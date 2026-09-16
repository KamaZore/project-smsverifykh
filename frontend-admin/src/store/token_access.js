export const getAccessToken = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  try {
    return JSON.parse(token);
  } catch {
    return token;
  }
};

export const setAccessToken = (token) => {
  localStorage.setItem("access_token", JSON.stringify(token));
};

export const removeAccessToken = () => {
  localStorage.removeItem("access_token");
};

export const getAdmin = () => {
  const admin = localStorage.getItem("admin");
  if (!admin) return null;
  try {
    return JSON.parse(admin);
  } catch {
    return admin;
  }
};

export const setAdmin = (admin) => {
  localStorage.setItem("admin", JSON.stringify(admin));
};

export const removeAdmin = () => {
  localStorage.removeItem("admin");
};

/** Clears the whole admin session (token + profile). */
export const clearSession = () => {
  removeAccessToken();
  removeAdmin();
};

