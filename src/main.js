// Main application entry point
// This file contains global initialization logic that runs on every page

import { initPWA } from './services/pwaService.js';
import { initThemeService } from './services/themeService.js';
import { initCacheManager } from './services/cacheManager.js';
import { initHeader } from './components/Header/Header.js';
import { initFooterBar } from './components/FooterBar/FooterBar.js';

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  console.log("🚀 Finley PWA - Main application initializing...");

  // Global Variables
  const APP_CONFIG = {
    isPWA: true, // Enables or disables the service worker and PWA
    isAJAX: true, // AJAX transitions. Requires local server or server
    pwaName: "QuoVadis", // Local Storage Names for PWA
    pwaRemind: 1, // Days to re-remind to add to home
    pwaNoCache: false, // Requires server and HTTPS/SSL. Will clear cache with each visit
    pwaScope: "/",
    pwaLocation: "/service-worker.js"
  };

  // Make config globally available
  window.FINLEY_CONFIG = APP_CONFIG;

  // Initialize core services
  initGlobalFeatures();
  initPWA(APP_CONFIG);
  initThemeService(APP_CONFIG.pwaName);
  initCacheManager(APP_CONFIG);

  // Initialize global components
  initHeader();
  initFooterBar();

  console.log("✅ Finley PWA - Main application initialized");
});

function initGlobalFeatures() {
  // Remove preloader
  setTimeout(function () {
    var preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.classList.add("preloader-hide");
    }
  }, 150);

  // Initialize global menu system
  initMenuSystem();
  
  // Initialize form validation
  initFormValidation();
  
  // Initialize card extender
  initCardExtender();
  
  // Initialize global utilities
  initGlobalUtilities();
}

function initMenuSystem() {
  // Attaching Menu Hider
  var menuHider = document.getElementsByClassName("menu-hider");
  var hider;
  if (!menuHider.length) {
    hider = document.createElement("div");
    hider.setAttribute("class", "menu-hider");
    document.body.insertAdjacentElement("beforebegin", hider);
  } else {
    hider = menuHider[0];
  }
  setTimeout(function () {
    if (hider && hider.classList.contains("menu-active")) {
      hider.classList.remove("menu-active");
    }
  }, 50);

  // Activating Menus
  document.querySelectorAll(".menu").forEach((el) => {
    el.style.display = "block";
  });

  // Setting Sidebar Widths
  var menus = document.querySelectorAll(".menu");
  if (menus.length) {
    var menuSidebar = document.querySelectorAll(".menu-box-left, .menu-box-right");
    menuSidebar.forEach(function (e) {
      if (e.getAttribute("data-menu-width") === "cover") {
        e.style.width = "100%";
      } else {
        e.style.width = e.getAttribute("data-menu-width") + "px";
      }
    });
    
    var menuSheets = document.querySelectorAll(".menu-box-bottom, .menu-box-top, .menu-box-modal");
    menuSheets.forEach(function (e) {
      if (e.getAttribute("data-menu-width") === "cover") {
        e.style.width = "100%";
        e.style.height = "100%";
      } else {
        e.style.width = e.getAttribute("data-menu-width") + "px";
        e.style.height = e.getAttribute("data-menu-height") + "px";
      }
    });

    // Opening Menus
    var menuOpen = document.querySelectorAll("[data-menu]");
    var wrappers = document.querySelectorAll(".header, #footer-bar, .page-content");

    menuOpen.forEach((el) =>
      el.addEventListener("click", (e) => {
        // Close Existing Opened Menus
        const activeMenu = document.querySelectorAll(".menu-active");
        for (let i = 0; i < activeMenu.length; i++) {
          activeMenu[i].classList.remove("menu-active");
        }
        
        // Open Clicked Menu
        var menuData = el.getAttribute("data-menu");
        document.getElementById(menuData).classList.add("menu-active");
        document.getElementsByClassName("menu-hider")[0].classList.add("menu-active");
        
        // Check and Apply Effects
        var menu = document.getElementById(menuData);
        var menuEffect = menu.getAttribute("data-menu-effect");
        var menuLeft = menu.classList.contains("menu-box-left");
        var menuRight = menu.classList.contains("menu-box-right");
        var menuTop = menu.classList.contains("menu-box-top");
        var menuBottom = menu.classList.contains("menu-box-bottom");
        var menuWidth = menu.offsetWidth;
        var menuHeight = menu.offsetHeight;

        if (menuEffect === "menu-push") {
          var menuWidth = document.getElementById(menuData).getAttribute("data-menu-width");
          if (menuLeft) {
            for (let i = 0; i < wrappers.length; i++) {
              wrappers[i].style.transform = "translateX(" + menuWidth + "px)";
            }
          }
          if (menuRight) {
            for (let i = 0; i < wrappers.length; i++) {
              wrappers[i].style.transform = "translateX(-" + menuWidth + "px)";
            }
          }
          if (menuBottom) {
            for (let i = 0; i < wrappers.length; i++) {
              wrappers[i].style.transform = "translateY(-" + menuHeight + "px)";
            }
          }
          if (menuTop) {
            for (let i = 0; i < wrappers.length; i++) {
              wrappers[i].style.transform = "translateY(" + menuHeight + "px)";
            }
          }
        }
        
        if (menuEffect === "menu-parallax") {
          var menuWidth = document.getElementById(menuData).getAttribute("data-menu-width");
          if (menuLeft) {
            for (let i = 0; i < wrappers.length; i++) {
              wrappers[i].style.transform = "translateX(" + menuWidth / 10 + "px)";
            }
          }
          if (menuRight) {
            for (let i = 0; i < wrappers.length; i++) {
              wrappers[i].style.transform = "translateX(-" + menuWidth / 10 + "px)";
            }
          }
          if (menuBottom) {
            for (let i = 0; i < wrappers.length; i++) {
              wrappers[i].style.transform = "translateY(-" + menuHeight / 5 + "px)";
            }
          }
          if (menuTop) {
            for (let i = 0; i < wrappers.length; i++) {
              wrappers[i].style.transform = "translateY(" + menuHeight / 5 + "px)";
            }
          }
        }
      })
    );

    // Closing Menus
    const menuClose = document.querySelectorAll(".close-menu, .menu-hider");
    menuClose.forEach((el) =>
      el.addEventListener("click", (e) => {
        const activeMenu = document.querySelectorAll(".menu-active");
        for (let i = 0; i < activeMenu.length; i++) {
          activeMenu[i].classList.remove("menu-active");
        }
        for (let i = 0; i < wrappers.length; i++) {
          wrappers[i].style.transform = "translateX(-" + 0 + "px)";
        }
        var iframes = document.querySelectorAll("iframe");
        iframes.forEach((el) => {
          var hrefer = el.getAttribute("src");
          el.setAttribute("newSrc", hrefer);
          el.setAttribute("src", "");
          var newSrc = el.getAttribute("newSrc");
          el.setAttribute("src", newSrc);
        });
      })
    );
  }
}

