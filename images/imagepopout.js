document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.image-container img');
    const fullScreen = document.getElementById('fullScreen');
    let currentIndex = 0;

    function updateFullScreenImage(imageUrl) {
        fullScreen.querySelector('img').src = imageUrl;
    }

    function showFullScreen() {
        fullScreen.style.visibility = 'visible';
        fullScreen.style.opacity = '1';
    }

    function hideFullScreen() {
        fullScreen.style.visibility = 'hidden';
        fullScreen.style.opacity = '0';
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateFullScreenImage(images[currentIndex].src);
        } else if (event.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % images.length;
            updateFullScreenImage(images[currentIndex].src);
        }
    });

    document.querySelector('.image-container').addEventListener('click', function (event) {
        if (event.target.tagName === 'IMG') {
            const imageUrl = event.target.src;
            currentIndex = Array.from(images).indexOf(event.target);
            updateFullScreenImage(imageUrl);
            showFullScreen();
        }
    });

    fullScreen.addEventListener('click', function () {
        hideFullScreen();
    });
});