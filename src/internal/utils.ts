export const handleDiagonal = (
  size: number,
  direction: '\\' | '/',
  handler: (s: number, i: number) => void
): void => {
  let initialVal;
  let colOffset;

  switch (direction) {
    case '\\':
      initialVal = 0;
      colOffset = 1;
      break;

    case '/':
      initialVal = size - 1;
      colOffset = -1;
      break;
  }

  for (let i = 0, s = initialVal; i < size; i++, s += size + colOffset) {
    handler(s, i);
  }
};

export type Sorter<T> = (a: T, b: T) => number;

export const getSorter = <T = unknown>(method: 'asc' | 'desc'): Sorter<T> => {
  switch (method) {
    case 'asc':
      return ascSorter<T>;

    case 'desc':
      return descSorter<T>;
  }
};

const ascSorter = <T = unknown>(a: T, b: T): number => {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};

const descSorter = <T = unknown>(a: T, b: T): number => {
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
};