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

  public static spreadForStory(story: StoryType, bdata: BookDataType): SpreadType {
    const width = Calc.any2pt(bdata.document.width || bdata.pageWidth);
    const height = Calc.any2pt(bdata.document.height || bdata.pageHeight);
    console.log("width / height = %i / %i", width, height);
    return {
      uuid: IDML.generateId(),
      pageCount: 1,
      children: [
        {type: 'TextFrame', story: story.uuid, bounds: {x: 0, y: 0, w: width, h: height}}
      ]
    } as SpreadType;
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
   * Dont, principalement ou pour commencer, les dimensions du document
   * si elles sont définies
   */
  private pageAttributes(): [string, any][] {

    const bdata = this.bookData;
    const attrs: [string, any][] = [['Self', this.self]];

    attrs.push();

    if (bdata.document && bdata.document.height) {
      attrs.push(['GeometricBounds', `0 0 ${Calc.any2pt(bdata.document.height)} ${Calc.any2pt(bdata.document.width)}`]);
      attrs.push(['ItemTransform', '1 0 0 1 0 0']);
    }

    return attrs;
  }

  /**
   * Retourne le code XML complet à copier dans le document 
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
    content.unshift(BuilderXML.xmlTag('Page', undefined, this.pageAttributes()));
    
    return content.join("\n");
  }

 private get pageCount(){
    return this.data.PageCount || '1';
  }

}