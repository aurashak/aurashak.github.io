document.getElementById("projectsLink").addEventListener("click", function() {
    var projectsList = document.getElementById("projectsList");
    projectsList.style.display = (projectsList.style.display === "none" || projectsList.style.display === "") ? "block" : "none";
});