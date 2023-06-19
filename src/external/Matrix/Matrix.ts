import { validateSquare } from "../../internal/helpers.js";
import { Sorter } from "../../internal/utils.js";
import { log } from "../helpers.js";
import {
    addColumn,
    addRow,
    merge,
    mergeColumns,
    mergeRows,
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
} from "../operations.js";
import { SlotCreator, create } from "../patterns.js";
import { SlotTester, findSlots, getColumn, getDiagonal, getRow } from "../utils.js";

export default class Matrix<T = unknown> {
    private rows: number;
    private columns: number;
    private matrix: T[];

    constructor(rows: number, columns: number, input: T[] | SlotCreator<T>) {
        this.rows = rows;
        this.columns = columns;
        this.set(Array.isArray(input) ? input : create(rows, columns, input));
    }

    private set = (mat: T[]) => {
        this.matrix = structuredClone(mat);
    };

    public log = () => log<T>(this.columns, this.matrix);

    public get = (): T[] => structuredClone(this.matrix);
    public getRow = (index: number) => structuredClone(getRow<T>(index, this.columns, this.matrix));
    public getColumn = (index: number) => structuredClone(getColumn<T>(index, this.columns, this.matrix));
    public getDiagonal = (direction: "\\" | "/" = "\\") =>
        structuredClone(validateSquare(this.rows, this.columns) && getDiagonal<T>(this.rows, this.matrix, direction));

    public findSlots = (testFunc?: SlotTester<T>) => structuredClone(findSlots(this.columns, this.matrix, testFunc));

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
        this.matrix = validateSquare(this.rows, this.columns) && reverseDiagonal<T>(this.rows, this.matrix, direction);
    };

    public swap = () => {
        this.matrix = swap<T>(this.columns, this.matrix);
    };
    public swapRows = (a: number, b: number) => {
        this.matrix = swapRows<T>(a, b, this.columns, this.matrix);
    };
    public swapColumns = (a: number, b: number) => {
        this.matrix = swapColumns<T>(a, b, this.columns, this.matrix);
    };
    public swapDiagonals = () => {
        this.matrix = validateSquare(this.rows, this.columns) && swapDiagonals<T>(this.rows, this.matrix);
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
        this.matrix = validateSquare(this.rows, this.columns) && replaceDiagonal<T>(newValues, this.rows, this.matrix, direction);
    };

    public merge = (mat: T[], mergeHandler: (a: T, b: T) => T) => {
        this.matrix = structuredClone(merge(this.matrix, mat, mergeHandler));
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
}
