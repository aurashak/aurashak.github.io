function handleGridClick(event) {
    const gridImage = document.getElementById('gridImage');
    const gridImageRect = gridImage.getBoundingClientRect();

    // Calculate the clicked coordinates relative to the gridImage
    const clickedX = (event.clientX - gridImageRect.left) / gridImageRect.width;
    const clickedY = (event.clientY - gridImageRect.top) / gridImageRect.height;

    // Determine the clicked quadrant
    const clickedQuadrant = determineQuadrant(clickedX, clickedY);

    // Zoom to the selected quadrant on the larger image
    zoomToQuadrant(clickedQuadrant);
}

function determineQuadrant(x, y) {
    if (x < 0.33) {
        if (y < 0.33) return 1;
        else if (y < 0.67) return 4;
        else return 7;
    } else if (x < 0.67) {
        if (y < 0.33) return 2;
        else if (y < 0.67) return 5;
        else return 8;
    } else {
        if (y < 0.33) return 3;
        else if (y < 0.67) return 6;
        else return 9;
    }
}

function zoomToQuadrant(quadrant) {
    const zoomImage = document.getElementById('zoomImage');
    const container = document.getElementById('zoomImageContainer');
    const containerRect = container.getBoundingClientRect();

    const centerX = ((quadrant - 1) % 3 + 0.5) / 3;
    const centerY = Math.floor((quadrant - 1) / 3 + 0.5) / 3;

    const offsetX = (centerX - 0.5) * containerRect.width;
    const offsetY = (centerY - 0.5) * containerRect.height;

    const dx = containerRect.width / 2 - offsetX;
    const dy = containerRect.height / 2 - offsetY;

    const scaleFactor = 2; // Adjust the scale factor as needed

    zoomImage.style.transform = `scale(${scaleFactor}) translate(${dx / scaleFactor}px, ${dy / scaleFactor}px)`;
}

