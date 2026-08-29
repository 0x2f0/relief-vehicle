import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { ApplyPass } from './pages/ApplyPass';
import { ApplicationSuccess } from './pages/ApplicationSuccess';
import { TrackStatus } from './pages/TrackStatus';
import { ViewPass } from './pages/ViewPass';
import { CheckpointScanner } from './pages/CheckpointScanner';
import { RoadConditions } from './pages/RoadConditions';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<ApplyPass />} />
          <Route path="/applied/:id" element={<ApplicationSuccess />} />
          <Route path="/track" element={<TrackStatus />} />
          <Route path="/pass/:id" element={<ViewPass />} />
          <Route path="/scanner" element={<CheckpointScanner />} />
          <Route path="/verify" element={<CheckpointScanner />} />
          <Route path="/roads" element={<RoadConditions />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
