import type { XMLObjet } from "../types/types";
import { AbstractFileClass } from "./AbstractFileClass";

export class Graphic extends AbstractFileClass {
  protected Name = 'Graphic';
  protected folder = 'Resources';
  protected bookProperty = 'graphics';

  /**
   * Le fichier minimal Graphic.xml comprend la définition de la 
   * couleur noire. (IL FAUDRAIT LA MÊME CHOSE POUR DES COULEURS DÉFINIES, SAUF
   * SI NOIRE EST DÉFINIE)
   */
  protected override buildMinimalFile(content?: XMLObjet): void {
    content = {
      tag: 'Color',
      attrs: [['Self', 'Color/Black'], ['Space', 'CMYK'], ['ColorValue', '0 0 0 100']]
    } as XMLObjet;
    super.buildMinimalFile(content);
  }
}