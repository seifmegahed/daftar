/**
 * Type utility to make a certain property of an object optional
 * 
 * @example
 * ```tsx
 * type User = {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 * 
 * type UserWithOptionalEmail = PartialBy<User, 'email'>
 * 
 * const user: UserWithOptionalEmail = {
 *   id: 1,
 *   name: 'John Doe',
 * }
 * ```
 * 
 * @param T The type to make a property optional
 * @param K The property to make optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * GO-like return type to ensure proper error handling
 *
 * This type ensures the the return is either the generic value or the error message.
 * 
 * Acts as an XOR gate (Either Or) (Never Neither) (Never Both)
 * 
 * This forces the caller to handle the error case.
 *
 * @example
 * ```tsx
 * const [value, error] = await getUserByIdAction(id);
 * if (error !== null) return <p>Error: {error}</p>;
 * return <p>User: {value.name}</p>;
 * ```
 *
 * @param T The generic type to return
 * @returns A tuple of the generic type and a null or a null and a string error message
 */
export type ReturnTuple<T> = readonly [T, null] | readonly [null, string];

export type SearchParamsPropsType = {
  page?: string;
  query?: string;
  ft?: string;
  fv?: string;
};
