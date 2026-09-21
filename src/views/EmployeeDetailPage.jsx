import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ApexCharts from "apexcharts";
import { apiGet } from "../api/client";

function formatPercent(value) {
  if (value === undefined || value === null) return "0%";
  return `${Math.round(value * 100)}%`;
}

function EmployeeDetailPage() {
  const { id } = useParams();
  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState("");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Fetch the latest metrics for this employee whenever the id changes.
    const load = async () => {
      setError("");
      try {
        const data = await apiGet(`/api/employees/${id}`);
        setEmployeeData(data);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    // Build/destroy the trend chart whenever history data is available.
    if (!employeeData?.history?.length || !chartRef.current) {
      return;
    }
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const categories = employeeData.history.map((point) =>
      new Date(point.date).toLocaleDateString()
    );
    const scores = employeeData.history.map((point) =>
      Math.round(point.score || 0)
    );

    const chart = new ApexCharts(chartRef.current, {
      chart: { type: "line", height: 320, toolbar: { show: false } },
      stroke: { curve: "smooth", width: 3 },
      dataLabels: { enabled: false },
      colors: ["#2563eb"],
      series: [{ name: "Score", data: scores }],
      xaxis: {
        categories,
        labels: { rotate: -30, style: { fontSize: "12px" } },
      },
      yaxis: {
        min: 0,
        max: 100,
        labels: { formatter: (val) => `${val}` },
      },
      grid: { strokeDashArray: 5 },
    });

    chart.render();
    chartInstance.current = chart;

    return () => chart.destroy();
  }, [employeeData]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-10">
        <Link to="/platform" className="text-indigo-600 hover:underline text-sm">
          ← Back to dashboard
        </Link>
        <p className="mt-6 text-red-600">Unable to load employee: {error}</p>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-10 text-gray-500">
        Loading employee metrics...
      </div>
    );
  }

  const { employee, metrics } = employeeData;
  const history = employeeData.history || [];
  const failures = employeeData.failures || [];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-10 pb-16 space-y-8">
      <Link to="/platform" className="text-indigo-600 hover:underline text-sm">
        ← Back to dashboard
      </Link>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row justify-between">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            Employee
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">
            {employee.name}
          </h1>
          <p className="text-gray-500 mt-2">{employee.email}</p>
          <p className="text-gray-500">
            {employee.department || "General"} • Onboarded{" "}
            {new Date(employee.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Overall Grade</p>
          <p className="text-5xl font-black text-gray-900">{metrics.grade}</p>
          <p className="text-sm text-gray-500 mt-1">
            Score {metrics.score} / 100
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-500 text-sm">Click Rate</p>
          <p className="text-3xl font-semibold">
            {formatPercent(metrics.click_rate)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-500 text-sm">Report Rate</p>
          <p className="text-3xl font-semibold">
            {formatPercent(metrics.report_rate)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-500 text-sm">Ignore Rate</p>
          <p className="text-3xl font-semibold">
            {formatPercent(metrics.ignore_rate)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-500 text-sm">Total Responses</p>
          <p className="text-3xl font-semibold">{metrics.total_responses}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Detailed Metrics</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <dt className="font-semibold text-gray-900">Reports</dt>
              <dd>{metrics.reports}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Clicks</dt>
              <dd>{metrics.clicks}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Ignores</dt>
              <dd>{metrics.ignores}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Correct Actions</dt>
              <dd>{metrics.correct}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Progress Over Time</h2>
          {history.length ? (
            <div ref={chartRef} />
          ) : (
            <p className="text-gray-500 text-sm">
              Not enough data points to chart performance yet.
            </p>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Incident Timeline</h2>
        {failures.length ? (
          <ul className="space-y-2 text-sm text-gray-600">
            {failures.map((failure) => (
              <li
                key={failure.day}
                className="flex justify-between border-b last:border-none pb-2"
              >
                <span>{new Date(failure.day).toLocaleDateString()}</span>
                <span>
                  {failure.failures} {failure.failures === 1 ? "failure" : "failures"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">
            No recorded phishing clicks during the selected window.
          </p>
        )}
      </div>
    </div>
  );
}

export default EmployeeDetailPage;
