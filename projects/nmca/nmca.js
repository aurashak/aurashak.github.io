function zoomTo(x, y) {
    const zoomImage = document.getElementById('zoomImage');
    zoomImage.style.transform = `scale(2) translate(${(x - 0.5) * 100}%, ${(y - 0.5) * 100}%)`;
}
