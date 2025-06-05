// Module for managing the preloader
export function initPreloader() {
  setTimeout(function () {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.classList.add("preloader-hide");
    }
  }, 150);
}
