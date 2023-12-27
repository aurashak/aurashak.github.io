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

window.onload = function() {
    if (document.getElementById("navigation")) {
        loadElement("navigation", "https://aurashak.github.io/navigation.html", highlightActiveLink);
    }
    if (document.getElementById("worknav")) {
        loadElement("worknav", "https://aurashak.github.io/worknav.html", highlightActiveLink);
    }
    if (document.getElementById("footer")) {
        loadElement("footer", "https://aurashak.github.io/footer.html");
    }
};
