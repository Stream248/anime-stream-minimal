export const api = new Proxy(
  {},
  {
    get: (_, prop) =>
      new Proxy(
        {},
        {
          get: (__, method) => `${prop}:${method}`,
        }
      ),
  }
);
