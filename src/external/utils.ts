export const isNumberMat = (mat: unknown[]): mat is number[] => mat.every(v => typeof v === "number");

export const convertByPerc = (
    sourceMat: { rows: number; columns: number; row: number; column: number },
    destinationMat: { rows: number; columns: number }
) => {
    const row = ((destinationMat.rows - 1) / 100) * ((sourceMat.row / (sourceMat.rows - 1)) * 100)
    const column = ((destinationMat.columns - 1) / 100) * ((sourceMat.column / (sourceMat.columns - 1)) * 100)

    return {
        row: Number.isNaN(row) ? 0 : row,
        column: Number.isNaN(column) ? 0 : column,
    };
};
