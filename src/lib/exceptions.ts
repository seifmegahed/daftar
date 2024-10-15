export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === "string") {
    return error;
  } else if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "Something went wrong";
}

export const checkUniqueConstraintError = (error: unknown): boolean => {
  const errorMessage = getErrorMessage(error);
  return errorMessage.includes("unique");
};

export const errorLogger = (title: string) => (error: unknown) =>
  console.error(title, error);