function initFormValidation() {
  var inputField = document.querySelectorAll("input");
  if (!inputField.length) return;

  var mailValidator = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
  var phoneValidator = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
  var nameValidator = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  var passwordValidator = /[A-Za-z]{2}[A-Za-z]*[ ]?[A-Za-z]*/;
  var numberValidator = /^(0|[1-9]\d*)$/;
  var linkValidator = /^(http|https)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;
  var textValidator = /[A-Za-z]{2}[A-Za-z]*[ ]?[A-Za-z]*/;

  function valid(el) {
    el.parentElement.querySelectorAll(".valid")[0].classList.remove("disabled");
    el.parentElement.querySelectorAll(".invalid")[0].classList.add("disabled");
  }
  
  function invalid(el) {
    el.parentElement.querySelectorAll(".valid")[0].classList.add("disabled");
    el.parentElement.querySelectorAll(".invalid")[0].classList.remove("disabled");
  }
  
  function unfilled(el) {
    el.parentElement.querySelectorAll("em")[0].classList.remove("disabled");
    el.parentElement.querySelectorAll(".valid")[0].classList.add("disabled");
    el.parentElement.querySelectorAll(".invalid")[0].classList.add("disabled");
  }

  // Regular field handling
  var regularField = document.querySelectorAll('.input-style input:not([type="date"])');
  regularField.forEach((el) =>
    el.addEventListener("keyup", (e) => {
      if (!el.value == "") {
        el.parentElement.classList.add("input-style-active");
        el.parentElement.querySelector("em").classList.add("disabled");
      } else {
        el.parentElement.querySelectorAll(".valid")[0].classList.add("disabled");
        el.parentElement.querySelectorAll(".invalid")[0].classList.add("disabled");
        el.parentElement.classList.remove("input-style-active");
        el.parentElement.querySelector("em").classList.remove("disabled");
      }
    })
  );

  // Validation field handling
  var validateField = document.querySelectorAll(".validate-field input, .validator-field textarea");
  if (validateField.length) {
    validateField.forEach((el) =>
      el.addEventListener("keyup", (e) => {
        var getAttribute = el.getAttribute("type");
        switch (getAttribute) {
          case "name":
            nameValidator.test(el.value) ? valid(el) : invalid(el);
            break;
          case "number":
            numberValidator.test(el.value) ? valid(el) : invalid(el);
            break;
          case "email":
            mailValidator.test(el.value) ? valid(el) : invalid(el);
            break;
          case "text":
            textValidator.test(el.value) ? valid(el) : invalid(el);
            break;
          case "url":
            linkValidator.test(el.value) ? valid(el) : invalid(el);
            break;
          case "tel":
            phoneValidator.test(el.value) ? valid(el) : invalid(el);
            break;
          case "password":
            passwordValidator.test(el.value) ? valid(el) : invalid(el);
            break;
        }
        if (el.value === "") {
          unfilled(el);
        }
      })
    );
  }
}

