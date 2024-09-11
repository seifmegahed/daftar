const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
const containsLowercase = (ch: string) => /[a-z]/.test(ch);

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