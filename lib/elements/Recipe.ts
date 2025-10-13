import path from "path";
// import fs from "fs";
import type { BookDataType, RecType, SpreadType } from "../types/types";
import { arrondis, Calc } from "../utils/utils_calculs";
import { Story } from "./Story";
import { Spread } from "./Spread";

export class Recipe {


  static DEFAULT_BOOK_DATA: RecType = {
    type: 'book', // book ou magazine ou document
    width: 595,
    height: 842,
    bleed: 8.5, // 3mm
    Tmargin: 56.7, // 20 mm
    Bmargin: 56.7,
    Lmargin: 42.5, // 15 mm
    Rmargin: 42.5,
    Imargin: 42.5,
    Emargin: 28.3,
  }


  /**
   * Fonction qui applique les valeurs par défaut aux préférences
   * transmises en argument.
   * 
   */
  public static defaultize(bookData: BookDataType): void {
    const bdata = bookData; // brièveté

    function assign(prop: string, value: any) {
      Object.assign(bdata, {[prop]: value});
    }
    bdata.idmlFolder || assign('idmlFolder', path.join(bdata.bookFolder, bdata.idmlFolderName || 'idml'));

    // Dimensions du livre
    const dbook = bdata.book || {};

    bdata.book.recto_verso = bdata.book.type !== 'document';

    [
      'width', 'height', 'bleed', 'Tmargin', 'Bmargin', 'Lmargin', 'Rmargin', 'Imargin', 'Emargin'
    ].forEach( prop => {
      const value = Calc.any2pt(dbook[prop]) || this.DEFAULT_BOOK_DATA[prop];
      Object.assign(dbook, {[prop]: value});
    })
    // On calcul les valeurs utiles
    Object.assign(dbook, {
      type: dbook.type || this.DEFAULT_BOOK_DATA.type,
      innerWidth: dbook.width - (dbook.Lmargin + dbook.Rmargin),
      innerHeight: dbook.height - (dbook.Tmargin + dbook.Bmargin)
    })
    assign('book', dbook);
    assign('pageHeight', bdata.book.height);
    assign('pageWidth', bdata.book.width);
    assign('bookWidth', bdata.book.recto_verso ? arrondis(2 * bdata.book.width) : bdata.book.width);
    assign('bookHeight', bdata.book.height);



    // console.log("recipe.book = ", dbook);
    // console.log("bdata = ", bdata);

    // Définition des préférences
    // ---------------------------
    const prefs = bdata.preferences || {}
    Object.assign(prefs, {
      attrs: [
        ['FacingPages', !(bdata.book.type === 'document')],
        ['PageWidth', bdata.pageWidth], // double si double-page
        ['PageHeight', bdata.book.height],
        ['PageBinding', 'LeftToRight'],
        ['DocumentBleedTopOffset', bdata.book.bleed],
        ['DocumentBleedUniformSize', true], // se sert donc de BleedTopOffset 
      ],
      properties: []
    })
    switch(bdata.book.type) {
      case 'book':
        break;
      case 'magazine':
        break;
      case 'document':
        break;
    }
    assign('preferences', {document: prefs});

    // Définition des textes 
    // ---------------------
    // Soit ils sont définis dans l'ordre dans la recette dans une 
    // propriété 'textes', soit on prend les fichiers (en général un 
    // seul dans ce cas-là) dans le dossier 'Texte
    bdata.stories || assign('stories', Story.getStories(bdata));

    // Définition des maquettes (MasterSpreads)
    // ----------------------------------------
    // Si elles sont définies seulement
    if (bdata.masterSpreads || bdata.maquettes) {

    }
    // définition des planches (Spreads)
    // ---------------------------------
    // Soit elles sont définies, soit il faut juste en faire pour
    // les textes existants (une planche par story);
    bdata.spreads || assign('spreads', []);
    const spreads: SpreadType[] = []
    if (bdata.spreads.length === 0) {
      bdata.stories.forEach(story => {
        spreads.push(...Spread.spreadsForStory(story, bdata));
      });
      bdata.spreads = spreads;
    }

    bdata.archName || assign('archName', 'book.idml')
    assign('archivePath', path.join(bdata.bookFolder, bdata.archName));
    // console.log("bdata à la fin de défautise", bdata);
    // throw new Error("Pour voir les données recette défautisées à la fin de la fonction");
 
  }
}