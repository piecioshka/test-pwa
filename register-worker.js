if ('serviceWorker' in window.navigator) {
    navigator.serviceWorker.register('service-worker.js', function (status) {
        console.log('status', status);
    })
}
