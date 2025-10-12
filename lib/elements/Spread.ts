import fs from "fs";
import path from "path";
import { BuilderXML } from "../BuilderXML";
import { IDML } from "../IDML";
import { throwError } from "../Messagerie";
import type { BookDataType, RecType, SpreadType, StoryType, XMLObjet, XMLRootType } from "../types/types";
import { AbstractElementClass } from "./AbstractElementClass";
import { TextFrame } from "./TextFrame";
import { Calc } from "../utils_calculs";

/**
 * Element Spread (maquette/page)
 */
export class Spread extends AbstractElementClass {

  /**
   * Méthode qui détermine les données spreads (planches) quand elles
   * ne sont pas définies explicitement dans la recette, au moment de
   * la défautisation de la donnée recette.
   * 
   * Elle applique un traitement de type 'book' (book.type) car on ne
   * doit passer par ici que si ce n'est pas le type 'magazine' dans
   * lequel cas les spreads devraient être définies explicitement.
   * 
   * @param story Donnée de la story
   * @param bdata Donnée de la recette
   * @returns Les données spreads pour la recette
   */
  public static spreadsForStory(story: StoryType, bdata: BookDataType): SpreadType[] {
    const width = bdata.book.width;
    const height = bdata.book.height;

    // Nombre de pages
    // ----------------
    // SOIT il est donné explicitement pour tout le livre
    // SOIT il est donné explicitement pour chaque texte (story)
    // SOIT il est calculé ici en fonction de la longueur du texte.

    if (undefined === story.pages){
      // Pour le moment, un calcul vraiment très approximatif
      const linesPerPage = bdata.book.innerHeight / 12;
      const charsPerLine = bdata.book.innerWidth / 9;
      const charsPerPage = charsPerLine * linesPerPage;
      const textLength = fs.readFileSync(story.path, 'utf8').length;
      let nbPages = Math.round(textLength / charsPerPage);
      if ( nbPages < 1 ) nbPages = 1;
      story.pages = nbPages;
    }

    // Dimensions de toutes les frames
    const bounds = {x: bdata.book.Lmargin, y:bdata.book.Tmargin, w: bdata.book.innerWidth, h: bdata.book.innerHeight};

    // console.log("width / height = %i / %i", width, height);
    const spreads = []
    let prevTFuuid: string | undefined = undefined; // Pour conserver l'id du text-frame précédent
    for (var ipage = 0; ipage < story.pages; ++ipage) {
      const TFuuid = IDML.generateId();
      if (ipage > 0) {
        ((spreads[ipage - 1] as SpreadType).children[0] as any).next = TFuuid;
      }
      spreads.push({
        type: 'spread',
        uuid: IDML.generateId(),
        pageCount: 1,
        children: [
          {type: 'TextFrame', uuid: TFuuid, bounds: bounds, story: story.uuid, next: undefined, previous: prevTFuuid}
        ]
      } as SpreadType)
      prevTFuuid = String(TFuuid);
    }

    return spreads;
  }
  constructor(data: RecType, bookData: BookDataType){ super(data, bookData); }

  /**
   * Construction du fichier Spread dans le dossier Spreads
   */
  buildFile(): boolean {
    const root: XMLRootType = {
      isPackage: true,
      tag: 'Spread',
      DOMVersion: IDML.DOMVersion,
      xmlns: IDML.AIDHttpPackaging,
    };

    const content: XMLObjet = {
      tag: 'Spread',
      text: this.XMLContent(),
      attrs: [['PageCount', this.pageCount]]
    }

    new BuilderXML({
      path: path.join(this.bookData.idmlFolder, 'Spreads', `Spread_${this.self}.xml`),
      content: content,
      root: root
    }).output();
    return true
  }

  /**
   * Retourne les attributs pour le Spread
   * Dont, principalement ou pour commencer, les dimensions du book
   * si elles sont définies
   */
  private pageAttributes(): [string, any][] {

    const bdata = this.bookData;
    console.log("bookdata: ", this.bookData);
    const attrs: [string, any][] = [['Self', this.self]];

    attrs.push(['GeometricBounds', `0 0 ${bdata.book.height} ${bdata.book.width}`]);
    attrs.push(['ItemTransform', '1 0 0 1 0 0']);

    return attrs;
  }

  /**
   * Retourne le code XML complet à copier dans le book 
   * Spreads.xml du package IDML
   */
  public XMLContent(): string {
    // On construit les enfants
   const content = this.children.map((child: RecType)  => {
      child.type || throwError('undef-element-type-in-children', [JSON.stringify(child)]);
      // Construction de l'élément en fonction de son type
      switch(child.type){
        case 'TextFrame': return new TextFrame(child, this.bookData).toXml();
        default: 
          throwError('unknown-element-type', [child.type]);
      }
    })
    // On ajoute la page
    /*
    <MarginPreference ColumnCount="1" ColumnGutter="12" Top="36"
Bottom="36" Left="36"
Right="36" ColumnDirection="Horizontal" ColumnsPositions="0 540"/>
    */
    const marginPrefs = BuilderXML.xmlTag(
      'MarginPreference',
      undefined,
      [
        ['ColumnCount', 1],
        ['ColumnDirection', 'Horizontal'], ['ColumnGutter', '12'],
        ['ColumnPositions', `0, 100`], // Ne doit rien faire
        ['Top', this.bookData.book.Tmargin],
        ['Bottom', this.bookData.book.Bmargin],
        ['Left', this.bookData.book.Lmargin],
        ['Right', this.bookData.book.Rmargin],
      ]
    )
    let pageContent: string[] | string = []
    pageContent.push(marginPrefs);
    pageContent = pageContent.join("\n");
    content.unshift(BuilderXML.xmlTag('Page', pageContent, this.pageAttributes()));
  
    return content.join("\n");
  }

 private get pageCount(){
    return this.data.PageCount || '1';
  }

}