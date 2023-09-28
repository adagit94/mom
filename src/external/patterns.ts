export type SlotCreator<T = unknown> = (r: number, c: number) => T;

export const create = <T = unknown>(rows: number, columns: number, slotCreator: SlotCreator<T>): T[] => {
    let mat: T[] = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            mat.push(slotCreator(r, c));
        }
    }

    return mat;
};

export const alternating = (rows: number, columns: number) =>
    create(rows, columns, (r, c) => {
        const evenR = r % 2 === 0;
        const evenC = c % 2 === 0;

        if (evenR) {
            if (evenC) return 0;
            return 1;
        } else {
            if (evenC) return 1;
            return 0;
        }
    });

export const concentricSquares = (rows: number, columns: number) => {
    if (rows !== columns) throw new Error(`Rows (${rows}) and columns (${columns}) count should match.`)

    const half = rows / 2
    const odd = rows % 2 !== 0
    const its = odd ? Math.ceil(half) : half
    let mat: number[] = []

    for (let y = 0; y < its; y++) {
        let row: number[] = []

        for (let x = 0; x < its; x++) {
            row.push(Math.min(x, y))
        }

        row.push(...row.slice(0, odd ? row.length - 1 : row.length).reverse())
        mat.push(...row)
    }

    mat.push(...mat.slice(0, odd ? mat.length - columns : mat.length).reverse())

    return mat
};
