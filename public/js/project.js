"use strict";

const startDateInput = document.getElementById("startDateInput");
const endDateInput = document.getElementById("endDateInput");
const reportFreqInput = document.getElementById("reportFreqInput");
const customDeadlinesInput = document.getElementById("customDeadlinesInput");

function checkDates () {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!startDate ||
        !endDate) {
        return;
    }

    const isBeforeDate = startDate < endDate;

    if (!isBeforeDate) {
        startDateInput.setCustomValidity(`Select a date before ${endDate}.`);
    } else {
        startDateInput.setCustomValidity("");
    }

    startDateInput.reportValidity();
}

startDateInput.addEventListener("input", checkDates);
endDateInput.addEventListener("input", checkDates);

// Function to handle the change in report frequency selection
function handleReportFrequencyChange () {
    const selectedValue = reportFreqInput.value;

    // Check if the selected report frequency is not "None"
    if (selectedValue !== "custom") {
        // Disable the report deadline input
        customDeadlinesInput.disabled = true;
        customDeadlinesInput.value = null;
    } else {
        // Enable the report deadline input
        customDeadlinesInput.disabled = false;
    }
}

// Add an event listener to reportFreq to handle changes in report frequency selection
reportFreqInput.addEventListener("change", handleReportFrequencyChange);

// Initially call the function to set the initial state based on the default value
handleReportFrequencyChange();
