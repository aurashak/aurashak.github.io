document.addEventListener("DOMContentLoaded", function () {
    // Load common header
    fetch("header.html")  // Update to relative path
      .then(response => response.text())
      .then(html => {
        document.getElementById("header-placeholder").innerHTML = html;
      });
  
    // Load common navigation
    fetch("navigation.html")  // Update to relative path
      .then(response => response.text())
      .then(html => {
        document.getElementById("navigation-placeholder").innerHTML = html;
      });
  
    // Load common footer
    fetch("footer.html")  // Update to relative path
      .then(response => response.text())
      .then(html => {
        document.getElementById("footer-placeholder").innerHTML = html;
      });
});
