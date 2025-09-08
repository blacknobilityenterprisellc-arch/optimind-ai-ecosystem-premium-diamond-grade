// Multi-Model AI Service Stub
export const useMultiModelAI = () => {
  return { analyze: async () => ({ result: "" }), isLoading: false };
};

export const getAvailableModels = () => {
  return [
    { id: "glm-4.5", name: "GLM 4.5", provider: "Z.AI" },
    { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
    { id: "claude", name: "Claude", provider: "Anthropic" },
  ];
};

export const multiModelAIUtils = {
  process: async () => ({ result: "" }),
  isAvailable: () => false,
};
