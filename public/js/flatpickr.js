"use strict";

/* eslint-disable no-undef */

// Datetime input
flatpickr(".flatpickr.js-flatpickr-datetime", {
    enableTime: true,
    time_24hr: true,
    altInput: true,
    altFormat: "d M Y H:i",
    dateFormat: "Y-m-d H:i",
    locale: {
        firstDayOfWeek: 1
    }
});

// Time input
flatpickr(".flatpickr.js-flatpickr-time", {
    enableTime: false,
    time_24hr: true,
    altInput: true,
    altFormat: "H:i",
    dateFormat: "H:i",
    noCalendar: true,
    locale: {
        firstDayOfWeek: 1
    }
});

// Date input
flatpickr(".flatpickr.js-flatpickr-date", {
    enableTime: false,
    altInput: true,
    altFormat: "d M Y",
    dateFormat: "Y-m-d",
    locale: {
        firstDayOfWeek: 1
    }
});

// Working datetime input
flatpickr(".flatpickr.js-flatpickr-working-datetime", {
    enableTime: true,
    time_24hr: true,
    altInput: true,
    altFormat: "d M Y H:i",
    dateFormat: "Y-m-d H:i",
    disable: [
        function (date) {
            return (date.getDay() === 0 || date.getDay() === 6);
        }
    ],
    locale: {
        firstDayOfWeek: 1
    }
});

// Working date input
flatpickr(".flatpickr.js-flatpickr-working-date", {
    enableTime: false,
    altInput: true,
    altFormat: "d M Y",
    dateFormat: "Y-m-d",
    disable: [
        function (date) {
            return (date.getDay() === 0 || date.getDay() === 6);
        }
    ],
    locale: {
        firstDayOfWeek: 1
    }
});

// Month input
flatpickr(".flatpickr.js-flatpickr-month", {
    enableTime: false,
    altInput: true,
    altFormat: "M",
    dateFormat: "m",
    locale: {
        firstDayOfWeek: 1
    }
});

// Project start date input
flatpickr(startDateInput, {
    weekNumbers: true,
    enableTime: false,
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
    minDate: "today",
    locale: {
        firstDayOfWeek: 1
    },
    disable: [
        function (date) {
            return (date.getDay() === 0 || date.getDay() === 6);
        }
    ],
    onOpen: function (selectedDates, dateStr, instance) {
        const endDate = endDateInput.value ? new Date(endDateInput.value) : null;

        if (endDate) {
            endDate.setDate(endDate.getDate() - 1);
            instance.set("maxDate", endDate);
        }
    }
});

// Project end date input
flatpickr(endDateInput, {
    weekNumbers: true,
    enableTime: false,
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
    minDate: "today",
    locale: {
        firstDayOfWeek: 1
    },
    disable: [
        function (date) {
            return (date.getDay() === 0 || date.getDay() === 6);
        }
    ],
    onOpen: function (selectedDates, dateStr, instance) {
        const startDate = startDateInput.value ? new Date(startDateInput.value) : null;

        if (startDate) {
            startDate.setDate(startDate.getDate() + 1);
            instance.set("minDate", startDate);
        }
    }
});

// Project deadline input
const fp = flatpickr(customDeadlinesInput, {
    weekNumbers: true,
    mode: "multiple",
    conjunction: ";",
    enableTime: false,
    altInput: true,
    altFormat: "Y-m-d",
    dateFormat: "Y-m-d",
    minDate: "today",
    locale: {
        firstDayOfWeek: 1
    },
    disable: [
        function (date) {
            return (date.getDay() === 0 || date.getDay() === 6);
        }
    ],
    onOpen: function (selectedDates, dateStr, instance) {
        const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
        const endDate = endDateInput.value ? new Date(endDateInput.value) : null;

        if (startDate) {
            startDate.setDate(startDate.getDate() + 1);
            instance.set("minDate", startDate);
        }

        if (endDate) {
            endDate.setDate(endDate.getDate() - 1);
            instance.set("maxDate", endDate);
        }
    }
});

// Function to handle the change in report frequency selection
function onReportFrequencyInputChanged () {
    const selectedValue = reportFreqInput.value;

    // Check if the selected report frequency is not "None"
    if (selectedValue !== "custom") {
        // Disable the report deadline input
        fp.set("allowInput", false);
        fp.set("clickOpens", false);
        fp.clear();
    } else {
        // Enable the report deadline input
        fp.set("allowInput", true);
        fp.set("clickOpens", true);
    }
}

// Add an event listener to reportFreq to handle changes in report frequency selection
reportFreqInput.addEventListener("change", onReportFrequencyInputChanged);

/* eslint-enable no-undef */
