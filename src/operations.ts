import { getColumn } from "./helpers.js";

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

export const reverseDiagonal = <T = unknown>(columns: number, mat: T[]): T[] => {
    let values: T[] = [];
    let indices: number[] = [];

    let m: T[] = [...mat];

    for (let s = 0; mat[s] !== undefined; s += columns + 1) {
        values.push(mat[s]);
        indices.unshift(s);
    }

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
