import fs from "fs";
import { describe, test, expect, beforeAll } from "bun:test";
import { DataProps } from "../../lib/DATA_PROPS";

describe("DataProps", () => {
  beforeAll(async () => {
    await DataProps.init();
  })
  test("permet de récupérer les données d'une propriété quelconque", () => {
    const actual = DataProps.get('FittingOption');
    expect(actual).toHaveProperty('values');
    expect(actual).toHaveProperty('default');
    expect(actual.default).toBe('Proportional');
  });

  test("lève une erreur avec une propriété inconnue", () => {
    expect(() => DataProps.get('BadPropForTest')).toThrow(/propriété "BadPropForTest" est inconnue/)
  });

  test("lève une erreur avec une propriété ambigüe, en donnant les possibles", () => {
    expect(() => DataProps.get('JPEGOptionsFormat')).toThrow(/propriété "JPEGOptionsFormat" est ambi/);
  })
});