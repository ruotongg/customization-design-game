// src/components/FourGridStoryComponent.jsx
import React, { useEffect, useRef, useState, useImperativeHandle, useCallback, useMemo } from "react";

// ============================================================================
// CONSTANTS AND CONFIGURATION
// ============================================================================

// Import random story scripts
import { RANDOM_STORY_SCRIPTS, getStoryScriptByKey } from '../config/randomStoryScripts.js';

// Four-grid story structure based on random story scripts
const getStoryGridStructure = (key) => {
  // Get story script by key with random branches processed
  const storyScript = getStoryScriptByKey(key);
  
  if (!storyScript || !storyScript.steps || storyScript.steps.length < 3) {
    // Default configuration if no valid script found
    return {
  start: {
    title: "King",
    position: { x: 0, y: 1 },
    color: "#ff6b6b",
    symbol: "♔"
  },
  step1: {
    title: "Brainstorm",
    position: { x: 1, y: 1 },
    color: "#4fc3f7",
    symbol: "💡"
  },
  step2: {
    title: "Embed in workflow",
    position: { x: 2, y: 1 },
    color: "#10b981",
    symbol: "⚙️"
  },
  step3: {
    title: "Result",
    position: { x: 3, y: 1 },
    color: "#ff9f43",
    symbol: "📊"
  },
  goal: {
    title: "Goal - Opponent King",
    position: { x: 4, y: 1 },
    color: "#2c3e50",
    symbol: "♚"
  }
    };
  }
  
  // Use the processed steps (with random branches already resolved)
  const steps = storyScript.steps.slice(0, 3);
  
  return {
    start: {
      title: "King",
      position: { x: 0, y: 1 },
      color: "#ff6b6b",
      symbol: "♔"
    },
    step1: {
      title: steps[0].title,
      position: { x: 1, y: 1 },
      color: steps[0].color,
      symbol: steps[0].symbol
    },
    step2: {
      title: steps[1].title,
      position: { x: 2, y: 1 },
      color: steps[1].color,
      symbol: steps[1].symbol
    },
    step3: {
      title: steps[2].title,
      position: { x: 3, y: 1 },
      color: steps[2].color,
      symbol: steps[2].symbol
    },
    goal: {
      title: "Goal - Opponent King",
      position: { x: 4, y: 1 },
      color: "#2c3e50",
      symbol: "♚"
    }
  };
};

// Chess characters that can be added to the grid
const CHESS_CHARACTERS = [
  { type: 'queen', symbol: '♕', count: 2, color: '#ff9f43' },
  { type: 'knight', symbol: '♘', count: 3, color: '#10b981' },
  { type: 'pawn', symbol: '♙', count: -1, color: '#4fc3f7' } // -1 means unlimited
];

// Grid dimensions
const GRID_COLS = 5; // King, Brainstorm, Embed, Result, Goal

