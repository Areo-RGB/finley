// PWA Service - Handles Progressive Web App functionality
// Extracted from custom.js PWA section

export function initPWA(config) {
  if (!config.isPWA) return;

  console.log("🔧 Initializing PWA Service...");

  var checkPWA = document.getElementsByTagName("html")[0];
  if (!checkPWA.classList.contains("isPWA")) {
    // Register Service Worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker
          .register(config.pwaLocation, { scope: config.pwaScope })
          .then(function (registration) {
            registration.update();
            console.log("✅ Service Worker registered successfully");
          })
          .catch(function (error) {
            console.error("❌ Service Worker registration failed:", error);
          });
      });
    }

    // Setting Timeout Before Prompt Shows Again if Dismissed
    var hours = config.pwaRemind * 24; // Reset when storage is more than 24hours
    var now = Date.now();
    var setupTime = localStorage.getItem(config.pwaName + "-PWA-Timeout-Value");
    if (setupTime == null) {
      localStorage.setItem(config.pwaName + "-PWA-Timeout-Value", now);
    } else if (now - setupTime > hours * 60 * 60 * 1000) {
      localStorage.removeItem(config.pwaName + "-PWA-Prompt");
      localStorage.setItem(config.pwaName + "-PWA-Timeout-Value", now);
    }

    // PWA Dismiss Handler
    const pwaClose = document.querySelectorAll(".pwa-dismiss");
    pwaClose.forEach((el) =>
      el.addEventListener("click", (e) => {
        const pwaWindows = document.querySelectorAll("#menu-install-pwa-android, #menu-install-pwa-ios");
        for (let i = 0; i < pwaWindows.length; i++) {
          pwaWindows[i].classList.remove("menu-active");
        }
        localStorage.setItem(config.pwaName + "-PWA-Timeout-Value", now);
        localStorage.setItem(config.pwaName + "-PWA-Prompt", "install-rejected");
        console.log("PWA Install Rejected. Will Show Again in " + config.pwaRemind + " Days");
      })
    );

    // Detecting Mobile OS
    let isMobile = {
      Android: function () {
        return navigator.userAgent.match(/Android/i);
      },
      iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      any: function () {
        return isMobile.Android() || isMobile.iOS();
      },
    };

    // Setup device-specific classes
    const androidDev = document.getElementsByClassName("show-android");
    const iOSDev = document.getElementsByClassName("show-ios");
    const noDev = document.getElementsByClassName("show-no-device");

    if (!isMobile.any()) {
      for (let i = 0; i < iOSDev.length; i++) {
        iOSDev[i].classList.add("disabled");
      }
      for (let i = 0; i < androidDev.length; i++) {
        androidDev[i].classList.add("disabled");
      }
    }
    
    if (isMobile.iOS()) {
      document.querySelectorAll("#page")[0].classList.add("device-is-ios");
      for (let i = 0; i < noDev.length; i++) {
        noDev[i].classList.add("disabled");
      }
      for (let i = 0; i < androidDev.length; i++) {
        androidDev[i].classList.add("disabled");
      }
    }
    
    if (isMobile.Android()) {
      document.querySelectorAll("#page")[0].classList.add("device-is-android");
      for (let i = 0; i < iOSDev.length; i++) {
        iOSDev[i].classList.add("disabled");
      }
      for (let i = 0; i < noDev.length; i++) {
        noDev[i].classList.add("disabled");
      }
    }

    // Trigger Install Prompt for Android
    const pwaWindows = document.querySelectorAll("#menu-install-pwa-android, #menu-install-pwa-ios");
    if (pwaWindows.length) {
      if (isMobile.Android()) {
        if (localStorage.getItem(config.pwaName + "-PWA-Prompt") != "install-rejected") {
          function showInstallPrompt() {
            setTimeout(function () {
              if (!window.matchMedia("(display-mode: fullscreen)").matches) {
                console.log("Triggering PWA Window for Android");
                document.getElementById("menu-install-pwa-android").classList.add("menu-active");
                document.querySelectorAll(".menu-hider")[0].classList.add("menu-active");
              }
            }, 3500);
          }
          
          var deferredPrompt;
          window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault();
            deferredPrompt = e;
            showInstallPrompt();
          });
          
          const pwaInstall = document.querySelectorAll(".pwa-install");
          pwaInstall.forEach((el) =>
            el.addEventListener("click", (e) => {
              deferredPrompt.prompt();
              deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === "accepted") {
                  console.log("PWA Added to Home Screen");
                } else {
                  localStorage.setItem(config.pwaName + "-PWA-Timeout-Value", now);
                  localStorage.setItem(config.pwaName + "-PWA-Prompt", "install-rejected");
                  setTimeout(function () {
                    if (!window.matchMedia("(display-mode: fullscreen)").matches) {
                      document.getElementById("menu-install-pwa-android").classList.remove("menu-active");
                      document.querySelectorAll(".menu-hider")[0].classList.remove("menu-active");
                    }
                  }, 50);
                }
                deferredPrompt = null;
              });
            })
          );
          
          window.addEventListener("appinstalled", (evt) => {
            document.getElementById("menu-install-pwa-android").classList.remove("menu-active");
            document.querySelectorAll(".menu-hider")[0].classList.remove("menu-active");
          });
        }
      }
      
      // Trigger Install Guide iOS
      if (isMobile.iOS()) {
        if (localStorage.getItem(config.pwaName + "-PWA-Prompt") != "install-rejected") {
          setTimeout(function () {
            if (!window.matchMedia("(display-mode: fullscreen)").matches) {
              console.log("Triggering PWA Window for iOS");
              document.getElementById("menu-install-pwa-ios").classList.add("menu-active");
              document.querySelectorAll(".menu-hider")[0].classList.add("menu-active");
            }
          }, 3500);
        }
      }
    }

    checkPWA.setAttribute("class", "isPWA");
  }

  // Handle no-cache option
  if (config.pwaNoCache === true) {
    sessionStorage.clear();
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }

  // Initialize online/offline handling
  initOnlineOfflineHandling();

  console.log("✅ PWA Service initialized");
}

