import { describe, test, expect } from "bun:test";
import fs from "fs";
import { createHash } from 'crypto';
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

  test.only("peut produire une archive minimale", async () => {
    /**
     * Teste une archive minimale, c'est-à-dire avec une recette
     * absolument vide qui prendra donc toutes les valeurs par
     * défaut (dossier 'minimal-prod' des assets)
     */
    const bookPath = 'books/minimal-prod';
    await Builder.buildBook(bookPath, { force_rebuild: true });
    const imdlfile = path.join(bookPath, 'book.idml');
    expectExists(imdlfile);
    expect(false).toBeTrue(); // tant que l'archive ne s'ouvre pas
  });

  test("permet de tester le contenu minimal", async () => {
    /**
     * Ce test s'assure que la production de l'archive IDML du dossier 
     * minimal fonctionne 
     */
    const bookPath = 'books/minimal-ever';
    await Builder.buildBook(bookPath, {rebuild: false});
    const imdlfile = path.join(bookPath, 'minimal.idml');
    expectExists(imdlfile);

    // Checksum
    const expected = '0aa7e6992ea25c1ceb2ba4a363df2532';
    const hash = createHash('md5');
    const data = fs.readFileSync(imdlfile);
    hash.update(data);
    const checksum = hash.digest('hex');
    expect(checksum).toBe(expected);
    // Pour corriger le checksum
    // console.log('Checksum : ' + checksum);
  });

  test("permet de trouver le contenu minimal", async () => {
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