document.addEventListener("DOMContentLoaded", function () {
    const magnifyContainer = document.querySelector(".magnify-container");
    const magnifyingGlass = document.querySelector(".magnifying-glass");
    const magnifiedImage = document.querySelector(".magnified-image");

    // Event listener for mouseover on the magnify container
    magnifyContainer.addEventListener("mouseover", function (e) {
      magnifyingGlass.style.display = "block";
      magnifiedImage.style.display = "block";
      updateMagnifiedImage(e);
    });

    // Event listener for mousemove on the magnify container
    magnifyContainer.addEventListener("mousemove", function (e) {
      updateMagnifiedImage(e);
    });

    // Event listener for mouseout on the magnify container
    magnifyContainer.addEventListener("mouseout", function () {
      magnifyingGlass.style.display = "none";
      magnifiedImage.style.display = "none";
    });

    // Function to update the position of the magnifying glass and magnified image
    function updateMagnifiedImage(e) {
      const rect = magnifyContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate the position of the magnifying glass
      magnifyingGlass.style.left = x - magnifyingGlass.clientWidth / 2 + "px";
      magnifyingGlass.style.top = y - magnifyingGlass.clientHeight / 2 + "px";

      // Calculate the position of the magnified image
      magnifiedImage.style.left = x + "px";
      magnifiedImage.style.top = y + "px";
      magnifiedImage.style.backgroundPosition = -x * 2 + "px " + -y * 2 + "px";
    }
  });