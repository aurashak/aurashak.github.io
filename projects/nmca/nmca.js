// Coordinates of each grid area on the larger image
const gridAreas = [
    { x: 0.1, y: 0.1 },
    { x: 0.4, y: 0.1 },
    { x: 0.7, y: 0.1 },
    // Add more grid areas as needed
];

// Define the zoomTo function
function zoomTo(x, y) {
    const zoomImage = document.getElementById('zoomImage');
    const container = document.getElementById('zoomImageContainer');
    const containerRect = container.getBoundingClientRect();

    const offsetX = (x - 0.5) * containerRect.width;
    const offsetY = (y - 0.5) * containerRect.height;

    const dx = containerRect.width / 2 - offsetX;
    const dy = containerRect.height / 2 - offsetY;

    zoomImage.style.transform = `scale(2) translate(${dx}px, ${dy}px)`;
}

function handleGridClick(event) {
    const gridImage = document.getElementById('gridImage');
    const gridImageRect = gridImage.getBoundingClientRect();

    // Calculate the clicked coordinates relative to the gridImage
    const clickedX = (event.clientX - gridImageRect.left) / gridImageRect.width;
    const clickedY = (event.clientY - gridImageRect.top) / gridImageRect.height;

    // Find the closest grid area
    const closestGridArea = findClosestGridArea(clickedX, clickedY);

    // Zoom to the selected grid area on the larger image
    zoomTo(closestGridArea.x, closestGridArea.y);
}

function findClosestGridArea(clickedX, clickedY) {
    let closestArea;
    let minDistance = Number.MAX_VALUE;

    for (const area of gridAreas) {
        const distance = Math.sqrt((clickedX - area.x) ** 2 + (clickedY - area.y) ** 2);
        if (distance < minDistance) {
            minDistance = distance;
            closestArea = area;
        }
    }

    return closestArea;
}
