import { useEffect, useState, useRef, useCallback } from 'react'
import NavigationBar from './components/NavigationBar'
import WelcomeSection from './components/WelcomeSection'
import ActivityRevisitSection from './components/ActivityRevisitSection'
import ReflectionSection from './components/ReflectionSection'
import ActionButtons from './components/ActionButtons'
import { ROUTE_MAP_CONFIG, PAGE_ROUTE_MAPS, JSON_FIELD_MAPPING } from './config/routeMapConfig'
import './responsive.css'

const LS_KEY = 'localFormDraft_v1'

const genUUID = () =>
  (crypto?.randomUUID?.() ??
    (`${Date.now()}-${Math.random().toString(16).slice(2)}`))

// 表单字段：基本信息 -> 路线图设计 -> 反思 -> 其他信息
const FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  ROUTE_MAP_CONFIG['routeMap2-1'],
  ROUTE_MAP_CONFIG['routeMap2-2'],
  ROUTE_MAP_CONFIG['routeMap2-3'],
  { key: 'age', label: 'Age' },
  ROUTE_MAP_CONFIG['routeMap3-1'],
  ROUTE_MAP_CONFIG['routeMap3-2'],
  { key: 'reflection', label: 'Learning Reflection', multiline: true },
  { key: 'feedback', label: 'Additional Comments on Learning Path', multiline: true },
]

