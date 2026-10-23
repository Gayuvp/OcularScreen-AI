import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Eye,
  Mail,
  Lock,
  LogIn,
  ShieldCheck
} from "lucide-react";

import "./Login.css";


function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");


    // ======================================
    // VALIDATION
    // ======================================

    if (!email.trim() || !password) {

      setError(
        "Please enter your email and password."
      );

      return;

    }


    try {

      setLoading(true);


      // ======================================
      // CALL FASTAPI LOGIN API
      // ======================================

      const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password
          })
        }
      );


      const data = await response.json();


      // ======================================
      // HANDLE ERROR
      // ======================================

      if (!response.ok) {

        throw new Error(
          data.detail ||
          data.message ||
          "Invalid email or password."
        );

      }


      console.log(
        "Login response:",
        data
      );


      // ======================================
      // SAVE ACCESS TOKEN
      // ======================================

      if (data.access_token) {

        localStorage.setItem(
          "token",
          data.access_token
        );

        localStorage.setItem(
          "access_token",
          data.access_token
        );

      }


      // ======================================
      // SAVE USER INFORMATION
      // ======================================

      if (data.user) {

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );


        // Save individual values too
        localStorage.setItem(
          "user_id",
          String(data.user.id)
        );

        localStorage.setItem(
          "user_name",
          data.user.name
        );

        localStorage.setItem(
          "user_email",
          data.user.email
        );

      }


      // ======================================
      // LOGIN SUCCESS
      // ======================================

      console.log(
        "✅ Login successful"
      );


      // ======================================
      // GO TO DASHBOARD
      // ======================================

      navigate("/dashboard");

    }


    catch (error) {

      console.error(
        "Login error:",
        error
      );


      setError(
        error.message ||
        "Unable to login. Please try again."
      );

    }


    finally {

      setLoading(false);

    }

  };


  return (

    <div className="login-page">


      {/* ====================================
          LEFT SIDE
      ==================================== */}

      <div className="login-left">


        {/* BRAND */}

        <div className="login-brand">

          <div className="login-brand-icon">

            <Eye size={28} />

          </div>

          <span>
            Ocular<span>AI</span>
          </span>

        </div>


        {/* HERO */}

        <div className="login-hero">

          <div className="hero-icon">

            <Eye size={48} />

          </div>


          <h1>
            Intelligent Ocular
            <br />
            Health Screening
          </h1>


          <p>
            AI-assisted ocular screening
            designed to help identify
            possible anemia from eye images.
          </p>


          <div className="security-info">

            <ShieldCheck size={18} />

            <span>
              Secure AI-assisted screening
            </span>

          </div>

        </div>


        {/* FOOTER */}

        <p className="login-footer">

          OcularScreenAI • AI-assisted
          screening & research platform

        </p>

      </div>


      {/* ====================================
          RIGHT SIDE
      ==================================== */}

      <div className="login-right">


        <div className="login-card">


          {/* MOBILE BRAND */}

          <div className="mobile-brand">

            <div className="login-brand-icon">

              <Eye size={24} />

            </div>

            <span>
              Ocular<span>AI</span>
            </span>

          </div>


          {/* HEADING */}

          <div className="login-heading">

            <h2>
              Welcome Back
            </h2>

            <p>
              Sign in to continue to
              OcularScreenAI.
            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div className="login-error">

              {error}

            </div>

          )}


          {/* ==================================
              LOGIN FORM
          ================================== */}

          <form
            onSubmit={handleLogin}
            className="login-form"
          >


            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email Address
              </label>


              <div className="input-wrapper">

                <Mail size={19} />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label>
                Password
              </label>


              <div className="input-wrapper">

                <Lock size={19} />

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                />

              </div>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (

                <>
                  <span className="spinner"></span>

                  Signing in...

                </>

              ) : (

                <>
                  <LogIn size={19} />

                  Sign In

                </>

              )}

            </button>


          </form>


          {/* ==================================
              REGISTER LINK
          ================================== */}

          <div className="register-link">

            <span>
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
            >
              Create Account
            </button>

          </div>


          {/* ==================================
              INFORMATION
          ================================== */}

          <div className="login-info">

            <ShieldCheck size={17} />

            <span>
              Your screening results are
              securely associated with your
              account.
            </span>

          </div>


          {/* DISCLAIMER */}

          <p className="login-disclaimer">

            OcularScreenAI is an AI-assisted
            screening prototype and does not
            replace professional medical
            diagnosis.

          </p>


        </div>

      </div>

    </div>

  );

}


export default Login;