// Mock, fully client-side "backend" for Crew Phished.
// Keeps the exact same apiGet/apiPost interface every view already uses,
// so no view/component code needs to change — this file is the only swap.
// All state lives in localStorage; nothing ever leaves the browser.

const DB_KEY = "crewPhished.mockDb.v1";

const TEMPLATE_LIBRARY = [
  { id: 1, name: "Corporate Policy Update", subject: "Mandatory Company Policy Review – Action Required", difficulty: "medium", department: "Corporate" },
  { id: 2, name: "Leadership Webinar Invite", subject: "You're Invited: Leadership Webinar This Friday", difficulty: "easy", department: "Corporate" },
  { id: 3, name: "Expense Reimbursement Error", subject: "Action Needed: Expense Reimbursement Failed", difficulty: "medium", department: "Finance" },
  { id: 4, name: "Payroll Direct Deposit Update", subject: "Update Your Direct Deposit Information", difficulty: "hard", department: "Finance" },
  { id: 5, name: "IT Password Expiration", subject: "Your Password Expires in 24 Hours", difficulty: "easy", department: "IT Support" },
  { id: 6, name: "VPN Access Alert", subject: "Unusual VPN Login Detected on Your Account", difficulty: "hard", department: "IT Support" },
  { id: 7, name: "Crew Scheduling Change", subject: "Your Upcoming Shift Has Changed", difficulty: "easy", department: "Flight Attendant" },
  { id: 8, name: "Flight Ops Bulletin", subject: "Updated Flight Ops Safety Bulletin Attached", difficulty: "medium", department: "Pilot Operations" },
  { id: 9, name: "Customer Complaint Escalation", subject: "Escalated Customer Complaint Needs Review", difficulty: "medium", department: "Customer Solutions" },
  { id: 10, name: "HR Benefits Enrollment", subject: "Benefits Enrollment Closes Friday", difficulty: "easy", department: "HR" },
];

function computeMetrics({ clicks, reports, ignores }) {
  const total = clicks + reports + ignores;
  const clickRate = total ? clicks / total : 0;
  const reportRate = total ? reports / total : 0;
  const ignoreRate = total ? ignores / total : 0;
  const score = total ? Math.round(100 - clickRate * 100) : 100;
  const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";
  const status =
    clickRate >= 0.5 ? "At Risk" : reportRate > 0 && clickRate === 0 ? "Security Champion" : "On Track";
  return {
    click_rate: clickRate,
    report_rate: reportRate,
    ignore_rate: ignoreRate,
    total_responses: total,
    clicks,
    reports,
    ignores,
    correct: reports,
    score,
    grade,
    status,
  };
}

function seedDb() {
  const employerId = 1;
  const seedEmployees = [
    { name: "Maria Gonzalez", email: "maria.gonzalez@skyward.test", department: "Flight Attendant", clicks: 0, reports: 2, ignores: 0 },
    { name: "Devon Brooks", email: "devon.brooks@skyward.test", department: "IT Support", clicks: 2, reports: 0, ignores: 0 },
    { name: "Priya Nair", email: "priya.nair@skyward.test", department: "Finance", clicks: 0, reports: 1, ignores: 1 },
    { name: "Tom Walsh", email: "tom.walsh@skyward.test", department: "HR", clicks: 0, reports: 0, ignores: 2 },
    { name: "Sam Okafor", email: "sam.okafor@skyward.test", department: "Pilot Operations", clicks: 1, reports: 1, ignores: 0 },
    { name: "Lena Park", email: "lena.park@skyward.test", department: "Customer Solutions", clicks: 0, reports: 2, ignores: 0 },
  ];

  const now = Date.now();
  const employees = seedEmployees.map((emp, i) => {
    const metrics = computeMetrics(emp);
    const history = [
      { date: new Date(now - 21 * 86400000).toISOString(), score: Math.min(100, metrics.score + 15) },
      { date: new Date(now - 14 * 86400000).toISOString(), score: Math.min(100, metrics.score + 5) },
      { date: new Date(now - 7 * 86400000).toISOString(), score: metrics.score },
    ];
    return {
      id: i + 1,
      employer_id: employerId,
      name: emp.name,
      email: emp.email,
      department: emp.department,
      created_at: new Date(now - 30 * 86400000).toISOString(),
      score: metrics.score,
      grade: metrics.grade,
      status: metrics.status,
      metrics,
      history,
      failures: metrics.clicks
        ? [{ day: new Date(now - 3 * 86400000).toISOString(), failures: metrics.clicks }]
        : [],
    };
  });

  return {
    nextEmployeeId: employees.length + 1,
    nextUserId: 2,
    employees,
    users: [
      {
        id: 1,
        email: "demo@skyward.test",
        password: "demo1234",
        first_name: "Jamie",
        last_name: "Rivera",
        role: "employer",
        companyName: "Skyward Air",
        employer_id: employerId,
      },
    ],
  };
}

function loadDb() {
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through to reseed
  }
  const fresh = seedDb();
  saveDb(fresh);
  return fresh;
}

function saveDb(db) {
  try {
    window.localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    // Storage may be unavailable in some embedded contexts; keep running
    // in-memory for this render even if it can't persist.
  }
}

