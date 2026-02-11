export const PerformanceMonitor = {
  metrics: {},
  observers: [],

  startMeasure(name) {
    if (performance.mark) {
      performance.mark(`${name}-start`);
    }
    this.metrics[name] = { startTime: performance.now() };
  },

  endMeasure(name) {
    if (!this.metrics[name]) return null;

    const endTime = performance.now();
    const duration = endTime - this.metrics[name].startTime;

    if (performance.mark && performance.measure) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }

    this.metrics[name] = {
      ...this.metrics[name],
      endTime,
      duration
    };

    return duration;
  },

  getMetric(name) {
    return this.metrics[name];
  },

  getAllMetrics() {
    return { ...this.metrics };
  },

  clearMetrics() {
    this.metrics = {};
    if (performance.clearMarks) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  },

  measureFPS() {
    let lastTime = performance.now();
    let frames = 0;
    let fps = 60;

    const measure = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frames * 1000) / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measure);
    };

    measure();
    return () => fps;
  },

  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      };
    }
    return null;
  },

  logPerformance() {
    console.log('Performance Metrics:', this.getAllMetrics());
    const memory = this.getMemoryUsage();
    if (memory) {
      console.log('Memory Usage:', memory);
    }
  }
};
