// SurveyJS code
var surveyJSON = {
    title: "Your Survey Title",
    pages: [
        {
            questions: [
                { type: "text", name: "name", title: "1. Name" },
                { type: "text", name: "email", title: "2. Email" },
                { type: "text", name: "contact", title: "3. Website or Other Contact" }
            ]
        },
        {
            questions: [
                {
                    type: "radiogroup",
                    name: "websiteUsage",
                    title: "Map Feedback: Were you able to easily use and navigate the website?",
                    choices: ["Yes", "No", "Somewhat"],
                    colCount: 1
                },
                {
                    type: "comment",
                    name: "difficulties",
                    title: "1b. If not, what were your difficulties?",
                    visibleIf: "{websiteUsage} = 'No' or {websiteUsage} = 'Somewhat'"
                },
                {
                    type: "radiogroup",
                    name: "informationUseful",
                    title: "2. Did you find the information useful for understanding infrastructure in NYC?",
                    choices: ["No", "Somewhat", "Very much"],
                    colCount: 1
                },
        
                {
                    type: "radiogroup",
                    name: "websiteDifficulties",
                    title: "3. If 'No' was selected for website usage, why?",
                    choices: ["Technical issues", "Confusing layout", "Lack of information", "Other"],
                    colCount: 1,
                    visibleIf: "{websiteUsage} = 'No'"
                },
                {
                    type: "comment",
                    name: "additionalInformation",
                    title: "What other information would you like to see on this map?",
                },
                {
                    type: "boolean",
                    name: "dataAccess",
                    title: "Do you have access to data that should be on this map?",
                    label: "Yes/No"
                },
                {
                    type: "comment",
                    name: "collaborationDetails",
                    title: "Would you like to collaborate on the research, design, funding, or some other aspect of this project? If yes, how so?",
                },
                {
                    type: "checkbox",
                    name: "usageGroups",
                    title: "Would you use this with any of the following groups for research, education, etc?",
                    choices: ["Classrooms", "NGOs", "Public Agencies", "Research Institutions", "Private Developers", "Other"],
                    colCount: 2
                },
                {
                    type: "comment",
                    name: "funders",
                    title: "Are you aware of potential funders for the continued development of this map? If yes, who?",
                },
                {
                    type: "boolean",
                    name: "mapNeedOutsideNY",
                    title: "Do you see the need for something like this map outside of New York?",
                    label: "Yes/No"
                }
            ]
        }


    ]
};

// Render the survey
Survey.Survey(document.getElementById("surveyContainer"), {
    model: new Survey.Model(surveyJSON)
});


Survey.Survey(document.getElementById("surveyContainer"), {
    model: new Survey.Model(surveyJSON),
    onComplete: function (survey) {
        // Send survey data to the backend
        fetch('/submit-survey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(survey.data),
        })
        .then(response => response.json())
        .then(data => {
            // Handle response from the server if needed
            console.log('Survey submitted successfully:', data);
        })
        .catch(error => {
            console.error('Error submitting survey:', error);
        });
    }
});
