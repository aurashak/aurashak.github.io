document.addEventListener('DOMContentLoaded', function () {
    // Get the mini and larger illustrations
    var miniIllustration = document.getElementById('miniIllustration');
    var largerIllustration = document.getElementById('largerIllustration');

    // Get the button element
    var triggerButton = document.getElementById('triggerButton');

    // Add click event listener to the button
    triggerButton.addEventListener('click', function () {
        // Set a fixed position on the larger illustration
        largerIllustration.style.objectPosition = '100% 100%';
    });
});
