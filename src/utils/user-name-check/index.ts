const regex = /^[^A-Z\s]+$/;

/**
 * Checks if username does not contain spaces or uppercase letters
 * 
 * @param value string to check
 * 
 * @returns 
 *   - true if the string is valid
 *   - false if the string is invalid
 */
export const checkUsername = (value: string) => regex.test(value);