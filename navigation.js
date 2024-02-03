document.addEventListener("DOMContentLoaded", function () {
    // Create navigation elements
    const navigation = document.createElement("nav");
    navigation.innerHTML = `
        <div class="navigation"><a href="https://aurashak.github.io">Home</a></div>
        <div class="navigation"><a href="https://aurashak.github.io/about/about.html">About</a></div>
        <div class="navigation" id="projectsLink">Projects</div>
        <div class="hidden-projects" id="projectsList">
            <a href="https://aurashak.github.io/projects/nymap/nymap.html">NY Map</a>
            <a href="https://aurashak.github.io/projects/mts/mts.html">MTS</a>
            <a href="https://aurashak.github.io/projects/nmca/nmca.html">NMCA</a>
            <a href="https://aurashak.github.io/projects/nydisplacementmap/nydisplacementmap.html">Displacement Map</a>
        </div>
        <div class="navigation"><a href="https://aurashak.github.io/mappingresources.html">Mapping Resources</a></div>
    `;

    // Append the navigation to the element with the class "header"
    const headerElement = document.querySelector(".header");
    if (headerElement) {
        headerElement.appendChild(navigation);
    }

    // Toggle the visibility of projectsList when clicking on projectsLink
    const projectsLink = document.getElementById("projectsLink");
    const projectsList = document.getElementById("projectsList");

    projectsLink.addEventListener("click", function () {
        projectsList.style.display = (projectsList.style.display === "none" || projectsList.style.display === "") ? "block" : "none";
    });

    // Adjust the position of the hidden projects list when resizing the window
    window.addEventListener("resize", function () {
        if (projectsList.style.display !== "none") {
            positionHiddenProjectsList();
        }
    });

    // Function to position the hidden projects list to the right of the "Projects" navigation item
    function positionHiddenProjectsList() {
        const projectsLinkRect = projectsLink.getBoundingClientRect();
        projectsList.style.top = projectsLinkRect.bottom + "px";
        projectsList.style.left = projectsLinkRect.left + "px";
    }
});
