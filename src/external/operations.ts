import { Sorter, getSorter, handleDiagonal } from "../internal/utils.js";
import { getColumn, getDiagonal, getRow } from "./utils.js";

export const reverse = <T = unknown>(mat: T[]): T[] => {
    const slots = mat.length;
    const lastNonOppositeSlot = Math.ceil(slots / 2) - 1; // account for both even and odd slots count

    let m: T[] = Array(slots);

    for (let s = 0; s <= lastNonOppositeSlot; s++) {
        const oppositeSlotIndex = mat.length - s - 1;

        const val = mat[s];
        const oppositeVal = mat[oppositeSlotIndex];

        m[s] = oppositeVal;
        m[oppositeSlotIndex] = val;
    }

    return m;
};

export const reverseRow = <T = unknown>(row: number, columns: number, mat: T[]): T[] => {
    const firstSlot = row * columns;
    const lastSlot = firstSlot + columns - 1;

    let m: T[] = [...mat];

    for (let s = firstSlot, ss = lastSlot; s <= lastSlot; s++, ss--) {
        m[s] = mat[ss];
    }

    return m;
};

export const reverseColumn = <T = unknown>(column: number, columns: number, mat: T[]): T[] => {
    let indices: number[] = [];
    let values: T[] = [];

    let m: T[] = [...mat];

    for (let s = column; mat[s] !== undefined; s += columns) {
        indices.unshift(s);
        values.push(mat[s]);
    }

    for (let i = 0; i < indices.length; i++) {
        m[indices[i]] = values[i];
    }

    return m;
};

export const reverseDiagonal = <T = unknown>(size: number, mat: T[], direction: "\\" | "/" = "\\"): T[] => {
    let indices: number[] = [];
    let values: T[] = [];

    let m: T[] = [...mat];

    handleDiagonal(size, direction, s => {
        indices.unshift(s);
        values.push(mat[s]);
    });

    for (let i = 0; i < indices.length; i++) {
        m[indices[i]] = values[i];
    }

    return m;
};

export const swap = <T = unknown>(columns: number, mat: T[]): T[] => {
    let m: T[] = [];

    for (let c = 0; c < columns; c++) {
        const column: T[] = getColumn<T>(c, columns, mat);

        m.push(...column);
    }

    return m;
};

export const swapRows = <T = unknown>(a: number, b: number, columns: number, mat: T[]): T[] => {
    const aI = a * columns;
    const bI = b * columns;

    const aRow = mat.slice(aI, aI + columns);
    const bRow = mat.slice(bI, bI + columns);

    let m: T[] = [...mat];

    m.splice(aI, columns, ...bRow);
    m.splice(bI, columns, ...aRow);

    return m;
};

export const swapColumns = <T = unknown>(a: number, b: number, columns: number, mat: T[]): T[] => {
    let m: T[] = [...mat];

    for (let aI = a, bI = b; mat[aI] !== undefined && mat[bI] !== undefined; aI += columns, bI += columns) {
        m[aI] = mat[bI];
        m[bI] = mat[aI];
    }

    return m;
};

export const swapDiagonals = <T = unknown>(size: number, mat: T[]): T[] => {
    const d1 = getDiagonal(size, mat, "\\");
    const d2 = getDiagonal(size, mat, "/");

    let m: T[] = [...mat];

    handleDiagonal(size, "\\", (s, i) => {
        m[s] = d2[i];
    });

    handleDiagonal(size, "/", (s, i) => {
        m[s] = d1[i];
    });

    return m;
};

export const addRow = <T = unknown>(index: number, values: T[], columns: number, mat: T[]): T[] => {
    let m: T[] = [...mat];

    m.splice(index * columns, 0, ...values);

    return m;
};

export const addColumn = <T = unknown>(index: number, values: T[], columns: number, mat: T[]): T[] => {
    let m: T[] = [...mat];

    for (let i = 0, s = index; i < values.length; i++, s += columns + 1) {
        m.splice(s, 0, values[i]);
    }

    return m;
};

export const removeRow = <T = unknown>(index: number, columns: number, mat: T[]): T[] => {
    let m: T[] = [...mat];

    m.splice(index * columns, columns);

    return m;
};

export const removeColumn = <T = unknown>(index: number, columns: number, mat: T[]): T[] => {
    let m: T[] = [...mat];

    for (let s = index; m[s] !== undefined; s += columns - 1) {
        m.splice(s, 1);
    }

    return m;
};

export const replaceRow = <T = unknown>(index: number, values: T[], columns: number, mat: T[]): T[] => {
    let m: T[] = [...mat];

    m.splice(index * columns, columns, ...values);

    return m;
};

