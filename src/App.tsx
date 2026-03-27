import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { Loader2 } from 'lucide-react';

const Editor = lazy(() => import('./pages/Editor').then(m => ({ default: m.Editor })));
const Viewer = lazy(() => import('./pages/Viewer').then(m => ({ default: m.Viewer })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));

const LoadingScreen = () => (
  <div className="min-h-screen bg-base flex flex-col items-center justify-center text-electric">
    <Loader2 className="w-10 h-10 animate-spin mb-4" />
    <p className="text-white/50 text-sm">جاري التحميل...</p>
  </div>
);

function App() {
  // Check for legacy ?mode=view logic just in case an old link is clicked
  const isLegacyViewMode = new URLSearchParams(window.location.search).get('mode') === 'view';

  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Legacy Support */}
            {isLegacyViewMode && <Route path="*" element={<Viewer />} />}
            
            <Route path="/" element={<Editor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor/:pageId" element={<Editor />} />
            <Route path="/view/:slug" element={<Viewer />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
