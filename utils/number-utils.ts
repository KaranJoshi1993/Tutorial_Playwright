export function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatNumberWithCommas(num: number): string {
    return Number(num.toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function generateRandomNumber(digit: number): number {
    const min = Math.pow(10, digit - 1);
    const max = Math.pow(10, digit) - 1;
    return getRandomNumber(min, max);
}

export function formatPhoneNumber(number: number | string): string {
    const numStr = number.toString();
    if (numStr.length !== 10 || !/^[0-9]+$/.test(numStr)) {
        throw new Error("Invalid input: Must be a 10-digit number");
    }
    
    return `(${numStr.slice(0, 3)}) ${numStr.slice(3, 6)}-${numStr.slice(6)}`;
}

export function generateUSPhoneNumber(): string {
  const getRandomDigits = (length: number): string =>
    Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');

  const areaCode = getRandomDigits(3);
  const centralOfficeCode = getRandomDigits(3);
  const lineNumber = getRandomDigits(4);

  return `${areaCode}-${centralOfficeCode}-${lineNumber}`;
}

export function generateUSZipCode(): string {
  const zip = Math.floor(Math.random() * 100000);
  return zip.toString().padStart(5, '0');
}
