import { test, expect } from "bun:test";
import { Builder } from "../lib/Builder";
/**
 * Ce module n'est pas un test
 * Il permet de faire des essais de modification de code sur un 
 * dossier IDML et de produire l'archive (puis de l'ouvrir dans AP)
 * pour voir le résultat.
 * 
 * Jouer bun test test/sandbox_test.ts
 * 
 */
test("Pour essayer du code", async () => {
  const bookPath = 'books/minimal-prod';
  await Builder.buildBook(bookPath, {rebuild: false, open_in_AP: true});
  console.log("Le livre doit être prêt et doit être ouvert dans Affinity Publisher.");
})