import { handleDiagonal } from "../internal/utils.js";

export const getRow = <T = unknown>(index: number, columns: number, mat: T[]): T[] => {
    const firstColumn = index * columns;

    return mat.slice(firstColumn, firstColumn + columns);
};

export const getColumn = <T = unknown>(index: number, columns: number, mat: T[]): T[] => {
    let col: T[] = [];

    for (let s = index; mat[s] !== undefined; s += columns) {
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

