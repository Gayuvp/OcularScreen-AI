import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

import {
  RefreshCw,
  Calendar,
  Image,
  AlertTriangle,
  CheckCircle,
  Activity
} from "lucide-react";

import "./AnalysisHistory.css";


function AnalysisHistory() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================
  // FETCH HISTORY
  // ==========================================

  const fetchHistory = async () => {

    try {

      setLoading(true);
      setError("");

      const storedUserId =
        localStorage.getItem("user_id");

      const userId =
        storedUserId
          ? Number(storedUserId)
          : 1;

      if (!userId || Number.isNaN(userId)) {
        throw new Error(
          "User ID not found. Please login again."
        );
      }


      const response = await fetch(
        `http://127.0.0.1:8000/history/${userId}`
      );


      if (!response.ok) {

        throw new Error(
          "Failed to fetch analysis history."
        );

      }


      const data = await response.json();

      console.log(
        "Analysis history:",
        data
      );


      if (data.success) {

        setHistory(
          data.history || []
        );

      } else {

        throw new Error(
          data.message ||
          "Could not load analysis history."
        );

      }

    }

    catch (error) {

      console.error(
        "History Fetch Error:",
        error
      );

      setError(
        error.message ||
        "Unable to load analysis history."
      );

    }

    finally {

      setLoading(false);

    }

  };


  // ==========================================
  // FETCH WHEN PAGE LOADS
  // ==========================================

  useEffect(() => {

    fetchHistory();

  }, []);


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
  if (!date) {
    return "Date unavailable";
  }

  try {
    // Backend/SQLite timestamp is stored as UTC
    let dateString = date;

    // If backend does not include timezone information,
    // explicitly treat it as UTC.
    if (
      typeof dateString === "string" &&
      !dateString.endsWith("Z") &&
      !dateString.includes("+")
    ) {
      dateString = dateString + "Z";
    }

    const analysisDate = new Date(dateString);

    if (isNaN(analysisDate.getTime())) {
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

  } catch (error) {
    console.error("Date formatting error:", error);
    return "Date unavailable";
  }
};

  // ==========================================
  // RESULT TYPE
  // ==========================================

  const getResultType = (prediction) => {

    const value =
      String(prediction || "")
        .toLowerCase()
        .trim();


    // ----------------------------------------
    // ANEMIA
    // ----------------------------------------

    if (
      value.includes("possible anemia") ||
      value === "anemia"
    ) {

      return "anemia";

    }


    // ----------------------------------------
    // NO ANEMIA
    // ----------------------------------------

    if (
      value.includes("no anemia") ||
      value === "no_anemia"
    ) {

      return "normal";

    }


    // ----------------------------------------
    // INCONCLUSIVE
    // ----------------------------------------

    if (
      value.includes("inconclusive")
    ) {

      return "inconclusive";

    }


    return "inconclusive";

  };


  // ==========================================
  // RESULT ICON
  // ==========================================

  const getResultIcon = (type) => {

    if (type === "anemia") {
      return "🩸";
    }

    if (type === "normal") {
      return "✓";
    }

    return "⚠️";

  };


  // ==========================================
  // STATUS TEXT
  // ==========================================

  const getStatusText = (type) => {

    if (type === "anemia") {
      return "Possible Anemia";
    }

    if (type === "normal") {
      return "No Anemia";
    }

    return "Inconclusive";

  };


  // ==========================================
  // RESULT TITLE
  // ==========================================

  const getResultTitle = (type) => {

    if (type === "anemia") {
      return "Possible Anemia Detected";
    }

    if (type === "normal") {
      return "No Anemia Detected";
    }

    return "Inconclusive Result";

  };


  // ==========================================
  // MAIN UI
  // ==========================================

  return (

    <div className="dashboard-layout">


      {/* ======================================
          SIDEBAR
      ====================================== */}

      <Sidebar />


      {/* ======================================
          MAIN
      ====================================== */}

      <main className="dashboard-main">

        <div className="history-page">


          {/* ====================================
              HEADER
          ==================================== */}

          <div className="history-header">

            <div>

              <p className="page-label">
                SCREENING RECORDS
              </p>


              <h1>
                Analysis History
              </h1>


              <p className="history-description">

                View all your previous AI-powered
                ocular health screening results.

              </p>

            </div>


            {/* REFRESH */}

            <button
              className="refresh-button"
              onClick={fetchHistory}
              disabled={loading}
            >

              <RefreshCw
                size={17}
                className={
                  loading
                    ? "refresh-spinning"
                    : ""
                }
              />

              {loading
                ? "Refreshing..."
                : "Refresh"}

            </button>

          </div>


          {/* ====================================
              LOADING
          ==================================== */}

          {loading && (

            <div className="history-loading">

              <div className="loading-spinner"></div>

              <p>
                Loading your analysis history...
              </p>

            </div>

          )}


          {/* ====================================
              ERROR
          ==================================== */}

          {!loading && error && (

            <div className="empty-history">

              <div className="empty-icon">
                ⚠️
              </div>


              <h2>
                Unable to Load History
              </h2>


              <p>
                {error}
              </p>


              <button
                className="refresh-button"
                onClick={fetchHistory}
              >
                Try Again
              </button>

            </div>

          )}


          {/* ====================================
              EMPTY
          ==================================== */}

          {!loading &&
            !error &&
            history.length === 0 && (

            <div className="empty-history">

              <div className="empty-icon">
                🔍
              </div>


              <h2>
                No Screenings Yet
              </h2>


              <p>

                You haven't completed any AI
                health screenings yet. Your
                results will appear here after
                analysis.

              </p>

            </div>

          )}


          {/* ====================================
              HISTORY LIST
          ==================================== */}

          {!loading &&
            !error &&
            history.length > 0 && (

            <div className="history-list">


              {history.map((item) => {


                const resultType =
                  getResultType(
                    item.prediction
                  );


                return (

                  <div
                    className="history-card"
                    key={item.id}
                  >


                    {/* ==========================
                        ICON
                    ========================== */}

                    <div
                      className={`
                        history-icon
                        ${
                          resultType === "anemia"
                            ? "anemia-icon"
                            : resultType === "normal"
                            ? "normal-icon"
                            : "inconclusive-icon"
                        }
                      `}
                    >

                      {getResultIcon(
                        resultType
                      )}

                    </div>


                    {/* ==========================
                        INFORMATION
                    ========================== */}

                    <div className="history-info">


                      <div className="history-title-row">


                        <div>

                          <p className="history-disease">

                            {item.disease_type ||
                              "Anemia Screening"}

                          </p>


                          <h3>

                            {getResultTitle(
                              resultType
                            )}

                          </h3>

                        </div>


                        {/* STATUS */}

                        <span
                          className={`
                            history-status
                            ${
                              resultType === "anemia"
                                ? "status-anemia"
                                : resultType === "normal"
                                ? "status-normal"
                                : "status-inconclusive"
                            }
                          `}
                        >

                          {getStatusText(
                            resultType
                          )}

                        </span>

                      </div>


                      {/* ========================
                          META
                      ======================== */}

                      <div className="history-meta">


                        <span>

                          <Calendar size={14} />

                          {" "}

                          {formatDate(
                            item.created_at
                          )}

                        </span>


                        <span>

                          <Image size={14} />

                          {" "}

                          {item.image_name
                            ? item.image_name
                            : "Image analyzed"}

                        </span>


                      </div>


                    </div>


                    {/* ==========================
                        CONFIDENCE
                    ========================== */}

                    <div
                      className={`
                        history-confidence
                        ${
                          resultType ===
                          "inconclusive"
                            ? "confidence-inconclusive"
                            : ""
                        }
                      `}
                    >

                      <strong>

                        {Number(
                          item.confidence || 0
                        ).toFixed(2)}%

                      </strong>


                      <span>
                        Confidence
                      </span>

                    </div>


                  </div>

                );

              })}


            </div>

          )}


          {/* ====================================
              MEDICAL NOTE
          ==================================== */}

          {!loading &&
            !error &&
            history.length > 0 && (

            <div className="history-note">

              ⚠️ These results are generated for
              AI-assisted screening and research
              purposes only. They are not a medical
              diagnosis. Please consult a qualified
              healthcare professional for proper
              medical advice.

            </div>

          )}

        </div>

      </main>

    </div>

  );

}


export default AnalysisHistory;