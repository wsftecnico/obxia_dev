const toggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

if (toggle && menu) {
  const setMenuState = (open) => {
    menu.classList.toggle("active", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "X" : "☰";
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };

  toggle.addEventListener("click", () => {
    const isOpen = !menu.classList.contains("active");
    setMenuState(isOpen);
  });

  menu.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (target.closest("a")) {
      setMenuState(false);
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }
    const clickInsideMenu = menu.contains(target);
    const clickOnToggle = toggle.contains(target);
    if (!clickInsideMenu && !clickOnToggle) {
      setMenuState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
      toggle.focus();
    }
  });
}

const galeriaSlider = document.querySelector("#galeria-slider");

if (galeriaSlider) {
  initGaleriaSlider(galeriaSlider);
}

function initGaleriaSlider(sliderRoot) {
  const imageEl = sliderRoot.querySelector(".galeria-slider-image");
  const prevBtn = sliderRoot.querySelector(".galeria-nav--prev");
  const nextBtn = sliderRoot.querySelector(".galeria-nav--next");
  const dotsEl = sliderRoot.querySelector(".galeria-dots");

  if (!imageEl || !prevBtn || !nextBtn || !dotsEl) {
    return;
  }

  const images = getGaleriaImages(sliderRoot);
  if (!images.length) {
    return;
  }

  let index = 0;
  let autoplayId = null;

  imageEl.loading = "eager";
  imageEl.decoding = "async";

  dotsEl.innerHTML = images
    .map(
      (_, i) =>
        `<button class="galeria-dot${i === 0 ? " is-active" : ""}" type="button" data-index="${i}" aria-label="Ir para a foto ${i + 1}"></button>`,
    )
    .join("");

  const dots = Array.from(dotsEl.querySelectorAll(".galeria-dot"));

  const render = () => {
    imageEl.src = images[index];
    imageEl.alt = `Registro do Festival de Violeiros ${index + 1}`;
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    preloadNext(index, images);
  };

  const goTo = (nextIndex) => {
    index = (nextIndex + images.length) % images.length;
    render();
  };

  const restartAutoplay = () => {
    if (autoplayId) {
      clearInterval(autoplayId);
    }
    autoplayId = setInterval(() => goTo(index + 1), 5000);
  };

  const stopAutoplay = () => {
    if (autoplayId) {
      clearInterval(autoplayId);
      autoplayId = null;
    }
  };

  prevBtn.addEventListener("click", () => {
    goTo(index - 1);
    restartAutoplay();
  });

  nextBtn.addEventListener("click", () => {
    goTo(index + 1);
    restartAutoplay();
  });

  dotsEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const dot = target.closest(".galeria-dot");
    if (!dot) {
      return;
    }
    const nextIndex = Number(dot.dataset.index);
    if (Number.isNaN(nextIndex)) {
      return;
    }
    goTo(nextIndex);
    restartAutoplay();
  });

  sliderRoot.addEventListener("mouseenter", stopAutoplay);
  sliderRoot.addEventListener("mouseleave", restartAutoplay);
  sliderRoot.addEventListener("focusin", stopAutoplay);
  sliderRoot.addEventListener("focusout", (event) => {
    const nextTarget = event.relatedTarget;
    if (!(nextTarget instanceof Node) || !sliderRoot.contains(nextTarget)) {
      restartAutoplay();
    }
  });

  sliderRoot.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      goTo(index - 1);
      restartAutoplay();
    }
    if (event.key === "ArrowRight") {
      goTo(index + 1);
      restartAutoplay();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      restartAutoplay();
    }
  });

  render();
  restartAutoplay();
}

function getGaleriaImages(sliderRoot) {
  const basePath = "/img/fts/";
  const totalFromData = Number(sliderRoot.dataset.totalImages);
  const total = Number.isInteger(totalFromData) && totalFromData > 0 ? totalFromData : 20;
  return Array.from({ length: total }, (_, i) => `${basePath}foto${i + 1}.jpeg`);
}

function preloadNext(index, images) {
  const nextIndex = (index + 1) % images.length;
  const preloadImage = new Image();
  preloadImage.decoding = "async";
  preloadImage.src = images[nextIndex];
}
