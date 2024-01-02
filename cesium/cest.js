/* General Body Styles */
body {
    background-color: #fff; /* White background for the body */
    color: #212529; /* Default text color */
    margin: 0;
    font-family: arial;
    padding: 0px;
    font-size: 14px;
    padding-bottom: 20px;
}

#cesiumContainer {
    width: 70%;
    height: 100%;
    margin: 20px auto;
    padding: 0;
    overflow: hidden;
}

.cesiumcontainer-lg {
    padding: 0px 0px 0px 0px;
    max-width: 100%;
    margin: 40px 20px;
    background-color: white;
}

/* Styles for mobile devices */
@media screen and (max-width: 768px) {
    .image-gridone, .image-gridtwo {
        grid-template-columns: 1fr; /* Collapse to one column */
        gap: 10px; /* Smaller gap for mobile */
        width: 80%; /* Adjust width for smaller screens */
    }

    .image-containerone img, .image-containertwo img {
        width: 100%; /* Full width images */
        height: auto; /* Maintain aspect ratio */
    }


    .content-grid {
        grid-template-columns: 1fr; /* Stack into one column on smaller screens */
    }
