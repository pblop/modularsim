declare global {
  var scheduler:
    | {
        yield?: () => Promise<void>;
      }
    | undefined;
}

export {};
