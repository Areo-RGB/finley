// FooterBar Component
// Bottom navigation bar with active state management and smooth transitions

export function initFooterBar() {
  console.log("📱 Initializing FooterBar Component...");

  initActiveNavigation();
  initNavigationTransitions();
  initFooterBarBehavior();

  console.log("✅ FooterBar Component initialized");
}

function initActiveNavigation() {
  const footerBar = document.getElementById("footer-bar");
  const navLinks = footerBar?.querySelectorAll("a");
  
  if (!footerBar || !navLinks.length) {
    console.warn("FooterBar elements not found");
    return;
  }

  // Set active navigation based on current page
  function setActiveNavigation() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Remove all active states
    navLinks.forEach(link => {
      link.classList.remove("active-nav");
    });

    // Set active state based on current page
    navLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (href) {
        const linkPage = href.split('/').pop();
        
        // Check for exact match or home page variants
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === '') ||
            (currentPage === '/' && linkPage === 'index.html')) {
          link.classList.add("active-nav");
          console.log(`🎯 Active navigation set for: ${linkPage}`);
        }
      }
    });
  }

  // Handle navigation clicks
  navLinks.forEach(link => {
    link.addEventListener("click", function(e) {
      const href = this.getAttribute("href");
      
      // Skip if it's a menu trigger or external link
      if (this.hasAttribute("data-menu") || href?.startsWith("#")) {
        return;
      }

      // Add loading state
      this.style.opacity = "0.6";
      
      // Remove active from all, add to clicked
      navLinks.forEach(l => l.classList.remove("active-nav"));
      this.classList.add("active-nav");
      
      console.log(`🔗 Navigation clicked: ${href}`);
    });
  });

  // Set initial active state
  setActiveNavigation();

  // Update active state when page changes (for SPA navigation)
  window.addEventListener("popstate", setActiveNavigation);

  console.log(`✅ Active navigation initialized (${navLinks.length} links)`);
}

function initNavigationTransitions() {
  const footerBar = document.getElementById("footer-bar");
  const navLinks = footerBar?.querySelectorAll("a");
  
  if (!navLinks.length) return;

  navLinks.forEach(link => {
    // Add touch feedback
    link.addEventListener("touchstart", function() {
      this.style.transform = "scale(0.95)";
      this.style.transition = "transform 0.1s ease";
    });

    link.addEventListener("touchend", function() {
      this.style.transform = "scale(1)";
      setTimeout(() => {
        this.style.transition = "";
      }, 100);
    });

    link.addEventListener("touchcancel", function() {
      this.style.transform = "scale(1)";
      this.style.transition = "";
    });

    // Add hover effects for desktop
    link.addEventListener("mouseenter", function() {
      if (!this.classList.contains("active-nav")) {
        this.style.transform = "translateY(-2px)";
      }
    });

    link.addEventListener("mouseleave", function() {
      this.style.transform = "translateY(0)";
    });

    // Add ripple effect on click
    link.addEventListener("click", function(e) {
      createRippleEffect(this, e);
    });
  });

  console.log("✅ Navigation transitions initialized");
}

function initFooterBarBehavior() {
  const footerBar = document.getElementById("footer-bar");
  
  if (!footerBar) return;

  // Hide footer bar when scrolling down, show when scrolling up
  let lastScrollTop = 0;
  let isScrolling = false;
  let scrollTimeout;

  function handleScroll() {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDirection = scrollTop > lastScrollTop ? "down" : "up";
        const scrollDistance = Math.abs(scrollTop - lastScrollTop);

        // Only hide/show if scrolled a significant distance
        if (scrollDistance > 5) {
          if (scrollDirection === "down" && scrollTop > 100) {
            // Scrolling down - hide footer bar
            footerBar.style.transform = "translateY(100%)";
          } else if (scrollDirection === "up" || scrollTop <= 100) {
            // Scrolling up or near top - show footer bar
            footerBar.style.transform = "translateY(0)";
          }
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        isScrolling = false;
      });
    }
    isScrolling = true;

    // Always show footer bar when scrolling stops
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      footerBar.style.transform = "translateY(0)";
    }, 150);
  }

  // Add scroll listener with throttling
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Show footer bar on page load
  footerBar.style.transform = "translateY(0)";

  console.log("✅ FooterBar behavior initialized");
}

function createRippleEffect(element, event) {
  const ripple = document.createElement("span");
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s ease-out;
    pointer-events: none;
    z-index: 1;
  `;

  // Add ripple animation keyframes if not already added
  if (!document.querySelector("#ripple-styles")) {
    const style = document.createElement("style");
    style.id = "ripple-styles";
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  element.style.position = "relative";
  element.style.overflow = "hidden";
  element.appendChild(ripple);

  // Remove ripple after animation
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// FooterBar utility functions
export const FooterBarUtils = {
  // Programmatically set active navigation
  setActiveNav: (href) => {
    const footerBar = document.getElementById("footer-bar");
    const navLinks = footerBar?.querySelectorAll("a");
    
    if (!navLinks) return;

    navLinks.forEach(link => {
      link.classList.remove("active-nav");
      if (link.getAttribute("href") === href) {
        link.classList.add("active-nav");
      }
    });
  },

  // Show footer bar
  show: () => {
    const footerBar = document.getElementById("footer-bar");
    if (footerBar) {
      footerBar.style.transform = "translateY(0)";
    }
  },

  // Hide footer bar
  hide: () => {
    const footerBar = document.getElementById("footer-bar");
    if (footerBar) {
      footerBar.style.transform = "translateY(100%)";
    }
  },

  // Toggle footer bar visibility
  toggle: () => {
    const footerBar = document.getElementById("footer-bar");
    if (footerBar) {
      const isHidden = footerBar.style.transform === "translateY(100%)";
      footerBar.style.transform = isHidden ? "translateY(0)" : "translateY(100%)";
    }
  },

  // Get current active navigation
  getActiveNav: () => {
    const activeLink = document.querySelector("#footer-bar .active-nav");
    return activeLink?.getAttribute("href") || null;
  },

  // Add notification badge to navigation item
  addBadge: (href, count = null) => {
    const footerBar = document.getElementById("footer-bar");
    const link = footerBar?.querySelector(`a[href="${href}"]`);
    
    if (!link) return;

    // Remove existing badge
    const existingBadge = link.querySelector(".nav-badge");
    if (existingBadge) {
      existingBadge.remove();
    }

    // Create new badge
    const badge = document.createElement("span");
    badge.className = "nav-badge";
    badge.style.cssText = `
      position: absolute;
      top: 8px;
      right: 12px;
      width: 8px;
      height: 8px;
      background: #dc3545;
      border-radius: 50%;
      border: 2px solid var(--footer-bg, #1b1d21);
    `;

    if (count !== null) {
      badge.textContent = count > 99 ? "99+" : count.toString();
      badge.style.cssText += `
        width: auto;
        height: 16px;
        min-width: 16px;
        padding: 0 4px;
        font-size: 0.6rem;
        font-weight: 600;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
      `;
    }

    link.style.position = "relative";
    link.appendChild(badge);
  },

  // Remove notification badge
  removeBadge: (href) => {
    const footerBar = document.getElementById("footer-bar");
    const link = footerBar?.querySelector(`a[href="${href}"]`);
    const badge = link?.querySelector(".nav-badge");
    
    if (badge) {
      badge.remove();
    }
  }
};

// Export individual functions for testing
export { initActiveNavigation, initNavigationTransitions, initFooterBarBehavior };
