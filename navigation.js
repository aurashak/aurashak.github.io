document.addEventListener("DOMContentLoaded", function () {
    // Create navigation elements
    const navigation = document.createElement("nav");
    navigation.innerHTML = `
        <div class="navigation"><a href="https://aurashak.github.io">Home</a></div>
        <div class="navigation"><a href="https://aurashak.github.io/about/about.html">About</a></div>
        <div class="navigation"><a href="https://aurashak.github.io/mappingresources.html">Mapping Resources</a></div>
        <div class="navigation" id="projectsLink">Projects</div>
        <div class="hidden-projects" id="projectsList">
            <a href="https://aurashak.github.io/projects/nymap/nymap.html">NY Map</a>
            <a href="https://aurashak.github.io/projects/mts/mts.html">MTS</a>
            <a href="https://aurashak.github.io/projects/nmca/nmca.html">NMCA</a>
            <a href="https://aurashak.github.io/projects/nydisplacementmap/nydisplacementmap.html">Displacement Map</a>
        </div>
    `;

    // Find the element with the class "header" and append the navigation
    const headerElement = document.querySelector(".header");
    if (headerElement) {
        headerElement.appendChild(navigation);
    }

    // Get the current page URL
    const currentURL = window.location.href;

    // Highlight the active link in the navigation
    const navigationLinks = navigation.querySelectorAll(".navigation a");
    navigationLinks.forEach(link => {
        if (link.href === currentURL) {
            link.classList.add("current-page");
        }
    });

    // Highlight the "Projects" button when a project page is being viewed
    const projectPages = [
        "https://aurashak.github.io/projects/nymap/nymap.html",
        "https://aurashak.github.io/projects/mts/mts.html",
        "https://aurashak.github.io/projects/nmca/nmca.html",
        "https://aurashak.github.io/projects/nydisplacementmap/nydisplacementmap.html"
    ];

    const projectsLink = document.getElementById("projectsLink");
    if (projectPages.includes(currentURL)) {
        projectsLink.classList.add("current-page");
    }

    // Toggle the visibility of projectsList when clicking on projectsLink
    const projectsList = document.getElementById("projectsList");

    projectsLink.addEventListener("click", function () {
        if (projectsList.style.display === "none" || projectsList.style.display === "") {
            projectsList.style.display = "inline-block";
        } else {
            projectsList.style.display = "none";
        }

        if (projectsList.style.display === "inline-block") {
            positionHiddenProjectsList();
        }
    });

    // Adjust the position of the hidden projects list when resizing the window
    window.addEventListener("resize", function () {
        if (projectsList.style.display === "inline-block") {
            positionHiddenProjectsList();
        }
    });

    // Function to position the hidden projects list to the right of the "Projects" navigation item
    function positionHiddenProjectsList() {
        const projectsLinkRect = projectsLink.getBoundingClientRect();
        projectsList.style.top = projectsLinkRect.top + "px";
        projectsList.style.left = projectsLinkRect.right + "px";
    }
});
