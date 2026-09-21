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

function PlatformPage() {
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



  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-10 flex">
      <div className="w-1/5 h-screen fixed bg-gray-100 p-8 flex flex-col justify-between border-r border-gray-200 top-0 left-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 mt-20">Dashboard Page</h2>
          <ul className="space-y-3 text-gray-600 font-medium">
            <li className="p-2 rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-all duration-200 cursor-pointer">
              On this page, you can quickly see how each employee is performing in your phishing training. It highlights who has the highest and lowest fail rates, along with their click rate, accuracy, and overall performance. These metrics help you understand who’s improving, who needs support, and how your team is doing as a whole.
            </li>
          </ul>
        </div>
        <ul className="space-y-3 text-gray-600 font-medium">
          <li className="p-2 rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-all duration-200 cursor-pointer">Help Information</li>
          <li className="p-2 rounded-lg text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 cursor-pointer">Logout</li>
        </ul>
      </div>

      <div className="ml-[22%] flex-1 flex flex-col gap-10">
        <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500">Your Dashboard</p>
          <h1 className="text-4xl font-bold">Welcome back, Admin</h1>
        </div>
        {statusMessage && (
          <div
            className={`px-4 py-2 rounded-md text-sm ${
              statusVariant === "success"
                ? "bg-emerald-100 text-emerald-800"
                : statusVariant === "error"
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {statusMessage}
          </div>
        )}
      </div>

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Overall Score</p>
              <p className="text-3xl font-semibold">{summary.score}</p>
              <p className="text-green-600 text-sm mt-1">{summary.grade}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Click Rate</p>
              <p className="text-3xl font-semibold">{formatPercent(summary.click_rate)}</p>
              <p className="text-gray-400 text-xs mt-1">Lower is better</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Report Rate</p>
              <p className="text-3xl font-semibold">{formatPercent(summary.report_rate)}</p>
              <p className="text-gray-400 text-xs mt-1">Goal: 60%+</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Ignore Rate</p>
              <p className="text-3xl font-semibold">{formatPercent(summary.ignore_rate)}</p>
              <p className="text-gray-400 text-xs mt-1">Employees who stayed vigilant</p>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Employee Performance</h2>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{employees.length} enrolled</span>
              <button type="button" className="text-red-600 hover:underline font-semibold" onClick={handleDeleteAllEmployees} disabled={employees.length === 0}>
                Delete all
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-500 uppercase border-b">
                <tr>
                  <th className="py-3">Name</th>
                  <th className="py-3">Department</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Score</th>
                  <th className="py-3">Click</th>
                  <th className="py-3">Report</th>
                  <th className="py-3">Ignore</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-b last:border-none hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-900">
                      <Link to={`/employees/${employee.id}`} className="text-indigo-600 hover:underline">{employee.name}</Link>
                    </td>
                    <td className="py-3 text-gray-600">{employee.department || "—"}</td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusPillStyles[employee.status] || "bg-gray-100 text-gray-600"}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="py-3 font-semibold">{employee.score}</td>
                    <td className="py-3">{formatPercent(employee.metrics.click_rate)}</td>
                    <td className="py-3">{formatPercent(employee.metrics.report_rate)}</td>
                    <td className="py-3">{formatPercent(employee.metrics.ignore_rate)}</td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr><td colSpan="7" className="text-center text-gray-500 py-6 text-sm">Add employees to begin tracking phishing performance.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        
          
          
          <div className="flex flex-row gap-5">
            <div className="space-y-8">
              <div className="flex-[1] bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
                <form className="space-y-4" onSubmit={handleAddEmployee}>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-100"
                      placeholder="Gianna Garcia"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Corporate Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-100"
                      placeholder="gianna.garcia@company.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-100 bg-white"
                      required
                    >
                      <option value="" disabled>
                        Select a department
                      </option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-60"
                  >
                    {submitting ? "Saving..." : "Add Employee"}
                  </button>
                </form>
              </div>
              </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm w-full">
              <h2 className="text-xl font-semibold mb-4">Engagement Snapshot</h2>
              <div ref={chartRef} />
            </div>
          </div>

          <div className=" bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Template Library</h2>
                  <p className="text-sm text-gray-500">
                    Select the templates you want to include in the next
                    simulation run.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>{selectedTemplates.length} selected</span>
                  <button
                    type="button"
                    className="text-indigo-600 hover:underline font-semibold"
                    onClick={handleSelectAll}
                    disabled={templates.length === 0}
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    className="text-gray-500 hover:underline"
                    onClick={handleClearAll}
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-2">
                {templates.map((template) => (
                  <label
                    key={template.id}
                    className={`border rounded-lg p-4 flex flex-col cursor-pointer transition ${
                      selectedTemplates.includes(template.id)
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {template.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {template.subject}
                        </p>
                      </div>
                      <span className="text-xs uppercase tracking-wide text-gray-500">
                        {template.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {template.department ? template.department : "All Teams"}
                      </span>
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-indigo-600"
                        checked={selectedTemplates.includes(template.id)}
                        onChange={() => toggleTemplate(template.id)}
                      />
                    </div>
                  </label>
                ))}
                {templates.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No templates found. Use the backend seeding script to load the
                    default phishing templates.
                  </p>
                )}
              </div>
            </div>

       <div className="flex flex-row">
          <div className="w-full max-w-lg p-4 border border-gray-200 rounded-lg shadow-sm sm:p-8 bg-white">

            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-bold leading-none text-gray-900">Highest Risks</h5>
              <a href="#" onClick={(e) => {e.preventDefault(); navigate("/highest");}}className="text-sm font-medium text-indigo-600 hover:underline">
              View all
            </a>
            </div>

            <div className="w-full">
              <hr className="text-neutral-300"/>

              <div className="grid grid-cols-[1.5fr_1fr_0.7fr] bg-gray-100 p-3 rounded-t-lg font-semibold text-gray-700">
                <p>Employee Email</p>
                <p>Full Name</p>
                <p>Failures</p>
              </div>

                  <ul role="list" className="divide-y divide-gray-200">
                {Array.isArray(employees) && employees.length > 0 ? (
                  employees
                    .sort((a, b) => {
                      const aRate = a?.metrics?.click_rate ?? 0;
                      const bRate = b?.metrics?.click_rate ?? 0;
                      return bRate - aRate; 
                    })
                    .slice(0, 5)
                    .map((emp, i) => {
                      const failures =
                        emp?.failures ??
                        emp?.metrics?.failures ??
                        (typeof emp?.metrics?.click_rate === "number"
                          ? Math.round(emp.metrics.click_rate * 100)
                          : 0);

                      return (
                        <li
                          key={emp?.id ?? `emp-${i}`}
                          className={`grid grid-cols-[1.5fr_1fr_0.7fr] items-center p-3 hover:bg-gray-50 transition-all duration-150 border-y border-neutral-300 ${
                            i % 2 === 0 ? "bg-white" : "bg-neutral-100"
                          }`}
                        >
                          <p className="text-xs text-gray-700">{emp?.email ?? "—"}</p>
                          <p className="text-xs font-medium text-gray-900">{emp?.name ?? "—"}</p>
                          <p className="text-xs text-gray-700 mx-5">{failures}</p>
                        </li>
                      );
                    })
                ) : (
                  <li className="p-3 text-sm text-gray-500">No employees available</li>
                )}
              </ul>
            </div>
          </div>

          <div className="w-full max-w-lg p-4 border border-gray-200 rounded-lg shadow-sm sm:p-8 bg-white mx-10">

            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-bold leading-none text-gray-900">Lowest Risks</h5>
              <a href="#" onClick={(e) => {e.preventDefault(); navigate("/lowest");}}className="text-sm font-medium text-indigo-600 hover:underline">View all</a>
            </div>

            <div className="w-full">
              <hr className="text-neutral-300" />

              <div className="grid grid-cols-2 bg-gray-100 p-3 rounded-t-lg font-semibold text-gray-700 text-center">
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
                    .slice(0, 5)
                    .map((emp, i) => {
                      const failures =
                        emp?.failures ??
                        emp?.metrics?.failures ??
                        (typeof emp?.metrics?.click_rate === "number"
                          ? Math.round(emp.metrics.click_rate * 100)
                          : 0);

                      return (
                        <li
                          key={emp?.id ?? `emp-${i}`}
                          className={`grid grid-cols-[1.5fr_1fr_0.7fr] items-center p-3 hover:bg-gray-50 transition-all duration-150 border-y border-neutral-300 ${
                            i % 2 === 0 ? "bg-white" : "bg-neutral-100"
                          }`}
                        >
                          <p className="text-xs text-gray-700">{emp?.email ?? "—"}</p>
                          <p className="text-xs font-medium text-gray-900">{emp?.name ?? "—"}</p>
                          <p className="text-xs text-gray-700 mx-5">{failures}</p>
                        </li>
                      );
                    })
                ) : (
                  <li className="p-3 text-sm text-gray-500">No employees available</li>
                )}
              </ul>
            </div>
          </div>

        </div>

        <button
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg disabled:opacity-60"
        onClick={() => handleRunSimulation()}
        disabled={runningSimulation || selectedTemplates.length === 0}
      >
        {runningSimulation ? "Running..." : "Run Simulation"}
      </button>
      <button
        className="fixed bottom-8 right-48 bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-4 rounded-full font-semibold shadow-lg disabled:opacity-60 mr-10"
        onClick={autoSimActive ? stopAutoSim : startAutoSim}
        disabled={selectedTemplates.length === 0}
      >
        {autoSimActive ? "Stop Auto Simulation" : "Start Auto Simulation"}
      </button>
      </div>
    </div>
  );
}

export default PlatformPage;
