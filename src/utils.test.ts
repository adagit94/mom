import { expect, test } from "@jest/globals";
import {
  chooseDirection,
  chooseDirectionSteps,
  getShortestDistance,
  getShortestPath,
  recomputeProportionalyRounded,
} from "./utils";

test("recomputeProportionalyRounded()", () => {
  {
    const sourceMatInfo = { rows: 10, columns: 10, row: 5, column: 5 };
    const destinationMatInfo = { rows: 100, columns: 100 };

    expect(recomputeProportionalyRounded(sourceMatInfo, destinationMatInfo)).toEqual({ row: 49, column: 49 });
  }

  {
    const sourceMatInfo = { rows: 3, columns: 3, row: 2, column: 2 };
    const destinationMatInfo = { rows: 2, columns: 2 };

    expect(recomputeProportionalyRounded(sourceMatInfo, destinationMatInfo)).toEqual({ row: 0, column: 0 });
  }
});

test("chooseDirection()", () => {
  expect(chooseDirection({ row: 1, column: 1 }, { row: 1, column: 1 })).toEqual([0, 0]);
  expect(chooseDirection({ row: 0, column: 0 }, { row: 0, column: 2 })).toEqual([1, 0]);
  expect(chooseDirection({ row: 0, column: 2 }, { row: 0, column: 0 })).toEqual([-1, 0]);
  expect(chooseDirection({ row: 0, column: 1 }, { row: 2, column: 1 })).toEqual([0, 1]);
  expect(chooseDirection({ row: 2, column: 1 }, { row: 0, column: 1 })).toEqual([0, -1]);
  expect(chooseDirection({ row: 0, column: 0 }, { row: 2, column: 2 })).toEqual([1, 1]);
  expect(chooseDirection({ row: 2, column: 2 }, { row: 0, column: 0 })).toEqual([-1, -1]);
  expect(chooseDirection({ row: 2, column: 0 }, { row: 0, column: 2 })).toEqual([1, -1]);
  expect(chooseDirection({ row: 0, column: 2 }, { row: 2, column: 0 })).toEqual([-1, 1]);

  expect(chooseDirection({ row: 1, column: 1 }, { row: 0, column: 1 })).toEqual([0, -1]);
  expect(chooseDirection({ row: 1, column: 1 }, { row: 0, column: 2 })).toEqual([1, -1]);
  expect(chooseDirection({ row: 1, column: 1 }, { row: 1, column: 2 })).toEqual([1, 0]);
  expect(chooseDirection({ row: 1, column: 1 }, { row: 2, column: 2 })).toEqual([1, 1]);
  expect(chooseDirection({ row: 1, column: 1 }, { row: 2, column: 1 })).toEqual([0, 1]);
  expect(chooseDirection({ row: 1, column: 1 }, { row: 2, column: 0 })).toEqual([-1, 1]);
  expect(chooseDirection({ row: 1, column: 1 }, { row: 1, column: 0 })).toEqual([-1, 0]);
  expect(chooseDirection({ row: 1, column: 1 }, { row: 0, column: 0 })).toEqual([-1, -1]);
});

test("chooseDirectionSteps()", () => {
  expect(chooseDirectionSteps({ row: 1, column: 1 }, { row: 1, column: 1 })).toEqual({ vecs: [0, 0], steps: 0 });
  expect(chooseDirectionSteps({ row: 0, column: 0 }, { row: 0, column: 2 })).toEqual({ vecs: [2, 0], steps: 2 });
  expect(chooseDirectionSteps({ row: 0, column: 1 }, { row: 2, column: 1 })).toEqual({ vecs: [0, 2], steps: 2 });
  expect(chooseDirectionSteps({ row: 2, column: 0 }, { row: 0, column: 2 })).toEqual({ vecs: [2, -2], steps: 2 });
  expect(chooseDirectionSteps({ row: 0, column: 2 }, { row: 2, column: 0 })).toEqual({ vecs: [-2, 2], steps: 2 });
  expect(chooseDirectionSteps({ row: 2, column: 0 }, { row: 0, column: 1 })).toEqual({ vecs: [1, -1], steps: 1 });
});

test("getShortestDistance()", () => {
  expect(getShortestDistance({ row: 2, column: 0 }, { row: 0, column: 1 })).toEqual(2);
});

test("getShortestPath()", () => {
  expect(getShortestPath({ row: 2, column: 0 }, { row: 0, column: 1 })).toEqual([
    { row: 1, column: 1 },
    { row: 0, column: 1 },
  ]);
});
