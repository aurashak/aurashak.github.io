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

    // Find the element with the class "header" and append the navigation
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
});
