export const pushService = {
  // Convert VAPID key for push subscription
  urlBase64ToUint8Array: (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
      
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  },

  requestPermission: async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('Tarayıcı bildirimleri desteklemiyor.');
      return false;
    }

    if (Notification.permission === 'granted') return true;

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (e) {
      console.error('Bildirim izni istenirken hata:', e);
      return false;
    }
  },

  subscribeToPush: async (vapidPublicKey: string) => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        const convertedVapidKey = pushService.urlBase64ToUint8Array(vapidPublicKey);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });
      }
      
      return subscription;
    } catch (error) {
      console.error('Push servisine abone olunurken hata:', error);
      return null;
    }
  },
  
  // Local notification fallback if service worker is not active
  showLocalNotification: (title: string, body: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/pwa-192x192.png'
      });
    }
  }
};
