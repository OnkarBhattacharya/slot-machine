export const Storage = {
  save: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage save error:', e);
    }
  },
  
  load: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Storage load error:', e);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Storage remove error:', e);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Storage clear error:', e);
    }
  },

  getSize: () => {
    let size = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length + key.length;
      }
    }
    return (size / 1024).toFixed(2);
  }
};
