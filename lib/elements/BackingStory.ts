import type { XMLObjet } from "../types/types";
import { AbstractFileClass } from "./AbstractFileClass";

export class BackingStory extends AbstractFileClass {
  protected Name = "BackingStory";
  protected folder = 'XML';
  protected bookProperty = 'unusedTexts';

  /**
   * Pas besoin de fichier si aucune backstory
   */
  protected override buildMinimalFile(content?: XMLObjet): void {
    return;
  }
}