// Reusable style objects
const buttonStyles = {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    border: "2px solid #ddd",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#333",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    minHeight: "40px",
    justifyContent: "center"
  },
  primary: {
    border: "2px solid #007bff",
    background: "#007bff",
    color: "#ffffff"
  },
  success: {
    border: "2px solid #28a745",
    background: "#28a745",
    color: "#ffffff"
  },
  danger: {
    border: "2px solid #dc3545",
    background: "#dc3545",
    color: "#ffffff"
  },
  disabled: {
    border: "2px solid #ccc",
    background: "#f5f5f5",
    color: "#999",
    cursor: "not-allowed"
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const FourGridStoryComponent = React.forwardRef(({ values, fieldKey, onDataChange, promptId, stepKey, onStepKeyChange }, ref) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Visual elements state
  const [visualElements, setVisualElements] = useState([]);
  
  // Progressive unlock state
  const [activeStep, setActiveStep] = useState(1); // 0 = King, 1 = Brainstorm, 2 = Embed, 3 = Result (never 4 = Goal)
  
  // Character editing state
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characterDescription, setCharacterDescription] = useState('');
  
  // Character selection state
  const [showCharacterSelection, setShowCharacterSelection] = useState(false);
  
  // Step key selection state
  const [selectedStepKey, setSelectedStepKey] = useState(stepKey || 'settingsExist');
  
  // Fixed story structure - generated once when stepKey changes
  const [fixedStoryStructure, setFixedStoryStructure] = useState(null);
  
  // Story boxes for different steps
  const [storyBoxes, setStoryBoxes] = useState([]);
  
  // Grid sizing
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const gridRef = useRef(null);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  // Get visual element at position
  const getVisualElementAt = useCallback((row, col) => {
    return visualElements.find(el => el.row === row && el.col === col);
  }, [visualElements]);

  // Generate story content for a specific step
  const generateStoryForStep = useCallback((step, storyStep, stepKey) => {
    const stepNames = ['King', 'Step 1', 'Step 2', 'Step 3', 'Goal'];
    const stepName = stepNames[step] || `Step ${step}`;
    
    if (stepKey === 'settingsExist') {
      switch (step) {
        case 1:
          return `You begin by understanding how to use existing settings and configurations. This involves exploring the current system and identifying what's already available.`;
        case 2:
          return `You proceed to complete the task using the existing settings. This step involves applying the known configurations to achieve your objectives.`;
        case 3:
          return `You successfully obtain a solution based on the existing settings. The outcome demonstrates the effectiveness of working with established configurations.`;
        default:
          return `This is ${stepName} in your journey.`;
      }
    } else if (stepKey === 'settingsNotThere') {
      switch (step) {
        case 1:
          return `You start by brainstorming ideas and approaches. This involves creative thinking and exploring different possibilities for your needs.`;
        case 2:
          return storyStep?.title === 'Reach out for help' 
            ? `When the initial approach doesn't work, you reach out for help and support from others to find alternative solutions.`
            : `You implement your chosen method and integrate it into your workflow to address the challenges.`;
        case 3:
          return `You successfully achieve your goals and obtain a solution. The process has led to a positive outcome that meets your needs.`;
        default:
          return `This is ${stepName} in your journey.`;
      }
    }
    
    return `This is ${stepName} in your journey.`;
  }, []);

  // ============================================================================
  // COMPUTED VALUES AND CALCULATIONS
  // ============================================================================

  // Calculate dynamic grid rows based on visual elements (max 4 character rows)
  const calculateMaxRows = useCallback(() => {
    if (visualElements.length === 0) {
      return 4; // Default: above + story path + below + add character row
    }
    
    // Calculate max row for the current activeStep column
    const maxRowInActiveColumn = Math.max(
      ...visualElements
        .filter(el => el.col === activeStep)
        .map(el => el.row),
      -1 // Default to -1 if no elements
    );
    
    // If no characters in active column, need at least 4 rows (0,1,2,3)
    if (maxRowInActiveColumn === -1) {
      return 4;
    }
    
    // Check if the last row has content
    const lastRowHasContent = getVisualElementAt(maxRowInActiveColumn, activeStep);
    
    // Calculate target row for Add Character button
    const targetRow = lastRowHasContent ? maxRowInActiveColumn + 1 : maxRowInActiveColumn - 1;
    
    // Ensure we have enough rows (at least 4, at most 7)
    const calculatedRows = Math.min(Math.max(targetRow + 1, 4), 7);
    return calculatedRows;
  }, [visualElements, activeStep]);
  
  const GRID_ROWS = calculateMaxRows();

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  // Check if a block is completed (has a character with description)
  const isBlockCompleted = useCallback((col) => {
    const element = visualElements.find(el => el.row === 2 && el.col === col);
    return element && element.description && element.description.trim() !== '';
  }, [visualElements]);

  // Check if a block is finished (completed and not the current active step)
  const isBlockFinished = useCallback((col) => {
    return isBlockCompleted(col) && col !== activeStep;
  }, [isBlockCompleted, activeStep]);

  // Check if next block can be unlocked
  const canUnlockNextBlock = useCallback(() => {
    return activeStep < 3; // Can unlock if not at the last step
  }, [activeStep]);

  // ============================================================================
  // CORE FUNCTIONS
  // ============================================================================

  // Add visual element
  const addVisualElement = useCallback((row, col, type, symbol, color, description = '') => {
    console.log('🔍 addVisualElement called:', { row, col, type, symbol, color });
    console.trace('Call stack:'); // Show where this is called from
    const newElement = {
      id: Date.now() + Math.random(),
      row,
      col,
      type,
      symbol,
      color,
      description
    };
    setVisualElements(prev => {
      const newElements = [...prev, newElement];
      console.log('📊 All elements after adding:', newElements.map(el => ({row: el.row, col: el.col, type: el.type})));
      return newElements;
    });
  }, []);

  // Remove visual element at specific position
  const removeVisualElement = useCallback((row, col) => {
    setVisualElements(prev => prev.filter(el => !(el.row === row && el.col === col)));
  }, []);

  // Clear all visual elements except goal
  const clearVisualElements = useCallback(() => {
    setVisualElements([]);
    // Clear all localStorage data
    localStorage.clear();
    console.log('Cleared all visual elements and localStorage');
  }, []);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  // Manually unlock next block
  const unlockNextBlock = useCallback(() => {
    if (activeStep < 3) {
      const newActiveStep = activeStep + 1;
      setActiveStep(newActiveStep);
      
      // Add a new story box for the unlocked step
      if (fixedStoryStructure) {
        const stepKeys = ['start', 'step1', 'step2', 'step3', 'goal'];
        const stepKey = stepKeys[newActiveStep];
        const storyStep = fixedStoryStructure[stepKey];
        
        // Generate story content for this step
        const storyContent = generateStoryForStep(newActiveStep, storyStep, selectedStepKey);
        
        // Add new story box
        const newStoryBox = {
          id: Date.now(),
          step: newActiveStep,
          title: storyStep?.title || `Step ${newActiveStep}`,
          symbol: storyStep?.symbol || '?',
          color: storyStep?.color || '#666',
          content: storyContent,
          timestamp: new Date().toISOString()
        };
        
        setStoryBoxes(prev => [...prev, newStoryBox]);
        
        console.log('Added story box for step:', newActiveStep, newStoryBox);
      }
    }
  }, [activeStep, fixedStoryStructure, selectedStepKey]);

  // Add character to current active step
  const addCharacterToActiveStep = useCallback(() => {
    setShowCharacterSelection(true);
  }, []);

  // Handle character selection from right panel
  const handleCharacterSelection = useCallback((characterType) => {
    const character = CHESS_CHARACTERS.find(c => c.type === characterType);
    if (character) {
      // Simply add to the next available row in the current active step column
      // Find the highest row number in the active step column
      const elementsInActiveColumn = visualElements.filter(el => el.col === activeStep);
      const maxRow = elementsInActiveColumn.length > 0 ? Math.max(...elementsInActiveColumn.map(el => el.row)) : 1;
      const nextRow = maxRow + 1;
      
      console.log('🎯 Adding character:', { 
        characterType, 
        activeStep, 
        nextRow, 
        elementsInActiveColumn: elementsInActiveColumn.map(el => ({row: el.row, col: el.col}))
      });
      
      // Add the character to the next row in the active step column
      addVisualElement(nextRow, activeStep, character.type, character.symbol, character.color);
      
      // Don't close the selection panel, allow multiple selections
    }
  }, [activeStep, addVisualElement, visualElements]);

  // Handle character selection and description editing
  const handleCharacterSelect = useCallback((element) => {
    setSelectedCharacter(element);
    setCharacterDescription(element.description || '');
  }, []);

  // Handle delete action for filled blocks
  const handleDeleteElement = useCallback((row, col) => {
    removeVisualElement(row, col);
    setSelectedCharacter(null);
  }, [removeVisualElement]);

  // Handle description save
  const handleDescriptionSave = useCallback(() => {
    if (selectedCharacter) {
      setVisualElements(prev => prev.map(el => 
        el.id === selectedCharacter.id 
          ? { ...el, description: characterDescription }
          : el
      ));
    }
    setSelectedCharacter(null);
    setCharacterDescription('');
  }, [selectedCharacter, characterDescription]);

  // Handle description cancel
  const handleDescriptionCancel = useCallback(() => {
    setSelectedCharacter(null);
    setCharacterDescription('');
  }, []);

  // Clean grid function
  const handleCleanGrid = useCallback(() => {
    clearVisualElements();
    setSelectedCharacter(null);
    setShowCharacterSelection(false);
    setActiveStep(1);
    setStoryBoxes([]); // Clear all story boxes
  }, [clearVisualElements]);

  // ============================================================================
  // CELL RENDERING AND INTERACTION
  // ============================================================================

  // Handle cell clicks
  const handleCellClick = useCallback((row, col) => {
    // Get visibility and editability rules
    const getVisibilityAndEditability = (row, col) => {
      // Step row (row 1): always visible, never editable
      if (row === 1) {
        return { isVisible: true, isEditable: false };
      }
      
      // First row (row 0): always visible, always editable
      if (row === 0) {
        return { isVisible: true, isEditable: true };
      }
      
      // Below step rows (row 2 and beyond): complex rules based on column position relative to activeStep
      if (row >= 2) {
        if (col < activeStep) {
          // Before current step: visible but not editable
          return { isVisible: true, isEditable: false };
        } else if (col > activeStep) {
          // After current step: not visible, not editable
          return { isVisible: false, isEditable: false };
        } else {
          // Current step: visible and editable
          return { isVisible: true, isEditable: true };
        }
      }
      
      // Default fallback
      return { isVisible: false, isEditable: false };
    };
    
    const { isVisible, isEditable } = getVisibilityAndEditability(row, col);
    
    // Check if this is the active step column
    const isActiveStepColumn = col === activeStep && activeStep >= 1 && activeStep <= 3; // Only columns 1-3, not Goal (4)
    
    // Don't allow interaction with invisible or non-editable cells
    if (!isVisible || !isEditable) {
      return;
    }
    
    // Handle existing character click
    const existingElement = getVisualElementAt(row, col);
    if (existingElement) {
      handleCharacterSelect(existingElement);
    }
  }, [getVisualElementAt, handleCharacterSelect, activeStep, addCharacterToActiveStep]);

  // Render individual cell
  const renderCell = useCallback((row, col, key) => {
    // Get visibility and editability rules
    const getVisibilityAndEditability = (row, col) => {
      // Step row (row 1): always visible, never editable
      if (row === 1) {
        return { isVisible: true, isEditable: false };
      }
      
      // First row (row 0): always visible, always editable
      if (row === 0) {
        return { isVisible: true, isEditable: true };
      }
      
      // Below step rows (row 2 and beyond): complex rules based on column position relative to activeStep
      if (row >= 2) {
        if (col < activeStep) {
          // Before current step: visible but not editable
          return { isVisible: true, isEditable: false };
        } else if (col > activeStep) {
          // After current step: not visible, not editable
          return { isVisible: false, isEditable: false };
        } else {
          // Current step: visible and editable
          return { isVisible: true, isEditable: true };
        }
      }
      
      // Default fallback
      return { isVisible: false, isEditable: false };
    };
    
    const { isVisible, isEditable } = getVisibilityAndEditability(row, col);
    
    // Check if this block is finished (completed but not active)
    const isFinished = row >= 2 ? isBlockFinished(col) : false;
    
    // Check if this is the active step column (for character placement)
    const isActiveStepColumn = col === activeStep && activeStep >= 1 && activeStep <= 3; // Only columns 1-3, not Goal (4)
    
    // Get story step info for the main path
    let storyStep = null;
    if (row === 1) {
      const stepKeys = ['start', 'step1', 'step2', 'step3', 'goal'];
      const stepKey = stepKeys[col];
    // Use fixed story structure if available, otherwise generate new one
    const STORY_GRID_STRUCTURE = fixedStoryStructure || getStoryGridStructure(selectedStepKey);
      storyStep = STORY_GRID_STRUCTURE[stepKey];
    }
    
    // Get visual element at this position
    const visualElement = getVisualElementAt(row, col);
    
    // This should not be reached anymore since visibility is handled above
    
    
    // Calculate cell height
    const isStoryPath = row === 1;
    const cellHeight = isStoryPath ? '100%' : '66.67%';
    
    return (
      <div
        key={`${row}-${col}`}
        onClick={() => handleCellClick(row, col)}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '60px', // Ensure minimum height for all cells
          backgroundColor: isFinished ? '#e8f5e8' : 
                          isEditable ? '#F8FBFF' : '#f5f5f5',
          border: isFinished ? '1px solid #28a745' : '1px solid #ccc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: isFinished ? 'default' : (isEditable ? 'pointer' : 'default'),
          transition: 'all 0.2s ease',
          padding: '4px', // Consistent padding for all cells
          margin: '0.5px', // Consistent margin for all cells
          wordBreak: 'break-word',
          textAlign: 'center',
          borderRadius: '4px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          boxSizing: 'border-box' // Include padding and border in width calculation
        }}
        title={visualElement ? (visualElement.description || 'Click to edit') : 'Click to add character'}
      >
        {/* Story step title */}
        <div style={{
          fontSize: row === 1 ? '10px' : '8px',
          fontWeight: 'bold',
          marginBottom: '1px',
          lineHeight: '1.1'
        }}>
          {row === 1 ? (col <= activeStep || col === 4 ? storyStep.title : '🔒 Locked') : (isVisible ? storyStep?.title : '🔒 Locked')}
        </div>
        
        {/* Visual element */}
        {visualElement && (
          <div style={{
            fontSize: '16px',
            margin: '1px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <span style={{ color: visualElement.color }}>{visualElement.symbol}</span>
          </div>
        )}
        
        {/* Story step symbol - only for row 1 (story path) */}
        {row === 1 && (
          <div style={{
            fontSize: '12px',
            marginTop: '1px'
          }}>
            {col <= activeStep || col === 4 ? storyStep.symbol : '🔒'}
          </div>
        )}
        
        {/* Description text */}
        {visualElement && visualElement.description && (
          <div style={{
            fontSize: '6px',
            color: '#666',
            marginTop: '1px',
            maxWidth: '100%',
            wordBreak: 'break-word',
            lineHeight: '1',
            textAlign: 'center'
          }}>
            {visualElement.description}
          </div>
        )}
        
        {/* Add Character Button - logic for positioning */}
        {(() => {
          if (col !== activeStep) return false;
          
          // Get the maximum row with content in this column
          const maxRowInColumn = Math.max(
            ...visualElements
              .filter(el => el.col === col)
              .map(el => el.row),
            -1 // Default to -1 if no elements
          );
          
          // If no characters in this column yet, show Add Character at row 2 (3rd row)
          if (maxRowInColumn === -1) {
            return row === 2;
          }
          
          // Check if the last row has content
          const lastRowHasContent = getVisualElementAt(maxRowInColumn, col);
          
          // If last row has content, show Add Character at maxRow + 1
          // If last row is empty, show Add Character at maxRow - 1
          const targetRow = lastRowHasContent ? maxRowInColumn + 1 : maxRowInColumn - 1;
          
          return row === targetRow && !getVisualElementAt(row, col);
        })() && (
          <div style={{
            position: 'absolute',
            bottom: '2px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10
          }}>
            <button
              onClick={addCharacterToActiveStep}
              style={{
                ...buttonStyles.base,
                ...buttonStyles.primary,
                padding: '4px 8px',
                fontSize: '8px',
                fontWeight: '600',
                borderRadius: '4px',
                border: '1px solid #007bff',
                background: '#007bff',
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              ➕ Add
            </button>
          </div>
        )}
        
        
        {/* Coordinates indicator */}
        <div style={{
          position: 'absolute',
          bottom: '1px',
          right: '1px',
          fontSize: '4px',
          color: '#999',
          background: 'rgba(255,255,255,0.9)',
          padding: '0px 1px',
          borderRadius: '1px',
          lineHeight: '1'
        }}>
          {row === 1 && col === 4 ? 'GOAL' : 
           row === 1 ? (col <= activeStep || col === 4 ? `${row}-${col}` : '🔒') : 
           (isVisible ? `${row}-${col}` : '🔒')}
        </div>
        
      </div>
    );
  }, [
    getVisualElementAt, 
    handleCellClick,
    activeStep,
    isBlockFinished,
    visualElements
  ]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Fix story structure when stepKey changes
  useEffect(() => {
    const storyStructure = getStoryGridStructure(selectedStepKey);
    setFixedStoryStructure(storyStructure);
    console.log('Story structure fixed for stepKey:', selectedStepKey, storyStructure);
  }, [selectedStepKey]);

  // Responsive sizing
  useEffect(() => {
    const updateGridSize = () => {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        setStageSize({ width: rect.width, height: rect.height });
      }
    };
    
    updateGridSize();
    window.addEventListener('resize', updateGridSize);
    return () => window.removeEventListener('resize', updateGridSize);
  }, []);

  // Restore visual elements from values when component mounts or values change
  // useEffect(() => {
  //   if (values && values[fieldKey]) {
  //     const savedElements = values[fieldKey];
  //     if (Array.isArray(savedElements)) {
  //       setVisualElements(savedElements);
  //     }
  //   }
  // }, [fieldKey, promptId]); // Temporarily disabled to debug

  // Place goal character at the end (row 1, col 4) only on initial mount
  // useEffect(() => {
  //   if (visualElements.length === 0) {
  //     addVisualElement(1, 4, 'goal', '♚', '#2c3e50');
  //   }
  // }, []); // Temporarily disabled to debug

  // ============================================================================
  // DATA TRANSFORMATION FUNCTIONS
  // ============================================================================

  // Transform visual elements to form data format
  const transformToFormData = useCallback(() => {
    // Separate elements by row
    const topRowElements = visualElements.filter(el => el.row === 0);
    const bottomRowElements = visualElements.filter(el => el.row >= 2);
    
    // Transform to form format
    const formData = {
      topRow: topRowElements.map(el => ({
        col: el.col,
        type: el.type,
        description: el.description || ''
      })),
      bottomRows: bottomRowElements.map(el => ({
        row: el.row,
        col: el.col,
        type: el.type,
        description: el.description || ''
      })),
      activeStep,
      totalElements: visualElements.length
    };
    
    return formData;
  }, [visualElements, activeStep]);

  // Transform form data back to visual elements
  const transformFromFormData = useCallback((formData) => {
    if (!formData) return [];
    
    const elements = [];
    let idCounter = Date.now();
    
    // Add top row elements
    if (formData.topRow) {
      formData.topRow.forEach(item => {
        // Get character info from CHESS_CHARACTERS
        const character = CHESS_CHARACTERS.find(c => c.type === item.type);
        elements.push({
          id: idCounter++,
          row: 0,
          col: item.col,
          type: item.type,
          symbol: character ? character.symbol : '?',
          color: character ? character.color : '#000000',
          description: item.description || ''
        });
      });
    }
    
    // Add bottom row elements
    if (formData.bottomRows) {
      formData.bottomRows.forEach(item => {
        // Get character info from CHESS_CHARACTERS
        const character = CHESS_CHARACTERS.find(c => c.type === item.type);
        elements.push({
          id: idCounter++,
          row: item.row,
          col: item.col,
          type: item.type,
          symbol: character ? character.symbol : '?',
          color: character ? character.color : '#000000',
          description: item.description || ''
        });
      });
    }
    
    return elements;
  }, []);

  // Save form data to parent component
  useEffect(() => {
    if (onDataChange && fieldKey) {
      const formData = transformToFormData();
      onDataChange(fieldKey, formData);
    }
  }, [visualElements, activeStep, fieldKey, onDataChange, transformToFormData]);

  // ============================================================================
  // IMPERATIVE HANDLE
  // ============================================================================

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getData: () => transformToFormData(),
    setData: (data) => {
      if (data) {
        const elements = transformFromFormData(data);
        setVisualElements(elements);
        if (data.activeStep !== undefined) {
          setActiveStep(data.activeStep);
        }
      }
    }
  }));

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      padding: "24px",
      background: "#f8f9fa",
      borderRadius: "16px",
      minHeight: "600px",
      margin: "16px"
    }}>
      {/* Main Grid Container */}
      <div style={{
        display: "flex",
        flexDirection: "row",
        gap: "24px",
        alignItems: "flex-start"
      }}>
        {/* Left Side - Story Grid */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          flex: "1",
          minWidth: "0" // Allow flex item to shrink
        }}>
          {/* Story Grid */}
          <div
            ref={gridRef}
            className="four-grid-story-grid"
            style={{
              display: "grid !important",
              gridTemplateColumns: `repeat(${GRID_COLS}, 1fr) !important`,
              gridTemplateRows: `60px 80px ${Array.from({length: GRID_ROWS - 2}, () => '60px').join(' ')} !important`, // Dynamic rows: above + story path + below rows
              minHeight: `${60 + 80 + (GRID_ROWS - 2) * 60 + (GRID_ROWS - 1) * 2}px`, // Calculate minimum height based on rows
              gap: "2px !important",
              maxWidth: "800px",
              width: "100%",
              height: "auto",
              background: "#ffffff",
              border: "2px solid #e9ecef",
              borderRadius: "16px",
              padding: "8px",
              boxShadow: "0 6px 12px rgba(0,0,0,0.08)"
            }}
          >
            {Array.from({ length: GRID_ROWS }, (_, row) =>
              Array.from({ length: GRID_COLS }, (_, col) => {
                const key = `${row}-${col}`;
                // Check visibility rules
                const getVisibilityAndEditability = (row, col) => {
                  // Row 0 (Above): Only middle columns (1-3) have content, King(0) and Goal(4) are empty
                  if (row === 0) {
                    if (col === 0 || col === 4) {
                      return { isVisible: false, isEditable: false }; // Empty for King and Goal
                    } else {
                      return { isVisible: true, isEditable: true }; // Editable for middle columns
                    }
                  }
                  
                  // Row 1 (Steps): All columns visible, never editable
                  if (row === 1) {
                    return { isVisible: true, isEditable: false };
                  }
                  
                  // Below step rows (row 2+): Show data for columns before activeStep, editable only for activeStep
                  if (row >= 2) {
                    if (col < activeStep) {
                      // Before current step: visible but not editable (show completed data)
                      return { isVisible: true, isEditable: false };
                    } else if (col === activeStep) {
                      // Current step: visible and editable
                      return { isVisible: true, isEditable: true };
                    } else {
                      // After current step: not visible, not editable
                      return { isVisible: false, isEditable: false };
                    }
                  }
                  
                  // Default fallback
                  return { isVisible: false, isEditable: false };
                };
                
                const { isVisible } = getVisibilityAndEditability(row, col);
                
                // Don't render invisible cells for other columns
                if (!isVisible) {
                  // For empty cells, render transparent placeholder to maintain grid alignment
                  return (
                    <div
                      key={`${row}-${col}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(240, 240, 240, 0.3)',
                        border: '1px dashed #ccc',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: '#999',
                        position: 'relative'
                      }}
                    >
                      {/* Debug: Show row-col coordinates for empty cells */}
                      <div style={{
                        position: 'absolute',
                        top: '2px',
                        left: '2px',
                        fontSize: '8px',
                        color: '#666',
                        background: 'rgba(255,255,255,0.8)',
                        padding: '1px 2px',
                        borderRadius: '2px'
                      }}>
                        {row}-{col}
                      </div>
                      <span style={{ fontSize: '8px' }}>空</span>
                    </div>
                  );
                }
                
                return renderCell(row, col, key);
              })
            )}
          </div>

          {/* Grid Controls */}
          <div style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
            padding: "16px 0",
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e9ecef",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}>
            {/* Step Key Selection */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center"
            }}>
              <label style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#2c3e50"
              }}>
                Story Type:
              </label>
              <select
                value={selectedStepKey}
                onChange={(e) => {
                  const newStepKey = e.target.value;
                  setSelectedStepKey(newStepKey);
                  
                  // Immediately fix the story structure for the new stepKey
                  const storyStructure = getStoryGridStructure(newStepKey);
                  setFixedStoryStructure(storyStructure);
                  
                  if (onStepKeyChange) {
                    onStepKeyChange(newStepKey);
                  }
                }}
                style={{
                  padding: "8px 12px",
                  border: "2px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  background: "#ffffff",
                  color: "#333",
                  cursor: "pointer",
                  minWidth: "200px"
                }}
              >
                <option value="settingsExist">Settings Exist</option>
                <option value="settingsNotThere">Settings Not There</option>
              </select>
            </div>
            
            <button
              onClick={unlockNextBlock}
              disabled={!canUnlockNextBlock()}
              style={{
                ...buttonStyles.base,
                ...(canUnlockNextBlock() ? buttonStyles.success : buttonStyles.disabled),
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "600"
              }}
            >
              ➡️ Next Block
            </button>
            
            {/* Current Step Character Info */}
            {fixedStoryStructure && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                alignItems: "center",
                padding: "12px",
                background: "#f8f9fa",
                borderRadius: "8px",
                border: "1px solid #e9ecef"
              }}>
                <div style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#6c757d"
                }}>
                  Current Step Character:
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "500"
                }}>
                  <span style={{ fontSize: "16px" }}>
                    {(() => {
                      const stepKeys = ['start', 'step1', 'step2', 'step3', 'goal'];
                      const stepKey = stepKeys[activeStep];
                      const storyStep = fixedStoryStructure[stepKey];
                      return storyStep?.symbol || '?';
                    })()}
                  </span>
                  <span>
                    {(() => {
                      const stepKeys = ['start', 'step1', 'step2', 'step3', 'goal'];
                      const stepKey = stepKeys[activeStep];
                      const storyStep = fixedStoryStructure[stepKey];
                      return storyStep?.title || 'Unknown';
                    })()}
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={handleCleanGrid}
              style={{
                ...buttonStyles.base,
                ...buttonStyles.danger,
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "600"
              }}
            >
              🧹 Clean Grid
            </button>
          </div>
        </div>

        {/* Right Side - Story Path Instructions or Character Editor */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "320px",
          minWidth: "320px",
          maxWidth: "400px"
        }}>
          {/* Character Editor */}
          {(selectedCharacter || showCharacterSelection) && (
            <div style={{
              background: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e9ecef",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              padding: "20px"
            }}>
              <h4 style={{ 
                margin: "0 0 16px 0", 
                fontSize: "18px", 
                fontWeight: "bold", 
                color: "#2c3e50" 
              }}>
                {selectedCharacter ? 
                  `Edit ${selectedCharacter.type.charAt(0).toUpperCase() + selectedCharacter.type.slice(1)}` :
                  "Add Character"
                }
              </h4>
              {/* Character Selection */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600", 
                  color: "#2c3e50" 
                }}>
                  Choose Character Type
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {CHESS_CHARACTERS.map((piece) => (
                    <button
                      key={piece.type}
                      onClick={() => handleCharacterSelection(piece.type)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        border: selectedCharacter && selectedCharacter.type === piece.type ? "2px solid #007bff" : "1px solid #ddd",
                        borderRadius: "6px",
                        background: selectedCharacter && selectedCharacter.type === piece.type ? "#f8f9fa" : "#fff",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontSize: "14px"
                      }}
                      onMouseEnter={(e) => {
                        if (!selectedCharacter || selectedCharacter.type !== piece.type) {
                          e.target.style.background = "#f8f9fa";
                          e.target.style.borderColor = "#007bff";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!selectedCharacter || selectedCharacter.type !== piece.type) {
                          e.target.style.background = "#fff";
                          e.target.style.borderColor = "#ddd";
                        }
                      }}
                    >
                      <span style={{ fontSize: "20px" }}>{piece.symbol}</span>
                      <span style={{ fontWeight: "500" }}>
                        {piece.type.charAt(0).toUpperCase() + piece.type.slice(1)}
                      </span>
                      <span style={{ 
                        fontSize: "12px", 
                        color: "#666",
                        marginLeft: "auto"
                      }}>
                        {piece.type === 'pawn' ? 'Unlimited' : 
                         piece.type === 'knight' ? '3' : '2'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Character Description Editor */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600", 
                  color: "#2c3e50" 
                }}>
                  Description:
                </label>
                <textarea
                  value={characterDescription}
                  onChange={(e) => setCharacterDescription(e.target.value)}
                  placeholder="Enter character description..."
                  style={{
                    width: "100%",
                    minHeight: "80px",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px",
                    resize: "vertical"
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleDescriptionSave}
                  style={{
                    ...buttonStyles.base,
                    ...buttonStyles.success,
                    flex: "1"
                  }}
                >
                  💾 Save
                </button>
                <button
                  onClick={handleDescriptionCancel}
                  style={{
                    ...buttonStyles.base,
                    ...buttonStyles.base,
                    flex: "1"
                  }}
                >
                  ❌ Cancel
                </button>
                <button
                  onClick={() => handleDeleteElement(selectedCharacter.row, selectedCharacter.col)}
                  style={{
                    ...buttonStyles.base,
                    ...buttonStyles.danger,
                    flex: "1"
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          )}


          {/* Story Boxes */}
          {storyBoxes.length > 0 && (
            <div style={{
              background: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e9ecef",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              padding: "20px",
              marginBottom: "20px"
            }}>
              <h4 style={{ 
                margin: "0 0 16px 0", 
                fontSize: "18px", 
                fontWeight: "bold", 
                color: "#2c3e50" 
              }}>
                Story Progress
              </h4>
              
              {storyBoxes.map((storyBox, index) => (
                <div key={storyBox.id} style={{
                  marginBottom: index < storyBoxes.length - 1 ? "16px" : "0",
                  padding: "16px",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  border: "2px solid #e9ecef",
                  borderLeft: `4px solid ${storyBox.color}`
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px"
                  }}>
                    <span style={{ fontSize: "18px" }}>{storyBox.symbol}</span>
                    <h3 style={{
                      margin: "0",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#2c3e50"
                    }}>
                      {storyBox.title}
                    </h3>
                    <span style={{
                      fontSize: "12px",
                      color: "#666",
                      background: "#e9ecef",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      marginLeft: "auto"
                    }}>
                      Step {storyBox.step}
                    </span>
                  </div>
                  <p style={{
                    margin: "0",
                    fontSize: "14px",
                    color: "#666",
                    lineHeight: "1.5"
                  }}>
                    {storyBox.content}
                  </p>
                  <div style={{
                    fontSize: "10px",
                    color: "#999",
                    marginTop: "8px",
                    textAlign: "right"
                  }}>
                    {new Date(storyBox.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Story Path Instructions */}
          {!selectedCharacter && !showCharacterSelection && (
            <div style={{
              background: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e9ecef",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              padding: "20px"
            }}>
              <h4 style={{ 
                margin: "0 0 16px 0", 
                fontSize: "18px", 
                fontWeight: "bold", 
                color: "#2c3e50" 
              }}>
                Story Path Instructions
              </h4>
              
              {/* Dynamic Step Display */}
              {fixedStoryStructure && (
                <div style={{ marginBottom: "20px" }}>
                  {/* King - Always visible */}
                  <div style={{ 
                    marginBottom: "16px",
                    padding: "12px",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef"
                  }}>
                    <h3 style={{ 
                      margin: "0 0 8px 0", 
                      fontSize: "16px", 
                      fontWeight: "bold", 
                      color: "#2c3e50",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <span style={{ fontSize: "18px" }}>♔</span>
                      King
                    </h3>
                    <p style={{ 
                      margin: "0", 
                      fontSize: "14px", 
                      color: "#666",
                      lineHeight: "1.5"
                    }}>
                      Starting point of your journey
                    </p>
              </div>

                  {/* Step 1 - Show if activeStep >= 1 */}
                  {activeStep >= 1 && (
                    <div style={{ 
                      marginBottom: "16px",
                      padding: "12px",
                      background: "#e7f3ff",
                      borderRadius: "8px",
                      border: "2px solid #007bff"
                    }}>
                      <h3 style={{ 
                        margin: "0 0 8px 0", 
                        fontSize: "16px", 
                        fontWeight: "bold", 
                        color: "#2c3e50",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        <span style={{ fontSize: "18px" }}>{fixedStoryStructure.step1?.symbol}</span>
                        {fixedStoryStructure.step1?.title}
                      </h3>
                      <p style={{ 
                        margin: "0", 
                        fontSize: "14px", 
                        color: "#666",
                        lineHeight: "1.5"
                      }}>
                        {fixedStoryStructure.step1?.description || "First step in your journey"}
                      </p>
            </div>
          )}

                  {/* Step 2 - Show if activeStep >= 2 */}
                  {activeStep >= 2 && (
            <div style={{
                      marginBottom: "16px",
                      padding: "12px",
                      background: "#e7f3ff",
                      borderRadius: "8px",
                      border: "2px solid #007bff"
                    }}>
                      <h3 style={{ 
                        margin: "0 0 8px 0", 
                        fontSize: "16px", 
                fontWeight: "bold", 
                        color: "#2c3e50",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        <span style={{ fontSize: "18px" }}>{fixedStoryStructure.step2?.symbol}</span>
                        {fixedStoryStructure.step2?.title}
                      </h3>
                      <p style={{ 
                        margin: "0", 
                        fontSize: "14px", 
                        color: "#666",
                        lineHeight: "1.5"
                      }}>
                        {fixedStoryStructure.step2?.description || "Second step in your journey"}
                      </p>
                    </div>
                  )}

                  {/* Step 3 - Show if activeStep >= 3 */}
                  {activeStep >= 3 && (
                    <div style={{ 
                      marginBottom: "16px",
                      padding: "12px",
                      background: "#e7f3ff",
                      borderRadius: "8px",
                      border: "2px solid #007bff"
                    }}>
                      <h3 style={{ 
                        margin: "0 0 8px 0", 
                        fontSize: "16px", 
                        fontWeight: "bold", 
                        color: "#2c3e50",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        <span style={{ fontSize: "18px" }}>{fixedStoryStructure.step3?.symbol}</span>
                        {fixedStoryStructure.step3?.title}
                      </h3>
                      <p style={{ 
                        margin: "0", 
                        fontSize: "14px", 
                        color: "#666",
                        lineHeight: "1.5"
                      }}>
                        {fixedStoryStructure.step3?.description || "Third step in your journey"}
                      </p>
                    </div>
                  )}

                  {/* Goal - Always visible */}
                  <div style={{ 
                    marginBottom: "16px",
                    padding: "12px",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef"
                  }}>
                    <h3 style={{ 
                      margin: "0 0 8px 0", 
                      fontSize: "16px", 
                      fontWeight: "bold", 
                      color: "#2c3e50",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <span style={{ fontSize: "18px" }}>♚</span>
                      Goal
                    </h3>
                    <p style={{ 
                      margin: "0", 
                      fontSize: "14px", 
                      color: "#666",
                      lineHeight: "1.5"
                    }}>
                      Final objective of your journey
                    </p>
                  </div>
                </div>
              )}

              <div style={{ fontSize: "14px", lineHeight: "1.6", color: "#666" }}>
                <p>Click "Next Block" to unlock the next step. Add characters to build your story path.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default FourGridStoryComponent;