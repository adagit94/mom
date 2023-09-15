import { validateSquare } from "../internal/helpers.js";
import { Sorter } from "../internal/utils.js";
import { log } from "./helpers.js";
import {
    addColumn,
    addRow,
    merge,
    mergeColumns,
    mergeRows,
    mult,
    removeColumn,
    removeRow,
    replaceColumn,
    replaceDiagonal,
    replaceRow,
    reverse,
    reverseColumn,
    reverseDiagonal,
    reverseRow,
    sort,
    sortColumn,
    sortRow,
    splitColumn,
    splitRow,
    swap,
    swapColumns,
    swapDiagonals,
    swapRows,
    swapValues,
} from "./operations.js";
import { SlotCreator, create } from "./patterns.js";
import { SlotTester, findSlots, getColumn, getDiagonal, getRow, getValue, isNumberMat, setValue } from "./utils.js";

export default class Matrix<T = unknown> {
    private rows: number;
    private columns: number;
    private matrix: T[];

    constructor(rows: number, columns: number, input: T[] | SlotCreator<T>) {
        const mat = Array.isArray(input) ? input : create(rows, columns, input);

        if (mat.length !== rows * columns) {
            throw new Error("Matrix array length should be equal to area of the matrix (rows * columns).");
        }

        this.set(mat);
        this.rows = rows;
        this.columns = columns;
    }

    private set = (mat: T[]) => {
        this.matrix = [...mat];
    };

    public log = () => log<T>(this.columns, this.matrix);

    public get = (): T[] => [...this.matrix];
    public getValue = (row: number, column: number): T => {
        let value = getValue<T>(row, column, this.columns, this.matrix);

        if (typeof value === "object" && value !== null) {
            value = (Array.isArray(value) ? [...value] : { ...value }) as T;
        }

        return value;
    };
    public getRow = (index: number) => getRow<T>(index, this.columns, this.matrix);
    public getColumn = (index: number) => getColumn<T>(index, this.columns, this.matrix);
    public getDiagonal = (direction: "\\" | "/" = "\\") =>
        validateSquare(this.rows, this.columns) && getDiagonal<T>(this.rows, this.matrix, direction);
    public getRowsCount = () => this.rows;
    public getColumnsCount = () => this.columns;

    public setValue = (value: T, row: number, column: number): void => setValue<T>(value, row, column, this.columns, this.matrix);

    public findSlots = (testFunc?: SlotTester<T>) => findSlots(this.columns, this.matrix, testFunc);

    public reverse = () => {
        this.matrix = reverse<T>(this.matrix);
    };
    public reverseRow = (index: number) => {
        this.matrix = reverseRow<T>(index, this.columns, this.matrix);
    };
    public reverseColumn = (index: number) => {
        this.matrix = reverseColumn<T>(index, this.columns, this.matrix);
    };
    public reverseDiagonal = (direction: "\\" | "/" = "\\") => {
        if (validateSquare(this.rows, this.columns)) {
            this.matrix = reverseDiagonal<T>(this.rows, this.matrix, direction);
        }
    };

    public swap = () => {
        this.matrix = swap<T>(this.columns, this.matrix);
    };
    public swapValues = (rowA: number, columnA: number, rowB: number, columnB: number) => {
        this.matrix = swapValues<T>(rowA, columnA, rowB, columnB, this.columns, this.matrix);
    };
    public swapRows = (a: number, b: number) => {
        this.matrix = swapRows<T>(a, b, this.columns, this.matrix);
    };
    public swapColumns = (a: number, b: number) => {
        this.matrix = swapColumns<T>(a, b, this.columns, this.matrix);
    };
    public swapDiagonals = () => {
        if (validateSquare(this.rows, this.columns)) {
            this.matrix = swapDiagonals<T>(this.rows, this.matrix);
        }
    };

    public addRow = (index: number, values: T[]) => {
        this.matrix = addRow(index, values, this.columns, this.matrix);
        this.rows++;
    };
    public addColumn = (index: number, values: T[]) => {
        this.matrix = addColumn<T>(index, values, this.columns, this.matrix);
        this.columns++;
    };

    public removeRow = (index: number) => {
        this.matrix = removeRow<T>(index, this.columns, this.matrix);
        this.rows--;
    };
    public removeColumn = (index: number) => {
        this.matrix = removeColumn<T>(index, this.columns, this.matrix);
        this.columns--;
    };

    public replaceRow = (index: number, values: T[]) => {
        this.matrix = replaceRow<T>(index, values, this.columns, this.matrix);
    };
    public replaceColumn = (index: number, values: T[]) => {
        this.matrix = replaceColumn<T>(index, values, this.columns, this.matrix);
    };
    public replaceDiagonal = (newValues: T[], direction: "\\" | "/" = "\\") => {
        if (validateSquare(this.rows, this.columns)) {
            this.matrix = replaceDiagonal<T>(newValues, this.rows, this.matrix, direction);
        }
    };

    public merge = (mat: T[], mergeHandler: (a: T, b: T) => T) => {
        this.matrix = merge(this.matrix, mat, mergeHandler);
    };
    public mergeRows = (index: number, mergeHandler: (a: T, b: T) => T) => {
        this.matrix = mergeRows<T>(index, mergeHandler, this.columns, this.matrix);
        this.rows--;
    };
    public mergeColumns = (index: number, mergeHandler: (a: T, b: T) => T) => {
        this.matrix = mergeColumns<T>(index, mergeHandler, this.columns, this.matrix);
        this.columns--;
    };

    public splitRow = (index: number, splitHandler: (a: T) => [T, T]) => {
        this.matrix = splitRow<T>(index, splitHandler, this.columns, this.matrix);
        this.rows++;
    };
    public splitColumn = (index: number, splitHandler: (a: T) => [T, T]) => {
        this.matrix = splitColumn<T>(index, splitHandler, this.columns, this.matrix);
        this.columns++;
    };

    public sort = (sorter: "asc" | "desc" | Sorter<T>) => {
        this.matrix = sort(sorter, this.matrix);
    };
    public sortRow = (index: number, sorter: "asc" | "desc" | Sorter<T>) => {
        this.matrix = sortRow(index, sorter, this.columns, this.matrix);
    };
    public sortColumn = (index: number, sorter: "asc" | "desc" | Sorter<T>) => {
        this.matrix = sortColumn(index, sorter, this.columns, this.matrix);
    };

    public mult = (mat: Matrix) => {
        const m = mat.get();

        if (!(isNumberMat(this.matrix) && isNumberMat(m))) throw new Error("Both matrices must be of number type.");

        this.matrix = mult(
            { mat: this.matrix, rows: this.rows, columns: this.columns },
            { mat: m, rows: mat.getRowsCount(), columns: mat.getColumnsCount() }
        ) as T[];
        this.columns = mat.getColumnsCount();
    };
}
