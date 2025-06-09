// ComparisonPage Feature Module
// Handles before-after slider, video comparison controls, and synchronization
// Extracted from plugins/before-after/before-after.js and page-Vergleich.html

export function initComparisonPage() {
  console.log("⚖️ Initializing ComparisonPage Feature...");

  initBeforeAfterSlider();
  initVideoControls();
  initSpeedControls();

  console.log("✅ ComparisonPage Feature initialized");
}

function initBeforeAfterSlider() {
  console.log("🔄 Initializing Before-After Slider");

  const sliderBA = document.getElementById("before-after-slider");
  const beforeBA = document.getElementById("before-image");
  const afterBA = document.getElementById("after-image");
  const resizerBA = document.getElementById("resizer");

  if (!sliderBA || !beforeBA || !afterBA || !resizerBA) {
    console.warn("Before-after slider elements not found");
    return;
  }

  const beforeMediaBA = beforeBA.getElementsByTagName("img")[0] || beforeBA.getElementsByTagName("video")[0];
  const afterMediaBA = afterBA.getElementsByTagName("img")[0] || afterBA.getElementsByTagName("video")[0];
  
  let activeBA = false;

  function activateSlider() {
    activeBA = true;
    resizerBA.classList.add("resize");
  }

  function deactivateSlider() {
    activeBA = false;
    resizerBA.classList.remove("resize");
  }

  function slideIt(x) {
    const transform = Math.max(0, Math.min(x, sliderBA.offsetWidth));
    beforeBA.style.width = transform + "px";
    resizerBA.style.left = transform + "px";
  }

  function pauseEvent(e) {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
  }

  // Set initial width for overflow handling
  function updateMediaWidth() {
    const width = sliderBA.offsetWidth;
    if (beforeMediaBA) beforeMediaBA.style.width = width + "px";
  }

  // Mouse events
  resizerBA.addEventListener("mousedown", activateSlider);
  document.body.addEventListener("mouseup", deactivateSlider);
  document.body.addEventListener("mouseleave", deactivateSlider);

  // Touch events
  resizerBA.addEventListener("touchstart", activateSlider);
  document.body.addEventListener("touchend", deactivateSlider);
  document.body.addEventListener("touchcancel", deactivateSlider);

  // Drag events
  document.body.addEventListener("mousemove", function(e) {
    if (!activeBA) return;
    const x = e.pageX - sliderBA.getBoundingClientRect().left;
    slideIt(x);
    pauseEvent(e);
  });

  document.body.addEventListener("touchmove", function(e) {
    if (!activeBA) return;
    let x;
    for (let i = 0; i < e.changedTouches.length; i++) {
      x = e.changedTouches[i].pageX;
    }
    x -= sliderBA.getBoundingClientRect().left;
    slideIt(x);
    pauseEvent(e);
  });

  // Handle window resize
  window.addEventListener("resize", updateMediaWidth);

  // Initialize
  updateMediaWidth();
  
  // Set initial position to center
  setTimeout(() => {
    slideIt(sliderBA.offsetWidth / 2);
  }, 100);

  console.log("✅ Before-after slider initialized");
}

function initVideoControls() {
  console.log("🎬 Initializing Video Controls");

  const beforeVideo = document.querySelector("#before-image video");
  const afterVideo = document.querySelector("#after-image video");
  const beforeControl = document.getElementById("before-video-control");
  const afterControl = document.getElementById("after-video-control");

  if (!beforeVideo || !afterVideo) {
    console.warn("Comparison videos not found");
    return;
  }

  function updateButtonText(button, video, beforeText, afterText) {
    if (!button) return;
    
    if (video.paused) {
      button.innerHTML = `<i class="fa fa-play me-2"></i>${beforeText}`;
    } else {
      button.innerHTML = `<i class="fa fa-pause me-2"></i>${afterText}`;
    }
  }

  function toggleVideo(video, button, playText, pauseText) {
    if (video.paused) {
      video.play().then(() => {
        updateButtonText(button, video, playText, pauseText);
        console.log(`▶️ ${playText} video started`);
      }).catch(err => {
        console.warn("Video play failed:", err);
      });
    } else {
      video.pause();
      updateButtonText(button, video, playText, pauseText);
      console.log(`⏸️ ${playText} video paused`);
    }
  }

  // Before video control
  if (beforeControl) {
    beforeControl.addEventListener("click", function() {
      toggleVideo(beforeVideo, beforeControl, "Play Bent", "Pause Bent");
    });

    beforeVideo.addEventListener("ended", function() {
      updateButtonText(beforeControl, beforeVideo, "Play Bent", "Pause Bent");
    });
  }

  // After video control
  if (afterControl) {
    afterControl.addEventListener("click", function() {
      toggleVideo(afterVideo, afterControl, "Play Finley", "Pause Finley");
    });

    afterVideo.addEventListener("ended", function() {
      updateButtonText(afterControl, afterVideo, "Play Finley", "Pause Finley");
    });
  }

  // Initialize button states
  updateButtonText(beforeControl, beforeVideo, "Play Bent", "Pause Bent");
  updateButtonText(afterControl, afterVideo, "Play Finley", "Pause Finley");

  console.log("✅ Video controls initialized");
}

