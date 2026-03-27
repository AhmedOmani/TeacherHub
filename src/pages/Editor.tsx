import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import type { TabType } from '../components/Sidebar';
import { Overlay } from '../components/Overlay';
import { Preview } from '../components/Preview';
import { ConfigProvider } from '../ConfigContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useEffect } from 'react';

export function Editor() {
  const { pageId } = useParams<{ pageId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>(null);
  
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return null;

  return (
    <ConfigProvider pageId={pageId} isViewMode={false}>
      <div className="w-full h-screen flex flex-row relative overflow-hidden bg-base text-text-main">
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
        <Preview isViewMode={false} />
        <Overlay activeTab={activeTab} onClose={() => setActiveTab(null)} />
      </div>
    </ConfigProvider>
  );
}
