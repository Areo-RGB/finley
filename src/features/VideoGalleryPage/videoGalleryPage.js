// VideoGalleryPage Feature Module
// Handles video card interactions, swipe functionality, and video playback
// Extracted from custom.js video-related functionality

export function initVideoGalleryPage() {
  console.log("🎬 Initializing VideoGalleryPage Feature...");

  initSwipeCards();
  initVideoPlayback();
  initVideoCardHover();

  console.log("✅ VideoGalleryPage Feature initialized");
}

function initSwipeCards() {
  console.log("👆 Initializing Swipe Cards");

  const swipeContainers = document.querySelectorAll('.swipe-card-container');
  
  swipeContainers.forEach((container, containerIndex) => {
    const cards = container.querySelectorAll('.swipe-card');
    const indicators = container.querySelectorAll('.indicator');
    let currentCard = 0;
    let startX = 0;
    let startY = 0;

    function showCard(index) {
      if (index < 0 || index >= cards.length) return;

      // Hide all cards
      cards.forEach((card, i) => {
        card.classList.remove('active');
        card.style.display = i === index ? 'block' : 'none';
      });

      // Update indicators
      indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
        indicator.style.background = i === index 
          ? 'rgba(255, 255, 255, 0.8)' 
          : 'rgba(255, 255, 255, 0.3)';
      });

      // Show current card
      if (cards[index]) {
        cards[index].classList.add('active');
        cards[index].style.display = 'block';
      }

      currentCard = index;
    }

    // Touch events for swiping
    container.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    container.addEventListener('touchend', function(e) {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Only handle horizontal swipes
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
        if (diffX > 0) { // Swiped left
          showCard((currentCard + 1) % cards.length);
        } else { // Swiped right
          showCard((currentCard - 1 + cards.length) % cards.length);
        }
      }
    });

    // Mouse events for desktop
    let isMouseDown = false;
    let mouseStartX = 0;

    container.addEventListener('mousedown', function(e) {
      isMouseDown = true;
      mouseStartX = e.clientX;
      e.preventDefault();
    });

    container.addEventListener('mouseup', function(e) {
      if (!isMouseDown) return;
      isMouseDown = false;

      const diffX = mouseStartX - e.clientX;
      if (Math.abs(diffX) > 50) { // Minimum drag distance
        if (diffX > 0) { // Dragged left
          showCard((currentCard + 1) % cards.length);
        } else { // Dragged right
          showCard((currentCard - 1 + cards.length) % cards.length);
        }
      }
    });

    container.addEventListener('mouseleave', function() {
      isMouseDown = false;
    });

    // Indicator click events
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        showCard(index);
      });
    });

    // Initialize first card
    if (cards.length > 0) {
      showCard(0);
    }
  });
}

function initVideoPlayback() {
  console.log("▶️ Initializing Video Playback");

  // Handle video background hover/play
  const videoCards = document.querySelectorAll('.video-card-container');
  
  videoCards.forEach(card => {
    const video = card.querySelector('.card-video-bg');
    if (!video) return;

    // Play video on hover (desktop)
    card.addEventListener('mouseenter', () => {
      video.play().catch(e => console.warn('Video play failed:', e));
    });

    // Pause video when not hovering (desktop)
    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });

    // Handle touch events for mobile
    card.addEventListener('touchstart', () => {
      video.play().catch(e => console.warn('Video play failed:', e));
    });
  });

  // Handle "Play Now" button clicks
  const playButtons = document.querySelectorAll('.play-now-btn');
  
  playButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      const videoSrc = button.getAttribute('data-video-src');
      if (videoSrc) {
        // Create and show video modal/lightbox
        showVideoModal(videoSrc);
      }
    });
  });
}

function showVideoModal(videoSrc) {
  // Create modal overlay
  const modal = document.createElement('div');
  modal.className = 'video-modal-overlay';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;

  // Create video container
  const videoContainer = document.createElement('div');
  videoContainer.style.cssText = `
    position: relative;
    width: 100%;
    max-width: 800px;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
  `;

  // Create video element
  const video = document.createElement('video');
  video.style.cssText = `
    width: 100%;
    height: auto;
  `;
  video.controls = true;
  video.autoplay = true;
  video.src = videoSrc;

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '×';
  closeButton.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    z-index: 10000;
  `;

  // Close modal function
  const closeModal = () => {
    video.pause();
    document.body.removeChild(modal);
  };

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Escape key to close
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  // Assemble modal
  videoContainer.appendChild(video);
  videoContainer.appendChild(closeButton);
  modal.appendChild(videoContainer);
  document.body.appendChild(modal);
}

function initVideoCardHover() {
  console.log("🎯 Initializing Video Card Hover Effects");

  // Card scale effects
  const cardScale = document.querySelectorAll(".card-scale");
  if (cardScale.length) {
    cardScale.forEach((el) => {
      el.addEventListener("mouseenter", (event) => {
        const img = el.querySelector("img");
        if (img) img.classList.add("card-scale-image");
      });
      
      el.addEventListener("mouseleave", (event) => {
        const img = el.querySelector("img");
        if (img) img.classList.remove("card-scale-image");
      });
    });
  }

  // Card hide effects
  const cardHide = document.querySelectorAll(".card-hide");
  if (cardHide.length) {
    cardHide.forEach((el) => {
      el.addEventListener("mouseenter", (event) => {
        const overlay = el.querySelector(".card-center, .card-bottom, .card-top, .card-overlay");
        if (overlay) overlay.classList.add("card-hide-image");
      });
      
      el.addEventListener("mouseleave", (event) => {
        const overlay = el.querySelector(".card-center, .card-bottom, .card-top, .card-overlay");
        if (overlay) overlay.classList.remove("card-hide-image");
      });
    });
  }

  // Card rotate effects
  const cardRotate = document.querySelectorAll(".card-rotate");
  if (cardRotate.length) {
    cardRotate.forEach((el) => {
      el.addEventListener("mouseenter", (event) => {
        const img = el.querySelector("img");
        if (img) img.classList.add("card-rotate-image");
      });
      
      el.addEventListener("mouseleave", (event) => {
        const img = el.querySelector("img");
        if (img) img.classList.remove("card-rotate-image");
      });
    });
  }

  // Card grayscale effects
  const cardGray = document.querySelectorAll(".card-grayscale");
  if (cardGray.length) {
    cardGray.forEach((el) => {
      el.addEventListener("mouseenter", (event) => {
        const img = el.querySelector("img");
        if (img) img.classList.add("card-grayscale-image");
      });
      
      el.addEventListener("mouseleave", (event) => {
        const img = el.querySelector("img");
        if (img) img.classList.remove("card-grayscale-image");
      });
    });
  }

  // Card blur effects
  const cardBlur = document.querySelectorAll(".card-blur");
  if (cardBlur.length) {
    cardBlur.forEach((el) => {
      el.addEventListener("mouseenter", (event) => {
        const img = el.querySelector("img");
        if (img) img.classList.add("card-blur-image");
      });
      
      el.addEventListener("mouseleave", (event) => {
        const img = el.querySelector("img");
        if (img) img.classList.remove("card-blur-image");
      });
    });
  }
}

// Export individual functions for testing
export { initSwipeCards, initVideoPlayback, initVideoCardHover, showVideoModal };
