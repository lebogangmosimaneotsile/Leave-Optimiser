// main.js — initialises the app and wires everything together

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('year').value = CONFIG.DEFAULTS.YEAR;
  document.getElementById('leave-days').value = CONFIG.DEFAULTS.LEAVE_DAYS;

  await populateCountryDropdown();

  document.getElementById('optimize-btn').addEventListener('click', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('optimize-btn');
    btn.textContent = 'Optimising…';
    btn.disabled = true;

    const countryCode = document.getElementById('countryCode').value;
    const year = parseInt(document.getElementById('year').value);
    const totalLeaveDays = parseInt(document.getElementById('leave-days').value, 10);

    activeMonth = new Date().getMonth();

    const holidays = await fetchHolidays(countryCode, year);
    const opportunities = buildOpportunities(holidays);
    const { allocated } = allocateLeave(opportunities, totalLeaveDays);
    const stats = calculateStats(allocated, totalLeaveDays);

    renderStats(stats);
    renderMonthPills(allocated, holidays, year);
    renderOpportunityCards(allocated, holidays, year, activeMonth);
    renderHolidays(holidays, activeMonth);
    renderCalendar(allocated, holidays, year);

    btn.textContent = 'Optimise';
    btn.disabled = false;
  });
});