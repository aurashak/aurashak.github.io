// Coordinates of each grid area on the larger image
const gridAreas = [
    { x: 0.1, y: 0.1 },
    { x: 0.4, y: 0.1 },
    { x: 0.7, y: 0.1 },
    // Add more grid areas as needed
];

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

// Rest of your existing zoomTo and other functions
