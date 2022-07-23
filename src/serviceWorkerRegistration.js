const publicVapidKey =
  "BFzStiraWyBfowVdYKQFQUxzVmUvBtO6MnVzqBxqU90ylOTEGQiCvBnoFoM2ZxuZ0XFNqbU20X-YZjV4c_mhaFI";
const registerUrl = 'https://webpush-notification-server.herokuapp.com/register';


const urlBase64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const saveSubscription = async subscription => {
  const res = await fetch(registerUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription)
  });
  return res.status === 200 ? res.json() : false;
};

const generateSubscription = async swRegistration => {
  await window.Notification.requestPermission();
  const pushSubscription = await swRegistration.pushManager.getSubscription();
  if (!pushSubscription) {
    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    const saved = await saveSubscription(subscription);
    if (saved) {
      console.log('Subscription saved', saved);
      return saved
    };
    throw Error('Subscription not saved!');
  } else {
    console.log('Subscription already exists!', pushSubscription);
    return pushSubscription
  };
};

export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./serviceWorker.js", {})
        .then(async (registration) => {
          console.log("SW registered: ", registration);
          await generateSubscription(registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError.message);
        });
    });
  }
}