export default function App() {
  const [values, setValues] = useState(
    Object.fromEntries(FIELDS.map(f => [f.key, '']))
  )
  
  
  
  const [respondentId, setRespondentId] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState('welcome') // 当前活跃的分段
  const [isInitialLoad, setIsInitialLoad] = useState(true) // Flag to prevent auto-save during initial load
  
  // Hash-based navigation
  useEffect(() => {
    const hash = window.location.hash.slice(1) || 'welcome';
    if (['welcome', 'activity-revisit', 'chess-game', 'reflection'].includes(hash)) {
      setActiveSection(hash);
    }
    
    // Listen for hash changes (browser back/forward)
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'welcome';
      if (['welcome', 'activity-revisit', 'chess-game', 'reflection'].includes(hash)) {
        setActiveSection(hash);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToSection = (section) => {
    setActiveSection(section);
    window.location.hash = section;
  };
  // 移除自动保存相关状态
  const routeMapRefs = useRef({})

  // 初始化
  useEffect(() => {
    setRespondentId(genUUID())
  }, [])

  // 处理路线图数据变化 - 使用 useCallback 优化
  const handleRouteMapDataChange = useCallback((fieldKey, formData) => {
    setValues(v => {
      // Convert form data to JSON string for storage
      const dataString = JSON.stringify(formData);
      
      // Only update if the value has actually changed
      if (v[fieldKey] === dataString) {
        return v;
      }
      return { ...v, [fieldKey]: dataString };
    });
  }, []);

  // Navigation bar configuration


  // 1. AUTOSAVE: 自动保存到网页缓存 (localStorage)
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LS_KEY);
      
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.values) {
          setValues(data.values);
          
          // Immediately save the loaded data to cache to make it the new source of truth
          const loadedFormData = {
            values: data.values,
            respondentId: data.respondentId || '',
            timestamp: new Date().toISOString()
          };
          localStorage.setItem(LS_KEY, JSON.stringify(loadedFormData));
          
          // 立即通知路线图组件更新数据 (same as JSON loading)
          Object.keys(JSON_FIELD_MAPPING).forEach(routeMapKey => {
            if (data.values[routeMapKey] && routeMapRefs.current[routeMapKey]) {
              try {
                const routeMapData = JSON.parse(data.values[routeMapKey]);
                routeMapRefs.current[routeMapKey].setData({
                  visualElements: routeMapData.visualElements || []
                });
              } catch (e) {
                console.warn(`Failed to parse ${routeMapKey} data from cache:`, e);
              }
            }
          });
          
          // Delay setting isInitialLoad to false to ensure values state is updated first
          setTimeout(() => {
            setIsInitialLoad(false);
          }, 100);
        }
        if (data.respondentId) setRespondentId(data.respondentId);
      } else {
        setIsInitialLoad(false); // Mark initial load as complete even if no cached data
      }
    } catch (error) {
      console.warn('加载保存的表单数据时出错:', error);
      setIsInitialLoad(false); // Mark initial load as complete even if there's an error
    }
  }, []);

  // AUTOSAVE: 数据变化时自动保存到网页缓存
  useEffect(() => {
    // Skip auto-save during initial load to prevent overwriting loaded data
    if (isInitialLoad) {
      return;
    }
    
    // Additional check: Skip auto-save if values appear to be empty/initial state
    const hasLoadedData = Object.values(values).some(value => value && value.toString().trim() !== '');
    if (!hasLoadedData) {
      return;
    }
    
    const timeoutId = setTimeout(() => {
      const formData = {
        values,
        respondentId,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(LS_KEY, JSON.stringify(formData));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [values, respondentId, isInitialLoad]);

  // Monitor route map data changes and sync to components
  useEffect(() => {
    const syncRouteMapData = (routeMapKey, refKey) => {
      if (values[routeMapKey] && routeMapRefs.current[refKey]) {
        try {
          // Handle both string and object data formats
          let routeMapData;
          if (typeof values[routeMapKey] === 'string') {
            routeMapData = JSON.parse(values[routeMapKey]);
          } else {
            routeMapData = values[routeMapKey];
          }
          
          // Check for new form data structure (topRow, bottomRows, activeStep)
          if (routeMapData.topRow !== undefined || routeMapData.bottomRows !== undefined) {
            // New form data format - pass directly to component
            routeMapRefs.current[refKey].setData(routeMapData);
          }
          // Legacy support for old visualElements format
          else if (routeMapData.visualElements) {
            // Convert old format to new format for backward compatibility
            const topRowElements = routeMapData.visualElements.filter(el => el.row === 0);
            const bottomRowElements = routeMapData.visualElements.filter(el => el.row >= 2);
            
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
              activeStep: routeMapData.activeStep || 1,
              totalElements: routeMapData.visualElements.length
            };
            
            routeMapRefs.current[refKey].setData(formData);
          }
        } catch (e) {
          console.warn(`Failed to parse ${routeMapKey} data:`, e);
        }
      }
    };

    // Only sync if we have route map refs available
    const timeoutId = setTimeout(() => {
      Object.keys(JSON_FIELD_MAPPING).forEach(routeMapKey => {
        syncRouteMapData(routeMapKey, routeMapKey);
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [values['routeMap2-1'], values['routeMap2-2'], values['routeMap2-3'], values['routeMap3-1'], values['routeMap3-2']]);

  // Simple sync when section changes - let the existing route map sync logic handle the rest
  useEffect(() => {
    // The existing route map sync logic will handle this automatically
  }, [activeSection]);

  const update = (k) => (e) => {
    setValues(v => ({ ...v, [k]: e.target.value }))
  }


  // 2. MANUAL SAVE: 手动保存到本地JSON文件
  function downloadJSON() {
    setError('')
    try {
      
      // 构建完整的表单数据 - 使用与cache相同的结构
      const outputData = {
        values: {
          name: values.name,
          email: values.email,
          age: values.age,
          'routeMap2-1': values['routeMap2-1'] || '',
          'routeMap2-2': values['routeMap2-2'] || '',
          'routeMap2-3': values['routeMap2-3'] || '',
          'routeMap3-1': values['routeMap3-1'] || '',
          'routeMap3-2': values['routeMap3-2'] || '',
          reflection: values.reflection || '',
          feedback: values.feedback || ''
        },
        respondentId: respondentId,
        timestamp: new Date().toISOString()
      }
      
      console.log('Complete data structure being saved:', outputData)
      
      const blob = new Blob([JSON.stringify(outputData, null, 2)], { type: 'application/json' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      const safeName = (values.name || 'anonymous').replace(/[^\w\u4e00-\u9fa5-]+/g, '_')
      a.download = `learning_route_map_${safeName}.json`
      a.click()
      setMsg('✅ Saved to local JSON file')
    } catch (err) {
      setError(err?.message || String(err))
    }
  }

  // 3. LOAD: 从本地JSON文件加载数据
  function loadFromFile(file) {
    if (!file) return;
    
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        
        // 使用与cache相同的结构加载数据
        if (data.values) {
          setValues(data.values);
          
          // 立即通知路线图组件更新数据
          Object.keys(JSON_FIELD_MAPPING).forEach(routeMapKey => {
            if (data.values[routeMapKey] && routeMapRefs.current[routeMapKey]) {
              try {
                const routeMapData = JSON.parse(data.values[routeMapKey]);
                console.log(`Importing ${routeMapKey} route map data:`, routeMapData);
                console.log(`Visual elements being loaded for ${routeMapKey}:`, 
                  routeMapData.visualElements?.length || 0);
                routeMapRefs.current[routeMapKey].setData({
                  visualElements: routeMapData.visualElements || []
                });
              } catch (e) {
                console.warn(`Failed to parse ${routeMapKey} data:`, e);
              }
            }
          });
        }
        
        if (data.respondentId) setRespondentId(data.respondentId);
        
        // Additional info is already handled in the main values object above
        
        setMsg('✅ Data loaded from JSON file')
        setError('')
      } catch (error) {
        setError('Failed to load file: ' + error.message)
      }
    }
    reader.readAsText(file)
  }

  // Clear all data
  function clearAllData() {
    setValues(Object.fromEntries(FIELDS.map(f => [f.key, ''])))
    localStorage.removeItem(LS_KEY)
    
    // Clear route map components
    Object.keys(ROUTE_MAP_CONFIG).forEach(routeMapKey => {
      if (routeMapRefs.current[routeMapKey]) {
        routeMapRefs.current[routeMapKey].setData({ 
          visualElements: [] 
        });
      }
    });
    
    setMsg('✅ All data cleared')
    setError('')
  }


  // Remove all duplicate functions, keep only three save methods

  return (
    <div className="container">
      
      <h1>Learning Roadmap Design Survey</h1>
      
      <NavigationBar 
        activeSection={activeSection} 
        navigateToSection={navigateToSection} 
      />
      

      {/* Section content */}
      {activeSection === 'welcome' && (
        <WelcomeSection 
          values={values} 
          update={update} 
          FIELDS={FIELDS}
        />
      )}

      {activeSection === 'activity-revisit' && (
        <ActivityRevisitSection 
          values={values} 
          FIELDS={FIELDS.filter(f => PAGE_ROUTE_MAPS.route.includes(f.key))} 
          routeMapRefs={routeMapRefs}
          handleRouteMapDataChange={handleRouteMapDataChange}
        />
      )}


      {activeSection === 'reflection' && (
        <ReflectionSection 
          values={values} 
          update={update} 
          FIELDS={FIELDS}
        />
      )}


      <ActionButtons 
        activeSection={activeSection}
        navigateToSection={navigateToSection}
        downloadJSON={downloadJSON}
        loadFromFile={loadFromFile}
        clearAllData={clearAllData}
        msg={msg}
        error={error}
      />

    </div>
  )
}