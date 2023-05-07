export const validateSquare = (rows: number, columns: number) => {
  if (rows !== columns) {
    throw new Error('Rows and columns count must be equal.');
  }

  return true;
};