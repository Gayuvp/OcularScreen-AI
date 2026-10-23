import { useState } from "react";
import { Link } from "react-router-dom";
import "./NewScreening.css";

function NewScreening() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [disease, setDisease] = useState("anemia");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  // ==================================================
  // IMAGE CHANGE
  // ==================================================

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));

    // Clear previous result
    setResult(null);
    setMessage("");
  };

  // ==================================================
  // START AI ANALYSIS
  // ==================================================

  const handleAnalyze = async () => {
    // ----------------------------------------------
    // CHECK IMAGE
    // ----------------------------------------------

    if (!selectedImage) {
      setMessage("⚠️ Please upload an ocular image first.");
      return;
    }

    // ----------------------------------------------
    // GET USER ID
    // ----------------------------------------------

    const storedUserId = localStorage.getItem("user_id");

    // Temporary fallback for testing
    const userId = storedUserId ? Number(storedUserId) : 1;

    if (!userId || Number.isNaN(userId)) {
      setMessage("❌ User ID not found. Please login again.");
      return;
    }

    // ----------------------------------------------
    // CHECK DISEASE
    // ----------------------------------------------

    if (disease !== "anemia") {
      setMessage("⚠️ This AI model is not available yet.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setResult(null);

      setMessage("🔄 AI is analyzing your ocular image...");

      // --------------------------------------------
      // CREATE FORM DATA
      // --------------------------------------------

      const formData = new FormData();

      // Backend expects the key "file"
      formData.append("file", selectedImage);

      // --------------------------------------------
      // SEND TO FASTAPI
      // --------------------------------------------

      const response = await fetch(
        `http://127.0.0.1:8000/analyze?user_id=${userId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("Backend response:", data);

      // --------------------------------------------
      // HANDLE HTTP ERRORS
      // --------------------------------------------

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Analysis request failed."
        );
      }

      // --------------------------------------------
      // HANDLE SUCCESS
      // --------------------------------------------

      if (data.success) {
        setResult(data);

        setMessage(
          "✅ AI analysis completed successfully!"
        );
      } else {
        setMessage(
          `❌ ${
            data.message ||
            "Analysis failed. Please try again."
          }`
        );
      }
    } catch (error) {
      console.error("Analysis error:", error);

      setMessage(
        `❌ Cannot connect to the AI backend: ${error.message}`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ==================================================
  // RESULT STATUS
  // ==================================================

  const getResultStatus = () => {
    if (!result) return null;

    const anemiaProbability = Number(
      result.probabilities?.anemia ?? 0
    );

    const noAnemiaProbability = Number(
      result.probabilities?.no_anemia ?? 0
    );

    // ------------------------------------------------
    // UI CONFIDENCE THRESHOLD
    // ------------------------------------------------

    const CONFIDENCE_THRESHOLD = 60;

    // ------------------------------------------------
    // POSSIBLE ANEMIA
    // ------------------------------------------------

    if (anemiaProbability >= CONFIDENCE_THRESHOLD) {
      return {
        title: "Possible Anemia Detected",
        type: "anemia",
        icon: "🩸",
      };
    }

    // ------------------------------------------------
    // NO ANEMIA
    // ------------------------------------------------

    if (noAnemiaProbability >= CONFIDENCE_THRESHOLD) {
      return {
        title: "No Anemia Detected",
        type: "normal",
        icon: "✓",
      };
    }

    // ------------------------------------------------
    // INCONCLUSIVE
    // ------------------------------------------------

    return {
      title: "Inconclusive Result",
      type: "inconclusive",
      icon: "⚠️",
    };
  };

  // ==================================================
  // GET RESULT CONFIDENCE
  // ==================================================

  const getResultConfidence = () => {
    if (!result) return 0;

    const anemiaProbability = Number(
      result.probabilities?.anemia ?? 0
    );

    const noAnemiaProbability = Number(
      result.probabilities?.no_anemia ?? 0
    );

    return Math.max(
      anemiaProbability,
      noAnemiaProbability
    );
  };

  // ==================================================
  // JSX
  // ==================================================

  return (
    <div className="screening-page">

      {/* ============================================= */}
      {/* SIDEBAR */}
      {/* ============================================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">

          <div className="logo-circle">
            ◉
          </div>

          <h2>
            Ocular<span>AI</span>
          </h2>

        </div>


        <nav className="sidebar-menu">

          {/* DASHBOARD */}

          <Link
            to="/dashboard"
            className="menu-item"
          >
            <span>▦</span>
            Dashboard
          </Link>


          {/* NEW SCREENING */}

          <Link
            to="/screening"
            className="menu-item active"
          >
            <span>＋</span>
            New Screening
          </Link>


          {/* HISTORY */}

          <Link
            to="/history"
            className="menu-item"
          >
            <span>◷</span>
            Analysis History
          </Link>


          {/* DISEASES */}

          <Link
            to="/diseases"
            className="menu-item"
          >
            <span>◉</span>
            Diseases
          </Link>


          {/* PROFILE */}

          <Link
            to="/profile"
            className="menu-item"
          >
            <span>◉</span>
            Profile
          </Link>

        </nav>


        {/* LOGOUT */}

        <div className="sidebar-bottom">

          <button
            className="logout-button"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user_id");

              window.location.href = "/";
            }}
          >
            Logout
          </button>

        </div>

      </aside>


      {/* ============================================= */}
      {/* MAIN CONTENT */}
      {/* ============================================= */}

      <main className="screening-main">


        {/* ============================================= */}
        {/* HEADER */}
        {/* ============================================= */}

        <div className="screening-header">

          <div>

            <p className="page-label">
              AI HEALTH SCREENING
            </p>

            <h1>
              New Screening
            </h1>

            <p className="page-description">
              Upload a clear ocular image and select the screening type.
            </p>

          </div>

        </div>


        {/* ============================================= */}
        {/* SCREENING LAYOUT */}
        {/* ============================================= */}

        <div className="screening-layout">


          {/* ========================================= */}
          {/* LEFT SIDE - IMAGE UPLOAD */}
          {/* ========================================= */}

          <div className="upload-panel">

            <div className="panel-header">

              <div className="step">
                01
              </div>

              <div>

                <h2>
                  Upload Ocular Image
                </h2>

                <p>
                  Use a clear and well-lit image.
                </p>

              </div>

            </div>


            {/* IMAGE UPLOAD */}

            {!preview ? (

              <label className="image-upload-box">

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <div className="upload-big-icon">
                  ↑
                </div>

                <h3>
                  Upload your image
                </h3>

                <p>
                  Click here to browse from your device
                </p>

                <span>
                  JPG • JPEG • PNG
                </span>

              </label>

            ) : (

              <div className="image-preview-box">

                <img
                  src={preview}
                  alt="Ocular Preview"
                />

                <label className="replace-image">

                  Change Image

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                </label>

              </div>

            )}

          </div>


          {/* ========================================= */}
          {/* RIGHT SIDE - MODEL SELECTION */}
          {/* ========================================= */}

          <div className="selection-panel">

            <div className="panel-header">

              <div className="step">
                02
              </div>

              <div>

                <h2>
                  Select Screening
                </h2>

                <p>
                  Choose the AI model.
                </p>

              </div>

            </div>


            {/* ========================================= */}
            {/* DISEASE OPTIONS */}
            {/* ========================================= */}

            <div className="disease-options">


              {/* ANEMIA */}

              <label
                className={
                  disease === "anemia"
                    ? "disease-option selected"
                    : "disease-option"
                }
              >

                <input
                  type="radio"
                  value="anemia"
                  checked={disease === "anemia"}
                  onChange={(e) =>
                    setDisease(e.target.value)
                  }
                />

                <div className="disease-icon">
                  🩸
                </div>

                <div>

                  <h3>
                    Anemia
                  </h3>

                  <p>
                    Available for AI screening
                  </p>

                </div>

                <span className="available">
                  Available
                </span>

              </label>


              {/* JAUNDICE */}

              <label className="disease-option disabled">

                <div className="disease-icon">
                  ☀️
                </div>

                <div>

                  <h3>
                    Jaundice
                  </h3>

                  <p>
                    AI model coming soon
                  </p>

                </div>

                <span className="coming-soon">
                  Coming Soon
                </span>

              </label>


              {/* RETINAL DISORDERS */}

              <label className="disease-option disabled">

                <div className="disease-icon">
                  👁️
                </div>

                <div>

                  <h3>
                    Retinal Disorders
                  </h3>

                  <p>
                    AI model coming soon
                  </p>

                </div>

                <span className="coming-soon">
                  Coming Soon
                </span>

              </label>

            </div>


            {/* ========================================= */}
            {/* START ANALYSIS BUTTON */}
            {/* ========================================= */}

            <button
              className="start-analysis-button"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >

              {isAnalyzing
                ? "Analyzing..."
                : "Start AI Analysis"}

              <span>
                →
              </span>

            </button>


            {/* ========================================= */}
            {/* MESSAGE */}
            {/* ========================================= */}

            {message && (

              <div className="screening-message">
                {message}
              </div>

            )}

          </div>

        </div>


        {/* ============================================= */}
        {/* AI RESULT */}
        {/* ============================================= */}

        {result && (

          <div className="analysis-result">


            {/* ========================================= */}
            {/* RESULT STATUS */}
            {/* ========================================= */}

            <div className="result-top">

              <div>

                <p>
                  AI SCREENING RESULT
                </p>

                <h2
                  className={
                    getResultStatus()?.type === "anemia"
                      ? "result-title-anemia"
                      : getResultStatus()?.type === "normal"
                      ? "result-title-normal"
                      : "result-title-inconclusive"
                  }
                >
                  {getResultStatus()?.icon}{" "}
                  {getResultStatus()?.title}
                </h2>

              </div>


              {/* ======================================= */}
              {/* CONFIDENCE */}
              {/* ======================================= */}

              <div
                className={`result-confidence ${
                  getResultStatus()?.type ===
                  "inconclusive"
                    ? "confidence-inconclusive"
                    : ""
                }`}
              >

                <strong>
                  {getResultConfidence().toFixed(2)}%
                </strong>

                <span>
                  Confidence
                </span>

              </div>

            </div>


            {/* ========================================= */}
            {/* PROBABILITIES */}
            {/* ========================================= */}

            <div className="result-probabilities">


              {/* ======================================= */}
              {/* ANEMIA */}
              {/* ======================================= */}

              <div className="result-row">

                <div className="result-row-top">

                  <span>
                    🩸 Anemia
                  </span>

                  <strong>
                    {Number(
                      result.probabilities?.anemia ?? 0
                    ).toFixed(2)}
                    %
                  </strong>

                </div>


                <div className="result-progress">

                  <div
                    className="anemia-progress"
                    style={{
                      width: `${Math.min(
                        Number(
                          result.probabilities?.anemia ?? 0
                        ),
                        100
                      )}%`,
                    }}
                  />

                </div>

              </div>


              {/* ======================================= */}
              {/* NO ANEMIA */}
              {/* ======================================= */}

              <div className="result-row">

                <div className="result-row-top">

                  <span>
                    ✓ No Anemia
                  </span>

                  <strong>
                    {Number(
                      result.probabilities?.no_anemia ?? 0
                    ).toFixed(2)}
                    %
                  </strong>

                </div>


                <div className="result-progress">

                  <div
                    className="normal-progress"
                    style={{
                      width: `${Math.min(
                        Number(
                          result.probabilities?.no_anemia ?? 0
                        ),
                        100
                      )}%`,
                    }}
                  />

                </div>

              </div>

            </div>


            {/* ========================================= */}
            {/* EXPLAINABLE AI - GRAD-CAM */}
            {/* ========================================= */}

            {result.gradcam_url && (
              <div className="xai-explanation">

                <div className="xai-header">
                  <div>
                    <p className="xai-label">EXPLAINABLE AI</p>
                    <h3>Grad-CAM Visual Explanation</h3>
                    <p className="xai-description">
                      The highlighted regions show areas that contributed
                      to the model's prediction.
                    </p>
                  </div>
                </div>

                <div className="xai-images">

                  {/* ORIGINAL IMAGE */}
                  <div className="xai-image-card">
                    <h4>Original Ocular Image</h4>

                    <img
                      src={preview}
                      alt="Original ocular image"
                      className="xai-image"
                    />
                  </div>

                  {/* GRAD-CAM IMAGE */}
                  <div className="xai-image-card">
                    <h4>Grad-CAM Heatmap</h4>

                    <img
                      src={`http://127.0.0.1:8000${result.gradcam_url}`}
                      alt="Grad-CAM explanation"
                      className="xai-image"
                    />
                  </div>

                </div>

                <div className="xai-note">
                  🔎 The heatmap indicates image regions that contributed
                  to the model's prediction. It does not independently
                  confirm the presence of anemia.
                </div>

              </div>
            )}

            {/* ========================================= */}
            {/* INCONCLUSIVE INFORMATION */}
            {/* ========================================= */}

            {getResultStatus()?.type ===
              "inconclusive" && (

              <div className="inconclusive-message">

                <strong>
                  ⚠️ Result is not conclusive
                </strong>

                <p>
                  The AI model is not sufficiently
                  confident in either class. Please
                  upload a clearer ocular image and
                  try the analysis again.
                </p>

              </div>

            )}


            {/* ========================================= */}
            {/* MEDICAL WARNING */}
            {/* ========================================= */}

            <div className="result-warning">

              ⚠️ This result is generated for
              AI-assisted screening and research
              purposes only. It is not a medical
              diagnosis.

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default NewScreening;