function summarize(employees) {
  const totals = employees.reduce(
    (acc, e) => {
      acc.clicks += e.metrics.clicks;
      acc.reports += e.metrics.reports;
      acc.ignores += e.metrics.ignores;
      return acc;
    },
    { clicks: 0, reports: 0, ignores: 0 }
  );
  const summaryMetrics = computeMetrics(totals);
  return {
    employer_id: employees[0]?.employer_id ?? 1,
    total_responses: summaryMetrics.total_responses,
    clicks: summaryMetrics.clicks,
    reports: summaryMetrics.reports,
    ignores: summaryMetrics.ignores,
    correct: summaryMetrics.correct,
    click_rate: summaryMetrics.click_rate,
    report_rate: summaryMetrics.report_rate,
    ignore_rate: summaryMetrics.ignore_rate,
    accuracy_rate: summaryMetrics.report_rate,
    failure_count: summaryMetrics.clicks,
    failure_rate: summaryMetrics.click_rate,
    score: summaryMetrics.score,
    grade: summaryMetrics.grade,
  };
}

function randomToken() {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 36).toString(36)).join("");
}

function delay(ms = 120) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handleGet(path) {
  await delay();
  const db = loadDb();
  const url = new URL(path, "https://mock.local");
  const pathname = url.pathname;

  if (pathname === "/api/templates") {
    return { templates: TEMPLATE_LIBRARY };
  }

  if (pathname === "/api/employees") {
    // List view only needs summary fields — the detailed failures/history
    // arrays live on the record itself and are only exposed via the
    // single-employee detail endpoint below, matching what these list
    // views (which read employee.failures as a plain number, not an array)
    // actually expect.
    const employees = db.employees.map(({ failures, history, ...rest }) => rest);
    return { employees, summary: employees.length ? summarize(employees) : null };
  }

  const empMatch = pathname.match(/^\/api\/employees\/(\d+)$/);
  if (empMatch) {
    const id = Number(empMatch[1]);
    const employee = db.employees.find((e) => e.id === id);
    if (!employee) throw new Error("Employee not found");
    return {
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        created_at: employee.created_at,
      },
      metrics: employee.metrics,
      history: employee.history,
      failures: employee.failures,
    };
  }

  throw new Error(`Mock backend has no route for ${pathname}`);
}

async function handlePost(path, body) {
  await delay();
  const db = loadDb();
  const url = new URL(path, "https://mock.local");
  const pathname = url.pathname;
  const payload = body || {};

  if (pathname === "/api/signup") {
    const email = (payload.email || "").trim().toLowerCase();
    const role = payload.role === "employee" ? "employee" : "employer";
    if (!email || !payload.password) throw new Error("Email and password are required");
    if (db.users.some((u) => u.email === email)) {
      throw new Error("An account with that email already exists");
    }
    const user = {
      id: db.nextUserId++,
      email,
      password: payload.password,
      first_name: payload.first_name || "",
      last_name: payload.last_name || "",
      role,
      companyName: payload.companyName || null,
      employer_id: 1,
    };
    db.users.push(user);
    saveDb(db);
    return {
      token: randomToken(),
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        companyId: user.employer_id,
        companyName: user.companyName,
      },
    };
  }

  if (pathname === "/api/login") {
    const email = (payload.email || "").trim().toLowerCase();
    const user = db.users.find((u) => u.email === email && u.password === payload.password);
    if (!user) throw new Error("Invalid email or password");
    return {
      token: randomToken(),
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        companyId: user.employer_id,
        companyName: user.companyName,
      },
    };
  }

  if (pathname === "/api/logout") {
    return { status: "ok" };
  }

  if (pathname === "/api/simulations/sweep") {
    return { ignored: 0 };
  }

  if (pathname === "/api/employees/delete_all") {
    const count = db.employees.length;
    db.employees = [];
    saveDb(db);
    return { deleted: count };
  }

  if (pathname === "/api/employees") {
    const metrics = computeMetrics({ clicks: 0, reports: 0, ignores: 0 });
    const employee = {
      id: db.nextEmployeeId++,
      employer_id: Number(payload.employerId) || 1,
      name: payload.name || "New Employee",
      email: payload.email || "",
      department: payload.department || "",
      created_at: new Date().toISOString(),
      score: metrics.score,
      grade: metrics.grade,
      status: metrics.status,
      metrics,
      history: [],
      failures: [],
    };
    db.employees.push(employee);
    saveDb(db);
    return employee;
  }

  if (pathname === "/api/simulations/run") {
    db.employees.forEach((emp) => {
      const roll = Math.random();
      const outcome = roll < 0.3 ? "clicks" : roll < 0.65 ? "reports" : "ignores";
      emp.metrics[outcome] += 1;
      emp.metrics = computeMetrics({
        clicks: emp.metrics.clicks,
        reports: emp.metrics.reports,
        ignores: emp.metrics.ignores,
      });
      emp.score = emp.metrics.score;
      emp.grade = emp.metrics.grade;
      emp.status = emp.metrics.status;
      emp.history = [...emp.history, { date: new Date().toISOString(), score: emp.metrics.score }];
      if (outcome === "clicks") {
        emp.failures = [...emp.failures, { day: new Date().toISOString(), failures: 1 }];
      }
    });
    saveDb(db);
    return { scheduled: db.employees.length };
  }

  throw new Error(`Mock backend has no route for ${pathname}`);
}

export async function apiGet(path) {
  return handleGet(path);
}

export async function apiPost(path, body) {
  return handlePost(path, body);
}
