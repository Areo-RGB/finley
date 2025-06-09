// Header Component
// Reusable header with navigation, theme toggle, and back button functionality

export function initHeader() {
  console.log("🎯 Initializing Header Component...");

  initBackButton();
  initThemeToggle();
  initHeaderInteractions();

  console.log("✅ Header Component initialized");
}

function initBackButton() {
  const backButtons = document.querySelectorAll("[data-back-button]");
  
  if (!backButtons.length) return;

  backButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Check if there's history to go back to
      if (window.history.length > 1) {
        window.history.go(-1);
        console.log("🔙 Navigating back in history");
      } else {
        // Fallback to home page if no history
        window.location.href = "/";
        console.log("🏠 No history found, redirecting to home");
      }
    });
  });

  console.log(`✅ Back button initialized (${backButtons.length} buttons)`);
}

function initThemeToggle() {
  const themeToggleButtons = document.querySelectorAll("[data-toggle-theme]");
  
  if (!themeToggleButtons.length) return;

  themeToggleButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      
      const currentTheme = document.body.classList.contains("theme-dark") ? "dark" : "light";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      
      // Remove transition temporarily for smooth theme change
      removeTransitions();
      
      if (newTheme === "dark") {
        activateDarkMode();
      } else {
        activateLightMode();
      }
      
      // Restore transitions after theme change
      setTimeout(addTransitions, 350);
      
      console.log(`🎨 Theme switched from ${currentTheme} to ${newTheme}`);
    });
  });

  console.log(`✅ Theme toggle initialized (${themeToggleButtons.length} buttons)`);
}

function initHeaderInteractions() {
  const headers = document.querySelectorAll(".header");
  
  if (!headers.length) return;

  headers.forEach((header) => {
    // Add scroll behavior for fixed headers
    if (header.classList.contains("header-fixed")) {
      let lastScrollTop = 0;
      let isScrolling = false;

      window.addEventListener("scroll", () => {
        if (!isScrolling) {
          window.requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Hide header when scrolling down, show when scrolling up
            if (scrollTop > lastScrollTop && scrollTop > 100) {
              // Scrolling down
              header.style.transform = "translateY(-100%)";
            } else {
              // Scrolling up
              header.style.transform = "translateY(0)";
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            isScrolling = false;
          });
        }
        isScrolling = true;
      });
    }

    // Add touch feedback for header buttons
    const headerButtons = header.querySelectorAll(".header-icon, .header-title");
    headerButtons.forEach((button) => {
      button.addEventListener("touchstart", () => {
        button.style.opacity = "0.7";
      });
      
      button.addEventListener("touchend", () => {
        button.style.opacity = "1";
      });
      
      button.addEventListener("touchcancel", () => {
        button.style.opacity = "1";
      });
    });
  });

  console.log(`✅ Header interactions initialized (${headers.length} headers)`);
}

// Theme utility functions (imported from themeService)
function removeTransitions() {
  const elements = document.querySelectorAll(".btn, .header, #footer-bar, .menu-box, .menu-active");
  elements.forEach((el) => {
    el.style.transition = "all 0s ease";
  });
}

function addTransitions() {
  const elements = document.querySelectorAll(".btn, .header, #footer-bar, .menu-box, .menu-active");
  elements.forEach((el) => {
    el.style.transition = "";
  });
}

function activateDarkMode() {
  document.body.classList.add("theme-dark");
  document.body.classList.remove("theme-light", "detect-theme");
  
  const toggles = document.querySelectorAll("[data-toggle-theme]");
  toggles.forEach((toggle) => {
    if (toggle.type === "checkbox") {
      toggle.checked = true;
    }
  });
  
  localStorage.setItem("QuoVadis-Theme", "dark-mode");
}

function activateLightMode() {
  document.body.classList.add("theme-light");
  document.body.classList.remove("theme-dark", "detect-theme");
  
  const toggles = document.querySelectorAll("[data-toggle-theme]");
  toggles.forEach((toggle) => {
    if (toggle.type === "checkbox") {
      toggle.checked = false;
    }
  });
  
  localStorage.setItem("QuoVadis-Theme", "light-mode");
}

// Header utility functions for external use
export const HeaderUtils = {
  // Programmatically trigger back navigation
  goBack: () => {
    if (window.history.length > 1) {
      window.history.go(-1);
    } else {
      window.location.href = "/";
    }
  },

  // Programmatically toggle theme
  toggleTheme: () => {
    const currentTheme = document.body.classList.contains("theme-dark") ? "dark" : "light";
    if (currentTheme === "dark") {
      activateLightMode();
    } else {
      activateDarkMode();
    }
  },

  // Set specific theme
  setTheme: (theme) => {
    if (theme === "dark") {
      activateDarkMode();
    } else if (theme === "light") {
      activateLightMode();
    }
  },

  // Get current theme
  getCurrentTheme: () => {
    return document.body.classList.contains("theme-dark") ? "dark" : "light";
  },

  // Show/hide header
  showHeader: () => {
    const headers = document.querySelectorAll(".header");
    headers.forEach((header) => {
      header.style.transform = "translateY(0)";
    });
  },

  hideHeader: () => {
    const headers = document.querySelectorAll(".header");
    headers.forEach((header) => {
      header.style.transform = "translateY(-100%)";
    });
  }
};

// Export individual functions for testing
export { initBackButton, initThemeToggle, initHeaderInteractions };
