// ProfilePage Feature Module
// Handles workout timer, exercise selection, video player controls, and training session management
// Extracted from page-profile-finley.html inline JavaScript

export function initProfilePage() {
  console.log("🎯 Initializing ProfilePage Feature...");

  initWorkoutTimer();
  initVideoPlayer();
  initExerciseSelection();
  initWorkoutSettings();

  console.log("✅ ProfilePage Feature initialized");
}

// Workout configuration
let workoutConfig = {
  totalExercises: 6,
  timerDuration: 15, // seconds
  restDuration: 10,  // seconds
};

// Timer state
let timerSeconds = workoutConfig.timerDuration;
let timerInterval = null;
let isTimerRunning = false;
let currentExercise = 1;
let isRestPhase = false;
let restSeconds = workoutConfig.restDuration;

// Video player state
let currentSpeedIndex = 1; // Start with 1x speed
const speedOptions = [0.25, 0.5, 1, 1.5, 2];

function initWorkoutTimer() {
  console.log("⏱️ Initializing Workout Timer");

  const timerDisplay = document.getElementById("timer-display");
  const timerToggleBtn = document.getElementById("timer-toggle-btn");
  const timerToggleIcon = document.getElementById("timer-toggle-icon");
  const progressPercentageElement = document.getElementById("progress-percentage");
  const totalDurationDisplay = document.getElementById("total-duration-display");
  const exerciseCounterElement = document.querySelector("[data-exercise-counter]");

  if (!timerDisplay || !timerToggleBtn) {
    console.warn("Timer elements not found");
    return;
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    timerDisplay.textContent = timeString;
    timerDisplay.style.color = isRestPhase ? "#FFC107" : "white"; // Yellow for rest, white for exercise
    
    const timerLabel = timerDisplay.nextElementSibling;
    if (timerLabel) {
      timerLabel.textContent = isRestPhase ? "Rest Timer" : "Session Timer";
    }
  }

  function updateExerciseCounter() {
    if (exerciseCounterElement) {
      exerciseCounterElement.textContent = `${currentExercise}/${workoutConfig.totalExercises}`;
    }
  }

  function updateProgressPercentage() {
    if (progressPercentageElement) {
      const totalPhases = workoutConfig.totalExercises * 2; // Exercise + rest phases
      let completedPhases = (currentExercise - 1) * 2;
      
      if (!isRestPhase && timerSeconds < workoutConfig.timerDuration) {
        completedPhases += (workoutConfig.timerDuration - timerSeconds) / workoutConfig.timerDuration;
      } else if (isRestPhase) {
        completedPhases += 1 + (workoutConfig.restDuration - timerSeconds) / workoutConfig.restDuration;
      }
      
      const percentage = Math.min(100, Math.round((completedPhases / totalPhases) * 100));
      progressPercentageElement.textContent = `${percentage}%`;
    }
  }

  function updateTotalDuration() {
    if (totalDurationDisplay) {
      const totalSeconds = (workoutConfig.totalExercises * workoutConfig.timerDuration) + 
                          ((workoutConfig.totalExercises - 1) * workoutConfig.restDuration);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      totalDurationDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  function updateToggleButton() {
    if (timerToggleIcon) {
      timerToggleIcon.className = isTimerRunning ? "fa fa-pause" : "fa fa-play";
    }
  }

  function startTimer() {
    if (!isTimerRunning && timerSeconds > 0) {
      isTimerRunning = true;
      updateToggleButton();
      console.log(`⏱️ ${isRestPhase ? 'Rest' : 'Exercise'} timer started`);

      timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();
        updateProgressPercentage();

        if (timerSeconds <= 0) {
          clearInterval(timerInterval);
          isTimerRunning = false;
          updateToggleButton();

          if (!isRestPhase) {
            // Exercise phase completed
            console.log("💪 Exercise phase completed!");
            
            if (currentExercise < workoutConfig.totalExercises) {
              currentExercise++;
              updateExerciseCounter();
              console.log(`📈 Exercise completed! Now ${currentExercise}/${workoutConfig.totalExercises}`);
            }

            if (currentExercise <= workoutConfig.totalExercises) {
              // Start rest phase
              isRestPhase = true;
              timerSeconds = workoutConfig.restDuration;
              updateTimerDisplay();
              console.log(`😴 Rest phase started - ${workoutConfig.restDuration}s`);
              
              // Auto-start rest timer
              setTimeout(() => startTimer(), 500);
            } else {
              // Workout completed
              console.log("🎉 Workout completed!");
              completeWorkout();
            }
          } else {
            // Rest phase completed
            console.log("😌 Rest phase completed!");
            isRestPhase = false;
            timerSeconds = workoutConfig.timerDuration;
            updateTimerDisplay();
            updateProgressPercentage();
            console.log(`🏃‍♂️ Exercise phase ready - ${workoutConfig.timerDuration}s`);
          }
        }
      }, 1000);
    }
  }

  function pauseTimer() {
    if (isTimerRunning) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      updateToggleButton();
      console.log("⏸️ Timer paused");
    }
  }

  function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    isRestPhase = false;
    currentExercise = 1;
    timerSeconds = workoutConfig.timerDuration;
    updateTimerDisplay();
    updateExerciseCounter();
    updateProgressPercentage();
    updateToggleButton();
    console.log(`🔄 Timer reset to exercise phase - ${workoutConfig.timerDuration}s`);
  }

  function completeWorkout() {
    timerDisplay.style.color = "#4CAF50"; // Green for completion
    const timerLabel = timerDisplay.nextElementSibling;
    if (timerLabel) {
      timerLabel.textContent = "Workout Complete!";
    }

    // Reset after showing completion
    setTimeout(() => {
      resetTimer();
    }, 3000);
  }

  function toggleTimer() {
    if (isTimerRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }

  // Event listeners
  timerToggleBtn.addEventListener("click", toggleTimer);

  // Initialize displays
  updateTimerDisplay();
  updateExerciseCounter();
  updateProgressPercentage();
  updateTotalDuration();

  // Export timer functions for external access
  window.FinleyWorkout = {
    setProgress: function(exerciseNumber) {
      if (exerciseNumber >= 1 && exerciseNumber <= workoutConfig.totalExercises) {
        currentExercise = exerciseNumber;
        updateProgressPercentage();
        updateExerciseCounter();
        console.log(`📊 Progress manually set to exercise ${exerciseNumber}/${workoutConfig.totalExercises}`);
        return true;
      }
      return false;
    },
    getProgress: function() {
      return {
        currentExercise,
        totalExercises: workoutConfig.totalExercises,
        isRestPhase,
        timerSeconds,
        isTimerRunning
      };
    },
    getWorkoutConfig: function() {
      return { ...workoutConfig };
    },
    resetWorkout: function() {
      resetTimer();
      return this.getWorkoutConfig();
    }
  };
}

