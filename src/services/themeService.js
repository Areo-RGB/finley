// Theme Service - Handles dark/light mode and page highlights
// Extracted from custom.js theme management section

export function initThemeService(pwaName) {
  console.log("🎨 Initializing Theme Service...");

  initPageHighlights(pwaName);
  initBackgroundGradients(pwaName);
  initDarkMode(pwaName);

  console.log("✅ Theme Service initialized");
}

function initPageHighlights(pwaName) {
  // Page Highlights
  var highlightData = document.querySelectorAll("[data-change-highlight]");
  highlightData.forEach((el) =>
    el.addEventListener("click", (e) => {
      var highlight = el.getAttribute("data-change-highlight");
      var pageHighlight = document.querySelectorAll(".page-highlight");
      if (pageHighlight.length) {
        pageHighlight.forEach(function (e) {
          e.remove();
        });
      }
      var loadHighlight = document.createElement("link");
      loadHighlight.rel = "stylesheet";
      loadHighlight.className = "page-highlight";
      loadHighlight.type = "text/css";
      loadHighlight.href = "styles/highlights/highlight_" + highlight + ".css";
      document.getElementsByTagName("head")[0].appendChild(loadHighlight);
      document.body.setAttribute("data-highlight", "highlight-" + highlight);
      localStorage.setItem(pwaName + "-Highlight", highlight);
    })
  );

  // Remember Highlight
  var rememberHighlight = localStorage.getItem(pwaName + "-Highlight");
  if (rememberHighlight) {
    document.body.setAttribute("data-highlight", rememberHighlight);
    var loadHighlight = document.createElement("link");
    loadHighlight.rel = "stylesheet";
    loadHighlight.className = "page-highlight";
    loadHighlight.type = "text/css";
    loadHighlight.href = "styles/highlights/highlight_" + rememberHighlight + ".css";
    if (!document.querySelectorAll(".page-highlight").length) {
      document.getElementsByTagName("head")[0].appendChild(loadHighlight);
      document.body.setAttribute("data-highlight", "highlight-" + rememberHighlight);
    }
  } else {
    var bodyHighlight = document.body.getAttribute("data-highlight");
    if (bodyHighlight) {
      var defaultHighlight = bodyHighlight.split("highlight-");
      document.body.setAttribute("data-highlight", defaultHighlight[1]);
      var loadHighlight = document.createElement("link");
      loadHighlight.rel = "stylesheet";
      loadHighlight.className = "page-highlight";
      loadHighlight.type = "text/css";
      loadHighlight.href = "styles/highlights/highlight_" + defaultHighlight[1] + ".css";
      if (!document.querySelectorAll(".page-highlight").length) {
        document.getElementsByTagName("head")[0].appendChild(loadHighlight);
        document.body.setAttribute("data-highlight", "highlight-" + defaultHighlight[1]);
        localStorage.setItem(pwaName + "-Highlight", defaultHighlight[1]);
      }
    }
  }
}

function initBackgroundGradients(pwaName) {
  // Background Gradient Color
  var gradientData = document.querySelectorAll("[data-change-background]");
  gradientData.forEach((el) =>
    el.addEventListener("click", (e) => {
      var gradient = el.getAttribute("data-change-background");
      document.body.setAttribute("data-gradient", "body-" + gradient + "");
      localStorage.setItem(pwaName + "-Gradient", gradient);
    })
  );

  // Set Background and Highlight
  var pageBackground = localStorage.getItem(pwaName + "-Gradient");
  if (pageBackground) {
    document.body.setAttribute("data-gradient", "body-" + pageBackground + "");
  }
}

function initDarkMode(pwaName) {
  // Dark Mode
  const toggleDark = document.querySelectorAll("[data-toggle-theme]");
  
  function activateDarkMode() {
    document.body.classList.add("theme-dark");
    document.body.classList.remove("theme-light", "detect-theme");
    for (let i = 0; i < toggleDark.length; i++) {
      toggleDark[i].checked = "checked";
    }
    localStorage.setItem(pwaName + "-Theme", "dark-mode");
  }
  
  function activateLightMode() {
    document.body.classList.add("theme-light");
    document.body.classList.remove("theme-dark", "detect-theme");
    for (let i = 0; i < toggleDark.length; i++) {
      toggleDark[i].checked = false;
    }
    localStorage.setItem(pwaName + "-Theme", "light-mode");
  }
  
  function removeTransitions() {
    var falseTransitions = document.querySelectorAll(".btn, .header, #footer-bar, .menu-box, .menu-active");
    for (let i = 0; i < falseTransitions.length; i++) {
      falseTransitions[i].style.transition = "all 0s ease";
    }
  }
  
  function addTransitions() {
    var trueTransitions = document.querySelectorAll(".btn, .header, #footer-bar, .menu-box, .menu-active");
    for (let i = 0; i < trueTransitions.length; i++) {
      trueTransitions[i].style.transition = "";
    }
  }

  function setColorScheme() {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isLightMode = window.matchMedia("(prefers-color-scheme: light)").matches;
    const isNoPreference = window.matchMedia("(prefers-color-scheme: no-preference)").matches;
    
    window.matchMedia("(prefers-color-scheme: dark)").addListener((e) => e.matches && activateDarkMode());
    window.matchMedia("(prefers-color-scheme: light)").addListener((e) => e.matches && activateLightMode());
    
    if (isDarkMode) activateDarkMode();
    if (isLightMode) activateLightMode();
  }

  // Activating Dark Mode
  const darkModeSwitch = document.querySelectorAll("[data-toggle-theme]");
  darkModeSwitch.forEach((el) =>
    el.addEventListener("click", (e) => {
      if (document.body.className == "theme-light") {
        removeTransitions();
        activateDarkMode();
      } else if (document.body.className == "theme-dark") {
        removeTransitions();
        activateLightMode();
      }
      setTimeout(function () {
        addTransitions();
      }, 350);
    })
  );

  // Set Color Based on Remembered Preference.
  if (localStorage.getItem(pwaName + "-Theme") == "dark-mode") {
    for (let i = 0; i < toggleDark.length; i++) {
      toggleDark[i].checked = "checked";
    }
    document.body.className = "theme-dark";
  }
  if (localStorage.getItem(pwaName + "-Theme") == "light-mode") {
    document.body.className = "theme-light";
  }
  if (document.body.className == "detect-theme") {
    setColorScheme();
  }

  // Detect Dark/Light Mode
  const darkModeDetect = document.querySelectorAll(".detect-dark-mode");
  darkModeDetect.forEach((el) =>
    el.addEventListener("click", (e) => {
      document.body.classList.remove("theme-light", "theme-dark");
      document.body.classList.add("detect-theme");
      setTimeout(function () {
        setColorScheme();
      }, 50);
    })
  );

  // Export functions for external use
  window.activateDarkMode = activateDarkMode;
  window.activateLightMode = activateLightMode;
  window.setColorScheme = setColorScheme;
}
