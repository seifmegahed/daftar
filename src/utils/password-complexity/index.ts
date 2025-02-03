const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
const containsLowercase = (ch: string) => /[a-z]/.test(ch);

/**
 * Check if the password is strong enough
 * 
 * The password must contain at least one uppercase letter, one lowercase letter, and one number
 * 
 * The password must be at least 8 characters long
 * 
 * The password must not contain any spaces
 * 
 * Returns true if the password is strong enough, false otherwise
 * 
 * @param password
 * @returns boolean
 */
export const checkPasswordComplexity = (password: string) => {
  let countOfUpperCase = 0,
    countOfLowerCase = 0,
    countOfNumbers = 0;
  for (let i = 0; i < password.length; i++) {
    const ch = password.charAt(i);
    if (!isNaN(+ch)) countOfNumbers++;
    else if (containsUppercase(ch)) countOfUpperCase++;
    else if (containsLowercase(ch)) countOfLowerCase++;
  }
  if (countOfLowerCase > 0 && countOfUpperCase > 0 && countOfNumbers > 0) {
    return true;
  }
  return false;
};