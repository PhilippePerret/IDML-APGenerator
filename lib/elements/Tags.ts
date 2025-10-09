import type { XMLObjet } from "../types/types";
import { AbstractFileClass } from "./AbstractFileClass";

export class TagsFile extends AbstractFileClass {
  protected Name = "Tags";
  protected folder = 'XML';
  protected bookProperty = 'tags';

  /**
   * Pas besoin de fichier si aucune donnée Tags 
   */
  protected override buildMinimalFile(content?: XMLObjet): void {
    return;
  }
}
