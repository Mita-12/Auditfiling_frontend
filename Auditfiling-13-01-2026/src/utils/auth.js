export const getUser = () => {
  return JSON.parse(sessionStorage.getItem("user"));
};

export const isAuthenticated = () => {
  return !!sessionStorage.getItem("user");
};

export const hasRole = (role) => {
  const user = getUser();
  return user?.role === role;
};