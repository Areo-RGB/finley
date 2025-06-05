# Issues Found in scripts/custom.js

This document lists glaring issues found during the review of `scripts/custom.js`.

1.  **Unintentionally Global Variables:**
    *   Variables `pwaName`, `pwaRemind`, `pwaNoCache`, `pwaScope`, `pwaLocation` are declared in the `DOMContentLoaded` scope without `var`, `let`, or `const`, potentially leading to unintended global-like behavior within this scope or conflicts if not managed carefully.
    *   Inside `init_template()`, variables `i, e, el` are declared without `var`, `let`, or `const` (e.g., `var i, e, el;`), which would make them global if `init_template` were called from the global scope. However, as `init_template` is called within the `DOMContentLoaded` listener, they are scoped to that listener if not declared, or function-scoped if declared with `var`. The comment `//https://www.w3schools.com/js/js_performance.asp` next to it suggests an attempt at performance optimization by reducing scope lookups, but modern JS engines are quite optimized, and clarity might be preferred.

2.  **Repeated DOM Queries:**
    *   `document.getElementsByClassName("menu-hider")[0]` is accessed multiple times throughout the script. Caching this element after its first retrieval would be more performant.
    *   `document.querySelectorAll(".header, #footer-bar, .page-content")` (for `wrappers`) is queried, and then its results are looped through multiple times in the menu opening/closing logic.
    *   Validation helper functions (`valid`, `invalid`, `unfilled`) repeatedly query `el.parentElement.querySelectorAll(...)`. These elements could be queried once and reused.
    *   `localStorage.getItem(pwaName + "-Highlight")` and `localStorage.getItem(pwaName + "-Theme")` are called multiple times in different sections (e.g., highlight loading, dark mode logic). Values could be read once and stored in a variable.
    *   Multiple calls to `document.getElementById(menuData)` and `menu.getAttribute(...)` within menu interaction logic.

3.  **Overly Complex Function (`init_template`)**:
    *   The `init_template()` function is excessively long (over 1000 lines) and responsible for a wide range of unrelated functionalities including UI interactions (menus, sliders, accordions, toasts), form validation, theme management (dark mode, highlights), PWA initialization, event handling for various elements, and more.
    *   This monolithic structure severely impacts readability, maintainability, and debuggability. It should be broken down into smaller, more focused modules or functions.

4.  **Inconsistent Naming Conventions:**
    *   Mixture of camelCase (e.g., `pwaName`, `isPWA`, `cardExtender`) and snake_case (e.g., `init_template`, `check_visited_links`, `splide_slider`) for function and variable names.
    *   CSS class names used in JavaScript are hyphenated (e.g., `menu-hider`, `menu-active`), which is standard for CSS, but consistency in how these are stored or referred to in JS variables could be improved.

5.  **Potential Race Conditions/Timing Issues:**
    *   Preloader removal uses `setTimeout(..., 150)`. The optimal timing can vary based on loading speed.
    *   Menu hider logic uses `setTimeout(..., 50)`.
    *   PWA installation prompts use `setTimeout(..., 3500)`.
    *   Such fixed delays can lead to UI glitches or prompts appearing at suboptimal times if content loads faster or slower than anticipated. Callbacks or event-driven approaches are generally more robust.

6.  **Lack of Robust Error Handling:**
    *   **QR Code Generation:** Relies on the external `api.qrserver.com` without explicit error handling for API downtime, network issues, or invalid responses.
    *   **Geolocation:** The `geoLocate` function has an `error` callback, but it only updates the text content of an element. It doesn't provide fallback mechanisms or more user-friendly error messages for different error types (e.g., permission denied, unavailable).
    *   **Contact Form AJAX:** The `xhr.onloadend` callback checks for `response.target.status === 200` but only logs "Form Submitted" to the console. It doesn't handle other HTTP status codes (e.g., 4xx, 5xx errors) with user-facing messages or retry mechanisms.

