import { handleDiagonal } from "../internal/utils.js";

export type Slot<T> = { value: T; row: number; column: number; index: number };
export type SlotTester<T> = (value: T, index: number, row: number, column: number) => any;

export const getValue = <T = unknown>(row: number, column: number, columns: number, mat: T[]): T => mat[column + columns * row];

export const getRow = <T = unknown>(index: number, columns: number, mat: T[]): T[] => {
    const firstColumn = index * columns;

    return mat.slice(firstColumn, firstColumn + columns);
};

export const getColumn = <T = unknown>(index: number, columns: number, mat: T[]): T[] => {
    let col: T[] = [];

    for (let s = index; s < mat.length; s += columns) {
        col.push(mat[s]);
    }

    return col;
};

export const getDiagonal = <T = unknown>(size: number, mat: T[], direction: "\\" | "/" = "\\"): T[] => {
    let diagonal: T[] = [];

    handleDiagonal(size, direction, s => {
        diagonal.push(mat[s]);
    });

    return diagonal;
};

export const setValue = <T = unknown>(value: T, row: number, column: number, columns: number, mat: T[]): void => {
    mat[column + columns * row] = value;
};

export const findSlots = <T = unknown>(columns: number, mat: T[], slotTester?: SlotTester<T>): Slot<T>[] => {
    let slots: Slot<T>[] = [];

    for (let row = 0; ; row++) {
        for (let column = 0; column < columns; column++) {
            const index = row * columns + column;

            if (index === mat.length) return slots;

            const value = mat[index];

            if (slotTester === undefined || slotTester(value, index, row, column)) slots.push({ value, index, row, column });
        }
    }
};

export const isNumberMat = (mat: unknown[]): mat is number[] => mat.every(v => typeof v === "number");
