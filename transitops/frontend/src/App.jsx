import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { FleetWorkspace } from "./features/fleet/FleetWorkspace.jsx";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FleetWorkspace />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3200,
          style: {
            borderRadius: "8px",
            background: "#16202a",
            color: "#ffffff"
          }
        }}
      />
    </Router>
  );
}
