// Type definitions
type BSDate = {
  year: number;
  month: number;
  day: number;
};

// Mapping for Nepali numbers
const nepaliNumbers: { [key: string]: string } = {
  "0": "०",
  "1": "१",
  "2": "२",
  "3": "३",
  "4": "४",
  "5": "५",
  "6": "६",
  "7": "७",
  "8": "८",
  "9": "९",
};

// Mapping for Nepali months
const nepaliMonths: { [key: number]: string } = {
  1: "बैशाख",
  2: "जेठ",
  3: "असार",
  4: "श्रावण",
  5: "भदौ",
  6: "आश्विन",
  7: "कार्तिक",
  8: "मंसिर",
  9: "पुष",
  10: "माघ",
  11: "फाल्गुण",
  12: "चैत्र",
};

// English month names
const englishMonths: { [key: number]: string } = {
  1: "Baisakh",
  2: "Jestha",
  3: "Ashar",
  4: "Shrawan",
  5: "Bhadra",
  6: "Ashwin",
  7: "Kartik",
  8: "Mangsir",
  9: "Poush",
  10: "Magh",
  11: "Falgun",
  12: "Chaitra",
};

// BS calendar data (2080-2090)
const bsMonthData: { [key: number]: number[] } = {
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2081: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2082: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2083: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2084: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2085: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2086: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2087: [30, 31, 32, 32, 31, 30, 30, 30, 29, 30, 29, 30],
  2088: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2089: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2090: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
};

// Updated reference date
const reference = {
  ad: {
    year: 2025,
    month: 2,
    day: 18,
  },
  bs: {
    year: 2081,
    month: 11,
    day: 6,
  },
};

function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

function convertADToBS(adDate: Date): BSDate {
  if (!isValidDate(adDate)) {
    throw new Error("Invalid date provided");
  }

  // Get the difference in days between the input date and reference date
  const inputDate = new Date(
    adDate.getFullYear(),
    adDate.getMonth(),
    adDate.getDate()
  );
  const refDate = new Date(
    reference.ad.year,
    reference.ad.month - 1,
    reference.ad.day
  );

  const diffDays = Math.floor(
    (inputDate.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  let bsYear = reference.bs.year;
  let bsMonth = reference.bs.month;
  let bsDay = reference.bs.day;

  // If date is before reference date
  if (diffDays < 0) {
    let remainingDays = Math.abs(diffDays);
    while (remainingDays > 0) {
      if (bsDay > 1) {
        bsDay--;
      } else {
        if (bsMonth > 1) {
          bsMonth--;
        } else {
          bsYear--;
          bsMonth = 12;
        }
        if (!bsMonthData[bsYear]) {
          throw new Error(`Year ${bsYear} BS is not supported`);
        }
        bsDay = bsMonthData[bsYear][bsMonth - 1];
      }
      remainingDays--;
    }
  }
  // If date is after or equal to reference date
  else {
    let remainingDays = diffDays;
    while (remainingDays > 0) {
      if (!bsMonthData[bsYear]) {
        throw new Error(`Year ${bsYear} BS is not supported`);
      }
      const daysInMonth = bsMonthData[bsYear][bsMonth - 1];
      if (bsDay < daysInMonth) {
        bsDay++;
      } else {
        bsDay = 1;
        if (bsMonth < 12) {
          bsMonth++;
        } else {
          bsYear++;
          bsMonth = 1;
        }
      }
      remainingDays--;
    }
  }

  return { year: bsYear, month: bsMonth, day: bsDay };
}

function toNepaliNumeral(number: number | string | null | undefined): string {
  if (number === null || number === undefined) return "";
  return number
    .toString()
    .split("")
    .map((char) => nepaliNumbers[char] || char)
    .join("");
}

function formatNepaliTime(hour: number, minute: number): string {
  const period = hour >= 12 ? "अपराह्न" : "पूर्वाह्न";
  const displayHour = hour % 12 || 12;
  return `${toNepaliNumeral(displayHour)}:${toNepaliNumeral(
    minute.toString().padStart(2, "0")
  )} ${period}`;
}

export function formatNepaliDateTime(date: Date | null | undefined): string {
  if (!date) return "";

  const bsDate = convertADToBS(date);
  const timeStr = formatNepaliTime(date.getHours(), date.getMinutes());

  return `${toNepaliNumeral(bsDate.day)} ${
    nepaliMonths[bsDate.month]
  } ${toNepaliNumeral(bsDate.year)}, ${timeStr}`;
}

export function formatNepaliDate(date: Date | null | undefined): string {
  if (!date) return "";

  const bsDate = convertADToBS(date);
  return `${toNepaliNumeral(bsDate.day)} ${
    nepaliMonths[bsDate.month]
  } ${toNepaliNumeral(bsDate.year)}`;
}

export function formatNepaliDateInEnglish(
  date: Date | null | undefined
): string {
  if (!date) return "";

  const bsDate = convertADToBS(date);
  return `${bsDate.day} ${englishMonths[bsDate.month]} ${bsDate.year} B.S.`;
}

export function formatNepaliDateFlexible(
  date: Date | null | undefined,
  format: "np" | "en" = "np"
): string {
  if (!date) return "";

  if (format === "en") {
    return formatNepaliDateInEnglish(date);
  }
  return formatNepaliDate(date);
}
