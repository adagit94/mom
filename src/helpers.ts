export const log = <T = unknown>(
    columns: number,
    mat: T[],
): void => {
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
    str += '  ';

    return str;
  });

  console.log(strs.join(''));
};

export const validateSquare = (rows: number, columns: number) => {
  if (rows !== columns) {
    throw new Error('Rows and columns count must be equal.');
  }

  return true;
};
