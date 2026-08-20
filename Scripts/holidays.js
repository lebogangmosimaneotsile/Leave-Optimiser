// holidays.js — fetches countries and holidays from Nager API

async function fetchAvailableCountries() {
  try {
    const response = await fetch(CONFIG.ENDPOINTS.COUNTRIES());
    if (!response.ok) throw new Error('Failed to fetch countries');
    return await response.json();
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

async function fetchHolidays(countryCode, year) {
  try {
    const response = await fetch(CONFIG.ENDPOINTS.HOLIDAYS(countryCode, year));
    if (!response.ok) throw new Error('Failed to fetch holidays');
    return await response.json();
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
}
