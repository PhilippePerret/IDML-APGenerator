import path from "path";
import fs from "fs";
import type { BookDataType, RecType, XMLObjet, XMLRootType } from "./types/types";
import { isOlder } from "./utils";
import { IDML } from "./IDML";

export class Styles {
  private static bookData?: BookDataType;
  private static _filepath?: string;

  public static init(bookData: BookDataType) {
    this.bookData = bookData;
  }

  /**
   * Construction du fichier Resources/Styles.xml
   */
  public static buildResourceFile(bookData: BookDataType){
    if (!bookData.styles) { return; }
    // On ne le construit que s'il a besoin d'être actualisé, c'est
    // à-dire si le fichier recette est plus vieux (créé avant) le
    // dernier fichier des styles construits
    if (fs.existsSync(this.filePath) && isOlder(bookData.recipePath, this.filePath)){ return ;}
    // On se sert de la définition des styles
    const stylesData: RecType = bookData.styles;
    //
    let content: XMLObjet, root: XMLRootType, model: string;
    
    root = {
      isPackage: true,
      tag: 'Styles',
      xmlns: 'http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging',
      DOMVersion: '15.0'
    }
    content = {
      children: [
        {
          tag: 'RootCharacterStyleGroup',
          childTag: 'CharacterStyle', 
          children: [],
          attrs: [['Self', IDML.generateId()]]
        },
        {
          tag: 'RootParagraphStyleGroup',
          childTag: 'ParagraphStyle',
          children: [],
          attrs: [['Self', IDML.generateId()]]
        },
        {
          tag: 'TOCStyle',
          attrs: []
        },
        {
          tag: 'RootCellStyleGroup',
          children: [],
          attrs: [['Self', IDML.generateId()]]
        },
        {
          tag: 'RootTableStyleGroup',
          children: [],
          attrs: [['Self', IDML.generateId()]]
        },
        {
          tag: 'RootObjectStyleGroup',
          children: [],
          attrs: [['Self', IDML.generateId()]]
        },
        {
          tag: 'TrapPreset',
          items: [
            // {text: '...', attrs: [], ns: '...'}
          ]
        }
      ]
    } as XMLObjet;
  }

  private static get filePath(){
    return this._filepath || (this._filepath = path.join((this.bookData as BookDataType).idmlFolder, 'Resources', 'Styles.xml'))
  }
}
