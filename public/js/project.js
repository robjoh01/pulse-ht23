"use strict";

const reportFreq = document.getElementById("reportFreq");
const reportDeadlineInput = document.getElementById("reportDeadlineInput");

// Function to handle the change in report frequency selection
function handleReportFrequencyChange() {
    const selectedValue = reportFreq.value;

    // Check if the selected report frequency is not "None"
    if (selectedValue !== "") {
        // Disable the report deadline input
        reportDeadlineInput.disabled = true;
        reportDeadlineInput.value = null;
    } else {
        // Enable the report deadline input
        reportDeadlineInput.disabled = false;
    }
}

// Add an event listener to reportFreq to handle changes in report frequency selection
reportFreq.addEventListener("change", handleReportFrequencyChange);

// Initially call the function to set the initial state based on the default value
handleReportFrequencyChange();
