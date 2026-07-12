import { Navigate, Route, Routes } from 'react-router-dom';
import FleetRoutes from './routes/FleetRoutes.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/fleet/*" element={<FleetRoutes />} />
      <Route path="*" element={<Navigate to="/fleet/vehicles" replace />} />
    </Routes>
  );
}

