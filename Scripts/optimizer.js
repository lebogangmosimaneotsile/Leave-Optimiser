// optimizer.js — leave planning algorithm with ROI calculation

function toDateString(date) {
  return date.toISOString().split('T')[0];
}

function isWeekday(date) {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

function calculateConsecutiveDays(leaveDates, holidayDates, bridgeDate) {
  // Count how many consecutive days off result from taking this bridge day
  // including surrounding weekends and holidays
  const allDaysOff = new Set([...holidayDates, ...leaveDates.map(d => toDateString(d))]);
  allDaysOff.add(toDateString(bridgeDate));

  let consecutive = 1;
  let check;

  // Count backwards
  check = new Date(bridgeDate);
  while (true) {
    check.setDate(check.getDate() - 1);
    const str = toDateString(check);
    const dow = check.getDay();
    if (allDaysOff.has(str) || dow === 0 || dow === 6) {
      consecutive++;
    } else {
      break;
    }
  }

  // Count forwards
  check = new Date(bridgeDate);
  while (true) {
    check.setDate(check.getDate() + 1);
    const str = toDateString(check);
    const dow = check.getDay();
    if (allDaysOff.has(str) || dow === 0 || dow === 6) {
      consecutive++;
    } else {
      break;
    }
  }

  return consecutive;
}

function buildOpportunities(holidays) {
  const holidayDates = new Set(holidays.map(h => h.date));
  const opportunities = [];
  const seen = new Set();

  holidays.forEach(holiday => {
    const holidayDate = new Date(holiday.date);

    [-1, 1].forEach(offset => {
      const bridgeDate = new Date(holidayDate);
      bridgeDate.setDate(holidayDate.getDate() + offset);
      const bridgeStr = toDateString(bridgeDate);

      if (
        isWeekday(bridgeDate) &&
        !holidayDates.has(bridgeStr) &&
        !seen.has(bridgeStr)
      ) {
        seen.add(bridgeStr);
        const consecutive = calculateConsecutiveDays([], holidayDates, bridgeDate);
        const roi = parseFloat((consecutive / 1).toFixed(1));

        opportunities.push({
          bridgeDate,
          bridgeDateStr: bridgeStr,
          bridgesHoliday: holiday.name,
          holidayDate,
          consecutive,
          roi,
          leaveDaysNeeded: 1,
          month: bridgeDate.getMonth(),
        });
      }
    });
  });

  // Sort by ROI descending
  opportunities.sort((a, b) => b.roi - a.roi || b.consecutive - a.consecutive);

  return opportunities;
}

function allocateLeave(opportunities, totalLeaveDays) {
  let remaining = totalLeaveDays;
  const allocated = [];

  for (const opp of opportunities) {
    if (remaining <= 0) break;
    if (opp.leaveDaysNeeded <= remaining) {
      allocated.push(opp);
      remaining -= opp.leaveDaysNeeded;
    }
  }

  return { allocated, remaining };
}

function calculateStats(allocated, totalLeaveDays) {
  if (allocated.length === 0) return null;

  const longestBreak = Math.max(...allocated.map(o => o.consecutive));
  const totalDaysOff = allocated.reduce((sum, o) => sum + o.consecutive, 0);
  const leaveDaysUsed = allocated.reduce((sum, o) => sum + o.leaveDaysNeeded, 0);
  const efficiency = parseFloat((totalDaysOff / leaveDaysUsed).toFixed(1));

  return {
    totalLeaveDays,
    leaveDaysUsed,
    leaveDaysRemaining: totalLeaveDays - leaveDaysUsed,
    totalDaysOff,
    longestBreak,
    efficiency,
  };
}
