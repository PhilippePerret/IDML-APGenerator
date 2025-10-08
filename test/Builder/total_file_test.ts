import { describe, test, expect } from "bun:test";
import fs from "fs";
import path from "path";
import { Builder } from "../../lib/Builder";
import { execSync } from "child_process";

function expectExists(pth: string){
  const ilexiste = fs.existsSync(pth);
  if (!ilexiste) {
    console.log("Introuvable : ", pth);
  }
  expect(ilexiste).toBeTrue();
}

describe("Builder", () => {

  test.only("permet de trouver le contenu minimal", async () => {
    /**
     * Ce test, en fait, permet de trouver le contenu minimal d'un
     * package IDML en procédant à l'envers : on part d'un package
     * qui fonctionne et on retire les éléments petit à petit.
     */
    console.log("Je commence à ", new Date());
    const bookPath = 'books/minimal';
    await Builder.buildBook(bookPath, {rebuild: false});
    console.log("Je finis la construction à ", new Date());

    const imdlfile = path.join(bookPath, 'text.idml');
    expectExists(imdlfile);

    // On essaie de l'ouvrir tout de suite dans AP
    execSync(`open "${imdlfile}"`);

  })

  test("permet de construire un livre simple complet", async () => {

    const bookPath = 'books/book1';
    Builder.buildBook(bookPath, {force_rebuild: true});
    
    const imdlFolder = path.join(bookPath,'idml')
    expectExists(imdlFolder);

    const mimetypeFile = path.join(imdlFolder, 'mimetype');
    expectExists(mimetypeFile);
    // TODO Vérifier un peu mieux

    const metainfFolder = path.join(imdlFolder, 'META-INF');
    expectExists(metainfFolder);

    const containerFile = path.join(metainfFolder, 'container.xml');
    expectExists(containerFile);
    // TODO Vérifier un peu mieux
    
    const resourcesFolder = path.join(imdlFolder, 'Resources');
    expectExists(resourcesFolder);

    const graphicFile = path.join(resourcesFolder, 'Graphic.xml');
    expectExists(graphicFile);
    // TODO Vérifier un peu mieux

    // TODO Vérifier chaque fichier (pas en profondeur)
    const fontsFile = path.join(imdlFolder, 'resources', 'Fonts.xml');
    expectExists(fontsFile);

  });
});