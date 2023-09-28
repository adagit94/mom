import { Sorter, getSorter, handleDiagonal } from "../internal/utils.js";
import { create } from "./patterns.js";
import { convertByPerc } from "./utils.js";

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

    for (let s = column; s < mat.length; s += columns) {
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

export const swapValues = <T = unknown>(rowA: number, columnA: number, rowB: number, columnB: number, columns: number, mat: T[]): T[] => {
    const a = getValue(rowA, columnA, columns, mat);
    const b = getValue(rowB, columnB, columns, mat);

    let m: T[] = [...mat];

    setValue(a, rowB, columnB, columns, m);
    setValue(b, rowA, columnA, columns, m);

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

    for (let aI = a, bI = b; aI < mat.length && bI < mat.length; aI += columns, bI += columns) {
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
    mat[columns * row + column] = value;
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

    for (let s = index; s < mat.length; s += columns - 1) {
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

export type MultMat<T> = { mat: T[]; rows: number; columns: number };
export const mult = <T extends number>(matA: MultMat<T>, matB: MultMat<T>): number[] => {
    if (matA.columns !== matB.rows) {
        throw new Error("Columns count of matA should be equal to matB rows count.");
    }

    let m: number[] = create(matA.rows, matB.columns, () => 0);

    for (let r = 0; r < matA.rows; r++) {
        const i = r * matA.columns;
        const row = matA.mat.slice(i, i + matA.columns);

        for (let c = 0; c < matB.columns; c++) {
            const col = getColumn<T>(c, matB.columns, matB.mat);
            let sum = 0;

            for (let i = 0; i < matA.columns; i++) {
                sum += row[i] * col[i];
            }

            m[i + c] = sum;
        }
    }

    return m;
};

type Output<T> = {
    mat: T[];
    rows: number;
    columns: number;
};

/**
 * @param steps number of 90° steps - clockwise (positive number) or counter clockwise (negative number)
 * @param rows number of rows
 * @param columns number of columns
 * @param mat matrix to transform
 * @returns Object: { mat: T[], rows: number, columns: number }
 */
export const rotate = <T>(steps: number, rows: number, columns: number, mat: T[]): Output<T> => {
    if (steps > 0) return rotateClockwise<T>(steps, rows, columns, mat);
    if (steps < 0) return rotateCounterClockwise<T>(steps, rows, columns, mat);

    return { mat, rows, columns };
};

const rotateClockwise = <T>(steps: number, rows: number, columns: number, mat: T[]): Output<T> => {
    let m: T[] = new Array(mat.length);

    for (let step = 0; step < steps; step++) {
        for (let row = 0; row < rows; row++) {
            const r = getRow(row, columns, mat);

            m = replaceColumn(rows - row - 1, r, rows, m);
        }

        const rs = rows;
        const cs = columns;

        rows = cs;
        columns = rs;
        mat = m;
        m = new Array(mat.length);
    }

    return { mat, rows, columns };
};

const rotateCounterClockwise = <T>(steps: number, rows: number, columns: number, mat: T[]): Output<T> => {
    steps *= -1;

    let m: T[] = new Array(mat.length);

    for (let step = 0; step < steps; step++) {
        for (let row = 0; row < rows; row++) {
            const r = getRow(row, columns, mat).reverse();

            m = replaceColumn(row, r, rows, m);
        }

        const rs = rows;
        const cs = columns;

        rows = cs;
        columns = rs;
        mat = m;
        m = new Array(mat.length);
    }

    return { mat, rows, columns };
};

/**
 * @description Positional - value will be positioned to same row and column as in source mat if slot at coordinates is available
 * @description Proportional - value will be positioned to row and column based on its % distance in source mat on each axis (when multiple values at rounded coordinates pertain to same slot, closest will be choosed
 * @description Clear - pure mat will be returned
 */
export enum ValuesTransfer {
    Positional,
    Proportional,
    Clear,
}

type SlotValue<T> = { value: T; distance: number };
type SlotValues<T> = { row: number; column: number; values: SlotValue<T>[] };

export const scale = <T>(
    rows: number,
    rowsFactor: number,
    columns: number,
    columnsFactor: number,
    mat: T[],
    valuesTransfer: ValuesTransfer = ValuesTransfer.Positional
): Output<T> => {
    const rs = Math.round(rows * rowsFactor);
    const cs = Math.round(columns * columnsFactor);

    const area = rs * cs;

    let m: T[] = new Array(area);

    switch (valuesTransfer) {
        case ValuesTransfer.Positional: {
            const prevSlots = findSlots(columns, mat);

            for (const slot of prevSlots) {
                const { row, column, value } = slot;

                if (row < rs && column < cs) {
                    setValue(value, row, column, cs, m);
                }
            }

            break;
        }

        case ValuesTransfer.Proportional: {
            const prevSlots = findSlots(columns, mat, value => value !== undefined && value !== null);
            let slotsValues: SlotValues<T>[] = [];

            for (const slot of prevSlots) {
                const { row, column, value } = slot;
                const { row: newRow, column: newColumn } = convertByPerc({ rows, columns, row, column }, { rows: rs, columns: cs });
                const roundedNewRow = Math.round(newRow);
                const roundedNewColumn = Math.round(newColumn);

                let slotValues = slotsValues.find(v => v.row === roundedNewRow && v.column === roundedNewColumn);
                const slotValue = {
                    value,
                    distance: Math.abs(newRow - roundedNewRow) + Math.abs(newColumn - roundedNewColumn),
                };

                if (slotValues) {
                    slotValues.values.push(slotValue);
                } else {
                    slotsValues.push({
                        row: roundedNewRow,
                        column: roundedNewColumn,
                        values: [slotValue],
                    });
                }
            }

            for (const slotValues of slotsValues) {
                let closestSlotValue: SlotValue<T> | undefined;

                for (const slotValue of slotValues.values) {
                    if (closestSlotValue === undefined || slotValue.distance < closestSlotValue.distance) {
                        closestSlotValue = slotValue;
                    }
                }

                setValue(closestSlotValue?.value, slotValues.row, slotValues.column, cs, m);
            }

            break;
        }
    }

    return { mat: m, rows: rs, columns: cs };
};

export type Slot<T> = { value: T; row: number; column: number; index: number };
export type SlotTester<T> = (value: T, index: number, row: number, column: number) => any;

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

export const clip = <T = unknown>(rowFrom: number, rowTo: number, columnFrom: number, columnTo: number, columns: number, mat: T[]): Output<T> => {
    const slots = findSlots(columns, mat, (_v, _i, r, c) => r >= rowFrom && r <= rowTo && c >= columnFrom && c <= columnTo);
    const m = slots.map(({ value }) => value);

    return { mat: m, rows: rowTo - rowFrom + 1, columns: columnTo - columnFrom + 1 };
};
