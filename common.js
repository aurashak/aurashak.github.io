function loadElement(elementId, filePath, callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) { 
                document.getElementById(elementId).innerHTML = this.responseText;
                if (callback) callback();
            }
            if (this.status === 404) { 
                document.getElementById(elementId).innerHTML = "Page not found."; 
            }
        }
    }
    xhttp.open("GET", filePath, true);
    xhttp.send();
}

function highlightActiveLink() {
    var navLinks = document.querySelectorAll('.UnderlineNav-item');
    navLinks.forEach(function(link) {
        if (link.href === window.location.href) {
            link.classList.add('active-link');
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    loadElement("navigation", "https://aurashak.github.io/navigation.html", highlightActiveLink);
    loadElement("worknav", "https://aurashak.github.io/worknav.html", highlightActiveLink);

    // Load other elements if needed
    loadElement("footer", "https://aurashak.github.io/footer.html");
});
