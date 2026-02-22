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
