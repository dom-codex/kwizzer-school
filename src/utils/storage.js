export const storeData = (type, data) => {
  localStorage.setItem(type, data);
};
export const fetchData = (key) => {
  return localStorage.getItem(key);
};
export const clearData = (key) => {
  localStorage.removeItem(key);
};
