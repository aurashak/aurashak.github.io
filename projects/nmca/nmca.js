document.addEventListener('DOMContentLoaded', function () {
    // Get the mini and larger illustrations
    var miniIllustration = document.getElementById('miniIllustration');
    var largerIllustration = document.getElementById('largerIllustration');

    // Add mouseover event listener to the mini illustration
    miniIllustration.addEventListener('mouseover', function (event) {
        // Set the corresponding position on the larger illustration
        largerIllustration.style.objectPosition = '100% 100%';
    });
});
