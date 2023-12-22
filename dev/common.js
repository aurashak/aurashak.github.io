document.addEventListener("DOMContentLoaded", function () {
    // Load common header
    fetch("header.html")
      .then(response => response.text())
      .then(html => {
        document.getElementById("header-placeholder").innerHTML = html;
      });
  
    // Load common navigation
    fetch("navigation.html")
      .then(response => response.text())
      .then(html => {
        document.getElementById("navigation-placeholder").innerHTML = html;
      });
  
    // Load common footer
    fetch("footer.html")
      .then(response => response.text())
      .then(html => {
        document.getElementById("footer-placeholder").innerHTML = html;
      });
});
