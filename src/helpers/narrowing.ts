type Truthy<T> = T extends undefined | null | false | '' | 0 ? never : T;

export const isTruthy = <T>(value: T): value is Truthy<T> => !!value;