7.  **Commented-Out Code:**
    *   The "Tooltips" section related to `popper.min.js v2` is entirely commented out with a note "Deprecated feature for Mobiles." If this feature is no longer used or supported, the code and related comments should be removed to reduce clutter. If it's conditionally used, the conditions should be clear.

8.  **Redeclaration of `window.cacheManager`:**
    *   `window.cacheManager` is defined twice. First, a version is defined inside `init_template`. Later, at the end of the `DOMContentLoaded` event listener, `window.cacheManager` is redefined with a slightly different implementation (e.g., different `getStorageInfo`, addition of `listCachedFiles`, and an `setInterval` for logging). This will cause the first definition to be overwritten, and any calls to its specific methods before the overwrite might not behave as expected by the second definition. The `setInterval` in the second definition will continuously log, while the first one logs only once after 2 seconds if `isPWA` is true. This needs to be consolidated.

9.  **`"use strict";` Scope:**
    *   `"use strict";` is declared within the `DOMContentLoaded` callback. This is good practice. However, the initial preloader `setTimeout` function is defined outside this callback and thus operates in non-strict mode. For consistency, all script code should ideally be within strict mode.

10. **Performance in Loops and Event Listeners:**
    *   In `setColorScheme()`, event listeners are added to `window.matchMedia` objects (`addListener`). If `setColorScheme` is called multiple times, new listeners might be added without removing old ones, leading to potential multiple executions of dark/light mode activation.
    *   The text resizer (`.text-size-changer`) queries `querySelectorAll("*")` and iterates through all descendant elements to change font sizes. For complex DOM structures, this can be inefficient. More targeted selectors or optimized approaches might be better.

11. **Security - Potential `innerHTML` Risks:**
    *   `innerHTML` is used in several places (e.g., `upload-file-name`, `location-coordinates`, `generate-qr-result`). While the script is client-side, if any data being inserted via `innerHTML` could originate from untrusted sources (e.g., user input that isn't properly sanitized elsewhere, though less direct here), it could pose an XSS risk. For the QR code, the URL from an input field is directly used in `<img>` src and as text content; while browsers have some protections for `<img> src`, this pattern should be handled with care. Using `textContent` for text and carefully constructing elements is generally safer.

12. **Magic Numbers and Strings:**
    *   Numerous string literals like `'menu-active'`, `'disabled'`, `'disabled-search-list'`, highlight names (e.g., `'highlight_blue'`), theme names (`'theme-dark'`), local storage keys (e.g., `pwaName + "-Highlight"`) are used directly in the code.
    *   Using named constants for these would improve readability and make future maintenance (e.g., changing a class name) much easier and less error-prone.

13. **Console Logs in Production Code:**
    *   The script contains many `console.log()` and `console.info()` statements (e.g., PWA status, cache manager logs, "Form Submitted", "Connection: Online/Offline"). These are useful for debugging but should generally be removed or conditionally disabled in a production version of the script to avoid cluttering the console for end-users.

14. **`window.history.go(-1)` for Back Button:**
    *   The back button functionality uses `e.preventDefault; e.stopPropagation; window.history.go(-1);`. Note that `e.preventDefault` and `e.stopPropagation` are functions and should be called as `e.preventDefault();` and `e.stopPropagation();`.
    *   Using `window.history.go(-1)` can sometimes be unreliable if the user's history is not what's expected (e.g., if they landed on the page directly).

15. **Plugin Loading Logic Concerns:**
    *   The dynamic plugin loading system appends script and style tags to the document. While this allows for on-demand loading, it can make dependency management complex.
    *   There's minimal error handling for script loading failures (e.g., if a plugin file is not found or fails to execute).
    *   The order of script execution can sometimes be an issue with dynamic loading if plugins have dependencies on each other or on parts of the main script that might not be fully initialized.

16. **Global Variables for PWA Configuration:**
    *   Variables like `isPWA`, `isAJAX`, `pwaName`, `pwaRemind`, `pwaNoCache`, `pwaScope`, `pwaLocation` are defined at the top of the `DOMContentLoaded` callback. While scoped to this callback, they function as global configuration for the script. Managing these as part of a configuration object might be cleaner.
