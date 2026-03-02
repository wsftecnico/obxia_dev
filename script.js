const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('active');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.textContent = isOpen ? 'X' : '☰';
    toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });
}

const galeriaSlider = document.querySelector('#galeria-slider');
const instagramFeed = document.querySelector('#instagram-feed');

if (galeriaSlider) {
  initGaleriaSlider(galeriaSlider);
}

if (instagramFeed) {
  initInstagramFeed(instagramFeed);
}

async function initGaleriaSlider(sliderRoot) {
  const imageEl = sliderRoot.querySelector('.galeria-slider-image');
  const prevBtn = sliderRoot.querySelector('.galeria-nav--prev');
  const nextBtn = sliderRoot.querySelector('.galeria-nav--next');
  const dotsEl = sliderRoot.querySelector('.galeria-dots');

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
    .map((_, i) => `<button class="galeria-dot${i === 0 ? ' is-active' : ''}" type="button" data-index="${i}" aria-label="Ir para a foto ${i + 1}"></button>`)
    .join('');

  const dots = Array.from(dotsEl.querySelectorAll('.galeria-dot'));

  const render = () => {
    imageEl.src = images[index];
    imageEl.alt = `Registro do Festival de Violeiros ${index + 1}`;
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
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

  prevBtn.addEventListener('click', () => {
    goTo(index - 1);
    restartAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    goTo(index + 1);
    restartAutoplay();
  });

  dotsEl.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const dot = target.closest('.galeria-dot');
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
  const basePath = 'img/fts/';
  const extensions = ['jpg', 'jpeg', 'png', 'webp'];
  const results = [];
  let missesAfterFirst = 0;

  for (let i = 1; i <= 200; i += 1) {
    let found = '';

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

async function initInstagramFeed(feedRoot) {
  const username = feedRoot.dataset.username;
  const statusEl = feedRoot.querySelector('.instagram-feed__status');
  const gridEl = feedRoot.querySelector('.instagram-feed__grid');

  if (!username || !statusEl || !gridEl) {
    return;
  }

  try {
    const posts = await fetchInstagramPosts(username, 6);
    if (!posts.length) {
      throw new Error('Nenhuma publicação encontrada');
    }

    statusEl.textContent = 'Atualizado com as publicações mais recentes.';
    gridEl.innerHTML = posts
      .map((post, i) => {
        const badge = post.isVideo ? '<span class="instagram-feed__badge">VIDEO</span>' : '';
        return `<a class="instagram-feed__item" href="${post.permalink}" target="_blank" rel="noopener noreferrer" aria-label="Abrir publicação ${i + 1} do Instagram"><img src="${post.image}" alt="${escapeHtml(post.caption || `Publicação ${i + 1} do festival`)}" loading="lazy">${badge}</a>`;
      })
      .join('');
  } catch (error) {
    statusEl.textContent = 'Não foi possível carregar o feed automático agora. Abra o perfil para ver as novidades.';
    gridEl.innerHTML = '';
  }
}

async function fetchInstagramPosts(username, limit = 6) {
  const profileUrl = `https://www.instagram.com/${encodeURIComponent(username)}/?__a=1&__d=dis`;
  const proxiedUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(profileUrl)}`;
  const response = await fetch(proxiedUrl, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Falha no carregamento do feed (${response.status})`);
  }

  const data = await response.json();
  const edges = data?.graphql?.user?.edge_owner_to_timeline_media?.edges;
  if (!Array.isArray(edges)) {
    return [];
  }

  return edges
    .slice(0, limit)
    .map((edge) => edge?.node)
    .filter(Boolean)
    .map((node) => ({
      image: node.display_url,
      permalink: `https://www.instagram.com/p/${node.shortcode}/`,
      caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
      isVideo: Boolean(node.is_video)
    }))
    .filter((post) => post.image && post.permalink);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
