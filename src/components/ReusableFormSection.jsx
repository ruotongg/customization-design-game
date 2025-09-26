import React from 'react';

const ReusableFormSection = ({ 
  title, 
  fieldKey = 'feedback', // Key for the form field
  values, 
  height = "120px", // Height of the answer space
  placeholder = "Please share your thoughts...",
  onChange,
  required = false,
  disabled = false
}) => {
  const fieldValue = values[fieldKey] || '';

  return (
    <div style={{
      background: "#f8f9fa",
      border: "1px solid #e9ecef",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "16px",
      width: "100%",
      maxWidth: "100%",
      minWidth: "280px",
      boxSizing: "border-box"
    }}>
      {title && (
        <h3 style={{ 
          margin: "0 0 16px 0", 
          fontSize: "16px", 
          fontWeight: "bold",
          color: "#2c3e50"
        }}>
          {title}
          {required && <span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>}
        </h3>
      )}
      
      <textarea
        value={fieldValue}
        onChange={(e) => onChange(fieldKey)(e)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: "100%",
          maxWidth: "100%",
          height: height,
          padding: "12px",
          border: `1px solid ${disabled ? "#e5e7eb" : "#d1d5db"}`,
          borderRadius: "6px",
          fontSize: "14px",
          fontFamily: "inherit",
          background: disabled ? "#f9fafb" : "#ffffff",
          resize: "vertical",
          color: disabled ? "#6b7280" : "#111827",
          cursor: disabled ? "not-allowed" : "text",
          transition: "border-color 0.2s ease",
          boxSizing: "border-box",
          minWidth: "280px"
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.target.style.borderColor = "#3b82f6";
          }
        }}
        onBlur={(e) => {
          if (!disabled) {
            e.target.style.borderColor = "#d1d5db";
          }
        }}
      />
    </div>
  );
};

export default ReusableFormSection;
