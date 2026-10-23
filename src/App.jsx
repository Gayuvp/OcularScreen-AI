import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewScreening from "./pages/NewScreening";
import AnalysisHistory from "./pages/AnalysisHistory";
import Diseases from "./pages/Diseases";
import Profile from "./pages/Profile";


import "./App.css";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* DASHBOARD */}
        <Route
  path="/"
  element={<Login />}
/>
<Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* NEW SCREENING */}

        <Route
          path="/screening"
          element={<NewScreening />}
        />


        {/* ANALYSIS HISTORY */}

        <Route
          path="/history"
          element={<AnalysisHistory />}
        />
        <Route
  path="/diseases"
  element={<Diseases />}
/>
<Route
  path="/profile"
  element={<Profile />}
/>


        {/* DEFAULT ROUTE */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;