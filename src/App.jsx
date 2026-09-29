import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import CreateLLR from './pages/CreateLLR/CreateLLR';
import AllLLR from './pages/AllLLR/AllLLR';
import Settings from './pages/Settings/Settings';
import PreviewLLR from './pages/PreviewLLR/PreviewLLR';
import BlackHoleDemo from './components/ui/demo';

const ProtectedRoute = ({ children }) => {
  if (localStorage.getItem('llr_logged_in') !== 'true') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/demo" element={<BlackHoleDemo />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="create-llr" element={<CreateLLR />} />
        <Route path="preview-llr" element={<PreviewLLR />} />
        <Route path="all-llr" element={<AllLLR />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
