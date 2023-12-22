document.addEventListener("DOMContentLoaded", function () {
    // Load common header
    fetch("https://aurashak.github.io/header.html")
      .then(response => response.text())
      .then(html => {
        document.getElementById("header-placeholder").innerHTML = html;
      });
  
    // Load common navigation
    fetch("https://aurashak.github.io/navigation.html")
      .then(response => response.text())
      .then(html => {
        document.getElementById("navigation-placeholder").innerHTML = html;
      });
  
    // Load common footer
    fetch("https://aurashak.github.io/footer.html")
      .then(response => response.text())
      .then(html => {
        document.getElementById("footer-placeholder").innerHTML = html;
      });
  });
  