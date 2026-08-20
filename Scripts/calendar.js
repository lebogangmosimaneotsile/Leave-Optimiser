// calendar.js — FullCalendar setup and rendering

let calendarInstance = null;
let activeMonth = new Date().getMonth();

function renderCalendar(allocated, holidays, year) {
  const calendarEl = document.getElementById('calendar');

  const leaveEvents = allocated.map(opp => ({
    title: 'Leave Day',
    start: opp.bridgeDateStr,
    classNames: ['leave-event'],
  }));

  const holidayEvents = holidays.map(h => ({
    title: h.name,
    start: h.date,
    classNames: ['holiday-event'],
  }));

  if (calendarInstance) calendarInstance.destroy();

  const monthStr = String(activeMonth + 1).padStart(2, '0');

  calendarInstance = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    initialDate: `${year}-${monthStr}-01`,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: '',
    },
    events: [...leaveEvents, ...holidayEvents],
    height: 'auto',
  });

  calendarInstance.render();
}

function navigateCalendarToMonth(month, year) {
  activeMonth = month;
  if (calendarInstance) {
    const monthStr = String(month + 1).padStart(2, '0');
    calendarInstance.gotoDate(`${year}-${monthStr}-01`);
  }
}
