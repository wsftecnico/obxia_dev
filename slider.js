const track = document.querySelector('.slider-track');
const slides = document.querySelectorAll('.slider-track img');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

let index = 0;

function update() {
  track.style.transform = `translateX(-${index * 100}%)`;
}

next.addEventListener('click', () => {
  index = (index + 1) % slides.length;
  update();
});

prev.addEventListener('click', () => {
  index = (index - 1 + slides.length) % slides.length;
  update();
});

let startX = 0;

track.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

track.addEventListener('touchend', e => {
  const endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) next.click();
  if (endX - startX > 50) prev.click();
});
