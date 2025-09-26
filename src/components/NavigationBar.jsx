import React from 'react';
import { getSectionText } from '../config/uiText';

const NavigationBar = ({ activeSection, navigateToSection }) => {
  const navigationSections = [
    { id: 'welcome', label: getSectionText('welcome').label, icon: getSectionText('welcome').icon },
    { id: 'activity-revisit', label: getSectionText('activityRevisit').label, icon: getSectionText('activityRevisit').icon },
    { id: 'reflection', label: getSectionText('reflection').label, icon: getSectionText('reflection').icon }
  ];

  return (
    <nav style={{
      background: "#ffffff",
      border: "1px solid #e9ecef",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "24px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <div style={{
        display: "flex",
        gap: "8px",
        justifyContent: "center",
        flexWrap: "wrap"
      }}>
        {navigationSections.map(section => (
          <button
            key={section.id}
            onClick={() => navigateToSection(section.id)}
            style={{
              padding: "12px 20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              background: activeSection === section.id ? "#007bff" : "#ffffff",
              color: activeSection === section.id ? "#ffffff" : "#495057",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
            onMouseEnter={(e) => {
              if (activeSection !== section.id) {
                e.target.style.background = "#f8f9fa";
                e.target.style.borderColor = "#007bff";
              }
            }}
            onMouseLeave={(e) => {
              if (activeSection !== section.id) {
                e.target.style.background = "#ffffff";
                e.target.style.borderColor = "#ddd";
              }
            }}
          >
            <span style={{ fontSize: "16px" }}>{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavigationBar;
