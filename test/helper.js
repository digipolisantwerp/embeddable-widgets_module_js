// zoid accesses performance instead of window.performance
// jsdom registers window.performance but not performance
// so the test breaks unless we define the performance global
global.performance = window.performance;
