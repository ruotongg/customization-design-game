// Route Map Configuration - Centralized settings for easy modification

export const ROUTE_MAP_CONFIG = {
  // Route Map 2-1 (revisit page)
  'routeMap2-1': {
    key: 'routeMap2-1',
    label: 'Settings Exist Story Path',
    title: 'Settings Exist Story Path',
    question: 'Design your journey from King to Goal when settings already exist',
    promptId: 'prompt2-1',
    type: 'fourGridStory',
    stepKey: 'settingsExist'
  },

  // Route Map 2-2 (revisit page)
  'routeMap2-2': {
    key: 'routeMap2-2',
    label: 'Settings Not There Story Path',
    title: 'Settings Not There Story Path',
    question: 'Design your journey from King to Goal when settings need to be created',
    promptId: 'prompt2-2',
    type: 'fourGridStory',
    stepKey: 'settingsNotThere'
  },

  // Route Map 2-3 (revisit page)
  'routeMap2-3': {
    key: 'routeMap2-3',
    label: 'Settings Exist Story Path (Alternative)',
    title: 'Settings Exist Story Path (Alternative)',
    question: 'Design your journey from King to Goal when settings already exist (alternative path)',
    promptId: 'prompt2-3',
    type: 'fourGridStory',
    stepKey: 'settingsExist'
  },

  // Route Map 3-1 (game page - first map)
  'routeMap3-1': {
    key: 'routeMap3-1',
    label: 'Settings Not There Story Path (Game)',
    title: 'Settings Not There Story Path (Game)',
    question: 'Design your journey from King to Goal when settings need to be created (game mode)',
    promptId: 'prompt3-1',
    type: 'fourGridStory',
    stepKey: 'settingsNotThere'
  },

  // Route Map 3-2 (game page - second map)
  'routeMap3-2': {
    key: 'routeMap3-2',
    label: 'Settings Exist Story Path (Game)',
    title: 'Settings Exist Story Path (Game)',
    question: 'Design your journey from King to Goal when settings already exist (game mode)',
    promptId: 'prompt3-2',
    required: false,
    type: 'fourGridStory',
    stepKey: 'settingsExist'
  }
};

// Page distribution configuration
export const PAGE_ROUTE_MAPS = {
  route: ['routeMap2-1', 'routeMap2-2', 'routeMap2-3'],           // Second page: 3 maps
  reflection: ['routeMap3-1', 'routeMap3-2']  // Third page: 2 maps
};

// JSON export field mapping
export const JSON_FIELD_MAPPING = {
  'routeMap2-1': 'learningAbilities',
  'routeMap2-2': 'learningMethods',
  'routeMap2-3': 'learningOutcomes',
  'routeMap3-1': 'learningGoals', 
  'routeMap3-2': 'learningReflection'
};

// Helper function to get route map config by key
export const getRouteMapConfig = (key) => ROUTE_MAP_CONFIG[key];

// Helper function to get route maps for a specific page
export const getRouteMapsForPage = (page) => PAGE_ROUTE_MAPS[page] || [];

// Helper function to get JSON field name
export const getJsonFieldName = (routeMapKey) => JSON_FIELD_MAPPING[routeMapKey];
