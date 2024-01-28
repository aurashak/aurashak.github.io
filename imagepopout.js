function openImagePopup(imageUrl) {
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
        <html>
            <head>
                <title>Pop-out Image</title>
                <link rel="stylesheet" href="styles.css">
            </head>
            <body>
                <img src="${imageUrl}" alt="Pop-out Image" onclick="window.close()">
            </body>
        </html>
    `);
}
