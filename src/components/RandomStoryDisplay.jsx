import React, { useState, useEffect } from 'react';
import { 
  getStoryScriptByKey,
  generateStory
} from '../config/randomStoryScripts';

const RandomStoryDisplay = ({ 
  gridStoryData = null, // 从父组件传入的grid story数据
  userName = "User", 
  userNeeds = "customization" 
}) => {
  const [currentScript, setCurrentScript] = useState(null);
  const [generatedStory, setGeneratedStory] = useState("");

  // 根据grid story数据确定使用哪个脚本
  const determineScriptKey = () => {
    // 这里可以根据grid story数据判断使用哪个key
    // 暂时默认使用settingsNotThere
    return "settingsNotThere";
  };

  // 从grid story数据中提取当前步骤和角色信息
  const extractStoryData = () => {
    if (!gridStoryData) return null;
    
    // 提取当前步骤
    const currentStepData = gridStoryData.currentStep || 0;
    
    // 提取当前步骤及之前的角色信息
    const characters = [];
    for (let i = 0; i <= currentStepData; i++) {
      if (gridStoryData.steps && gridStoryData.steps[i]) {
        const stepCharacters = gridStoryData.steps[i].characters || [];
        characters.push(...stepCharacters);
      }
    }
    
    return {
      currentStep: currentStepData,
      characters: characters,
      steps: gridStoryData.steps || []
    };
  };

  // 生成故事
  const generateCurrentStory = () => {
    const scriptKey = determineScriptKey();
    const script = getStoryScriptByKey(scriptKey);
    
    if (script) {
      // 创建包含当前步骤和角色信息的脚本
      const storyData = extractStoryData();
      if (storyData) {
        // 更新脚本中的角色信息
        const updatedScript = {
          ...script,
          steps: script.steps.map((step, index) => {
            if (index <= storyData.currentStep) {
              return {
                ...step,
                characters: storyData.characters.filter(char => 
                  char.step === index || char.step === undefined
                )
              };
            }
            return step;
          })
        };
        
        const story = generateStory(userName, userNeeds, updatedScript);
        setGeneratedStory(story);
      }
    }
  };

  // 当grid story数据变化时重新生成故事
  useEffect(() => {
    if (gridStoryData) {
      generateCurrentStory();
    }
  }, [gridStoryData, userName, userNeeds]);

  // 初始化脚本
  useEffect(() => {
    const scriptKey = determineScriptKey();
    const script = getStoryScriptByKey(scriptKey);
    if (script) {
      setCurrentScript(script);
    }
  }, []);

  return (
    <div style={{
      padding: '24px',
      background: '#f8f9fa',
      borderRadius: '16px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* 标题 */}
      <div style={{
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <h1 style={{
          margin: 0,
          color: '#2c3e50',
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          📖 故事生成器
        </h1>
        <p style={{
          margin: '8px 0 0 0',
          color: '#666',
          fontSize: '16px'
        }}>
          基于当前步骤和角色信息生成个性化故事
        </p>
      </div>

      {/* 数据状态显示 */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#2c3e50' }}>📊 数据状态</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: gridStoryData ? '#28a745' : '#dc3545' }}>
              {gridStoryData ? '✓' : '✗'}
            </div>
            <div style={{ color: '#666' }}>Grid Story 数据</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
              {gridStoryData?.currentStep || 0}
            </div>
            <div style={{ color: '#666' }}>当前步骤</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff6b6b' }}>
              {gridStoryData?.characters?.length || 0}
            </div>
            <div style={{ color: '#666' }}>角色数量</div>
          </div>
        </div>
      </div>

      {/* 生成的故事内容 */}
      {generatedStory && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e9ecef',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>
              🎭 生成的故事
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
              基于当前数据生成的个性化故事
            </p>
          </div>
          
          <div style={{ padding: '24px' }}>
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              borderLeft: '4px solid #667eea',
              lineHeight: '1.6',
              fontSize: '16px',
              color: '#2c3e50',
              whiteSpace: 'pre-line'
            }}>
              {generatedStory}
            </div>
          </div>
        </div>
      )}

      {/* 无数据时的提示 */}
      {!gridStoryData && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          color: '#856404'
        }}>
          <h3 style={{ margin: '0 0 8px 0' }}>⚠️ 等待数据</h3>
          <p style={{ margin: 0 }}>
            请提供Grid Story数据以生成故事内容
          </p>
        </div>
      )}

      {/* 底部信息 */}
      <div style={{
        marginTop: '24px',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px'
      }}>
        <p>💡 提示：故事会根据当前步骤和角色信息自动生成</p>
      </div>
    </div>
  );
};

export default RandomStoryDisplay;