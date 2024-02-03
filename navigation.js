document.addEventListener("DOMContentLoaded", function () {
    // Your navigation code goes here
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
    
    // Append the navigation to the body or a specific element
    document.body.appendChild(navigation);

    // Toggle the visibility of the projectsList when clicking on projectsLink
    const projectsLink = document.getElementById("projectsLink");
    const projectsList = document.getElementById("projectsList");

    projectsLink.addEventListener("click", function () {
        projectsList.classList.toggle("hidden-projects");
    });
});


