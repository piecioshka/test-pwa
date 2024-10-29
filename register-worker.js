if ('serviceWorker' in window.navigator) {
  navigator.serviceWorker.register('service-worker.js', { scope: 'test-pwa' });
}
