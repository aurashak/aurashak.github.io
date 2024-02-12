document.addEventListener("DOMContentLoaded", function () {
    // Create navigation elements
    const navigation = document.createElement("nav");
    navigation.innerHTML = `
        <div class="navigation"><a href="https://aurashak.github.io">Home</a></div>
        <div class="navigation"><a href="https://aurashak.github.io/about/about.html">About</a></div>
        <div class="navigation"><a href="https://aurashak.github.io/resources/mappingresources.html">Mapping Resources</a></div>
        <div class="navigation" id="projectsLink">Projects</div>
        <div class="hidden-projects" id="projectsList">
            <a href="https://aurashak.github.io/projects/nymap/nymap.html">NY Map</a>
            <a href="https://aurashak.github.io/projects/nmca/nmca.html">NMCA</a>
            <a href="https://aurashak.github.io/projects/nydisplacementmap/nydisplacementmap.html">Displacement Map</a>
        </div>
    `;

    // Find the element with the class "header" and append the navigation
    const headerElement = document.querySelector(".header");
    if (headerElement) {
        headerElement.appendChild(navigation);
    }

    // Add the language selector to the header
    const languageSelector = document.createElement("div");
    languageSelector.classList.add("language-selector");
    languageSelector.innerHTML = `
        <label for="language">Select Language:</label>
        <select id="language" onchange="changeLanguage()">
            <option value="en">English</option>
            <option value="es">Español</option>
            <!-- Add more language options as needed -->
        </select>
    `;
    headerElement.appendChild(languageSelector);

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

    // Move changeLanguage function outside of the DOMContentLoaded event listener
    function changeLanguage() {
        const selectedLanguage = document.getElementById('language').value;

        // Fetch translations or update content based on selected language
        // Example: You can use an object to store translations for different languages
        const translations = {
            'en': {
                'welcomeMessage': 'Welcome to our website!',
                // Add translations for each English text on your page
            },
            'es': {
                'welcomeMessage': '¡Bienvenido a nuestro sitio web!',
                // Add translations for each Spanish text on your page
            },
            // Add translations for more languages
        };

        // Update content based on the selected language
        // Example: Update the welcome message
        const welcomeMessageElement = document.getElementById('welcome-message');
        if (welcomeMessageElement) {
            welcomeMessageElement.innerText = translations[selectedLanguage]['welcomeMessage'];
        }
        // Update more elements as needed
    }

    // Ensure that the language selector is present in the DOM before attempting to set its onchange attribute
    const languageSelectorElement = document.getElementById('language');
    if (languageSelectorElement) {
        // Explicitly define the changeLanguage function in the global scope
        window.changeLanguage = changeLanguage;

        // Set the onchange attribute to the global changeLanguage function
        languageSelectorElement.onchange = window.changeLanguage;
    }

    // Additional elements might need updating, replace 'your-element-id' with the actual IDs in your HTML
    const additionalElement1 = document.getElementById('your-element-id-1');
    const additionalElement2 = document.getElementById('your-element-id-2');

    // Update additional elements based on the selected language
    const selectedLanguage = document.getElementById('language').value;
    if (additionalElement1) {
        additionalElement1.innerText = translations[selectedLanguage]['additionalText1'];
    }

    if (additionalElement2) {
        additionalElement2.innerText = translations[selectedLanguage]['additionalText2'];
    }
});
