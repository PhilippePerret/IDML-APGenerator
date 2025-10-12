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
    const modele = '<PathPointType Anchor="_PT_" LeftDirection="_LD_" RightDirection="_RD_"/>';
    // On a besoin des données du document pour les marges et autres
    const ddoc = this.bookData.document;
    // On fait les points en fonction de la définition des coordonnées
    // du textframe. Ces coordonnées peuvent être définies par une 
    // liste de points ou une paire de définitions
    let points: any[] = [];
    const xL = ddoc.Lmargin || ddoc.Emargin;
    const yT = ddoc.Tmargin;
    const width = this.pageWidth - xL - (ddoc.Rmargin || ddoc.Imargin);
    const height = this.pageHeight - yT - (ddoc.Bmargin);
    const yB = yT + height;
    const xR = xL + width;
    if (this.coordonates[0] === 'top-left') {
      points.push(...[[xL, yT], [xL, yB]]);
    }
    if (this.coordonates[1] === 'bottom-right') {
      points.push(...[[xR, yB], [xR, yT]]);
    }
    if (points.length === 0){
      points = this.coordonates;
    }
    points.forEach((point: [number, number]) => {
      // console.log("point = ", point);
      const pt = point.join(' ')
      c.push(modele.replace(/_(PT|LD|RD)_/g, pt)); // Pour le moment, pas de courbure
    })

    // Finalisation
    return c.join("\n").wrapIn('PathPointArray')
      .wrapIn('GeometryPathType')
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