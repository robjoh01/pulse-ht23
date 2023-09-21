"use strict";

const Calendar = tui.Calendar;

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

const container = document.getElementById('calendar');
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
