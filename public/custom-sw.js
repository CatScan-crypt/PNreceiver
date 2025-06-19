// Handle push notification
self.addEventListener('push', (event) => {
  if (event.data) {
    let data;
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'New Notification',
        body: event.data.text(),
        image: event.data.text()
      };
    }

    const options = {
      body: data.body || data.notification?.body,
      icon: data.icon || data.notification?.icon,
      badge: data.badge || data.notification?.badge,
      image: 'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjEwNDktMjIucG5n.png',

      data: {
        ...data.data,
        link: data.fcmOptions?.link || '/'
      },
      actions: data.actions || data.notification?.actions || [],
      requireInteraction: true,
      vibrate: [200, 100, 200]
    };

    event.waitUntil(
      self.registration.showNotification(data, options)
    );
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log(event);
  console.log('Notification clicked');
  event.notification.close();

  if (event.action) {
    // Handle custom actions if any
    console.log('Action clicked:', event.action);
  } else {
    // Default click behavior
    const urlToOpen = event.notification.data?.link || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Check if any window is already open with the target URL
        const existingClient = clientList.find(client => 
          client.url.includes(urlToOpen) && 'focus' in client
        );
        
        if (existingClient) {
          return existingClient.focus();
        }
        
        // If no window is open, open a new one
        return clients.openWindow(urlToOpen);
      })
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    console.log('Notification closed:', event.notification.tag);
  });


  