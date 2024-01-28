document.getElementById('popupImage').addEventListener('click', openImagePopup);

function openImagePopup() {
    const imageUrl = "https://aurashak.github.io/projects/nydisplacementmap/nydisplacementmap_2022.png";
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
        <html>
            <head>
                <title>Pop-out Image</title>
                <link rel="stylesheet" href="styles.css">
            </head>
            <body>
                <img src="${imageUrl}" alt="Pop-out Image" style="cursor: pointer;" onclick="window.close()">
            </body>
        </html>
    `);
}
