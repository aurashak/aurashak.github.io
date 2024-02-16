// imagepopout.js

document.addEventListener('DOMContentLoaded', function () {
    var fullScreen = document.getElementById('fullScreen');
    var closeBtn = document.getElementById('closeBtn');

    if (fullScreen && closeBtn) {
        closeBtn.addEventListener('click', function () {
            fullScreen.style.visibility = 'hidden';
            fullScreen.style.opacity = '0';
        });
    } else {
        console.error('Full screen element or close button not found.');
    }
});
