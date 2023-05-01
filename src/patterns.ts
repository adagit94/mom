export const create = <T = unknown>(rows: number, columns: number, slotHandler: (r: number, c: number) => T): T[] => {
    let mat: T[] = []
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            mat.push(slotHandler(r, c))
        }
    }

    return mat
};

export const alternating = <A = unknown, B = unknown>(rows: number, columns: number, a: A, b: B) => create(rows, columns, (r, c) => {
    const evenR = r % 2 === 0
    const evenC = c % 2 === 0

    if (evenR) {
        if (evenC) return a
        return b
    } else {
        if (evenC) return b
        return a
    }
});
