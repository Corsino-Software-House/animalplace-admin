import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Users } from '@/pages/Users';
import { Banners } from '@/pages/Banners';
import { Payments } from '@/pages/Payments';
import { Plans } from '@/pages/Plans';
import { Services } from '@/pages/Services';
import { Agenda } from '@/pages/Agenda';
import { Microchips } from '@/pages/Microchips';
import { Cashbacks } from '@/pages/Cashbacks';
import { Reports } from '@/pages/Reports';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-black font-space-grotesk">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/banners" element={<Banners />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/services" element={<Services />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/microchips" element={<Microchips />} />
            <Route path="/cashbacks" element={<Cashbacks />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Layout>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;