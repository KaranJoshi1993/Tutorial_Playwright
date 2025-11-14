import { faker } from "@faker-js/faker";
type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
interface JSONObject { [key: string]: JSONValue; }
interface JSONArray extends Array<JSONValue> {}

export function generateTextOfLength(length: number): string {
  let text = "";
  while (text.length < length) {
    const additionalWords = faker.lorem.words(5); // Adjust the number as needed
    if (text.length + additionalWords.length + 1 <= length) {
      text += (text ? " " : "") + additionalWords;
    } else {
      break;
    }
  }

  // Trim or pad the text to exactly match the desired length
  return text.length > length
    ? text.substring(0, length)
    : text.padEnd(length, getRandomCharacter());
}

export function getPartOfText(text: string, length: number): string {
  return text.length > length ? text.substring(0, length) : text;
}

export function getRandomPartOfText(text: string, length: number): string {
  if (length >= text.length) {
    return text;
  }
  
  const maxStartIndex = text.length - length;
  const startIndex = Math.floor(Math.random() * (maxStartIndex + 1));
  
  return text.substring(startIndex, startIndex + length);
}

export function getRandomCharacter(): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
}

export function extractUrl(text: string): string | null {
  const urlPattern = /(https?:\/\/[^\s]+)/; // Regular expression to match URLs
  const match = text.match(urlPattern);
  return match ? match[0] : null;
}

export function encodeToBase64(input: string): string {
  return Buffer.from(input).toString("base64");
}

export function getRandomStateCode(): string {
  const stateCodes = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];
  return stateCodes[Math.floor(Math.random() * stateCodes.length)];
}

export function generateUSFaxNumberE164(fixedAreaCode?: string): string {
  let areaCode: string;

  if (fixedAreaCode) {
    if (!/^[2-9]\d{2}$/.test(fixedAreaCode)) {
      throw new Error(
        "Invalid area code. Must be 3 digits, starting with 2–9."
      );
    }
    areaCode = fixedAreaCode;
  } else {
    const firstDigit = Math.floor(Math.random() * 8) + 2; // 2–9
    const rest = Array.from({ length: 2 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
    areaCode = `${firstDigit}${rest}`;
  }

  // Generate exchange code (first 3 digits of subscriber number)
  // Must be 2-9 for first digit, 0-9 for second and third
  const exchangeFirstDigit = Math.floor(Math.random() * 8) + 2; // 2–9
  const exchangeRest = Array.from({ length: 2 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  const exchangeCode = `${exchangeFirstDigit}${exchangeRest}`;

  // Generate last 4 digits (subscriber number)
  const lastFourDigits = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");

  return `${areaCode}${exchangeCode}${lastFourDigits}`;
}

export function generatesRandomAutomationText(): string {
  const randomData = faker.string.alphanumeric(12); // generates a 6-alphanumeric number
  return `AUTO_${randomData.toUpperCase()}`;
}

export function generateRandomEmail(): string {
  const randomData = faker.string.alphanumeric(6); // generates a 5-digit number
  return `AUTZ${randomData.toUpperCase()}@GMAIL.COM`;
}

export function generatesRandomPhoneNumber(): string {
  const randomData = faker.string.numeric(10)
  return `${randomData}`;
}

export function generateRandomAddress():string{
  const randomData = faker.string.alphanumeric(5);
   return `${randomData.toUpperCase()} BASE LANE`;
}

export function stringifyValues(data: JSONValue): any {
  if (Array.isArray(data)) {
    return data.map(item => stringifyValues(item));
  } else if (data !== null && typeof data === 'object') {
    const result: { [key: string]: any } = {};
    for (const key in data) {
      result[key] = stringifyValues((data as JSONObject)[key]);
    }
    return result;
  } else {
    return String(data);
  }
}

