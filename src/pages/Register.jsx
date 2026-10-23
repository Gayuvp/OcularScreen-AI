import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Eye,
  User,
  Mail,
  Lock,
  UserPlus,
  ShieldCheck
} from "lucide-react";

import "./Register.css";


function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // ==========================================
  // REGISTER
  // ==========================================

  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    if (!name || !email || !password) {

      setError(
        "Please fill in all fields."
      );

      return;
    }


    if (password.length < 6) {

      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }


    try {

      setLoading(true);


      const response = await fetch(
        "http://127.0.0.1:8000/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password
          })
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Registration failed."
        );

      }


      console.log(
        "Registration response:",
        data
      );


      setSuccess(
        "Account created successfully! Redirecting to login..."
      );


      // ======================================
      // SAVE USER INFORMATION
      // ======================================

      if (data.user) {

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

      }


      // ======================================
      // GO TO LOGIN
      // ======================================

      setTimeout(() => {

        navigate("/");

      }, 1500);

    }

    catch (error) {

      console.error(
        "Registration error:",
        error
      );

      setError(
        error.message ||
        "Unable to create account."
      );

    }

    finally {

      setLoading(false);

    }

  };


  return (

    <div className="register-page">


      {/* ====================================
          LEFT SIDE
      ==================================== */}

      <div className="register-left">


        <div className="register-brand">

          <div className="register-brand-icon">

            <Eye size={28} />

          </div>

          <span>
            Ocular<span>AI</span>
          </span>

        </div>


        <div className="register-hero">

          <div className="register-hero-icon">

            <UserPlus size={42} />

          </div>


          <h1>
            Start Your
            <br />
            OcularAI Journey
          </h1>


          <p>
            Create your account and access
            AI-assisted ocular health screening,
            analysis history and personalized
            screening information.
          </p>


          <div className="register-security">

            <ShieldCheck size={18} />

            <span>
              Your account is securely protected
            </span>

          </div>

        </div>


        <p className="register-footer">

          OcularScreenAI • AI-assisted
          screening & research platform

        </p>

      </div>


      {/* ====================================
          RIGHT SIDE
      ==================================== */}

      <div className="register-right">

        <div className="register-card">


          {/* MOBILE BRAND */}

          <div className="register-mobile-brand">

            <div className="register-brand-icon">

              <Eye size={24} />

            </div>

            <span>
              Ocular<span>AI</span>
            </span>

          </div>


          {/* HEADING */}

          <div className="register-heading">

            <h2>
              Create Account
            </h2>

            <p>
              Join OcularScreenAI today.
            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div className="register-error">

              {error}

            </div>

          )}


          {/* SUCCESS */}

          {success && (

            <div className="register-success">

              {success}

            </div>

          )}


          {/* FORM */}

          <form
            className="register-form"
            onSubmit={handleRegister}
          >


            {/* NAME */}

            <div className="register-form-group">

              <label>
                Full Name
              </label>


              <div className="register-input">

                <User size={19} />

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  autoComplete="name"
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="register-form-group">

              <label>
                Email Address
              </label>


              <div className="register-input">

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

            <div className="register-form-group">

              <label>
                Password
              </label>


              <div className="register-input">

                <Lock size={19} />

                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="new-password"
                />

              </div>

            </div>


            {/* BUTTON */}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >

              {loading ? (

                <>
                  <span className="register-spinner"></span>

                  Creating Account...

                </>

              ) : (

                <>
                  <UserPlus size={19} />

                  Create Account

                </>

              )}

            </button>


          </form>


          {/* LOGIN LINK */}

          <div className="login-link">

            Already have an account?

            <button
              type="button"
              onClick={() => navigate("/")}
            >
              Sign In
            </button>

          </div>


          {/* SECURITY */}

          <div className="register-info">

            <ShieldCheck size={17} />

            <span>
              Your password is securely hashed
              before being stored.
            </span>

          </div>


          <p className="register-disclaimer">

            OcularScreenAI is an AI-assisted
            screening prototype and does not
            replace professional medical diagnosis.

          </p>


        </div>

      </div>

    </div>

  );

}


export default Register;