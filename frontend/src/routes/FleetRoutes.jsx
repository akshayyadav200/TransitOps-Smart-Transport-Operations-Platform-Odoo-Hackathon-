import { Route, Routes } from 'react-router-dom';
import VehiclesPage from '../pages/VehiclesPage.jsx';

export default function FleetRoutes() {
  return (
    <Routes>
      <Route path="vehicles" element={<VehiclesPage />} />
    </Routes>
  );
}

