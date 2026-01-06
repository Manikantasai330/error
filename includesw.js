if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Aggressive: Unregister any existing service workers first to clear old cache
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
            for (let registration of registrations) {
                registration.unregister();
            }
        }).then(() => {
            // Register the new service worker with a new version param
            navigator.serviceWorker.register('/sw-v2.js?v=visual_image_2').then((registration) => {
                // Check if there is already a waiting worker
                if (registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                }

                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content is available; force update
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                        }
                    });
                });
            });
        });
    });

    // Reload the page when the new service worker takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
    });
}

var d = new Date();
var timestamp = d.getTime();
