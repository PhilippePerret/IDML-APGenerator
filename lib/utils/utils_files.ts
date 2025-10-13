import fs from "fs";
import { createHash, Hash } from 'crypto';
import path from "path";

/**
 * Ce module contient des méthodes/fonctions utilitaires pour les
 * fichiers.
 * 
 * Elles s'abordent principalement en tant que méthodes de classe
 * de la class File.
 */
export class File {

  /**
   * @api
   * 
   * Retourne le CHECKSUM du fichier +path+
   * 
   * @param path Chemin d'accès du fichier
   */
  public static checksum(path: string){
    this.hash.update(fs.readFileSync(path));
    return this.hash.digest('hex');
  }




  private static get hash() {
    return this._hash || (this._hash = createHash('md5'))
  }
  private static _hash?: Hash;
}