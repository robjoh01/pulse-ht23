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
    timezone: {
        zones: [
            {
                timezoneName: 'Asia/Seoul',
                displayLabel: 'UTC+09',
                tooltip: 'Seoul',
            },
            {
                timezoneName: 'Europe/London',
                displayLabel: 'UTC+00',
                tooltip: 'London',
            },
        ],
    },
    // NOTE: Not every theme is not included. For more info, check the theme docs.
    theme: {
        week: {
            dayName: {
                borderLeft: 'none',
                borderTop: '1px dotted red',
                borderBottom: '1px dotted red',
                backgroundColor: 'rgba(81, 92, 230, 0.05)',
            },
            dayGrid: {
                backgroundColor: 'rgba(81, 92, 230, 0.05)',
            },
            dayGridLeft: {
                borderRight: 'none',
                backgroundColor: 'rgba(81, 92, 230, 0.05)',
                width: '144px',
            },
            timeGridLeft: {
                borderRight: 'none',
                backgroundColor: 'rgba(81, 92, 230, 0.05)',
                width: '144px',
            },
            timeGridLeftAdditionalTimezone: {
                backgroundColor: '#e5e5e5',
            },
            timeGridHalfHourLine: {
                borderBottom: '1px dotted #e5e5e5',
            },
            nowIndicatorPast: {
                border: '1px dashed red',
            },
            futureTime: {
                color: 'red',
            },
        },
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
