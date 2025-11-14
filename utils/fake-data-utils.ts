import { faker } from '@faker-js/faker';
import * as stringUtils from '../utils/string-utils';

export class FakeDataUtils {
    static getFirstName(): string {
        const name = faker.person.firstName().replace(/[^a-zA-Z]/g, '');
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }

    static getMiddleName(): string {
        const name = faker.person.middleName().replace(/[^a-zA-Z]/g, '');
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }

    static getLastName(): string {
        const name = faker.person.lastName().replace(/[^a-zA-Z]/g, '');
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }

    static getEmail(firstName?: string, lastName?: string): string {
        const fName = firstName || this.getFirstName();
        const lName = lastName || this.getLastName();

        return faker.internet.email({
            firstName: fName,
            lastName: lName,
            provider: 'test.com',
            allowSpecialCharacters: false
        }).toLowerCase();
    }

    static getEmailWithName(): {
        firstName: string;
        lastName: string;
        email: string;
    } {
        const firstName = this.getFirstName();
        const lastName = this.getLastName();
        const email = this.getEmail(firstName, lastName);

        return {
            firstName,
            lastName,
            email
        };
    }

    static getStreetAddress(): string {
        return faker.location
            .streetAddress({ useFullAddress: true })
            .toUpperCase()
            .replaceAll("'", "");
    }

    static getCity(): string {
        return faker.location.city().toUpperCase();
    }

    static getState(): string {
        return stringUtils.getRandomStateCode().toUpperCase();
    }

    static getZipCode(): string {
        return faker.string.numeric(5);
    }

    static getMobileNumber(): string {
        const getRandomDigits = (length: number): string =>
            Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');

        const areaCode = getRandomDigits(3);
        const centralOfficeCode = getRandomDigits(3);
        const lineNumber = getRandomDigits(4);

        return `${areaCode}-${centralOfficeCode}-${lineNumber}`;
    }

    static getFaxNumber(fixedAreaCode?: string): string {
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

    static isValidFaxNumber(faxNumber: string): boolean {
        // Check if it's exactly 10 digits
        if (!/^\d{10}$/.test(faxNumber)) {
            return false;
        }

        // Extract area code (first 3 digits)
        const areaCode = faxNumber.substring(0, 3);

        // Extract exchange code (next 3 digits)
        const exchangeCode = faxNumber.substring(3, 6);

        // Validate area code: first digit must be 2-9
        if (parseInt(areaCode[0]) < 2) {
            return false;
        }

        // Validate exchange code: first digit must be 2-9
        if (parseInt(exchangeCode[0]) < 2) {
            return false;
        }

        return true;
    }

    static getFullAddress(): {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    } {
        return {
            street: this.getStreetAddress(),
            city: this.getCity(),
            state: this.getState(),
            zipCode: this.getZipCode()
        };
    }

    static getFullName(): string {
        return this.getFirstName() + ' ' + this.getLastName();
    }

    static getFullNameWithMiddle(): string {
        return this.getFirstName() + ' ' + this.getMiddleName() + ' ' + this.getLastName();
    }

    static getNumeric(length: number): string {
        if (length <= 0) return '';
        if (length === 1) return faker.string.numeric(1);

        // Generate first digit (1-9) to avoid leading zeros
        const firstDigit = Math.floor(Math.random() * 9) + 1;
        // Generate remaining digits (0-9)
        const remainingDigits = faker.string.numeric(length - 1);

        return `${firstDigit}${remainingDigits}`;
    }

    static getAlphaNumeric(length: number): string {
        return faker.string.alphanumeric(length);
    }

    static generateNote(length: number): string {
        return faker.lorem.sentence(length).replace(/[^a-zA-Z0-9\s.,]/g, '');
    }
}