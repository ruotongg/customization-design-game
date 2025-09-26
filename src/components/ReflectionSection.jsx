import React from 'react';
import ReusableFormSection from './ReusableFormSection';
import { getSectionText } from '../config/uiText';

const ReflectionSection = ({ values, update, FIELDS }) => {
  return (
    <>
      {/* Description box */}
      <div className="description-box">
        <h3>
          {getSectionText('reflection').title}
        </h3>
        <p>
          {getSectionText('reflection').description}
        </p>
      </div>

      {/* Reusable form section with simplified props */}
      <ReusableFormSection
        title={getSectionText('reflection').title}
        fieldKey="feedback"
        values={values}
        height="150px"
        placeholder="Please share any additional thoughts about your learning path, challenges, or insights..."
        onChange={update}
      />

      {/* Privacy notice */}
      <div style={{
        background: "#f0fdf4",
        border: "1px solid #c8e6c9", 
        borderRadius: "6px", 
        padding: "12px",
        fontSize: "14px",
        color: "#2e7d32"
      }}>
        <strong>🔒 Privacy Protection:</strong> All data is only stored on your local device and will not be uploaded to any server.
        You can clear data or export data for backup at any time.
      </div>
    </>
  );
};

export default ReflectionSection;
