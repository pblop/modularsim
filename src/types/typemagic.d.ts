type Falsy = false | 0 | "" | null | undefined;
type Truthy<T> = T extends Falsy ? never : T;
