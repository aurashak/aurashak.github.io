document.addEventListener('DOMContentLoaded', function () {
    // Get the mini and larger illustrations
    var miniIllustration = document.getElementById('miniIllustration');
    var largerIllustration = document.getElementById('largerIllustration');

    // Add mousemove event listener to the mini illustration
    miniIllustration.addEventListener('mousemove', function (event) {
        // Calculate the position of the mouse relative to the mini illustration
        var mouseX = event.offsetX / miniIllustration.width;
        var mouseY = event.offsetY / miniIllustration.height;

        // Set the corresponding position on the larger illustration
        largerIllustration.style.objectPosition = mouseX * 100 + '% ' + mouseY * 100 + '%';
    });
});