function handleGridClick(event) {
    const gridImage = document.getElementById('gridImage');
    const gridImageRect = gridImage.getBoundingClientRect();

    // Calculate the clicked coordinates relative to the gridImage
    const clickedX = (event.clientX - gridImageRect.left) / gridImageRect.width;
    const clickedY = (event.clientY - gridImageRect.top) / gridImageRect.height;

    // Zoom to the selected area on the larger image
    zoomToCoordinates(clickedX, clickedY);
}

function zoomToCoordinates(x, y) {
    const zoomImage = document.getElementById('zoomImage');
    const container = document.getElementById('zoomImageContainer');
    const containerRect = container.getBoundingClientRect();

    const offsetX = x * zoomImage.width - containerRect.width / 2;
    const offsetY = y * zoomImage.height - containerRect.height / 2;

    const scaleFactor = 2; // Adjust the scale factor as needed

    zoomImage.style.transform = `scale(${scaleFactor}) translate(${-offsetX}px, ${-offsetY}px)`;

    // Update the container size after zooming
    const newWidth = containerRect.width / scaleFactor;
    const newHeight = containerRect.height / scaleFactor;

    container.style.width = `${newWidth}px`;
    container.style.height = `${newHeight}px`;
}

function updateGridOverlay() {
    const gridImage = document.getElementById('gridImage');
    const gridImageOverlay = document.getElementById('gridImageOverlay');

    const columns = 3;
    const rows = 3;

    const columnWidth = 100 / columns;
    const rowHeight = gridImage.offsetHeight / rows; // Use offsetHeight instead of clientHeight

    gridImageOverlay.innerHTML = '';

    for (let i = 1; i < columns; i++) {
        const verticalLine = document.createElement('div');
        verticalLine.className = 'gridline vertical';
        verticalLine.style.left = `${i * columnWidth}%`;
        gridImageOverlay.appendChild(verticalLine);
    }

    for (let i = 1; i < rows; i++) {
        const horizontalLine = document.createElement('div');
        horizontalLine.className = 'gridline horizontal';
        horizontalLine.style.top = `${i * rowHeight}px`;
        gridImageOverlay.appendChild(horizontalLine);
    }
}

// Call the updateGridOverlay function initially and whenever the window is resized
updateGridOverlay();
window.addEventListener('resize', updateGridOverlay);

// Attach click event to the gridImage
document.getElementById('gridImage').addEventListener('click', handleGridClick);
