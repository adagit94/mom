import Matrix from "../Matrix/Matrix.js";
import { Slot } from "../utils.js";

export type Message = { value: unknown };

export type Side = "top" | "bottom" | "right" | "left";

export type IO = {
    id: string | number;
    index: number;
    side: Side;
    emit: (msg: Message) => void;
    receive: (msg: Message) => void;
};

export type NodeAccumulator = { queue: Message[] };

export type NodeRouter = (msg: Message, acc: NodeAccumulator) => [Side, Message][] | void;

export type Node = {
    id: string | number;
    route: NodeRouter;
    accumulator: NodeAccumulator;
};

export type Rows = {
    top: (IO | undefined)[];
    bottom: (IO | undefined)[];
};

export type Columns = {
    right: (IO | undefined)[];
    left: (IO | undefined)[];
};

export type Conf = {
    rows: number;
    columns: number;
};

class MatrixRouter {
    private matrix: Matrix<Node | undefined>;
    private rows: Rows;
    private columns: Columns;

    constructor(conf: Conf) {
        this.matrix = new Matrix(conf.rows, conf.columns, new Array(conf.rows * conf.columns));
        this.rows = { top: new Array(conf.columns), bottom: new Array(conf.columns) };
        this.columns = { left: new Array(conf.rows), right: new Array(conf.rows) };
    }

    public getMatrix = () => this.matrix;

    private getIOInternal = (side: Side, index: number): IO | undefined => {
        switch (side) {
            case "top":
            case "bottom":
                return this.rows[side][index];

            case "left":
            case "right":
                return this.columns[side][index];
        }
    };

    public getIOByID = (side: Side, id: number | string): Omit<IO, "receive"> | undefined => {
        let io: IO | undefined;

        switch (side) {
            case "top":
            case "bottom":
                io = this.rows[side].find(io => io?.id === id);
                break;

            case "left":
            case "right":
                io = this.columns[side].find(io => io?.id === id);
                break;
        }

        if (io) io = { ...io };

        return io;
    };

    public getIOByIndex = (side: Side, index: number): Omit<IO, "receive"> | undefined => {
        let io: IO | undefined;

        switch (side) {
            case "top":
            case "bottom":
                io = this.rows[side][index];
                break;

            case "left":
            case "right":
                io = this.columns[side][index];
                break;
        }

        if (io) io = { ...io };

        return io;
    };

    public swapIOs = (sideA: Side, indexA: number, sideB: Side, indexB: number) => {
        const a = this.getIOInternal(sideA, indexA);
        const b = this.getIOInternal(sideB, indexB);

        if (a === undefined) throw new Error(`IO A not found (side: ${sideA}, index: ${indexA}).`);
        if (b === undefined) throw new Error(`IO B not found (side: ${sideB}, index: ${indexB}).`);

        this.setIO(sideB, indexB, a.id, a.receive);
        this.setIO(sideA, indexA, b.id, b.receive);
    };

    public setIO = (side: Side, index: number, id: number | string, receiver?: (msg: Message) => void) => {
        const io = {
            side,
            index,
            id,
            emit: (msg: Message) => this.emitMessage(io, msg),
            receive: (msg: Message) => receiver?.(msg),
        };

        switch (side) {
            case "top":
            case "bottom": {
                this.rows[side][index] = io;

                const colsCount = this.matrix.getColumnsCount();

                if (io.index >= colsCount) {
                    const colsToAdd = io.index - (colsCount - 1);
                    const colValues = new Array(this.matrix.getRowsCount()).map(() => undefined);

                    for (let i = 0; i < colsToAdd; i++) {
                        this.matrix.addColumn(colsCount + i, colValues);
                    }
                }

                break;
            }

            case "left":
            case "right": {
                this.columns[side][index] = io;

                const rowsCount = this.matrix.getRowsCount();

                if (io.index >= rowsCount) {
                    const rowsToAdd = io.index - (rowsCount - 1);
                    const rowValues = new Array(this.matrix.getColumnsCount()).map(() => undefined);

                    for (let i = 0; i < rowsToAdd; i++) {
                        this.matrix.addRow(rowsCount + i, rowValues);
                    }
                }

                break;
            }
        }
    };

    public clearIO = (side: Side, index: number) => {
        switch (side) {
            case "top":
            case "bottom":
                this.rows[side][index] = undefined;
                break;

            case "left":
            case "right":
                this.columns[side][index] = undefined;
                break;
        }
    };

