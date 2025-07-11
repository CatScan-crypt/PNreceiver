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
        image: event.data.image,
        // badge:  '/icon.png',
      };
    } 
    console.log(":asf", data)
    const options = {
      body:  data.notification?.body,
      icon:  data.notification?.image,
      badge:  '/icon-badge.png',
      image: data.notification?.image,
      
      data: {
        ...data.data,
        link: data.fcmOptions?.link || '/'
      },
      actions: data.actions || data.notification?.actions || [],
      requireInteraction: true,
      vibrate: [200, 100, 200]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || data.notification?.title || 'New Notification', options)
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