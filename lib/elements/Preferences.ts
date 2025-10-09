import type { XMLObjet } from "../types/types";
import { AbstractFileClass } from "./AbstractFileClass";

export class Preferences extends AbstractFileClass {
  protected Name = 'Preferences';
  protected folder = 'Resources';
  protected bookProperty = 'preferences';

  /**
   * Pas de besoin de fichier si aucune préférence
   */
  protected override buildMinimalFile(content?: XMLObjet): void {
    return;
  }
}