    public swapNodes = (rowA: number, columnA: number, rowB: number, columnB: number) => {
        const a = this.matrix.getValue(rowA, columnA);
        const b = this.matrix.getValue(rowB, columnB);

        if (a === undefined) throw new Error(`Node A not found (row: ${rowA}, column: ${columnA}).`);
        if (b === undefined) throw new Error(`Node B not found (row: ${rowB}, column: ${columnB}).`);

        this.setNode(rowB, columnB, a.id, a.route);
        this.setNode(rowA, columnA, b.id, b.route);
    };

    public setNode = (row: number, column: number, id: string | number, router: NodeRouter) => {
        this.matrix.setValue({ id, route: router, accumulator: { queue: [] } }, row, column);
    };

    public clearNode = (row: number, column: number) => {
        this.matrix.setValue(undefined, row, column);
    };

    public swapRows = (a: number, b: number) => {
        const aIOs = [this.columns.left[a], this.columns.right[a]];
        const bIOs = [this.columns.left[b], this.columns.right[b]];

        this.columns.left[a] = bIOs[0];
        this.columns.right[a] = bIOs[1];
        this.columns.left[b] = aIOs[0];
        this.columns.right[b] = aIOs[1];

        this.matrix.swapRows(a, b);
    };

    public swapColumns = (a: number, b: number) => {
        const aIOs = [this.rows.top[a], this.rows.bottom[a]];
        const bIOs = [this.rows.top[b], this.rows.bottom[b]];

        this.rows.top[a] = bIOs[0];
        this.rows.bottom[a] = bIOs[1];
        this.rows.top[b] = aIOs[0];
        this.rows.bottom[b] = aIOs[1];

        this.matrix.swapColumns(a, b);
    };

    private emitMessage = (io: IO, msg: Message) => {
        const node = this.findNode(io.side, io.index, (getPolarity(io.side) * -1) as 1 | -1);

        this.routeMessage(node, msg, {
            side: getOppositeSide(io.side),
            index: io.index,
        });
    };

    private routeMessage = (node: Slot<Node | undefined> | undefined, msg: Message, ioLocation: { side: Side; index: number }) => {
        if (node) {
            const sides = node.value?.route(msg, node.value.accumulator);

            if (sides !== undefined && sides.length > 0) {
                for (const [side, msg] of sides) {
                    const isRow = side === "top" || side === "bottom";
                    const n = this.findNode(side, isRow ? node.column : node.row, getPolarity(side), isRow ? node.row : node.column);

                    this.routeMessage(n, msg, {
                        side,
                        index: isRow ? node.column : node.row,
                    });
                }
            }

            return;
        }

        const io = this.getIOInternal(ioLocation.side, ioLocation.index);

        if (io) io.receive(msg);
    };

    private findNode = (side: Side, ioIndex: number, polarity: 1 | -1, initialNodeIndex?: number) => {
        let set: (Node | undefined)[];

        switch (side) {
            case "top":
            case "bottom":
                set = this.matrix.getColumn(ioIndex);
                break;

            case "left":
            case "right":
                set = this.matrix.getRow(ioIndex);
                break;
        }

        if (initialNodeIndex === undefined) initialNodeIndex = getInitialNodeIndex(side, set);

        let node: Node | undefined;

        switch (polarity) {
            case 1:
                for (let i = initialNodeIndex + 1; i < set.length; i++) {
                    const value = set[i];

                    if (value) {
                        node = value;
                        break;
                    }
                }
                break;

            case -1:
                for (let i = initialNodeIndex - 1; i >= 0; i--) {
                    const value = set[i];

                    if (value) {
                        node = value;
                        break;
                    }
                }
                break;
        }

        if (node) {
            const n = node;

            return this.matrix.findSlots(slot => slot?.id === n.id)[0];
        }
    };
}

const getOppositeSide = (side: Side): Side => {
    switch (side) {
        case "top":
            return "bottom";

        case "bottom":
            return "top";

        case "left":
            return "right";

        case "right":
            return "left";
    }
};

const getPolarity = (side: Side): 1 | -1 => {
    switch (side) {
        case "top":
            return -1;

        case "bottom":
            return 1;

        case "left":
            return -1;

        case "right":
            return 1;
    }
};

const getInitialNodeIndex = (side: Side, set: (Node | undefined)[]): number => {
    switch (side) {
        case "top":
        case "left":
            return 0;

        case "bottom":
        case "right":
            return set.length - 1;
    }
};

export default MatrixRouter;
