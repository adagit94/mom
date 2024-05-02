export const isNumberMat = (mat: unknown[]): mat is number[] => mat.every((v) => typeof v === "number");

/**
 * @description Function that takes slot location inside of sourceMat and returns location in destinationMat recomputed proportionaly (by percentage). For the sake of precision row and column units are counted from 1 and not 0 in background, but function accepts location in indices for consistency. 
 * @param sourceMat Source matrix with slot location.
 * @param destinationMat Destination matrix for which new position would be computed.
 * @returns New position in destination matrix.
 */
export const recomputeProportionaly = (
  sourceMat: { rows: number; columns: number; row: number; column: number },
  destinationMat: { rows: number; columns: number }
) => {
  const row = destinationMat.rows * ((sourceMat.row + 1) / sourceMat.rows);
  const column = destinationMat.columns * ((sourceMat.column + 1) / sourceMat.columns);

  return {
    row: row - 1,
    column: column - 1,
  };
};

/**
 * @description Function that takes slot location inside of sourceMat and returns location in destinationMat recomputed proportionaly (by percentage). For the sake of precision row and column units are counted from 1 and not 0 in background, but function accepts location in indices for consistency. 
 * @param sourceMat Source matrix with slot location.
 * @param destinationMat Destination matrix for which new position would be computed.
 * @returns New rounded position in destination matrix.
 */
export const recomputeProportionalyRounded = (
  sourceMat: { rows: number; columns: number; row: number; column: number },
  destinationMat: { rows: number; columns: number }
) => {
  const { row, column } = recomputeProportionaly(sourceMat, destinationMat);

  return {
    row: Math.round(row),
    column: Math.round(column),
  };
};

/**
 * @description Computes offset of slot2 from slot1 in rows and columns.
 * @param slot1 Position of first slot.
 * @param slot2 Position of second slot.
 * @returns Offset of slot2 from slot1 in rows and columns.
 */
export const getOffset = (slot1: { row: number; column: number }, slot2: { row: number; column: number }) => {
  return {
    rows: slot2.row - slot1.row,
    columns: slot2.column - slot1.column,
  };
};

/**
 * @description Computes new position based on passed vector for x axis (columns) and vector for y axis (rows).
 * @param position Position from which new position would be computed based on a passed vectors.
 * @param vectors Vector for x axis (columns) and vector for y axis (rows). Starting from left to right and top to bottom respectively.
 * @returns New position.
 */
export const getNewPosition = (position: { row: number; column: number }, [xVec, yVec]: [number, number]) => ({
  row: position.row + yVec,
  column: position.column + xVec,
});

/**
 * @description Get single step vectors from slot1 to slot2 (including diagonals - 8 possibilities).
 * @param slot1 Origin from which direction would be choosed.
 * @param slot2 Destination to which direction would be choosed.
 * @returns Vector for x axis (columns) and vector for y axis (rows). Starting from left to right and top to bottom respectively.
 */
export const chooseDirection = (
  slot1: { row: number; column: number },
  slot2: { row: number; column: number }
): [number, number] => {
  if (slot1.row === slot2.row && slot1.column === slot2.column) return [0, 0];

  if (slot1.row === slot2.row && slot2.column > slot1.column) return [1, 0];
  if (slot1.row === slot2.row && slot2.column < slot1.column) return [-1, 0];

  if (slot1.column === slot2.column && slot2.row > slot1.row) return [0, 1];
  if (slot1.column === slot2.column && slot2.row < slot1.row) return [0, -1];

  if (slot2.row > slot1.row && slot2.column > slot1.column) return [1, 1];
  if (slot2.row < slot1.row && slot2.column < slot1.column) return [-1, -1];

  if (slot2.column > slot1.column && slot2.row < slot1.row) return [1, -1];
  if (slot2.column < slot1.column && slot2.row > slot1.row) return [-1, 1];

  throw new Error("chooseDirection function failed: No direction choosed.");
};

/**
 * @description Get multiple steps (when possible) vectors from slot1 to slot2 (including diagonals - 8 possibilities).
 * @param slot1 Origin from which direction would be choosed.
 * @param slot2 Destination to which direction would be choosed.
 * @returns vecs: Vector for x axis (columns) and vector for y axis (rows). Starting from left to right and top to bottom respectively., steps: Number of steps to new position. 
 */
export const chooseDirectionSteps = (
  slot1: { row: number; column: number },
  slot2: { row: number; column: number }
): { vecs: [number, number]; steps: number } => {
  if (slot1.row === slot2.row && slot1.column === slot2.column) return { vecs: [0, 0], steps: 0 };

  const offset = getOffset(slot1, slot2);
  const xSteps = Math.abs(offset.columns);
  const ySteps = Math.abs(offset.rows);

  if (slot1.row === slot2.row) return { vecs: [offset.columns, 0], steps: xSteps };
  if (slot1.column === slot2.column) return { vecs: [0, offset.rows], steps: ySteps };

  if (xSteps === ySteps) return { vecs: [offset.columns, offset.rows], steps: xSteps };

  if (slot2.row > slot1.row && slot2.column > slot1.column) return { vecs: [1, 1], steps: 1 };
  if (slot2.row < slot1.row && slot2.column < slot1.column) return { vecs: [-1, -1], steps: 1 };

  if (slot2.column > slot1.column && slot2.row < slot1.row) return { vecs: [1, -1], steps: 1 };
  if (slot2.column < slot1.column && slot2.row > slot1.row) return { vecs: [-1, 1], steps: 1 };

  throw new Error("chooseDirection function failed: No direction choosed.");
};

/**
 * @description Get number of steps to destination (slot2).
 * @param slot1 Slot from which computation starts.
 * @param slot2 Destination slot.
 * @returns Number of steps from slot1 to slot2 (including diagonal steps).
 */
export const getShortestDistance = (slot1: { row: number; column: number }, slot2: { row: number; column: number }) => {
  let steps = 0;

  for (
    let movingSlot = { ...slot1 }, direction = chooseDirectionSteps(movingSlot, slot2);
    direction.steps !== 0;
    steps += direction.steps
  ) {
    const { vecs } = (direction = chooseDirectionSteps(movingSlot, slot2));

    movingSlot = getNewPosition(movingSlot, vecs);
  }

  return steps;
};

/**
 * @description Get path of steps to destination (slot2).
 * @param slot1 Slot from which computation starts.
 * @param slot2 Destination slot.
 * @returns An array of steps from slot1 to slot2 (including diagonal steps).
 */
export const getShortestPath = (slot1: { row: number; column: number }, slot2: { row: number; column: number }): { row: number; column: number }[] => {
  let path: { row: number; column: number }[] = [];

  while (true) {
    const from = path.at(-1) ?? slot1;
    const vecs = chooseDirection(from, slot2);
    const [xVec, yVec] = vecs;

    if (xVec === 0 && yVec === 0) break;

    path.push(getNewPosition(from, vecs));
  }

  return path;
};

export const handleDiagonal = (size: number, direction: "\\" | "/", handler: (s: number, i: number) => void): void => {
    switch (direction) {
      case "\\": {
        for (let i = 0, s = 0; i < size; i++, s += size + 1) {
          handler(s, i);
        }
  
        break;
      }
  
      case "/": {
        for (let i = 0, s = size * size - size; i < size; i++, s -= size - 1) {
          handler(s, i);
        }
  
        break;
      }
    }
  };
  
  export type Sorter<T> = (a: T, b: T) => number;
  
  export const getSorter = <T = unknown>(method: "asc" | "desc"): Sorter<T> => {
    switch (method) {
      case "asc":
        return ascSorter<T>;
  
      case "desc":
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
  