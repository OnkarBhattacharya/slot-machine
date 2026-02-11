export const AssetLoaderService = {
  cache: new Map(),
  loading: new Map(),

  async loadImage(src) {
    if (this.cache.has(src)) {
      return this.cache.get(src);
    }

    if (this.loading.has(src)) {
      return this.loading.get(src);
    }

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.cache.set(src, img);
        this.loading.delete(src);
        resolve(img);
      };
      img.onerror = () => {
        this.loading.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });

    this.loading.set(src, promise);
    return promise;
  },

  async preloadImages(sources) {
    return Promise.all(sources.map(src => this.loadImage(src)));
  },

  clearCache() {
    this.cache.clear();
    this.loading.clear();
  },

  getCacheSize() {
    return this.cache.size;
  }
};
