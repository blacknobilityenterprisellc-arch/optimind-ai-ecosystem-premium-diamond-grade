// AI Art Generator Service Stub
export const useSecureSubscription = () => {
  return { isLoading: false, subscribe: () => {} };
};

export const useAIArtGenerator = () => {
  return {
    generate: async () => ({ url: "" }),
    isAvailable: () => false,
    isLoading: false,
  };
};

export const aiArtGenerator = {
  generate: async () => ({ url: "" }),
  isAvailable: () => false,
};
