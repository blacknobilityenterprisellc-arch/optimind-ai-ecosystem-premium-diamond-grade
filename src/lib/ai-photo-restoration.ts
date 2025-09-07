// AI Photo Restoration Service Stub
export const useSecureSubscription = () => {
  return { isLoading: false, subscribe: () => {} };
};

export const useAIPhotoRestoration = () => {
  return { restore: async () => ({ url: '' }), isLoading: false };
};