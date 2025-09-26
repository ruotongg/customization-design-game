import React, { useState } from 'react';
import FourGridStoryComponent from './FourGridStoryComponent';
import { getSectionText } from '../config/uiText';

const ActivityRevisitSection = ({ values, FIELDS, routeMapRefs, handleRouteMapDataChange }) => {
  const routeFields = FIELDS.filter(f => f.type === 'fourGridStory');
  const [activeRouteMap, setActiveRouteMap] = useState('routeMap2-2');
  
  // Separate routeMap2-1 from the others
  const routeMap2_1 = routeFields.find(f => f.key === 'routeMap2-1');
  const additionalRouteMaps = routeFields.filter(f => f.key !== 'routeMap2-1');

  return (
    <>
      <div className="description-box">
        <h3>
          {getSectionText('activityRevisit').title}
        </h3>
        <p>
          {getSectionText('activityRevisit').description}
        </p>
      </div>

      {/* Route map components */}
      <section className="activity-revisit-section">
        {/* Always show routeMap2-1 */}
        {routeMap2_1 && (
          <div key={routeMap2_1.key} className="activity-revisit-item">
            <div className="activity-revisit-description">
              <h4 style={{ margin: "0 0 12px 0", fontSize: 16, color: "#2c3e50" }}>
                Learning Abilities Development
              </h4>
              <p style={{ margin: "0 0 0 0", color: "#6c757d", fontSize: 14, lineHeight: "1.5" }}>
                Map out your <strong>learning abilities</strong> - the skills, competencies, and capabilities you've developed or are developing. 
                Consider both <em>technical skills</em> and <em>soft skills</em> that contribute to your learning journey.
              </p>
            </div>
            <FourGridStoryComponent
              title={routeMap2_1.title}
              question={routeMap2_1.question}
              promptId={routeMap2_1.promptId}
              values={values}
              fieldKey={routeMap2_1.key}
              onDataChange={(fieldKey, data) => handleRouteMapDataChange(fieldKey, data)}
              ref={(el) => { routeMapRefs.current[routeMap2_1.key] = el }}
              stepKey={routeMap2_1.stepKey}
              onStepKeyChange={(stepKey) => {
                console.log('Step key changed to:', stepKey);
                // You can add additional logic here if needed
              }}
            />
          </div>
        )}

              {/* Description for additional route maps */}
      <div className="activity-revisit-description">
        <h4 style={{ margin: "0 0 12px 0", fontSize: 16, color: "#2c3e50" }}>
          Additional Learning Roadmaps
        </h4>
        <p style={{ margin: "0 0 0 0", color: "#6c757d", fontSize: 14, lineHeight: "1.5" }}>
          Choose between <strong>Learning Methods</strong> to explore your study strategies and approaches, 
          or <strong>Learning Outcomes</strong> to map your achievements and goals. 
          Both roadmaps help you reflect on different aspects of your learning journey.
        </p>
      </div>

      {/* Navigation for additional route maps (2-2 and 2-3) */}
      <div className="activity-revisit-navigation">
        <h4 style={{ margin: "0 0 16px 0", fontSize: 16, color: "#2c3e50" }}>
          Choose an Additional Learning Roadmap:
        </h4>
        <div className="activity-revisit-buttons">
          {additionalRouteMaps.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveRouteMap(f.key)}
              className="activity-revisit-button"
              style={{
                border: activeRouteMap === f.key ? "2px solid #007bff" : "1px solid #dee2e6",
                background: activeRouteMap === f.key ? "#e7f3ff" : "#ffffff",
                color: activeRouteMap === f.key ? "#007bff" : "#495057",
                fontWeight: activeRouteMap === f.key ? "600" : "400"
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

        {/* Show selected additional route map */}
        {additionalRouteMaps
          .filter(f => f.key === activeRouteMap)
          .map(f => (
            <div key={f.key} className="activity-revisit-item">
              <FourGridStoryComponent
                title={f.title}
                question={f.question}
                promptId={f.promptId}
                values={values}
                fieldKey={f.key}
                onDataChange={(fieldKey, data) => handleRouteMapDataChange(fieldKey, data)}
                ref={(el) => { routeMapRefs.current[f.key] = el }}
                stepKey={f.stepKey}
                onStepKeyChange={(stepKey) => {
                  console.log('Step key changed to:', stepKey);
                  // You can add additional logic here if needed
                }}
              />
            </div>
          ))}
      </section>
    </>
  );
};

export default ActivityRevisitSection;
