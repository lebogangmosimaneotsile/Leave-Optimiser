// config.js — API endpoints and app-wide constants

const CONFIG = {
  API_V3: 'https://date.nager.at/api/v3',
  API_V4: 'https://date.nager.at/api/v4',
  ENDPOINTS: {
    HOLIDAYS: (countryCode, year) => `https://date.nager.at/api/v4/Holidays/${countryCode}/${year}`,
    COUNTRIES: () => `https://date.nager.at/api/v3/AvailableCountries`,
  },
  DEFAULTS: {
    YEAR: new Date().getFullYear(),
    LEAVE_DAYS: 20,
    COUNTRY: 'BW',
  },
  PRIORITY_COUNTRIES: ['BW', 'ZA'],
  FLAG_MAP: {
    ZA: '🇿🇦',
    BW: '🇧🇼',
    NA: '🇳🇦',
    ZW: '🇿🇼',
    GB: '🇬🇧',
    AU: '🇦🇺',
    CA: '🇨🇦',
    US: '🇺🇸',
    NZ: '🇳🇿',
  },
};