export const replaceColumn = <T = unknown>(index: number, values: T[], columns: number, mat: T[]): T[] => {
    let m: T[] = [...mat];

    for (let i = 0, s = index; i < values.length; i++, s += columns) {
        m.splice(s, 1, values[i]);
    }

    return m;
};

export const replaceDiagonal = <T = unknown>(newValues: T[], size: number, mat: T[], direction: "\\" | "/" = "\\"): T[] => {
    let m: T[] = [...mat];

    handleDiagonal(size, direction, (s, i) => {
        m[s] = newValues[i];
    });

    return m;
};

export const merge = <T = unknown>(matA: T[], matB: T[], mergeHandler: (a: T, b: T) => T): T[] => {
    if (matA.length !== matB.length) throw new Error("Matrices should match in terms of rows and columns.");

    let mat: T[] = [];

    for (let i = 0; i < matA.length; i++) {
        mat.push(mergeHandler(matA[i], matB[i]));
    }

    return mat;
};

export const mergeRows = <T = unknown>(index: number, mergeHandler: (a: T, b: T) => T, columns: number, mat: T[]): T[] => {
    const r1 = getRow(index, columns, mat);
    const r2 = getRow(index + 1, columns, mat);

    let mergeRow: T[] = [];

    for (let c = 0; c < columns; c++) {
        mergeRow.push(mergeHandler(r1[c], r2[c]));
    }

    let m: T[] = [...mat];

    m = replaceRow(index, mergeRow, columns, m);
    m = removeRow(index + 1, columns, m);

    return m;
};

export const mergeColumns = <T = unknown>(index: number, mergeHandler: (a: T, b: T) => T, columns: number, mat: T[]): T[] => {
    const c1 = getColumn(index, columns, mat);
    const c2 = getColumn(index + 1, columns, mat);

    let mergeColumn: T[] = [];

    for (let i = 0; i < c1.length && i < c2.length; i++) {
        mergeColumn.push(mergeHandler(c1[i], c2[i]));
    }

    let m: T[] = [...mat];

    m = replaceColumn(index, mergeColumn, columns, m);
    m = removeColumn(index + 1, columns, m);

    return m;
};

export const split = <T = unknown>(mat: T[], splitHandler: (x: T) => [T, T]): [T[], T[]] => {
    let matA: T[] = [];
    let matB: T[] = [];

    for (const x of mat) {
        const [a, b] = splitHandler(x);

        matA.push(a);
        matB.push(b);
    }

    return [matA, matB];
};

export const splitRow = <T = unknown>(index: number, splitHandler: (a: T) => [T, T], columns: number, mat: T[]): T[] => {
    const r = getRow(index, columns, mat);
    let rowsValues: { a: T[]; b: T[] } = { a: [], b: [] };

    for (let c = 0; c < columns; c++) {
        const [a, b] = splitHandler(r[c]);

        rowsValues.a.push(a);
        rowsValues.b.push(b);
    }

    let m: T[] = [...mat];

    m = replaceRow(index, rowsValues.a, columns, m);
    m = addRow(index + 1, rowsValues.b, columns, m);

    return m;
};

export const splitColumn = <T = unknown>(index: number, splitHandler: (a: T) => [T, T], columns: number, mat: T[]): T[] => {
    const c = getColumn(index, columns, mat);
    let colsValues: { a: T[]; b: T[] } = { a: [], b: [] };

    for (let r = 0; r < c.length; r++) {
        const [a, b] = splitHandler(c[r]);

        colsValues.a.push(a);
        colsValues.b.push(b);
    }

    let m: T[] = [...mat];

    m = replaceColumn(index, colsValues.a, columns, m);
    m = addColumn(index + 1, colsValues.b, columns, m);

    return m;
};

export const sort = <T = unknown>(sorter: "asc" | "desc" | Sorter<T>, mat: T[]): T[] => {
    if (typeof sorter === "string") sorter = getSorter<T>(sorter);

    return [...mat].sort(sorter);
};

export const sortRow = <T = unknown>(index: number, sorter: "asc" | "desc" | Sorter<T>, columns: number, mat: T[]): T[] => {
    if (typeof sorter === "string") sorter = getSorter<T>(sorter);

    return replaceRow<T>(index, getRow<T>(index, columns, mat).sort(sorter), columns, mat);
};

export const sortColumn = <T = unknown>(index: number, sorter: "asc" | "desc" | Sorter<T>, columns: number, mat: T[]): T[] => {
    if (typeof sorter === "string") sorter = getSorter<T>(sorter);

    return replaceColumn<T>(index, getColumn<T>(index, columns, mat).sort(sorter), columns, mat);
};
