/**
 * DashboardPage – Protected main dashboard.
 * Manages sidebar state and renders the active section.
 */
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import HomeSection from '../sections/HomeSection';
import SimilarWordsSection from '../sections/SimilarWordsSection';
import CompareWordsSection from '../sections/CompareWordsSection';
import AnalogySection from '../sections/AnalogySection';
import ApiHealthSection from '../sections/ApiHealthSection';
import AboutSection from '../sections/AboutSection';

// Map section IDs to components
const SECTIONS = {
  home:    HomeSection,
  similar: SimilarWordsSection,
  compare: CompareWordsSection,
  analogy: AnalogySection,
  health:  ApiHealthSection,
  about:   AboutSection,
};

function DashboardPage() {
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarOpen, setSidebarOpen]     = useState(true);

  // Dynamically resolve the active section component
  const ActiveComponent = SECTIONS[activeSection] || SECTIONS.home;

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // On mobile: auto-close sidebar after selecting
    if (window.innerWidth <= 900) setSidebarOpen(false);
  };

  const toggleSidebar = () => setSidebarOpen(v => !v);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Fixed sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isOpen={sidebarOpen}
      />

      {/* Mobile overlay backdrop */}
      {sidebarOpen && window.innerWidth <= 900 && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 38
          }}
        />
      )}

      {/* Main content area */}
      <div style={{
        flex: 1,
        display: 'flex', flexDirection: 'column',
        marginLeft: sidebarOpen ? 'var(--sidebar-width)' : '0',
        transition: 'margin-left 0.3s ease',
        height: '100vh', overflow: 'hidden',
        minWidth: 0,
      }}>
        {/* Sticky Navbar */}
        <Navbar onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />

        {/* Scrollable content */}
        <main style={{
          flex: 1, overflowY: 'auto',
          padding: '32px',
          background: 'var(--bg-base)',
        }}>
          {/* Pass navigate-to-section down to HomeSection */}
          <ActiveComponent
            onNavigate={activeSection === 'home' ? handleSectionChange : undefined}
          />
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
