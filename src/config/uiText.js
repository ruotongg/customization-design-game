// 统一的UI文本配置，避免重复

export const UI_TEXTS = {
  sections: {
    welcome: {
      title: 'Welcome',
      description: 'Please fill in your basic information, which will help us better analyze the learning roadmap data.',
      icon: '👋',
      label: '1. Welcome'
    },
    activityRevisit: {
      title: 'Learning Story Paths',
      description: 'Design your learning journey using story paths: King → Brainstorm → Embed in workflow → Result → Goal. Add chess characters to create branching narratives for different learning aspects.',
      icon: '📖',
      label: '2. Learning Story Paths'
    },
    reflection: {
      title: 'Reflection',
      description: 'Please provide any additional comments or feedback about your learning path. This information will help us better understand your learning experience.',
      icon: '🤔',
      label: '4. Reflection'
    }
  },
  
  buttons: {
    save: '💾 Manual Save',
    load: '📂 Load File',
    clear: '🗑️ Clear All Data',
    previous: '← Previous',
    next: 'Next →'
  },
  
  messages: {
    saved: '✅ Data saved successfully',
    loaded: '✅ Data loaded from JSON file',
    cleared: '✅ All data cleared',
    error: '❌ An error occurred'
  },
  
  placeholders: {
    name: 'Enter your full name',
    email: 'Enter your email address',
    age: 'Enter your age',
    feedback: 'Please provide any additional comments or feedback about your learning path...'
  }
};

// 导出便捷函数
export const getSectionText = (sectionKey) => UI_TEXTS.sections[sectionKey];
export const getButtonText = (buttonKey) => UI_TEXTS.buttons[buttonKey];
export const getMessageText = (messageKey) => UI_TEXTS.messages[messageKey];
export const getPlaceholderText = (fieldKey) => UI_TEXTS.placeholders[fieldKey];
