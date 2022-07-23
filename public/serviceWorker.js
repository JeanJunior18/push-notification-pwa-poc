

self.addEventListener("push", async (event) => {
  const res = JSON.parse(event.data.text());
  const { title, body, url, icon } = res.payload;
  console.log("push", { title, body, url, icon });

  const options = {
    body,
    icon,
    vibrate: [100],
    data: { url }
  };
  console.log(title, options)
  self.registration.showNotification(title, options).then(() => resolve());
});

self.addEventListener("notificationclick", (event) => {
  console.log("Notification click: tag", event);
});
