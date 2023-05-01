export const log = <T = unknown>(columns: number, mat: T[]): void => {
    let strs = [];
    let highestCharsCount = 0;

    for (let s = 0; s < mat.length; s++) {
        let val = String(mat[s]);

        if (val.length > highestCharsCount) highestCharsCount = val.length;

        strs.push(val);
    }

    strs = strs.map((str, i) => {
        str = str.padStart(highestCharsCount);
        if (i > 0 && i % columns === 0) str = `\n${str}`;
        str += "  ";

        return str;
    });

    console.log(strs.join(""));
};

export const getRow = <T = unknown>(row: number, columns: number, mat: T[]): T[] => {
    const firstColumn = row * columns;

    return mat.slice(firstColumn, firstColumn + columns);
};

export const getColumn = <T = unknown>(column: number, columns: number, mat: T[]): T[] => {
    let col: T[] = [];

    for (let s = column; mat[s] !== undefined; s += columns) {
        col.push(mat[s]);
    }

    return col;
};

export const getDiagonal = <T = unknown>(size: number, mat: T[]): T[] => {
    let diagonal: T[] = [];

    for (let s = 0; mat[s] !== undefined; s += size + 1) {
        diagonal.push(mat[s]);
    }

    return diagonal;
};
