import { test, expect } from "bun:test";
import { Builder } from "../lib/Builder";

/**
 * Ce module n'est pas un test
 * Il permet de faire des essais de modification de code sur un 
 * dossier IDML et de produire l'archive (puis de l'ouvrir dans AP)
 * pour voir le résultat.
 * 
 * Indiquer ci-dessous le livre à utiliser (BOOK)
 * Définir ensuite si on veut le construire entièrement (première fois)
 * en mettant BUILD à true.
 * Mettre ensuite BUILD à false après avoir modifier le code XML de
 * l'archive IDML pour voir le résultat.
 * 
 * Jouer bun test test/sandbox_test.ts chaque fois.
 * 
 */
const BOOK = 'book-A4';
// const BOOK = 'minimal-prod';
const BUILD = true; 
// const BUILD = false; 
const REBUILD = true;
// const REBUILD = false;
const OPEN_IN_AFFINITY = true;
// const OPEN_IN_AFFINITY = false;

test("Pour essayer un book", async () => {
  const bookPath = `books/${BOOK}`;
  await Builder.buildBook(bookPath, {force_rebuild: REBUILD, rebuild: BUILD, open_in_AP: OPEN_IN_AFFINITY});
  console.log("Le livre doit être prêt et doit être ouvert dans Affinity Publisher.");
})