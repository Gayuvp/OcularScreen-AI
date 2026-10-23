import Sidebar from "../components/Sidebar";

import {
  Activity,
  AlertTriangle,
  CheckCircle,
  HeartPulse,
  Info,
  ShieldCheck
} from "lucide-react";

import "./Diseases.css";


function Diseases() {

  const diseases = [
    {
      name: "Anemia",
      icon: "🩸",
      type: "AI Supported",
      description:
        "Anemia is a condition in which the blood does not carry enough oxygen to the body's tissues. OcularScreenAI provides AI-assisted screening using ocular images.",
      symptoms: [
        "Fatigue and weakness",
        "Pale skin",
        "Dizziness",
        "Shortness of breath",
        "Headache"
      ],
      prevention: [
        "Maintain a balanced diet",
        "Consume iron-rich foods",
        "Include vitamin B12 and folate",
        "Have regular health checkups"
      ],
      supported: true
    },

    {
      name: "Jaundice",
      icon: "🟡",
      type: "Information",
      description:
        "Jaundice is a condition in which the skin and the whites of the eyes may appear yellow due to increased bilirubin levels in the blood.",
      symptoms: [
        "Yellowing of the eyes",
        "Yellowing of the skin",
        "Dark urine",
        "Fatigue",
        "Abdominal discomfort"
      ],
      prevention: [
        "Maintain good hygiene",
        "Avoid excessive alcohol consumption",
        "Follow a healthy diet",
        "Seek medical advice for persistent symptoms"
      ],
      supported: false
    },

    {
      name: "Retinal Disorders",
      icon: "👁️",
      type: "Information",
      description:
        "Retinal disorders affect the retina, the light-sensitive tissue at the back of the eye. Early detection and regular eye examinations can help identify potential problems.",
      symptoms: [
        "Blurred vision",
        "Floaters",
        "Flashes of light",
        "Difficulty seeing at night",
        "Changes in vision"
      ],
      prevention: [
        "Have regular eye examinations",
        "Control blood pressure and blood sugar",
        "Protect your eyes from injury",
        "Maintain a healthy lifestyle"
      ],
      supported: false
    }
  ];


  return (

    <div className="dashboard-layout">

      <Sidebar />

      <main className="dashboard-main">

        <div className="diseases-page">

          {/* HEADER */}

          <div className="diseases-header">

            <div>

              <p className="diseases-label">
                OCULAR HEALTH
              </p>

              <h1>
                Diseases & Conditions
              </h1>

              <p className="diseases-description">
                Learn about common conditions related
                to blood health and ocular health.
              </p>

            </div>

            <div className="health-badge">

              <ShieldCheck size={20} />

              AI-Assisted Screening

            </div>

          </div>


          {/* AI NOTICE */}

          <div className="ai-notice">

            <div className="ai-notice-icon">
              <Info size={22} />
            </div>

            <div>

              <h3>
                About OcularScreenAI
              </h3>

              <p>
                OcularScreenAI currently provides
                AI-assisted screening for anemia
                using ocular images. Other conditions
                shown below are provided for
                educational information only.
              </p>

            </div>

          </div>


          {/* DISEASE CARDS */}

          <div className="disease-grid">

            {diseases.map((disease) => (

              <div
                className="disease-card"
                key={disease.name}
              >

                {/* CARD HEADER */}

                <div className="disease-card-header">

                  <div className="disease-icon">
                    {disease.icon}
                  </div>

                  <div>

                    <span
                      className={
                        disease.supported
                          ? "disease-status supported"
                          : "disease-status"
                      }
                    >

                      {disease.type}

                    </span>

                    <h2>
                      {disease.name}
                    </h2>

                  </div>

                </div>


                {/* DESCRIPTION */}

                <p className="disease-description">
                  {disease.description}
                </p>


                {/* SYMPTOMS */}

                <div className="disease-section">

                  <h3>

                    <AlertTriangle size={17} />

                    Common Symptoms

                  </h3>

                  <ul>

                    {disease.symptoms.map(
                      (symptom) => (

                        <li key={symptom}>
                          {symptom}
                        </li>

                      )
                    )}

                  </ul>

                </div>


                {/* PREVENTION */}

                <div className="disease-section">

                  <h3>

                    <ShieldCheck size={17} />

                    Prevention & Care

                  </h3>

                  <ul>

                    {disease.prevention.map(
                      (item) => (

                        <li key={item}>
                          {item}
                        </li>

                      )
                    )}

                  </ul>

                </div>


                {/* AI STATUS */}

                {disease.supported ? (

                  <div className="ai-supported-box">

                    <CheckCircle size={18} />

                    <span>
                      AI screening available
                    </span>

                  </div>

                ) : (

                  <div className="coming-soon-box">

                    <Activity size={18} />

                    <span>
                      AI screening coming soon
                    </span>

                  </div>

                )}

              </div>

            ))}

          </div>


          {/* MEDICAL DISCLAIMER */}

          <div className="medical-disclaimer">

            <HeartPulse size={22} />

            <div>

              <strong>
                Medical Information
              </strong>

              <p>
                The information provided on this page
                is for educational purposes only.
                OcularScreenAI is an AI-assisted
                screening prototype and does not
                replace professional medical
                diagnosis or consultation.
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>

  );

}


export default Diseases;