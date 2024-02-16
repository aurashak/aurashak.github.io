document.addEventListener('DOMContentLoaded', function () {
    const imageContainer = document.querySelector('.image-container');
    const fullScreen = document.getElementById('fullScreen');

    imageContainer.addEventListener('click', function (event) {
        if (event.target.tagName === 'IMG') {
            const imageUrl = event.target.src;
            const imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

            // Check if the clicked image is one of the exceptions
            if (imageName !== 'worldmigration.png' && imageName !== 'nsworld.png') {
                // Apply border to images other than 'worldmigration.png' and 'nsworld.png'
                event.target.style.border = '0.1px solid rgb(187, 187, 187)';
            } else {
                // Remove border for 'worldmigration.png' and 'nsworld.png'
                event.target.style.border = 'none';
            }

            fullScreen.querySelector('img').src = imageUrl;
            fullScreen.style.visibility = 'visible';
            fullScreen.style.opacity = '1';
        }
    });

    fullScreen.addEventListener('click', function () {
        // Remove border from all images when closing full-screen
        const allImages = document.querySelectorAll('.image-container img');
        allImages.forEach(image => {
            image.style.border = 'none';
        });

        fullScreen.style.visibility = 'hidden';
        fullScreen.style.opacity = '0';
    });
});
