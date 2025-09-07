// AI Premium Editor Service Stub
export const useSecureSubscription = () => {
  return { isLoading: false, subscribe: () => {} };
};

export const useAIPremiumEditor = () => {
  return { edit: async () => ({ content: "" }), isLoading: false };
};
