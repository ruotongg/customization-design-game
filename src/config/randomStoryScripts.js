// 随机剧情脚本配置
// 包含2个不同的key，每个key有3步剧情

export const RANDOM_STORY_SCRIPTS = {
  // Key 1: Settings exist
  settingsExist: {
    key: "settingsExist",
    title: "Settings Exist",
    description: "当设置已经存在时的处理流程",
    steps: [
      {
        step: 1,
        title: "How to use it",
        description: "了解如何使用现有的设置和配置选项。",
        characters: [],
        color: "#ff6b6b",
        symbol: "⚙️"
      },
      {
        step: 2,
        title: "Complete the task",
        description: "使用现有设置完成指定的任务或目标。",
        characters: [],
        color: "#4fc3f7",
        symbol: "✅"
      },
      {
        step: 3,
        title: "Get a solution",
        description: "基于现有设置获得最终的解决方案或结果。",
        characters: [],
        color: "#10b981",
        symbol: "🎯"
      }
    ]
  },

  // Key 2: Settings not there
  settingsNotThere: {
    key: "settingsNotThere",
    title: "Settings Not There",
    description: "当设置不存在时需要创建新配置的流程",
    steps: [
      {
        step: 1,
        title: "Brainstorm",
        description: "进行头脑风暴，思考需要什么样的设置和配置。",
        characters: [],
        color: "#ff9f43",
        symbol: "💡"
      },
      {
        step: "2-1",
        title: "Embed in workflow",
        description: "将新的设置和配置嵌入到现有的工作流程中。",
        characters: [],
        color: "#9c27b0",
        symbol: "🔧",
        randomBranch: {
          probability: 0.5,
          alternativeStep: {
            step: "2-2",
            title: "Reach out for help",
            description: "寻求外部帮助和支持来解决问题。",
            characters: [],
            color: "#ff9800",
            symbol: "🤝"
          }
        }
      },
      {
        step: 3,
        title: "Get a solution",
        description: "通过新创建的设置获得解决方案。",
        characters: [],
        color: "#00bcd4",
        symbol: "🚀"
      }
    ]
  }
};

// 获取随机剧情脚本的函数
export const getRandomStoryScript = () => {
  const keys = Object.keys(RANDOM_STORY_SCRIPTS);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const script = RANDOM_STORY_SCRIPTS[randomKey];
  return getScriptWithRandomBranches(script);
};

// 根据key获取特定剧情脚本
export const getStoryScriptByKey = (key) => {
  const script = RANDOM_STORY_SCRIPTS[key];
  if (script) {
    return getScriptWithRandomBranches(script);
  }
  return null;
};

// 获取所有可用的剧情脚本keys
export const getAvailableStoryKeys = () => {
  return Object.keys(RANDOM_STORY_SCRIPTS);
};

// 获取剧情脚本的统计信息
export const getStoryScriptStats = () => {
  const keys = Object.keys(RANDOM_STORY_SCRIPTS);
  return {
    totalScripts: keys.length,
    totalSteps: keys.reduce((total, key) => total + RANDOM_STORY_SCRIPTS[key].steps.length, 0),
    availableKeys: keys
  };
};

// 处理随机分支逻辑
export const getStepWithRandomBranch = (script, stepIndex) => {
  const step = script.steps[stepIndex];
  
  // 检查是否有随机分支
  if (step.randomBranch) {
    const randomValue = Math.random();
    if (randomValue < step.randomBranch.probability) {
      // 执行替代步骤
      return step.randomBranch.alternativeStep;
    }
  }
  
  // 返回原始步骤
  return step;
};

// 获取带有随机分支的完整脚本
export const getScriptWithRandomBranches = (script) => {
  const processedSteps = script.steps.map((step, index) => {
    return getStepWithRandomBranch(script, index);
  });
  
  return {
    ...script,
    steps: processedSteps
  };
};

// 生成故事文本
export const generateStory = (name, needs, script) => {
  if (script.key === "settingsExist") {
    // Key 1暂时为空
    return "";
  }
  
  if (script.key === "settingsNotThere") {
    const step1 = script.steps[0];
    const step2 = script.steps[1];
    
    // 获取角色名称
    const getCharacterNames = (characters) => {
      if (!characters || characters.length === 0) return "some colleagues";
      return characters.map(char => char.type || "colleague").join(", ");
    };
    
    // 生成解决方案质量
    const getSolutionQuality = () => {
      const random = Math.random();
      if (random < 0.5) return "successful";
      if (random < 0.8) return "usable";
      return "not too bad";
    };
    
    // 生成时间描述
    const getTimeDescription = () => {
      const random = Math.random();
      return random < 0.8 ? "long" : "ok";
    };
    
    let story = `${name} is going to start the customization for an unmet needs on ${needs} but with no prior settings. They firstly ${step1.title.toLowerCase()} with ${getCharacterNames(step1.characters)} about walkarounds/combination, and got some idea.\n\n`;
    
    // 检查是否是随机分支的step 2-2
    if (step2.step === "2-2") {
      story += `Unluckily, the walkaround/combination didn't work. So with the help of ${getCharacterNames(step2.characters)} they started ${step2.title}. Finally they got a ${getSolutionQuality()} solution within a ${getTimeDescription()} time.`;
    } else {
      // 默认是step 2-1
      story += `Luckily, the walkaround/combination worked! So they started ${step2.title} with ${getCharacterNames(step2.characters)} to implement, and finally they got a ${getSolutionQuality()} solution.`;
    }
    
    return story;
  }
  
  return "";
};
