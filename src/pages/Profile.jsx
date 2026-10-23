import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Hash,
  LogOut,
  Activity
} from "lucide-react";

import "./Profile.css";


function Profile() {

  const [user, setUser] = useState(null);


  // ==========================================
  // LOAD USER INFORMATION
  // ==========================================

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");


    if (storedUser) {

      try {

        setUser(
          JSON.parse(storedUser)
        );

      } catch (error) {

        console.error(
          "Unable to read user data:",
          error
        );

      }

    }

  }, []);


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user");

    window.location.href = "/";

  };


  // ==========================================
  // USER DETAILS
  // ==========================================

  const userName =
    user?.name ||
    user?.username ||
    "OcularAI User";


  const userEmail =
    user?.email ||
    "Email not available";


  const userId =
    user?.id ||
    localStorage.getItem("user_id") ||
    "Not available";


  return (

    <div className="dashboard-layout">

      <Sidebar />

      <main className="dashboard-main">

        <div className="profile-page">


          {/* ====================================
              HEADER
          ==================================== */}

          <div className="profile-header">

            <div>

              <p className="profile-label">
                ACCOUNT SETTINGS
              </p>

              <h1>
                My Profile
              </h1>

              <p className="profile-description">
                Manage your OcularScreenAI account
                information.
              </p>

            </div>

          </div>


          {/* ====================================
              PROFILE HERO
          ==================================== */}

          <section className="profile-hero">

            <div className="profile-avatar">

              {userName
                .charAt(0)
                .toUpperCase()}

            </div>


            <div className="profile-hero-info">

              <h2>
                {userName}
              </h2>

              <p>
                {userEmail}
              </p>

              <span className="account-status">

                <span></span>

                Account Active

              </span>

            </div>

          </section>


          {/* ====================================
              INFORMATION CARDS
          ==================================== */}

          <section className="profile-grid">


            {/* PERSONAL INFORMATION */}

            <div className="profile-card">

              <div className="profile-card-title">

                <div className="profile-card-icon blue">

                  <User size={20} />

                </div>

                <div>

                  <h3>
                    Personal Information
                  </h3>

                  <p>
                    Your account details
                  </p>

                </div>

              </div>


              <div className="profile-details">


                <div className="profile-detail">

                  <div className="detail-icon">

                    <User size={17} />

                  </div>

                  <div>

                    <span>
                      Name
                    </span>

                    <strong>
                      {userName}
                    </strong>

                  </div>

                </div>


                <div className="profile-detail">

                  <div className="detail-icon">

                    <Mail size={17} />

                  </div>

                  <div>

                    <span>
                      Email
                    </span>

                    <strong>
                      {userEmail}
                    </strong>

                  </div>

                </div>


                <div className="profile-detail">

                  <div className="detail-icon">

                    <Hash size={17} />

                  </div>

                  <div>

                    <span>
                      User ID
                    </span>

                    <strong>
                      {userId}
                    </strong>

                  </div>

                </div>

              </div>

            </div>


            {/* ACCOUNT INFORMATION */}

            <div className="profile-card">

              <div className="profile-card-title">

                <div className="profile-card-icon green">

                  <ShieldCheck size={20} />

                </div>

                <div>

                  <h3>
                    Account Information
                  </h3>

                  <p>
                    OcularScreenAI account status
                  </p>

                </div>

              </div>


              <div className="profile-details">


                <div className="profile-detail">

                  <div className="detail-icon">

                    <ShieldCheck size={17} />

                  </div>

                  <div>

                    <span>
                      Account Status
                    </span>

                    <strong className="active-text">
                      Active
                    </strong>

                  </div>

                </div>


                <div className="profile-detail">

                  <div className="detail-icon">

                    <Activity size={17} />

                  </div>

                  <div>

                    <span>
                      AI Screening
                    </span>

                    <strong className="active-text">
                      Available
                    </strong>

                  </div>

                </div>


                <div className="profile-detail">

                  <div className="detail-icon">

                    <Calendar size={17} />

                  </div>

                  <div>

                    <span>
                      Platform
                    </span>

                    <strong>
                      OcularScreenAI
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* ====================================
              AI INFORMATION
          ==================================== */}

          <section className="profile-info-box">

            <div className="profile-info-icon">

              <ShieldCheck size={22} />

            </div>


            <div>

              <h3>
                Your Data & AI Screening
              </h3>

              <p>

                Your screening results are stored
                in your account so you can review
                your previous analyses through the
                Analysis History page.

                OcularScreenAI provides AI-assisted
                screening and should not be used as
                a replacement for professional
                medical diagnosis.

              </p>

            </div>

          </section>


          {/* ====================================
              LOGOUT
          ==================================== */}

          <button
            className="profile-logout"
            onClick={handleLogout}
          >

            <LogOut size={19} />

            Logout from OcularScreenAI

          </button>


        </div>

      </main>

    </div>

  );

}


export default Profile;