// AI Art Generator Service Stub
export const useSecureSubscription = () => {
  return { isLoading: false, subscribe: () => {} };
};

export const aiArtGenerator = {
  generate: async () => ({ url: '' }),
  isAvailable: () => false,
};