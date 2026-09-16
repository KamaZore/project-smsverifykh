export const getAccessToken = (key) => {
  return localStorage.getItem(key);
};

export const setAccessToken = (key, value) => {
  localStorage.setItem(key, value);
};

export const removeAccessToken = (key) => {
  localStorage.removeItem(key);
};
