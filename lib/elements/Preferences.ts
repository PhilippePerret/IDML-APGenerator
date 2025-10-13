import type { RecType, XMLObjet } from "../types/types";
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

  protected override buildFile(content?: XMLObjet): void {
    const prefs = this.bookData.preferences as RecType;
    // Pour la balise DocumentPreference
    const documentPrefs: XMLObjet = {
      tag: 'DocumentPreference',
      attrs: prefs.document.attrs
    }

    // Construction du fichier
    super.buildFile({children: [
      documentPrefs
    ]});
  }
}