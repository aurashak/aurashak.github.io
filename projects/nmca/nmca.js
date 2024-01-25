let isDragging = false;
let offsetX, offsetY;

function startDrag(e) {
    isDragging = true;
    offsetX = e.clientX;
    offsetY = e.clientY;
    document.getElementById('zoomImage').style.cursor = 'grabbing';
}

function stopDrag() {
    isDragging = false;
    document.getElementById('zoomImage').style.cursor = 'grab';
}

function drag(e) {
    if (isDragging) {
        const zoomImage = document.getElementById('zoomImage');
        const dx = e.clientX - offsetX;
        const dy = e.clientY - offsetY;
        offsetX = e.clientX;
        offsetY = e.clientY;

        zoomImage.style.transform = `translate(${dx}px, ${dy}px) ${zoomImage.style.transform}`;
    }
}

function zoomTo(x, y) {
    const zoomImage = document.getElementById('zoomImage');
    zoomImage.style.transform = `scale(2) translate(${(x - 0.5) * 100}%, ${(y - 0.5) * 100}%)`;
}

function resetZoom() {
    const zoomImage = document.getElementById('zoomImage');
    zoomImage.style.transform = 'none';
}

// Add scroll zoom functionality
document.getElementById('zoomImage').addEventListener('wheel', function (e) {
    e.preventDefault();
    const zoomImage = document.getElementById('zoomImage');
    const scale = e.deltaY > 0 ? 0.9 : 1.1;
    zoomImage.style.transform = `scale(${scale}) ${zoomImage.style.transform}`;
});