import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth, Role } from './auth';
import Landing from './pages/Landing';
import Programs from './pages/Programs';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminPortal from './pages/AdminPortal';
import TeacherPortal from './pages/TeacherPortal';
import StudentDashboard from './pages/StudentDashboard';
import ChapterView from './pages/ChapterView';

function Guard({ role, children }: { role: Role; children: JSX.Element }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="spinner" />;
  if (!user) return <Navigate to="/" state={{ from: loc }} replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return children;
}

function Home() {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  if (user) return <Navigate to={`/${user.role}`} replace />;
  return <Landing />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/programs" element={<Programs />} />
      <Route path="/programs/:slug" element={<Programs />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin/*" element={<Guard role="admin"><AdminPortal /></Guard>} />
      <Route path="/teacher/*" element={<Guard role="teacher"><TeacherPortal /></Guard>} />
      <Route path="/student" element={<Guard role="student"><StudentDashboard /></Guard>} />
      <Route path="/student/chapter/:id" element={<Guard role="student"><ChapterView /></Guard>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
