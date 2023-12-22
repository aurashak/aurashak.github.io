document.addEventListener("DOMContentLoaded", function () {
    // Get the base URL of the current page
    const baseURL = window.location.href.replace(/\/[^/]+$/, '/');

    // Load common header
    fetch(baseURL + "header.html")
      .then(response => response.text())
      .then(html => {
        document.getElementById("header-placeholder").innerHTML = html;
      });
  
    // Load common navigation
    fetch(baseURL + "navigation.html")
      .then(response => response.text())
      .then(html => {
        document.getElementById("navigation-placeholder").innerHTML = html;
      });
  
    // Load common footer
    fetch(baseURL + "footer.html")
      .then(response => response.text())
      .then(html => {
        document.getElementById("footer-placeholder").innerHTML = html;
      });
});