function initVideoPlayer() {
  console.log("🎬 Initializing Video Player");

  const mainVideo = document.getElementById("main-video");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const playPauseIcon = document.getElementById("play-pause-icon");
  const speedToggleBtn = document.getElementById("speed-toggle-btn");
  const speedDisplay = document.getElementById("speed-display");
  const videoFullscreenBtn = document.getElementById("video-fullscreen-btn");
  const fullscreenIcon = document.getElementById("fullscreen-icon");
  const customControls = document.querySelector(".custom-controls");

  if (!mainVideo) {
    console.warn("Main video element not found");
    return;
  }

  function updatePlayPauseButton() {
    if (playPauseIcon) {
      playPauseIcon.className = mainVideo.paused ? "fa fa-play" : "fa fa-pause";
    }
  }

  function updateSpeedDisplay() {
    const speed = speedOptions[currentSpeedIndex];
    if (speedDisplay) {
      speedDisplay.textContent = `${speed}x`;
    }
    mainVideo.playbackRate = speed;
    console.log(`🎬 Video speed set to ${speed}x`);
  }

  function toggleSpeed() {
    currentSpeedIndex = (currentSpeedIndex + 1) % speedOptions.length;
    updateSpeedDisplay();
  }

  function toggleVideoFullscreen() {
    if (!document.fullscreenElement) {
      mainVideo.requestFullscreen().catch(err => {
        console.warn("Fullscreen request failed:", err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  function updateFullscreenIcon() {
    if (fullscreenIcon) {
      fullscreenIcon.className = document.fullscreenElement ? "fa fa-compress" : "fa fa-expand";
    }
  }

  // Event listeners
  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", () => {
      if (mainVideo.paused) {
        mainVideo.play();
      } else {
        mainVideo.pause();
      }
    });
  }

  if (speedToggleBtn) {
    speedToggleBtn.addEventListener("click", toggleSpeed);
  }

  if (videoFullscreenBtn) {
    videoFullscreenBtn.addEventListener("click", toggleVideoFullscreen);
  }

  // Video event listeners
  mainVideo.addEventListener("play", updatePlayPauseButton);
  mainVideo.addEventListener("pause", updatePlayPauseButton);
  mainVideo.addEventListener("ended", updatePlayPauseButton);

  // Fullscreen change listener
  document.addEventListener("fullscreenchange", updateFullscreenIcon);

  // Hide controls when video is playing
  if (customControls) {
    mainVideo.addEventListener("play", () => {
      customControls.style.opacity = "0";
    });
    
    mainVideo.addEventListener("pause", () => {
      customControls.style.opacity = "1";
    });
  }

  // Initialize
  updatePlayPauseButton();
  updateSpeedDisplay();
  updateFullscreenIcon();
}

function initExerciseSelection() {
  console.log("🏃‍♂️ Initializing Exercise Selection");

  const mainVideo = document.getElementById("main-video");
  const videoTitle = document.getElementById("video-title");
  const exerciseCards = document.querySelectorAll(".exercise-card");

  if (!mainVideo || !exerciseCards.length) {
    console.warn("Exercise selection elements not found");
    return;
  }

  exerciseCards.forEach((card, index) => {
    card.addEventListener("click", function(e) {
      e.preventDefault();
      
      const videoNumber = this.getAttribute("data-video");
      const videoUrl = this.getAttribute("data-url");
      const exerciseTitle = `Übung ${videoNumber}`;

      console.log("Switching to:", { videoNumber, videoUrl, exerciseTitle });

      // Pause current video
      mainVideo.pause();

      // Update video source
      const source = mainVideo.querySelector("source");
      if (source) {
        source.src = videoUrl;
        mainVideo.load();

        // Auto-play when ready
        mainVideo.addEventListener('canplay', function autoPlay() {
          mainVideo.play().then(() => {
            console.log("▶️ Video auto-playing after card click");
          }).catch((error) => {
            console.warn("Auto-play failed:", error);
          });
          mainVideo.removeEventListener('canplay', autoPlay);
        });
      }

      // Update title
      if (videoTitle) {
        videoTitle.textContent = exerciseTitle;
      }
    });
  });
}

function initWorkoutSettings() {
  console.log("⚙️ Initializing Workout Settings");

  const exerciseAmountSelect = document.getElementById("exercise-amount-select");
  const timerDurationSelect = document.getElementById("timer-duration-select");
  const restDurationSelect = document.getElementById("rest-duration-select");
  const applySettingsBtn = document.getElementById("apply-workout-settings");
  const resetSettingsBtn = document.getElementById("reset-workout-settings");

  function applyWorkoutSettings() {
    const newTotalExercises = parseInt(exerciseAmountSelect.value);
    const newTimerDuration = parseInt(timerDurationSelect.value);
    const newRestDuration = parseInt(restDurationSelect.value);

    // Update configuration
    workoutConfig.totalExercises = newTotalExercises;
    workoutConfig.timerDuration = newTimerDuration;
    workoutConfig.restDuration = newRestDuration;

    // Reset timer with new settings
    isRestPhase = false;
    timerSeconds = newTimerDuration;
    
    if (currentExercise > newTotalExercises) {
      currentExercise = 1;
    }

    // Update displays
    const timerDisplay = document.getElementById("timer-display");
    const exerciseCounterElement = document.querySelector("[data-exercise-counter]");
    const progressPercentageElement = document.getElementById("progress-percentage");
    const totalDurationDisplay = document.getElementById("total-duration-display");

    if (timerDisplay) {
      const minutes = Math.floor(timerSeconds / 60);
      const seconds = timerSeconds % 60;
      timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    if (exerciseCounterElement) {
      exerciseCounterElement.textContent = `${currentExercise}/${newTotalExercises}`;
    }

    if (totalDurationDisplay) {
      const totalSeconds = (newTotalExercises * newTimerDuration) + ((newTotalExercises - 1) * newRestDuration);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      totalDurationDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    console.log("✅ Workout settings applied:", workoutConfig);
  }

  function resetWorkoutSettings() {
    exerciseAmountSelect.value = "6";
    timerDurationSelect.value = "15";
    restDurationSelect.value = "10";
    applyWorkoutSettings();
    console.log("🔄 Workout settings reset to defaults");
  }

  // Event listeners
  if (applySettingsBtn) {
    applySettingsBtn.addEventListener("click", applyWorkoutSettings);
  }

  if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener("click", resetWorkoutSettings);
  }
}

// Export individual functions for testing
export { initWorkoutTimer, initVideoPlayer, initExerciseSelection, initWorkoutSettings };
