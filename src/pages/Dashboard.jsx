import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import {
  ScanLine,
  Activity,
  CheckCircle,
  BrainCircuit,
  AlertTriangle
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";


function Dashboard() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);


  // ==========================================
  // FETCH HISTORY
  // ==========================================

  const fetchDashboardData = async () => {

    try {

      setLoading(true);

      const userId =
        localStorage.getItem("user_id") || 1;


      const response = await fetch(
        `http://127.0.0.1:8000/history/${userId}`
      );


      if (!response.ok) {

        throw new Error(
          "Failed to fetch dashboard data."
        );

      }


      const data =
        await response.json();


      console.log(
        "Dashboard history:",
        data
      );


      if (data.success) {

        setHistory(
          data.history || []
        );

      }

    }

    catch (error) {

      console.error(
        "Dashboard Fetch Error:",
        error
      );

    }

    finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {

    fetchDashboardData();

  }, []);


  // ==========================================
  // RESULT HELPERS
  // ==========================================

  const getResultType = (prediction) => {

    const value =
      String(prediction || "")
        .toLowerCase()
        .trim();


    // Possible Anemia
    if (
      value.includes("possible anemia") ||
      value === "anemia"
    ) {

      return "anemia";

    }


    // No Anemia
    if (
      value.includes("no anemia") ||
      value === "no_anemia"
    ) {

      return "normal";

    }


    // Inconclusive
    if (
      value.includes("inconclusive")
    ) {

      return "inconclusive";

    }


    return "inconclusive";

  };


  // ==========================================
  // CALCULATE STATISTICS
  // ==========================================

  const totalScreenings =
    history.length;


  const possibleAnemia =
    history.filter(
      (item) =>
        getResultType(item.prediction)
        === "anemia"
    ).length;


  const normalResults =
    history.filter(
      (item) =>
        getResultType(item.prediction)
        === "normal"
    ).length;


  const inconclusiveResults =
    history.filter(
      (item) =>
        getResultType(item.prediction)
        === "inconclusive"
    ).length;


  // ==========================================
  // AVERAGE CONFIDENCE
  // ==========================================

  const averageConfidence =
    history.length > 0
      ? (
          history.reduce(
            (total, item) =>
              total +
              Number(
                item.confidence || 0
              ),
            0
          ) / history.length
        ).toFixed(2)
      : "0.00";


  // ==========================================
  // FORMAT DATE - IST
  // ==========================================

  const parseBackendDate = (date) => {

    if (!date) {
      return null;
    }

    let dateString = String(date);

    /*
      SQLite/FastAPI may return a timestamp
      without timezone information.

      Treat it as UTC before converting
      it to India Standard Time.
    */

    if (
      !dateString.endsWith("Z") &&
      !dateString.includes("+")
    ) {

      dateString += "Z";

    }

    const parsedDate =
      new Date(dateString);


    if (
      isNaN(parsedDate.getTime())
    ) {

      return null;

    }

    return parsedDate;

  };


  const formatDate = (date) => {

    const analysisDate =
      parseBackendDate(date);


    if (!analysisDate) {

      return "Date unavailable";

    }


    return analysisDate.toLocaleString(
      "en-IN",
      {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }
    );

  };


  // ==========================================
  // ACTIVITY CHART DATA
  // ==========================================

  const activityMap = {};


  history.forEach((item) => {

    const date =
      parseBackendDate(
        item.created_at
      );


    if (!date) {
      return;
    }


    const day =
      date.toLocaleDateString(
        "en-IN",
        {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "short"
        }
      );


    activityMap[day] =
      (activityMap[day] || 0) + 1;

  });


  const activityData =
    Object.entries(activityMap)
      .map(
        ([day, analyses]) => ({
          day,
          analyses
        })
      )
      .reverse();


  // ==========================================
  // PIE CHART DATA
  // ==========================================

  const diseaseData = [

    {
      name: "Anemia",
      value: possibleAnemia
    },

    {
      name: "No Anemia",
      value: normalResults
    },

    {
      name: "Inconclusive",
      value: inconclusiveResults
    }

  ];


  const COLORS = [

    "#ef4444",
    "#22c55e",
    "#f59e0b"

  ];


  // ==========================================
  // RESULT CSS CLASS
  // ==========================================

  const getResultClass = (prediction) => {

    const type =
      getResultType(prediction);


    if (type === "anemia") {

      return "result-warning";

    }


    if (type === "normal") {

      return "result-success";

    }


    return "result-inconclusive";

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="dashboard-layout">

        <Sidebar />

        <main className="dashboard-main">

          <h2>
            Loading dashboard...
          </h2>

        </main>

      </div>

    );

  }


  // ==========================================
  // DASHBOARD
  // ==========================================

  return (

    <div className="dashboard-layout">

      <Sidebar />


      <main className="dashboard-main">


        {/* ======================================
            HEADER
        ====================================== */}

        <div className="dashboard-header">

          <div>

            <p className="dashboard-small-title">
              OcularScreenAI
            </p>


            <h1>
              Welcome back 👋
            </h1>


            <p className="dashboard-subtitle">
              Monitor your AI-powered ocular health
              screenings.
            </p>

          </div>


          <div className="system-online">

            <span></span>

            AI System Online

          </div>

        </div>


        {/* ======================================
            STATISTICS
        ====================================== */}

        <section className="stats-grid">


          {/* TOTAL SCREENINGS */}

          <div className="stat-card">

            <div className="stat-icon blue">

              <ScanLine size={24} />

            </div>


            <div>

              <p>
                Total Screenings
              </p>

              <h2>
                {totalScreenings}
              </h2>

              <span>
                All AI analyses
              </span>

            </div>

          </div>


          {/* ANEMIA */}

          <div className="stat-card">

            <div className="stat-icon red">

              <Activity size={24} />

            </div>


            <div>

              <p>
                Possible Anemia
              </p>

              <h2>
                {possibleAnemia}
              </h2>

              <span>
                Detected screenings
              </span>

            </div>

          </div>


          {/* NO ANEMIA */}

          <div className="stat-card">

            <div className="stat-icon green">

              <CheckCircle size={24} />

            </div>


            <div>

              <p>
                No Anemia
              </p>

              <h2>
                {normalResults}
              </h2>

              <span>
                Normal screening results
              </span>

            </div>

          </div>


          {/* AI CONFIDENCE */}

          <div className="stat-card">

            <div className="stat-icon purple">

              <BrainCircuit size={24} />

            </div>


            <div>

              <p>
                AI Confidence
              </p>

              <h2>
                {averageConfidence}%
              </h2>

              <span>
                Average confidence
              </span>

            </div>

          </div>


        </section>


        {/* ======================================
            INCONCLUSIVE SUMMARY
        ====================================== */}

        {inconclusiveResults > 0 && (

          <div
            style={{
              marginTop: "20px",
              padding: "15px 20px",
              borderRadius: "14px",
              background: "#fffbeb",
              border: "1px solid #fde68a",
              color: "#92400e",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >

            <AlertTriangle size={20} />

            <span>

              <strong>
                {inconclusiveResults}
              </strong>{" "}

              screening
              {inconclusiveResults !== 1
                ? "s"
                : ""}{" "}

              {inconclusiveResults !== 1
                ? "were"
                : "was"}{" "}

              inconclusive and may need
              another clearer image.

            </span>

          </div>

        )}


        {/* ======================================
            CHARTS
        ====================================== */}

        <section className="dashboard-charts">


          {/* SCREENING ACTIVITY */}

          <div className="chart-card large-chart">

            <div className="chart-header">

              <div>

                <h2>
                  Screening Activity
                </h2>

                <p>
                  Your recent analysis activity
                </p>

              </div>

            </div>


            {activityData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={activityData}
                >

                  <XAxis
                    dataKey="day"
                  />

                  <YAxis
                    allowDecimals={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="analyses"
                    radius={[8, 8, 0, 0]}
                    fill="#5b5ce2"
                  />

                </BarChart>

              </ResponsiveContainer>

            ) : (

              <div
                style={{
                  height: "300px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8"
                }}
              >

                No screening activity yet

              </div>

            )}

          </div>


          {/* RESULT DISTRIBUTION */}

          <div className="chart-card">

            <div className="chart-header">

              <div>

                <h2>
                  Result Distribution
                </h2>

                <p>
                  Current screening results
                </p>

              </div>

            </div>


            {totalScreenings > 0 ? (

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={diseaseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >

                    {diseaseData.map(
                      (entry, index) => (

                        <Cell
                          key={index}
                          fill={COLORS[index]}
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            ) : (

              <div
                style={{
                  height: "300px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8"
                }}
              >

                No screening data yet

              </div>

            )}


            <div className="chart-legend">

              <span>

                <i className="red-dot"></i>

                Anemia

              </span>


              <span>

                <i className="green-dot"></i>

                No Anemia

              </span>


              <span>

                <i
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#f59e0b",
                    marginRight: "6px"
                  }}
                ></i>

                Inconclusive

              </span>

            </div>

          </div>


        </section>


        {/* ======================================
            RECENT HISTORY
        ====================================== */}

        <section className="recent-section">


          <div className="section-heading">

            <div>

              <h2>
                Recent Screenings
              </h2>

              <p>
                Your latest AI analysis results
              </p>

            </div>

          </div>


          <div className="history-table">


            {/* HEADER */}

            <div className="history-row history-header">

              <span>
                Disease
              </span>

              <span>
                Result
              </span>

              <span>
                Confidence
              </span>

              <span>
                Date
              </span>

            </div>


            {/* DATABASE DATA */}

            {history.length > 0

              ?

              history
                .slice(0, 5)
                .map((item) => (

                  <div
                    className="history-row"
                    key={item.id}
                  >

                    <span>

                      🩸{" "}

                      {item.disease_type ||
                        "Anemia"}

                    </span>


                    <span
                      className={
                        getResultClass(
                          item.prediction
                        )
                      }
                    >

                      {item.prediction}

                    </span>


                    <span>

                      {Number(
                        item.confidence || 0
                      ).toFixed(2)}%

                    </span>


                    <span>

                      {formatDate(
                        item.created_at
                      )}

                    </span>

                  </div>

                ))

              :

              (

                <div className="history-row">

                  <span>

                    No screenings available

                  </span>

                </div>

              )

            }


          </div>


        </section>


      </main>

    </div>

  );

}


export default Dashboard;