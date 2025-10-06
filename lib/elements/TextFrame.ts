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
    // Position et taille
    // ------------------
    // Rappel : Anchor = Coordonnées 'Left Top' du point
    //          LeftDirection = idem pour la poignée de Bézier gauche
    //          RightDirection = idem pour la poignée de Bézier droite
    const modele = '<PathPoint Anchor="_PT_" LeftDirection="_LD_" RightDirection="_RD_"/>';
    // On fait les points en fonction de la définition des coordonnées
    // du textframe. Ces coordonnées peuvent être définies par une 
    // liste de points ou une paire de définitions
    let points: any[];
    switch(this.coordonates){
      case ['top-left', 'bottom-righ']:
        points = [[0, 0], [this.pageWidth, 0], [this.pageWidth, this.pageHeight], [0, this.pageHeight]];
        break;
      default: 
        points = this.coordonates;
    }
    points.forEach((point: [number, number]) => {
      const pt = point.join(' ')
      c.push(modele.replace(/_(PT|LD|RD)_/g, pt)); // Pour le moment, pas de courbure
    })

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
        return `1 0 0 1 -${this.pageHeight} -${this.pageWidth}`;
      default:
        return '1 0 0 1 0 0'
    }
  }

  private get coordonates(){return this.data.coor || this.data.coordonates || ['top-left', 'bottom-right'];}
  private get pageWidth(){ return this.bookData.pageWidth;}
  private get pageHeight(){ return this.bookData.pageHeight;}
}