function initOnlineOfflineHandling() {
  // Creating Offline Alert Messages
  var addOfflineClasses = document.querySelectorAll(".offline-message");
  if (!addOfflineClasses.length) {
    const offlineAlert = document.createElement("p");
    const onlineAlert = document.createElement("p");
    offlineAlert.className = "offline-message bg-red-dark color-white";
    offlineAlert.textContent = "No internet connection detected";
    onlineAlert.className = "online-message bg-green-dark color-white";
    onlineAlert.textContent = "You are back online";
    document.getElementsByTagName("body")[0].appendChild(offlineAlert);
    document.getElementsByTagName("body")[0].appendChild(onlineAlert);
  }

  // Online / Offline Functions
  function offlinePage() {
    var showOffline = document.querySelectorAll(".show-offline");
    showOffline.forEach((el) =>
      el.addEventListener("click", (event) => {
        document.getElementsByClassName("offline-message")[0].classList.add("offline-message-active");
        setTimeout(function () {
          document.getElementsByClassName("offline-message")[0].classList.remove("offline-message-active");
        }, 1500);
      })
    );
  }

  function onlinePage() {
    var anchorsEnabled = document.querySelectorAll("[data-link]");
    anchorsEnabled.forEach(function (e) {
      var hrefs = e.getAttribute("data-link");
      if (hrefs.match(/.html/)) {
        e.setAttribute("href", hrefs);
        e.removeAttribute("data-link", "");
      }
    });
  }

  // Defining Offline/Online Variables
  var offlineMessage = document.getElementsByClassName("offline-message")[0];
  var onlineMessage = document.getElementsByClassName("online-message")[0];

  // Online / Offline Status
  function isOnline() {
    onlinePage();
    onlineMessage.classList.add("online-message-active");
    setTimeout(function () {
      onlineMessage.classList.remove("online-message-active");
    }, 2000);
    console.info("Connection: Online");
  }

  function isOffline() {
    offlinePage();
    offlineMessage.classList.add("offline-message-active");
    setTimeout(function () {
      offlineMessage.classList.remove("offline-message-active");
    }, 2000);
    console.info("Connection: Offline");
  }

  // Simulate offline/online for testing
  var simulateOffline = document.querySelectorAll(".simulate-offline");
  var simulateOnline = document.querySelectorAll(".simulate-online");
  if (simulateOffline.length) {
    simulateOffline[0].addEventListener("click", function () {
      isOffline();
    });
    simulateOnline[0].addEventListener("click", function () {
      isOnline();
    });
  }

  // Check if Online / Offline
  function updateOnlineStatus(event) {
    var condition = navigator.onLine ? "online" : "offline";
    isOnline();
  }
  function updateOfflineStatus(event) {
    isOffline();
  }
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOfflineStatus);
}

// iOS Badge simulation
export function simulateIOSBadge() {
  const iOSBadge = document.querySelectorAll(".simulate-iphone-badge");
  iOSBadge.forEach((el) =>
    el.addEventListener("click", (e) => {
      document.getElementsByClassName("add-to-home")[0].classList.add("add-to-home-visible", "add-to-home-ios");
      document.getElementsByClassName("add-to-home")[0].classList.remove("add-to-home-android");
    })
  );
}

// Android Badge simulation
export function simulateAndroidBadge() {
  const AndroidBadge = document.querySelectorAll(".simulate-android-badge");
  AndroidBadge.forEach((el) =>
    el.addEventListener("click", (e) => {
      document.getElementsByClassName("add-to-home")[0].classList.add("add-to-home-visible", "add-to-home-android");
      document.getElementsByClassName("add-to-home")[0].classList.remove("add-to-home-ios");
    })
  );
}

// Remove Add to Home Badge
export function initAddToHomeBadgeClose() {
  const addToHomeBadgeClose = document.querySelectorAll(".add-to-home");
  addToHomeBadgeClose.forEach((el) =>
    el.addEventListener("click", (e) => {
      document.getElementsByClassName("add-to-home")[0].classList.remove("add-to-home-visible");
    })
  );
}
