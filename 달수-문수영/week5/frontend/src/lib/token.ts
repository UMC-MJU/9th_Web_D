export const tokenStorage = {
    getAccess: () => localStorage.getItem('accessToken'),
    getRefresh: () => localStorage.getItem('refreshToken'),
    set: (access: string, refresh: string) => {
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
    },
    clear: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  };