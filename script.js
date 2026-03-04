const toggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("active");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.textContent = isOpen ? "X" : "☰";
    toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  });
}

const galeriaSlider = document.querySelector("#galeria-slider");

if (galeriaSlider) {
  initGaleriaSlider(galeriaSlider);
}

async function initGaleriaSlider(sliderRoot) {
  const imageEl = sliderRoot.querySelector(".galeria-slider-image");
  const prevBtn = sliderRoot.querySelector(".galeria-nav--prev");
  const nextBtn = sliderRoot.querySelector(".galeria-nav--next");
  const dotsEl = sliderRoot.querySelector(".galeria-dots");

  if (!imageEl || !prevBtn || !nextBtn || !dotsEl) {
    return;
  }

  const images = await discoverGaleriaImages();
  if (!images.length) {
    return;
  }

  let index = 0;
  let autoplayId = null;

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

  render();
  restartAutoplay();
}

async function discoverGaleriaImages() {
  const basePath = "img/fts/";
  const extensions = ["jpg", "jpeg", "png", "webp"];
  const results = [];
  let missesAfterFirst = 0;

  for (let i = 1; i <= 200; i += 1) {
    let found = "";

    for (const extension of extensions) {
      const path = `${basePath}foto${i}.${extension}`;
      // eslint-disable-next-line no-await-in-loop
      if (await imageExists(path)) {
        found = path;
        break;
      }
    }

    if (found) {
      results.push(found);
      missesAfterFirst = 0;
    } else if (results.length) {
      missesAfterFirst += 1;
      if (missesAfterFirst >= 6) {
        break;
      }
    }
  }

  return results;
}

function imageExists(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}
