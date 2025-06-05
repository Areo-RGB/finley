// HomePage Feature Module
// Handles video swiper, hero animations, and statistics display
// Refactored from js/homePageVideoSwiper.js and js/homePageHeroAnimations.js

export function initHomePage() {
  console.log("🏠 Initializing HomePage Feature...");

  initVideoSwiper();
  initHeroAnimations();

  console.log("✅ HomePage Feature initialized");
}

function initVideoSwiper() {
  console.log("📹 Initializing Homepage Video Swiper");
  
  let currentSlide = 0;
  const slides = document.querySelectorAll("#video-swiper .video-slide");
  const indicators = document.querySelectorAll("#video-swiper .indicator");
  const swiper = document.getElementById("video-swiper");
  let startX = 0;
  let startY = 0;

  function showSlide(index) {
    if (!slides.length || !indicators.length || index < 0 || index >= slides.length) {
      console.warn("VideoSwiper: showSlide called with invalid index or missing elements.", { 
        index, 
        slidesLength: slides.length, 
        indicatorsLength: indicators.length 
      });
      return;
    }

    slides.forEach((slide) => {
      slide.classList.remove("active");
      const video = slide.querySelector("video");
      if (video) video.pause();
    });

    indicators.forEach((indicator) => {
      indicator.classList.remove("active");
    });

    if (slides[index] && indicators[index]) {
      slides[index].classList.add("active");
      indicators[index].classList.add("active");
      const currentVideo = slides[index].querySelector("video");
      if (currentVideo) {
        currentVideo.currentTime = 0;
        currentVideo.play().catch((e) => console.warn("VideoSwiper: Video play failed:", e));
      }
    }
    currentSlide = index;
  }

  if (swiper) {
    swiper.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    swiper.addEventListener("touchend", function (e) {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) { // Horizontal swipe
        if (diffX > 0) { // Swiped left
          showSlide((currentSlide + 1) % slides.length);
        } else { // Swiped right
          showSlide((currentSlide - 1 + slides.length) % slides.length);
        }
      }
    });
  } else {
    console.warn("VideoSwiper: Swiper element #video-swiper not found.");
  }

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      showSlide(index);
    });
  });

  if (slides.length > 0) {
    showSlide(0); // Initialize first slide
  } else {
    console.warn("VideoSwiper: No slides found for the swiper.");
  }
}

function initHeroAnimations() {
  console.log("✨ Initializing Homepage Hero Animations");
  
  const finleyHeading = document.querySelector(".finley-animated-heading");
  if (!finleyHeading) {
    console.warn("HeroAnimations: Finley heading .finley-animated-heading not found.");
    return;
  }

  // Animate Finley letters
  const finleyLetters = finleyHeading.querySelectorAll("span");
  finleyLetters.forEach((span, index) => {
    span.style.animationDelay = `${index * 0.1}s`;
    span.classList.add("fade-in-letter-anim");
  });

  const finleyAnimationTimePerLetter = 0.5; // seconds
  const finleyLastLetterDelay = finleyLetters.length > 0 ? (finleyLetters.length - 1) * 0.1 : 0;
  const totalFinleyAnimationDuration = (finleyLastLetterDelay + finleyAnimationTimePerLetter) * 1000; // milliseconds

  // Statistics data
  const initialStatsData = [
    { name: "10m Sprint", value: "2.00s", label: "AUSGEZEICHNET" },
    { name: "20m Sprint", value: "3.59s", label: "SEHR GUT" },
    { name: "Gewandtheit", value: "7.81s", label: "AUSGEZEICHNET" },
    { name: "Dribbling", value: "10.27s", label: "AUSGEZEICHNET" },
    { name: "Balljonglieren", value: "0.00", label: "UNTERDURCHSCHNITTLICH" },
    { name: "Ballkontrolle", value: "10.82s", label: "DURCHSCHNITTLICH" },
  ];

  const gesamtleistungData = {
    name: "Gesamtleistung",
    value: "101.80",
    label: "SEHR GUT"
  };

  // Build elements to render (stats + divider)
  const elementsToRender = [];
  initialStatsData.forEach(stat => {
    elementsToRender.push({ type: "stat", data: stat });
    // Add divider after "Ballkontrolle" or before "Gesamtleistung"
    if (stat.name === "Ballkontrolle") {
      elementsToRender.push({ type: "divider" });
    }
  });
  elementsToRender.push({ type: "stat", data: gesamtleistungData, isSummary: true });

  const statsContainer = document.querySelector(".statistics-container");
  if (!statsContainer) {
    console.warn("HeroAnimations: Statistics container .statistics-container not found.");
    return;
  }

  const statsAnimationStartTime = totalFinleyAnimationDuration + 200; // Start stats after Finley animation + buffer

  setTimeout(() => {
    elementsToRender.forEach((element, index) => {
      const rowBaseDelay = index * 350; // Stagger animation for each element

      if (element.type === "stat") {
        const stat = element.data;
        const item = document.createElement("div");
        item.classList.add("statistic-item");
        if (element.isSummary) {
          item.classList.add("statistic-item-summary");
        }

        const nameSpan = document.createElement("span");
        nameSpan.classList.add("stat-exercise-name");
        nameSpan.textContent = stat.name;

        const ratingContainer = document.createElement("span");
        ratingContainer.classList.add("stat-rating-container");
        const ratingText = document.createElement("span");
        ratingText.classList.add("stat-rating-text");
        ratingText.textContent = stat.label;

        // Apply label classes based on rating
        if (stat.label === "AUSGEZEICHNET") ratingText.classList.add("label-ausgezeichnet");
        else if (stat.label === "SEHR GUT") ratingText.classList.add("label-sehr-gut");
        else if (stat.label === "DURCHSCHNITTLICH") ratingText.classList.add("label-durchschnittlich");
        else if (stat.label === "UNTERDURCHSCHNITTLICH") ratingText.classList.add("label-unterdurchschnittlich");

        ratingContainer.appendChild(ratingText);

        const valueSpan = document.createElement("span");
        valueSpan.classList.add("stat-result");
        valueSpan.textContent = stat.value;

        item.appendChild(nameSpan);
        item.appendChild(ratingContainer);
        item.appendChild(valueSpan);
        statsContainer.appendChild(item);

        // Animation trigger
        setTimeout(() => {
          item.style.opacity = "1"; // Make item visible for animations
          nameSpan.classList.add("animate-slide-in-left");
          valueSpan.classList.add("animate-slide-in-right");

          const nameValueAnimationDuration = 600; // Duration of slide-in animations
          const ratingBuffer = 100; // Buffer before rating animation starts

          setTimeout(() => {
            ratingContainer.classList.add("animate-rating-drop-in");
          }, nameValueAnimationDuration + ratingBuffer);
        }, rowBaseDelay);

      } else if (element.type === "divider") {
        const dividerElement = document.createElement("div");
        dividerElement.classList.add("divider", "divider-margins", "divider-prominent");
        dividerElement.style.opacity = "0"; // Start transparent for fade-in
        statsContainer.appendChild(dividerElement);

        setTimeout(() => {
          dividerElement.style.transition = "opacity 0.5s ease-in-out 0.1s"; // 0.1s delay
          dividerElement.style.opacity = "1";
        }, rowBaseDelay);
      }
    });
  }, statsAnimationStartTime);
}

// Export individual functions for testing or external use
export { initVideoSwiper, initHeroAnimations };
