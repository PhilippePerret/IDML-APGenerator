import type { XMLObjet } from "../types/types";
import { AbstractFileClass } from "./AbstractFileClass";

export class Graphic extends AbstractFileClass {
  protected Name = 'Graphic';
  protected folder = 'Resources';
  protected bookProperty = 'graphics';

  /**
   * Le fichier minimal Graphic.xml comprend la définition de la 
   * couleur noire. Todo : cette couleur noire doit être définie pour
   * toutes les archives 
   */
  protected override buildMinimalFile(content?: XMLObjet): void {
    content = {
      tag: 'Color',
      attrs: [['Self', 'Color/Black'], ['Space', 'CMYK'], ['ColorValue', '0 0 0 100']]
    } as XMLObjet;
    super.buildMinimalFile(content);
  }
}