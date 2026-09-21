
import ApexCharts from "apexcharts";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { apiGet, apiPost } from "../api/client";

const EMPTY_FORM = { name: "", email: "", department: "" };
const SELECTED_TEMPLATES_KEY = "saas_selected_templates";
const EMPLOYEE_CACHE_KEY = "saas_employee_cache";
const AUTO_SIM_KEY = "saas_auto_sim_active";
const EMPLOYER_ID_KEY = "saas_employer_id";
const DEPARTMENTS = [
  "Aircraft Maintenance and Support",
  "At the Airport",
  "Corporate",
  "Customer Solutions",
  "Digital Technology",
  "Customer Service",
  "Finance",
  "Flight Attendant",
  "HR",
  "IT Support",
  "Pilot Operations",
];

const statusPillStyles = {
  "Security Champion": "bg-emerald-100 text-emerald-700",
  "At Risk": "bg-red-100 text-red-700",
  "On Track": "bg-blue-100 text-blue-800",
  Monitor: "bg-amber-100 text-amber-700",
};

function formatPercent(value) {
  if (value === undefined || value === null) return "0%";
  return `${Math.round(value * 100)}%`;
}

function LowestRisks() {
  const [employees, setEmployees] = useState([]);
  const [summary, setSummary] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [runningSimulation, setRunningSimulation] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusVariant, setStatusVariant] = useState("info");
  const [autoSimActive, setAutoSimActive] = useState(false);
  const [employerId, setEmployerId] = useState(
    localStorage.getItem(EMPLOYER_ID_KEY) || localStorage.getItem("employerId") || null
  );
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const bootstrap = async () => {
      const savedTemplates = localStorage.getItem(SELECTED_TEMPLATES_KEY);
      if (savedTemplates) {
        try {
          setSelectedTemplates(JSON.parse(savedTemplates));
        } catch (e) {
          console.warn("Unable to parse cached selected templates", e);
        }
      }
      const savedEmployees = localStorage.getItem(EMPLOYEE_CACHE_KEY);
      if (savedEmployees) {
        try {
          const cached = JSON.parse(savedEmployees);
          setEmployees(cached.employees || []);
          setSummary(cached.summary || null);
        } catch (e) {
          console.warn("Unable to parse cached employees", e);
        }
      }
      const savedAutoSim = localStorage.getItem(AUTO_SIM_KEY);
      if (savedAutoSim) setAutoSimActive(savedAutoSim === "true");

      try {
        await apiPost("/api/simulations/sweep", {});
      } catch (err) {
        console.warn("Unable to auto-mark ignored simulations", err);
      }
      fetchEmployees();
      fetchTemplates();
    };

    bootstrap();
  }, []);

  useEffect(() => {
      // Rebuild the engagement chart whenever summary data changes.
      if (!chartRef.current || !summary) return;
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
  
      const chartData = [
        Math.round((summary.click_rate || 0) * 100),
        Math.round((summary.report_rate || 0) * 100),
        Math.round((summary.ignore_rate || 0) * 100),
      ];
  
      const chart = new ApexCharts(chartRef.current, {
        chart: { type: "bar", height: 300, toolbar: { show: false } },
        series: [{ name: "Rate", data: chartData }],
        colors: ["#0f172a"],
        plotOptions: { bar: { columnWidth: "45%", distributed: true } },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${val}%`,
          style: { colors: ["#111827"] },
        },
        xaxis: {
          categories: ["Click Rate", "Report Rate", "Ignore Rate"],
          labels: { style: { fontSize: "12px" } },
        },
        yaxis: {
          labels: {
            formatter: (val) => `${val}%`,
          },
          max: 100,
        },
        grid: { strokeDashArray: 5 },
      });
  
      chart.render();
      chartInstance.current = chart;
      return () => chart.destroy();
    }, [summary]);
  
  const fetchEmployees = async () => {
    try {
      const data = await apiGet(
        employerId ? `/api/employees?employerId=${employerId}` : "/api/employees"
      );
      setEmployees(data.employees || []);
      setSummary(data.summary || null);
      if (!employerId && data.employees && data.employees.length > 0) {
        const derived = data.employees[0].employer_id;
        if (derived !== undefined && derived !== null) {
          setEmployerId(String(derived));
          localStorage.setItem(EMPLOYER_ID_KEY, String(derived));
        }
      }
      localStorage.setItem(
        EMPLOYEE_CACHE_KEY,
        JSON.stringify({ employees: data.employees || [], summary: data.summary || null })
      );
    } catch (err) {
      setStatusVariant("error");
      setStatusMessage(`Failed to load employees: ${err.message}`);
    }
  };

  const fetchTemplates = async () => {
    try {
      const data = await apiGet("/api/templates");
      setTemplates(data.templates || []);
    } catch (err) {
      console.warn("Failed to load templates", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiPost("/api/employees", { ...formData, employerId });
      setFormData(EMPTY_FORM);
      setStatusVariant("success");
      setStatusMessage("Employee added successfully.");
      fetchEmployees();
    } catch (err) {
      setStatusVariant("error");
      setStatusMessage(`Unable to add employee: ${err.message}`);
    } finally { setSubmitting(false); }
  };

  const toggleTemplate = (templateId) => {
    setSelectedTemplates((prev) => prev.includes(templateId) ? prev.filter((id) => id !== templateId) : [...prev, templateId]);
  };

  const handleSelectAll = () => setSelectedTemplates(templates.map((t) => t.id));
  const handleClearAll = () => setSelectedTemplates([]);

  const handleDeleteAllEmployees = async () => {
    const confirmed = window.confirm("Delete all employees? This cannot be undone.");
    if (!confirmed) return;
    try {
      const effectiveEmployerId = employerId || (employees[0] && employees[0].employer_id);
      if (!effectiveEmployerId) { setStatusVariant("error"); setStatusMessage("Employer ID missing; cannot delete employees."); return; }
      const result = await apiPost("/api/employees/delete_all", { employerId: effectiveEmployerId });
      setEmployees([]); setSummary(null);
      localStorage.setItem(EMPLOYEE_CACHE_KEY, JSON.stringify({ employees: [], summary: null }));
      setStatusVariant("success"); setStatusMessage(`Deleted ${result.deleted || 0} employees.`);
    } catch (err) {
      setStatusVariant("error"); setStatusMessage(`Failed to delete employees: ${err.message}`);
    }
  };

  const handleRunSimulation = async ({ silent = false, auto = false } = {}) => {
    if (runningSimulation && !auto) return;
    if (!silent) setRunningSimulation(true);
    try {
      const response = await apiPost("/api/simulations/run", { templateIds: selectedTemplates });
      if (!silent) { setStatusVariant("success"); setStatusMessage(`Simulation queued for ${response.scheduled} employees.`); }
    } catch (err) {
      if (!silent) { setStatusVariant("error"); setStatusMessage(`Failed to run simulation: ${err.message}`); }
    } finally { if (!silent) setRunningSimulation(false); fetchEmployees(); }
  };

  const startAutoSim = () => setAutoSimActive(true);
  const stopAutoSim = () => setAutoSimActive(false);

  useEffect(() => { localStorage.setItem(SELECTED_TEMPLATES_KEY, JSON.stringify(selectedTemplates)); }, [selectedTemplates]);
  useEffect(() => {
    localStorage.setItem(AUTO_SIM_KEY, autoSimActive ? "true" : "false");
    if (!autoSimActive) return undefined;
    const intervalId = setInterval(() => { if (selectedTemplates.length > 0) handleRunSimulation({ silent: true, auto: true }); }, 60_000);
    return () => clearInterval(intervalId);
  }, [autoSimActive, selectedTemplates]);
    return(
        <div className="w-3/4 justify-center items-center mx-auto h-screen">
         <div className="grid grid-cols-2 bg-gray-100 p-3 rounded-t-lg font-semibold text-gray-700 text-center mt-20 justify-items-center">
                <p>Employee Email</p>
                <p>Full Name</p>

              </div>

              <ul role="list" className="divide-y divide-gray-200">
                {Array.isArray(employees) && employees.length > 0 ? (
                  employees
                    .sort((a, b) => {
                      const aRate = a?.metrics?.click_rate ?? 0;
                      const bRate = b?.metrics?.click_rate ?? 0;
                      return aRate - bRate; 
                    })
                    .map((emp, i) => {


                      return (
                        <li
                          key={emp?.id ?? `emp-${i}`}
                          className={`grid grid-cols-2 justify-items-center p-3 hover:bg-gray-50 transition-all duration-150 border-y border-neutral-300 ${
                            i % 2 === 0 ? "bg-white" : "bg-neutral-100"
                          }`}
                        >
                          <p className="text-xs text-gray-700">{emp?.email ?? "—"}</p>
                          <p className="text-xs font-medium text-gray-900">{emp?.name ?? "—"}</p>
                        </li>
                      );
                    })
                ) : (
                  <li className="p-3 text-sm text-gray-500">No employees available</li>
                )}
              </ul>
            </div>

        
    );
}
export default LowestRisks;