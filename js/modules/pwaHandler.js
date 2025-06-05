// js/modules/pwaHandler.js

// Default configuration
let config = {
  isPWA: true,
  pwaName: "QuoVadis",
  pwaRemind: 1, // Days
  pwaLocation: "/service-worker.js",
  pwaScope: "/",
  pwaNoCache: false,
  androidPromptSelector: "#menu-install-pwa-android",
  iosPromptSelector: "#menu-install-pwa-ios",
  dismissButtonSelector: ".pwa-dismiss",
  installButtonSelector: ".pwa-install",
  menuHiderSelector: ".menu-hider"
};

let deferredPrompt;

const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  }
};

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register(config.pwaLocation, { scope: config.pwaScope })
        .then(function (registration) {
          // console.log("Service Worker Registered with scope:", registration.scope);
          registration.update();
        })
        .catch(function (error) {
          console.error("Service Worker Registration Failed:", error);
        });
    });
  }
}

function manageInstallPromptTimeout() {
  var hours = config.pwaRemind * 24;
  var now = Date.now();
  var setupTime = localStorage.getItem(config.pwaName + "-PWA-Timeout-Value");

  if (setupTime == null) {
    localStorage.setItem(config.pwaName + "-PWA-Timeout-Value", now);
  } else if (now - setupTime > hours * 60 * 60 * 1000) {
    localStorage.removeItem(config.pwaName + "-PWA-Prompt");
    localStorage.setItem(config.pwaName + "-PWA-Timeout-Value", now);
    // console.log("PWA prompt rejection reset after timeout.");
  }
}

function setupDismissListeners() {
  const pwaDismissButtons = document.querySelectorAll(config.dismissButtonSelector);
  pwaDismissButtons.forEach((el) => {
    el.addEventListener("click", () => {
      const androidPrompt = document.querySelector(config.androidPromptSelector);
      const iosPrompt = document.querySelector(config.iosPromptSelector);
      if (androidPrompt) androidPrompt.classList.remove("menu-active");
      if (iosPrompt) iosPrompt.classList.remove("menu-active");

      const menuHider = document.querySelector(config.menuHiderSelector);
      if(menuHider) menuHider.classList.remove("menu-active");

      localStorage.setItem(config.pwaName + "-PWA-Timeout-Value", Date.now());
      localStorage.setItem(config.pwaName + "-PWA-Prompt", "install-rejected");
      // console.log("PWA Install Rejected. Remind in " + config.pwaRemind + " days.");
    });
  });
}

function hidePrompts() {
    const androidPrompt = document.querySelector(config.androidPromptSelector);
    const iosPrompt = document.querySelector(config.iosPromptSelector);
    if (androidPrompt) androidPrompt.classList.remove("menu-active");
    if (iosPrompt) iosPrompt.classList.remove("menu-active");
    const menuHider = document.querySelector(config.menuHiderSelector);
    if (menuHider) menuHider.classList.remove("menu-active");
}

function showAndroidInstallPrompt() {
    const androidPromptElement = document.querySelector(config.androidPromptSelector);
    if (androidPromptElement && !window.matchMedia("(display-mode: fullscreen)").matches) {
        // console.log("Triggering PWA Window for Android");
        androidPromptElement.classList.add("menu-active");
        const menuHider = document.querySelector(config.menuHiderSelector);
        if (menuHider) menuHider.classList.add("menu-active");
    }
}

function showIosInstallPrompt() {
    const iosPromptElement = document.querySelector(config.iosPromptSelector);
    if (iosPromptElement && !window.matchMedia("(display-mode: fullscreen)").matches) {
        // console.log("Triggering PWA Window for iOS");
        iosPromptElement.classList.add("menu-active");
        const menuHider = document.querySelector(config.menuHiderSelector);
        if (menuHider) menuHider.classList.add("menu-active");
    }
}

function setupAndroidPWA() {
  if (localStorage.getItem(config.pwaName + "-PWA-Prompt") !== "install-rejected") {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      // console.log("'beforeinstallprompt' event fired.");
      setTimeout(showAndroidInstallPrompt, 3500);
    });
  }

  const pwaInstallButtons = document.querySelectorAll(config.installButtonSelector);
  pwaInstallButtons.forEach((el) => {
    // Check if the button is specifically for Android if needed, e.g. by parent
    if(el.closest(config.androidPromptSelector)){
        el.addEventListener("click", () => {
          if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
              if (choiceResult.outcome === "accepted") {
                // console.log("PWA Added to Home Screen by user.");
              } else {
                // console.log("PWA Install prompt dismissed by user.");
                localStorage.setItem(config.pwaName + "-PWA-Timeout-Value", Date.now());
                localStorage.setItem(config.pwaName + "-PWA-Prompt", "install-rejected");
                hidePrompts();
              }
              deferredPrompt = null;
            });
          } else {
            // console.log("PWA install button clicked, but no deferredPrompt available.");
          }
        });
    }
  });

  window.addEventListener("appinstalled", () => {
    // console.log("PWA App Installed successfully.");
    hidePrompts();
  });
}

function setupIosPWA() {
  if (localStorage.getItem(config.pwaName + "-PWA-Prompt") !== "install-rejected") {
    setTimeout(showIosInstallPrompt, 3500);
  }
}

function clearCacheIfNeeded() {
  if (config.pwaNoCache === true) {
    // console.log("Clearing cache because pwaNoCache is true.");
    sessionStorage.clear();
    if (caches && typeof caches.keys === 'function') {
        caches.keys().then((cacheNames) => {
          return Promise.all( // Ensure all deletions are processed
            cacheNames.map((cacheName) => { // Use map to return promises
              // console.log('Deleting cache:', cacheName);
              return caches.delete(cacheName);
            })
          );
        }).then(() => {
            // console.log('All caches deleted successfully.');
        }).catch(err => {
            console.error('Error during cache deletion:', err);
        });
    } else {
        console.warn('Caches API not fully supported or available.');
    }
  }
}

export function initPWA(userConfig = {}) {
  // Merge userConfig with default config
  config = { ...config, ...userConfig };

  if (!config.isPWA) {
    // console.log("PWA feature is disabled by config.");
    return;
  }

  const checkPWAHtml = document.getElementsByTagName("html")[0];
  if (checkPWAHtml.classList.contains("isPWA")) {
    // console.log("PWA already initialized.");
    return; // Already initialized
  }

  registerServiceWorker();
  manageInstallPromptTimeout();
  setupDismissListeners(); // These should always be active to hide prompts

  const androidPromptElement = document.querySelector(config.androidPromptSelector);
  const iosPromptElement = document.querySelector(config.iosPromptSelector);

  if (androidPromptElement || iosPromptElement) { // Only setup PWA install logic if prompt elements exist
      if (isMobile.Android()) {
        setupAndroidPWA();
      } else if (isMobile.iOS()) {
        setupIosPWA();
      }
  }

  clearCacheIfNeeded();
  checkPWAHtml.classList.add("isPWA"); // Mark as initialized
  // console.log("PWA Handler Initialized.");
}
