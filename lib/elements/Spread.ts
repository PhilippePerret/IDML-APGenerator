import { BuilderXML } from "../BuilderXML";
import { IDML } from "../IDML";
import { throwError } from "../Messagerie";
import type { BookDataType, RecType, XMLObjet } from "../types/types";
import { AbstractElementClass } from "./AbstractElementClass";
import { TextFrame } from "./TextFrame";

/**
 * Element Spread (maquette/page)
 */
export class Spread extends AbstractElementClass {

  constructor(data: RecType, bookData: BookDataType){ super(data, bookData); }

  /**
   * Retourne le code XML complet à copier dans le document 
   * Spreads.xml du package IDML
   */
  public toXml(){
   const content = this.children.map((child: RecType)  => {
      child.type || throwError('undef-element-type-in-children', [JSON.stringify(child)]);
      // Construction de l'élément en fonction de son type
      switch(child.type){
        case 'TextFrame': return new TextFrame(child, this.bookData).toXml();
        default: 
          throwError('unknown-element-type', [child.type]);
      }
    }).join("\n");
 
    return BuilderXML.xmlTag(
      'Spread',
      content,
      [['PageCount', this.pageCount]]
    );
  }

 private get pageCount(){
    return this.data.PageCount || '1';
  }

}