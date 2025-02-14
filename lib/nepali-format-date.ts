// AD date ranges for BS conversion
const startDate = new Date(1943, 3, 14); // 1943/04/14 in AD
const endDate = new Date(2034, 3, 13); // 2034/04/13 in AD

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

// New mapping for English month names
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

// BS date data for conversion
const bsMonthData = {
  2000: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2001: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  // Add more year data as needed
  2081: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2082: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
};

// Convert English number to Nepali
function toNepaliNumeral(number: number | string | null | undefined): string {
  if (number === null || number === undefined) return "";
  return number
    .toString()
    .split("")
    .map((char) => nepaliNumbers[char] || char)
    .join("");
}

// Convert AD date to BS date
function convertADToBS(adDate: Date): {
  year: number;
  month: number;
  day: number;
} {
  // Basic conversion logic (simplified version)
  // This is a basic implementation. For production, you should use a comprehensive conversion library
  const year = adDate.getFullYear();
  const month = adDate.getMonth() + 1; // JavaScript months are 0-based
  const day = adDate.getDate();

  // For demonstration, adding 56 years and 8 months to convert to BS
  // This is a very simplified conversion and won't be accurate
  // You should use a proper conversion library in production
  const bsYear = year + 56;
  const bsMonth = (month + 8) % 12 || 12;
  const bsDay = day;

  return {
    year: bsYear,
    month: bsMonth,
    day: bsDay,
  };
}

// Format time to Nepali (12-hour format with अपराह्न/पूर्वाह्न)
function formatNepaliTime(hour: number, minute: number): string {
  const period = hour >= 12 ? "अपराह्न" : "पूर्वाह्न";
  const displayHour = hour % 12 || 12;
  return `${toNepaliNumeral(displayHour)}:${toNepaliNumeral(
    minute.toString().padStart(2, "0")
  )} ${period}`;
}

/**
 * Converts AD date to format: "१ फाल्गुण २०८१, ७:३१ अपराह्न" (1 Falgun 2081, 7:31 PM)
 * @param date - JavaScript Date object
 */
export function formatNepaliDateTime(date: Date | null | undefined): string {
  if (!date) return "";

  const bsDate = convertADToBS(date);
  const timeStr = formatNepaliTime(date.getHours(), date.getMinutes());

  return `${toNepaliNumeral(bsDate.day)} ${
    nepaliMonths[bsDate.month]
  } ${toNepaliNumeral(bsDate.year)}, ${timeStr}`;
}

/**
 * Converts AD date to format: "१ फाल्गुण २०८१" (1 Falgun 2081 B.S.)
 * @param date - JavaScript Date object
 */
export function formatNepaliDate(date: Date | null | undefined): string {
  if (!date) return "";

  const bsDate = convertADToBS(date);
  return `${toNepaliNumeral(bsDate.day)} ${
    nepaliMonths[bsDate.month]
  } ${toNepaliNumeral(bsDate.year)}`;
}

/**
 * Converts AD date to English format: "1 Falgun 2081 B.S."
 * @param date - JavaScript Date object
 */
export function formatNepaliDateInEnglish(
  date: Date | null | undefined
): string {
  if (!date) return "";

  const bsDate = convertADToBS(date);
  return `${bsDate.day} ${englishMonths[bsDate.month]} ${bsDate.year} B.S.`;
}

/**
 * Flexible format function that can return either Nepali or English format
 * @param date - JavaScript Date object
 * @param format - 'np' for Nepali format, 'en' for English format
 */
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
