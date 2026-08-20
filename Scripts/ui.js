// ui.js — rendering summary, opportunity cards, month pills, holidays

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long'
  });
}

function formatShortDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short'
  });
}

function renderStats(stats) {
  if (!stats) return;
  document.getElementById('summary-content').innerHTML = `
    <div>Total entered: <strong>${stats.totalLeaveDays}</strong></div>
    <div>Used in optimisation: <strong>${stats.leaveDaysUsed}</strong></div>
    <div>Remaining: <strong>${stats.leaveDaysRemaining}</strong></div>
  `;
}

function renderMonthPills(allocated, holidays, year) {
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const filter = document.getElementById('month-filter');
  filter.style.display = 'block';

  const container = document.getElementById('month-pills');
  container.innerHTML = '';

  months.forEach((label, index) => {
    const btn = document.createElement('button');
    btn.className = 'month-pill' + (index === activeMonth ? ' active' : '');
    btn.textContent = label;
    btn.addEventListener('click', () => {
      activeMonth = index;
      document.querySelectorAll('.month-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      renderOpportunityCards(allocated, holidays, year, index);
      renderHolidays(holidays, index);
      navigateCalendarToMonth(index, year);
    });
    container.appendChild(btn);
  });
}

function renderOpportunityCards(allocated, holidays, year, month) {
  const el = document.getElementById('suggestions');
  el.innerHTML = '';

  const filtered = allocated.filter(o => o.month === month);

  if (filtered.length === 0) {
    el.innerHTML = '<p class="empty-state">No suggested leave days for this month.</p>';
    return;
  }

  filtered.forEach(opp => {
    const monthName = new Date(opp.bridgeDate).toLocaleDateString('en-GB', { month: 'long' });
    const holiday = holidays.find(h => h.name === opp.bridgesHoliday);
    const holidayShortDate = holiday ? formatShortDate(holiday.date) : '';

    const card = document.createElement('div');
    card.className = 'opportunity-card';
    card.innerHTML = `
      <div class="card-header">
        <div class="card-month">${monthName}</div>
      </div>
      <div class="card-body">
        <div class="card-row">
          <span class="card-key">Take leave</span>
          <span class="card-val">${formatShortDate(opp.bridgeDate)}</span>
        </div>
        <div class="card-row">
          <span class="card-key">Holiday</span>
          <span class="card-val">${holidayShortDate} — ${opp.bridgesHoliday}</span>
        </div>
        <div class="card-row">
          <span class="card-key">Result</span>
          <span class="card-val card-highlight">${opp.consecutive} consecutive days off</span>
        </div>
      </div>
    `;

    el.appendChild(card);
  });
}

function renderHolidays(holidays, month) {
  const el = document.getElementById('holidays-list');
  el.innerHTML = '';

  const filtered = holidays.filter(h => new Date(h.date).getMonth() === month);

  if (filtered.length === 0) {
    el.innerHTML = '<p class="empty-state">No public holidays this month.</p>';
    return;
  }

  filtered.forEach(h => {
    const row = document.createElement('div');
    row.className = 'holiday-row';
    row.innerHTML = `
      <span class="holiday-date">${formatDate(h.date)}</span>
      <span>${h.name}</span>
    `;
    el.appendChild(row);
  });
}

async function populateCountryDropdown() {
  const select = document.getElementById('countryCode');
  select.innerHTML = '<option value="" disabled selected>Loading countries...</option>';

  const countries = await fetchAvailableCountries();

  if (countries.length === 0) {
    select.innerHTML = `
      <option value="" disabled selected>Select country</option>
      <option value="ZA">🇿🇦 South Africa</option>
      <option value="BW">🇧🇼 Botswana</option>
    `;
    return;
  }

  select.innerHTML = '';

  // Placeholder
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.textContent = 'Select country';
  select.appendChild(placeholder);

  // Priority countries first
  CONFIG.PRIORITY_COUNTRIES.forEach(code => {
    const country = countries.find(c => c.countryCode === code);
    if (country) {
      const opt = document.createElement('option');
      opt.value = country.countryCode;
      opt.textContent = `${CONFIG.FLAG_MAP[code] || ''} ${country.name}`.trim();
      select.appendChild(opt);
    }
  });

  // Divider
  const divider = document.createElement('option');
  divider.disabled = true;
  divider.value = '';
  divider.textContent = '──────────';
  select.appendChild(divider);

  // Rest alphabetically
  countries
    .filter(c => !CONFIG.PRIORITY_COUNTRIES.includes(c.countryCode))
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(country => {
      const opt = document.createElement('option');
      opt.value = country.countryCode;
      opt.textContent = `${CONFIG.FLAG_MAP[country.countryCode] || ''} ${country.name}`.trim();
      select.appendChild(opt);
    });
}