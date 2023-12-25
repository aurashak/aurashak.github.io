function loadElement(elementId, filePath) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) { document.getElementById(elementId).innerHTML = this.responseText; }
            if (this.status === 404) { document.getElementById(elementId).innerHTML = "Page not found."; }
        }
    }
    xhttp.open("GET", filePath, true);
    xhttp.send();
}

document.addEventListener("DOMContentLoaded", function() {
    loadElement("navigation", "https://aurashak.github.io/navigation.html");
    loadElement("printsubnav", "https://aurashak.github.io/nav/printsubnav.html");
    loadElement("footer", "https://aurashak.github.io/footer.html");
});
