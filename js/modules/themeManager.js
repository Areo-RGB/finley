// js/modules/themeManager.js
let currentPwaName; // To be set by initThemeManager
let currentToggleDarkSelectors = '[data-toggle-theme]'; // Default selector

function getToggleDarkElements() {
  return document.querySelectorAll(currentToggleDarkSelectors);
}

function removeTransitions() {
  const falseTransitions = document.querySelectorAll(
    ".btn, .header, #footer-bar, .menu-box, .menu-active"
  );
  falseTransitions.forEach(el => el.style.transition = "all 0s ease");
}

function addTransitions() {
  const trueTransitions = document.querySelectorAll(
    ".btn, .header, #footer-bar, .menu-box, .menu-active"
  );
  trueTransitions.forEach(el => el.style.transition = "");
}

// Private function to activate dark mode
function _activateDarkMode() {
  document.body.classList.add("theme-dark");
  document.body.classList.remove("theme-light", "detect-theme");
  getToggleDarkElements().forEach(el => el.checked = true);
  if (currentPwaName) {
    localStorage.setItem(currentPwaName + "-Theme", "dark-mode");
  }
}

// Private function to activate light mode
function _activateLightMode() {
  document.body.classList.add("theme-light");
  document.body.classList.remove("theme-dark", "detect-theme");
  getToggleDarkElements().forEach(el => el.checked = false);
  if (currentPwaName) {
    localStorage.setItem(currentPwaName + "-Theme", "light-mode");
  }
}

// Private function to apply system color scheme preference
function _applySystemColorScheme() {
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isLightMode = window.matchMedia("(prefers-color-scheme: light)").matches;

  if (isDarkMode) _activateDarkMode();
  else if (isLightMode) _activateLightMode();
}

// Private function to apply the saved theme or system preference
function _applyInitialTheme() {
  const savedTheme = currentPwaName ? localStorage.getItem(currentPwaName + "-Theme") : null;
  const toggleDark = getToggleDarkElements();

  if (savedTheme === "dark-mode") {
    document.body.className = 'theme-dark';
    toggleDark.forEach(el => el.checked = true);
  } else if (savedTheme === "light-mode") {
    document.body.className = 'theme-light';
    toggleDark.forEach(el => el.checked = false);
  } else {
      if (document.body.classList.contains("detect-theme")) {
        _applySystemColorScheme();
      } else if (document.body.className === "" && !document.body.classList.contains("theme-light") && !document.body.classList.contains("theme-dark")) {
         _applySystemColorScheme();
      }
  }
}

export function initThemeManager(config) {
  if (!config || !config.pwaName) {
    console.error('themeManager: pwaName is required in config.');
    return;
  }
  currentPwaName = config.pwaName;
  if (config.toggleDarkSelectors) {
    currentToggleDarkSelectors = config.toggleDarkSelectors;
  }

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener('change', e => {
    if (document.body.classList.contains("detect-theme") && e.matches) _activateDarkMode();
  });
  window.matchMedia("(prefers-color-scheme: light)").addEventListener('change', e => {
    if (document.body.classList.contains("detect-theme") && e.matches) _activateLightMode();
  });

  _applyInitialTheme();

  const darkModeSwitch = getToggleDarkElements();
  darkModeSwitch.forEach((el) =>
    el.addEventListener("click", () => {
      removeTransitions();
      if (document.body.classList.contains("theme-light") || (document.body.classList.contains("detect-theme") && !window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        _activateDarkMode();
      } else {
        _activateLightMode();
      }
      setTimeout(addTransitions, 350);
    })
  );

  const darkModeDetect = document.querySelectorAll(".detect-dark-mode");
  darkModeDetect.forEach((el) =>
    el.addEventListener("click", () => {
      document.body.classList.remove("theme-light", "theme-dark");
      document.body.classList.add("detect-theme");
      setTimeout(_applySystemColorScheme, 50);
    })
  );
}