function initCardExtender() {
  const cards = document.getElementsByClassName("card");
  
  function card_extender() {
    var headerHeight, footerHeight, headerOnPage;
    var headerOnPage = document.querySelectorAll(".header:not(.header-transparent)")[0];
    var footerOnPage = document.querySelectorAll("#footer-bar")[0];

    headerOnPage
      ? (headerHeight = document.querySelectorAll(".header")[0].offsetHeight)
      : (headerHeight = 0);
    footerOnPage
      ? (footerHeight = document.querySelectorAll("#footer-bar")[0].offsetHeight)
      : (footerHeight = 0);

    for (let i = 0; i < cards.length; i++) {
      if (cards[i].getAttribute("data-card-height") === "cover") {
        if (window.matchMedia("(display-mode: fullscreen)").matches) {
          var windowHeight = window.outerHeight;
        }
        if (!window.matchMedia("(display-mode: fullscreen)").matches) {
          var windowHeight = window.innerHeight;
        }
        var coverHeight = windowHeight + "px";
      }
      if (cards[i].hasAttribute("data-card-height")) {
        var getHeight = cards[i].getAttribute("data-card-height");
        cards[i].style.height = getHeight + "px";
        if (getHeight === "cover") {
          var totalHeight = getHeight;
          cards[i].style.height = coverHeight;
        }
      }
    }
  }

  if (cards.length) {
    card_extender();
    window.addEventListener("resize", card_extender);
  }
}

function initGlobalUtilities() {
  // Don't jump on Empty Links
  const emptyHref = document.querySelectorAll('a[href="#"]');
  emptyHref.forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      return false;
    })
  );

  // Back Button
  const backButton = document.querySelectorAll("[data-back-button]");
  if (backButton.length) {
    backButton.forEach((el) =>
      el.addEventListener("click", (e) => {
        e.stopPropagation;
        e.preventDefault;
        window.history.go(-1);
      })
    );
  }

  // Back to Top
  const backToTop = document.querySelectorAll(".back-to-top-icon, .back-to-top-badge, .back-to-top");
  if (backToTop.length) {
    backToTop.forEach((el) =>
      el.addEventListener("click", (e) => {
        window.scrollTo({ top: 0, behavior: `smooth` });
      })
    );
  }

  // Check iOS Version and add min-ios15 class if higher or equal to iOS15
  function iOSversion() {
    let d, v;
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
      v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
      d = {
        status: true,
        version: parseInt(v[1], 10),
        info: parseInt(v[1], 10) + "." + parseInt(v[2], 10) + "." + parseInt(v[3] || 0, 10),
      };
    } else {
      d = { status: false, version: false, info: "" };
    }
    return d;
  }
  let iosVer = iOSversion();
  if (iosVer.version > 14) {
    document.querySelectorAll("#page")[0].classList.add("min-ios15");
  }
}

// Global utility function for extending menu functionality
window.menu = function(menuName, menuFunction, menuTimeout) {
  setTimeout(function () {
    if (menuFunction === "show") {
      return (
        document.getElementById(menuName).classList.add("menu-active"),
        document.querySelectorAll(".menu-hider")[0].classList.add("menu-active")
      );
    } else {
      return (
        document.getElementById(menuName).classList.remove("menu-active"),
        document.querySelectorAll(".menu-hider")[0].classList.remove("menu-active")
      );
    }
  }, menuTimeout);
};
