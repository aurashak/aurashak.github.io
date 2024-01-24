document.addEventListener('DOMContentLoaded', function () {
    // Get the mini and larger illustrations
    var miniIllustration = document.getElementById('miniIllustration');
    var largerIllustration = document.getElementById('largerIllustration');

    // Add mouseover event listener to the mini illustration
    miniIllustration.addEventListener('mouseover', function () {
        console.log('Mouseover event triggered.');
    });

    // Add mousemove event listener to the mini illustration
    miniIllustration.addEventListener('mousemove', function (event) {
        console.log('Mousemove event triggered.');
        console.log('Mouse X:', event.clientX);
        console.log('Mouse Y:', event.clientY);
    });

    // Add click event listener to the mini illustration
    miniIllustration.addEventListener('click', function () {
        console.log('Click event triggered.');
    });
});
