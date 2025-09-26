import React from 'react';
import ReusableFormSection from './ReusableFormSection';
import { getSectionText } from '../config/uiText';

const WelcomeSection = ({ values, update, FIELDS }) => {

  // Define basic info fields configuration
  const basicFields = [
    {
      key: 'name',
      label: 'Name',
      placeholder: 'Please enter your full name...'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Please enter your email address...'
    },
    {
      key: 'age',
      label: 'Age',
      type: 'number',
      placeholder: 'Please enter your age...'
    }
  ];

  return (
    <>
      {/* Description box */}
      <div className="description-box">
        <h3>
          {getSectionText('welcome').title}
        </h3>
        <p>
          {getSectionText('welcome').description}
        </p>
      </div>

      {/* Introduction*/}
      <div style={{
        background: "#f8f9fa",
        border: "1px solid #e9ecef",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "24px",
        lineHeight: "1.6"
      }}>
        <h2 style={{ marginTop: 0, color: "#2c3e50", fontSize: "20px" }}>
          🎯 Welcome to Learning Roadmap Design Research
        </h2>
        
        <p style={{ marginBottom: "16px", fontSize: "16px", color: "#495057" }}>
          This survey aims to understand your learning abilities development path and learning goals planning. Through visual design, we can better understand learners' thinking patterns and development trajectories.
        </p>
        
        <div style={{ 
          background: "#e3f2fd", 
          border: "1px solid #bbdefb", 
          borderRadius: "8px", 
          padding: "16px", 
          marginBottom: "16px" 
        }}>
          <h3 style={{ marginTop: 0, color: "#1976d2", fontSize: "16px" }}>
            📝 How to use this tool:
          </h3>
          <ol style={{ margin: 0, paddingLeft: "20px", color: "#424242" }}>
            <li><strong>Fill in basic information</strong>: Name, email and other basic information</li>
            <li><strong>Design learning abilities roadmap</strong>: Describe your learning abilities, methods and outcomes</li>
            <li><strong>Design learning goals roadmap</strong>: Plan your learning goals and expected outcomes</li>
            <li><strong>Add visual markers</strong>: Add ❤️ hearts and ❓ question marks on the canvas to highlight important content</li>
            <li><strong>Save data</strong>: The system will automatically save to browser, you can also manually save JSON files</li>
          </ol>
        </div>
        
        <div style={{ 
          background: "#fff3e0", 
          border: "1px solid #ffcc02", 
          borderRadius: "8px", 
          padding: "16px" 
        }}>
          <h3 style={{ marginTop: 0, color: "#f57c00", fontSize: "16px" }}>
            💡 Example descriptions:
          </h3>
          <p style={{ margin: 0, color: "#424242", fontSize: "14px" }}>
            <strong>Learning Abilities</strong>: Such as "strong logical thinking", "good at teamwork", "solid programming foundation"<br/>
            <strong>Learning Methods</strong>: Such as "learning through project practice", "reading professional books", "taking online courses"<br/>
            <strong>Learning Outcomes</strong>: Such as "mastering Python programming", "obtaining relevant certifications", "completing graduation projects"
          </p>
        </div>
      </div>

      {/* Reusable form section for name */}
      <ReusableFormSection
        title="Name"
        fieldKey="name"
        values={values}
        height="60px"
        placeholder="Please enter your full name..."
        onChange={update}
      />

      {/* Reusable form section for email */}
      <ReusableFormSection
        title="Email"
        fieldKey="email"
        values={values}
        height="60px"
        placeholder="Please enter your email address..."
        onChange={update}
      />

      {/* Reusable form section for age */}
      <ReusableFormSection
        title="Age"
        fieldKey="age"
        values={values}
        height="60px"
        placeholder="Please enter your age..."
        onChange={update}
      />
    </>
  );
};

export default WelcomeSection;
