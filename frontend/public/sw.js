self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {}
  const title   = data.title   || 'Sky Stay Resorts'
  const options = {
    body:    data.body    || 'Thank you for visiting Sky Stay Resorts!',
    icon:    data.icon    || '/logo2.png',
    badge:   '/logo2.png',
    image:   data.image   || '',
    vibrate: [200, 100, 200],
    data:    { url: data.url || '/' },
    actions: [
      { action: 'view',    title: 'View Offer' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  if (event.action === 'dismiss') return
  const url = event.notification.data?.url || '/'
  event.waitUntil(clients.openWindow(url))
})
