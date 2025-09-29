export function generateRandomNumber(min: number, max: number, numAfterDigit: number = 0): number {
    const factor = Math.pow(10, numAfterDigit);
    return Math.floor(Math.random() * (max - min + 1) + min) / factor;
}

export function getRandomArrayElement<T>(elements: T[]): T {
    const randomIndex = Math.floor(Math.random() * elements.length);
    return elements[randomIndex];
}

export function getRandomArrayElements<T>(elements: T[], count: number): T[] {
    const shuffled = elements.slice();
    let i = elements.length;
    const min = i - count;
    let temp: T;
    let index: number;

    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }

    return shuffled.slice(min);
}

export function getRandomBoolean(): boolean {
    return Math.random() < 0.5;
}

export function getRandomCoordinate(min: number, max: number, numAfterDigit: number): number {
    const factor = Math.pow(10, numAfterDigit);
    return Math.floor(Math.random() * (max * factor - min * factor + 1) + min * factor) / factor;
}

export function getRandomEnumValue(enumeration: any): any {
    const values = Object.keys(enumeration);
    const enumKey = values[Math.floor(Math.random() * values.length)];
    return enumeration[enumKey];
}

export function getRandomEnumValues(enumeration: any, count: number): any[] {
    const values = Object.keys(enumeration);
    const shuffled = values.slice();
    let i = values.length;
    const min = i - count;
    let temp: string;
    let index: number;
    
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    
    return shuffled.slice(min).map((key) => enumeration[key]);
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}