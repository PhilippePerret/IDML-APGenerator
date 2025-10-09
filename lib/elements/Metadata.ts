import fs from "fs";
import type { XMLObjet } from "../types/types";
import { AbstractFileClass } from "./AbstractFileClass";

export class Metadata extends AbstractFileClass {
  protected Name = 'metadata';
  protected folder = 'META-INF';
  protected bookProperty = 'metadata';

  /**
   * Pas besoin de fichier si aucune métadonnée n'est définie.
   */
  protected override buildMinimalFile(content?: XMLObjet): void { return ; }
}