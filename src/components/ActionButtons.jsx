import React from 'react';
import { getSectionText, getButtonText } from '../config/uiText';

const ActionButtons = ({ 
  activeSection, 
  navigateToSection, 
  downloadJSON, 
  loadFromFile, 
  clearAllData, 
  msg, 
  error 
}) => {
  const sections = ['welcome', 'activity-revisit', 'chess-game', 'reflection'];
  
  // Map section IDs to uiText keys
  const getSectionKey = (sectionId) => {
    const mapping = {
      'welcome': 'welcome',
      'activity-revisit': 'activityRevisit',
      'chess-game': 'chessGame',
      'reflection': 'reflection'
    };
    return mapping[sectionId] || 'welcome';
  };

  return (
    <>
      {/* Navigation buttons */}
      <div className="navigation-buttons">
        <button 
          className="btn" 
          onClick={() => {
            const currentIndex = sections.indexOf(activeSection);
            if (currentIndex > 0) {
              navigateToSection(sections[currentIndex - 1]);
            }
          }}
          disabled={activeSection === 'basic'}
          style={{
            background: activeSection === 'basic' ? '#e9ecef' : '#6c757d',
            color: activeSection === 'basic' ? '#6c757d' : '#ffffff',
            cursor: activeSection === 'basic' ? 'not-allowed' : 'pointer',
            opacity: activeSection === 'basic' ? 0.6 : 1
          }}
        >
          ← Previous
        </button>
        
        <div className="current-section">
          <span>{getSectionText(getSectionKey(activeSection)).icon}</span>
          {getSectionText(getSectionKey(activeSection)).label}
        </div>
        
        <button 
          className="btn" 
          onClick={() => {
            const currentIndex = sections.indexOf(activeSection);
            if (currentIndex < sections.length - 1) {
              navigateToSection(sections[currentIndex + 1]);
            }
          }}
          disabled={activeSection === 'additional'}
          style={{
            background: activeSection === 'additional' ? '#e9ecef' : '#007bff',
            color: activeSection === 'additional' ? '#6c757d' : '#ffffff',
            cursor: activeSection === 'additional' ? 'not-allowed' : 'pointer',
            opacity: activeSection === 'additional' ? 0.6 : 1
          }}
        >
          Next →
        </button>
      </div>

      {/* Action buttons */}
      <div className="row" style={{ 
        display: 'flex', 
        gap: 8, 
        flexWrap: 'wrap',
        justifyContent: 'center',
        margin: '20px 0'
      }}>
        <button className="btn" onClick={downloadJSON}>{getButtonText('save')}</button>
        <label className="btn" style={{ cursor:'pointer' }}>
          {getButtonText('load')}
          <input 
            type="file" 
            accept="application/json" 
            hidden 
            onChange={(e) => loadFromFile(e.target.files?.[0])} 
          />
        </label>
        <button 
          className="btn" 
          onClick={clearAllData}
          style={{ 
            background: '#dc2626', 
            color: '#fff', 
            border: '1px solid #dc2626' 
          }}
        >
          {getButtonText('clear')}
        </button>
      </div>

      {/* Information messages */}
      {msg && <p className="ok">{msg}</p>}
      {error && <p className="err">{error}</p>}

      <p className="muted">
        Note: Content is automatically saved to browser cache. You can fill in all information and design your learning roadmap, including filling in abilities, methods and outcomes, and adding heart and question mark markers. Use the buttons at the bottom to manually save to local JSON file or import previously saved files.
      </p>
    </>
  );
};

export default ActionButtons;
