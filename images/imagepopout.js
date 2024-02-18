document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.image-container img');
    const fullScreen = document.getElementById('fullScreen');
    let currentIndex = 0;

    function updateFullScreenImage() {
        fullScreen.querySelector('img').src = images[currentIndex].src;
    }

    function showFullScreen() {
        fullScreen.style.visibility = 'visible';
        fullScreen.style.opacity = '1';
    }

    function hideFullScreen() {
        fullScreen.style.visibility = 'hidden';
        fullScreen.style.opacity = '0';
    }

    function updateArrows() {
        const leftArrow = document.querySelector('.left-arrow');
        const rightArrow = document.querySelector('.right-arrow');
        leftArrow.style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
        rightArrow.style.visibility = currentIndex === images.length - 1 ? 'hidden' : 'visible';
    }

    function nextImage(event) {
        event.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        updateFullScreenImage();
        updateArrows();
    }

    function prevImage(event) {
        event.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateFullScreenImage();
        updateArrows();
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') {
            prevImage(event);
        } else if (event.key === 'ArrowRight') {
            nextImage(event);
        }
    });

    document.querySelector('.left-arrow').addEventListener('click', function (event) {
        prevImage(event);
    });

    document.querySelector('.right-arrow').addEventListener('click', function (event) {
        nextImage(event);
    });

    document.querySelector('.image-container').addEventListener('click', function (event) {
        if (event.target.tagName === 'IMG') {
            currentIndex = Array.from(images).indexOf(event.target);
            updateFullScreenImage();
            updateArrows();
            showFullScreen();
        }
    });

    fullScreen.addEventListener('click', function () {
        hideFullScreen();
    });

    // Initial update
    updateFullScreenImage();
    updateArrows();
});
