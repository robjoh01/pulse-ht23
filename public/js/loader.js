"use strict";

const Calendar = tui.Calendar;

// function updateTheme(matches) {
//     const link = document.getElementById("window-style");
//     const type = matches ? "dark" : "light";
//     link.setAttribute("href", `/styles/style-${type}.css`);
// }

// const mql = window.matchMedia("(prefers-color-scheme: dark)");

// mql.addEventListener("change", e => {
//     updateTheme(e.matches);
// });

// updateTheme(mql.matches);

// mdc.ripple.MDCRipple.attachTo(document.querySelector<HTMLElement>('.foo-button'));

// const selector = '.mdc-button, .mdc-icon-button, .mdc-card__primary-action';

// const ripples = [].map.call(document.querySelectorAll(selector), function(el) {
//     return new MDCRipple(el);
// });

// const togglePassword = document.querySelector("#togglePassword");
// const password = document.querySelector("#password");

// togglePassword.addEventListener("click", function () {
//     // toggle the type attribute
//     const type = password.getAttribute("type") === "password" ? "text" : "password";
//     password.setAttribute("type", type);
    
//     // toggle the icon
//     this.classList.toggle("bi-eye");
// });

// // prevent form submit
// const form = document.querySelector("form");
// form.addEventListener('submit', function (e) {
//     e.preventDefault();
// });

const container = document.getElementById('calendar');

const options = {
    defaultView: 'month',
    month: {
        startDayOfWeek: 1,
        visibleEventCount: 3,
    },
    gridSelection: {
        enableDblClick: true,
        enableClick: true,
    },
};

const calendar = new Calendar(container, options);

calendar.createEvents([
    {
        id: 'event1',
        calendarId: 'cal2',
        title: 'Weekly meeting',
        start: '2023-09-14T09:00:00',
        end: '2023-09-15T10:00:00',
    },
    {
        id: 'event2',
        calendarId: 'cal1',
        title: 'Lunch appointment',
        start: '2023-09-08T12:00:00',
        end: '2023-09-08T13:00:00',
    },
    {
        id: 'event3',
        calendarId: 'cal2',
        title: 'Vacation',
        start: '2023-09-22',
        end: '2023-10-03',
        isAllday: true,
        category: 'allday',
    },
]);
