export const config = {
  BASE_URL: import.meta.env.VITE_BASE_URL || "http://localhost:3000/api",
  IMG_URL:
    import.meta.env.VITE_IMG_URL ||
    "http://localhost:3000/public/assets/images",
};
