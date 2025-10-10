import { IDML } from "../IDML";
import type { XMLObjet } from "../types/types";
import { AbstractFileClass } from "./AbstractFileClass";

export class Graphic extends AbstractFileClass {
  protected Name = 'Graphic';
  protected folder = 'Resources';
  protected bookProperty = 'graphics';

  /**
   * Le fichier minimal Graphic.xml comprend la définition de la 
   * couleur noire.
   */
  protected override buildMinimalFile(content?: XMLObjet): void {
    content = {
      tag: 'Color',
      attrs: [['Self', IDML.generateId()], ['Space', 'CMYK'], ['ColorValue', '0 0 0 0 100']]
    } as XMLObjet;
    super.buildMinimalFile(content);
  }
}