function initSpeedControls() {
  console.log("⚡ Initializing Speed Controls");

  const beforeVideo = document.querySelector("#before-image video");
  const afterVideo = document.querySelector("#after-image video");
  const speed025Btn = document.getElementById("speed-025");
  const speed05Btn = document.getElementById("speed-05");
  const speed1Btn = document.getElementById("speed-1");
  const syncBtn = document.getElementById("sync-videos");

  if (!beforeVideo || !afterVideo) {
    console.warn("Videos not found for speed controls");
    return;
  }

  let currentSpeed = 1.0;

  function setPlaybackSpeed(speed) {
    currentSpeed = speed;
    beforeVideo.playbackRate = speed;
    afterVideo.playbackRate = speed;

    // Update button states
    document.querySelectorAll('[id^="speed-"]').forEach((btn) => {
      btn.classList.remove("active-speed", "bg-green-dark");
      btn.classList.add("bg-gray-dark");
    });

    // Activate current speed button
    const speedId = speed.toString().replace(".", "");
    const activeBtn = document.getElementById(`speed-${speedId}`);
    if (activeBtn) {
      activeBtn.classList.add("active-speed", "bg-green-dark");
      activeBtn.classList.remove("bg-gray-dark");
    }

    console.log(`⚡ Playback speed set to ${speed}x`);
  }

  function syncVideos() {
    if (beforeVideo && afterVideo) {
      // Calculate average time position
      const avgTime = (beforeVideo.currentTime + afterVideo.currentTime) / 2;
      
      // Set both videos to the average time
      beforeVideo.currentTime = avgTime;
      afterVideo.currentTime = avgTime;
      
      console.log(`🔄 Videos synchronized to ${avgTime.toFixed(2)}s`);
      
      // Visual feedback
      if (syncBtn) {
        const originalText = syncBtn.innerHTML;
        syncBtn.innerHTML = '<i class="fa fa-check me-1"></i>Synced';
        syncBtn.classList.add("bg-green-dark");
        syncBtn.classList.remove("bg-red-dark");
        
        setTimeout(() => {
          syncBtn.innerHTML = originalText;
          syncBtn.classList.remove("bg-green-dark");
          syncBtn.classList.add("bg-red-dark");
        }, 1500);
      }
    }
  }

  // Speed control event listeners
  if (speed025Btn) {
    speed025Btn.addEventListener("click", () => setPlaybackSpeed(0.25));
  }

  if (speed05Btn) {
    speed05Btn.addEventListener("click", () => setPlaybackSpeed(0.5));
  }

  if (speed1Btn) {
    speed1Btn.addEventListener("click", () => setPlaybackSpeed(1.0));
  }

  if (syncBtn) {
    syncBtn.addEventListener("click", syncVideos);
  }

  // Initialize with normal speed
  setPlaybackSpeed(1.0);

  // Auto-sync when videos are loaded
  const autoSyncOnLoad = () => {
    if (beforeVideo.readyState >= 2 && afterVideo.readyState >= 2) {
      syncVideos();
    }
  };

  beforeVideo.addEventListener("loadeddata", autoSyncOnLoad);
  afterVideo.addEventListener("loadeddata", autoSyncOnLoad);

  console.log("✅ Speed controls initialized");
}

// Advanced comparison features
export function initAdvancedComparison() {
  console.log("🔬 Initializing Advanced Comparison Features");

  const beforeVideo = document.querySelector("#before-image video");
  const afterVideo = document.querySelector("#after-image video");

  if (!beforeVideo || !afterVideo) return;

  // Synchronized playback
  function createSyncedPlayback() {
    let syncInterval;

    function startSync() {
      syncInterval = setInterval(() => {
        if (!beforeVideo.paused && !afterVideo.paused) {
          const timeDiff = Math.abs(beforeVideo.currentTime - afterVideo.currentTime);
          if (timeDiff > 0.1) { // 100ms tolerance
            const avgTime = (beforeVideo.currentTime + afterVideo.currentTime) / 2;
            beforeVideo.currentTime = avgTime;
            afterVideo.currentTime = avgTime;
          }
        }
      }, 100);
    }

    function stopSync() {
      if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
      }
    }

    // Start sync when both videos play
    beforeVideo.addEventListener("play", () => {
      if (!afterVideo.paused) startSync();
    });

    afterVideo.addEventListener("play", () => {
      if (!beforeVideo.paused) startSync();
    });

    // Stop sync when either video pauses
    beforeVideo.addEventListener("pause", stopSync);
    afterVideo.addEventListener("pause", stopSync);
    beforeVideo.addEventListener("ended", stopSync);
    afterVideo.addEventListener("ended", stopSync);
  }

  // Loop both videos together
  function createLoopedPlayback() {
    function restartBoth() {
      beforeVideo.currentTime = 0;
      afterVideo.currentTime = 0;
      beforeVideo.play();
      afterVideo.play();
    }

    beforeVideo.addEventListener("ended", () => {
      if (afterVideo.loop) restartBoth();
    });

    afterVideo.addEventListener("ended", () => {
      if (beforeVideo.loop) restartBoth();
    });
  }

  createSyncedPlayback();
  createLoopedPlayback();

  // Export utility functions
  window.ComparisonUtils = {
    syncVideos: () => {
      const avgTime = (beforeVideo.currentTime + afterVideo.currentTime) / 2;
      beforeVideo.currentTime = avgTime;
      afterVideo.currentTime = avgTime;
    },
    
    setSpeed: (speed) => {
      beforeVideo.playbackRate = speed;
      afterVideo.playbackRate = speed;
    },
    
    playBoth: () => {
      beforeVideo.play();
      afterVideo.play();
    },
    
    pauseBoth: () => {
      beforeVideo.pause();
      afterVideo.pause();
    },
    
    getTimeDifference: () => {
      return Math.abs(beforeVideo.currentTime - afterVideo.currentTime);
    }
  };

  console.log("✅ Advanced comparison features initialized");
}

// Export individual functions for testing
export { initBeforeAfterSlider, initVideoControls, initSpeedControls };
