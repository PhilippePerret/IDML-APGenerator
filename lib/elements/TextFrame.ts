import { BuilderXML } from "../BuilderXML";
import { throwError } from "../Messagerie";
import type { BookDataType, RecType } from "../types/types";
import { AbstractElementClass } from "./AbstractElementClass";

export class TextFrame extends AbstractElementClass {
  constructor(data: RecType, bookData: BookDataType){
    super(data, bookData);
    this.parentStory || throwError('story-undef-in-textframe', [this.self])
  }

  /**
   * Retourne le code XML pour l'élément
   */
  toXml(){
    const contenu = this.buildThisContent();
    return BuilderXML.xmlTag(
      'TextFrame',
      `<Properties>\n${contenu}\n</Properties>`,
      [
        ['Self', this.self], 
        ['ParentStory', this.parentStory], 
        ['ContentType', this.contentType],
        ['ItemTransform', this.itemTransform]
      ]
    );
  }

  buildThisContent(): string {
    const c: string[] = [];

    // Finalisation
    return c.join("\n")
      .wrapIn('PathPointArray')
      .wrapIn('GeometryPath', [['PathOpen', 'false']])
      .wrapIn('PathGeometry')
  }


  private get parentStory(){ return this.data.story || this.data.parentStory; }
  private get contentType(){ return this.data.contentType || 'TextType';}
  private get itemTransform(){
    switch(this.data.origin){
      case 'top-left':
        return `1 0 0 1 -${this.bookData.pageHeight} -${this.bookData.pageWidth}`;
      default:
        return '1 0 0 1 0 0'
    }
  }
}