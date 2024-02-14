const imageContainer = document.querySelector('.image-container');
const fullScreen = document.getElementById('fullScreen');

imageContainer.addEventListener('click', (event) => {
  if (event.target.tagName === 'IMG') {
    const imageUrl = event.target.src;
    fullScreen.querySelector('img').src = imageUrl;
    fullScreen.style.visibility = 'visible';
    fullScreen.style.opacity = '1';
  }
});

fullScreen.addEventListener('click', () => {
  fullScreen.style.visibility = 'hidden';
  fullScreen.style.opacity = '0';
});
