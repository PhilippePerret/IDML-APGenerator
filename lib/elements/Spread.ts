import path from "path";
import { BuilderXML } from "../BuilderXML";
import { IDML } from "../IDML";
import { throwError } from "../Messagerie";
import type { BookDataType, RecType, XMLObjet, XMLRootType } from "../types/types";
import { AbstractElementClass } from "./AbstractElementClass";
import { Story } from "./Story";
import { TextFrame } from "./TextFrame";

/**
 * Element Spread (maquette/page)
 */
export class Spread extends AbstractElementClass {

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
      attrs: [['Self', this.self], ['PageCount', this.pageCount]]
    }

    new BuilderXML({
      path: path.join(this.bookData.idmlFolder, 'Spreads', `Spread_${this.self}.xml`),
      content: content,
      root: root
    }).output();
    return true
  }
  /**
   * Retourne le code XML complet à copier dans le document 
   * Spreads.xml du package IDML
   */
  public XMLContent(): string {
   const content = this.children.map((child: RecType)  => {
      child.type || throwError('undef-element-type-in-children', [JSON.stringify(child)]);
      // Construction de l'élément en fonction de son type
      switch(child.type){
        case 'TextFrame': return new TextFrame(child, this.bookData).toXml();
        default: 
          throwError('unknown-element-type', [child.type]);
      }
    })
    
    return content.join("\n");
  }

 private get pageCount(){
    return this.data.PageCount || '1';
  }

}