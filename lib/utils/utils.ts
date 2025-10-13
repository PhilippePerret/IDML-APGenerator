import fs from "fs";
import { Options } from "../Options";

/**
 * Fonction qui retourne la valeur de l'option +prop+
 * 
 * Cette option peut être définie soit dans la ligne de commande,
 * soit dans le fichier de configuration.
 * 
 * @param prop L'option à voir
 */
export function option(opt: string) {
  return Options.getOption(opt);
}


/**
 * Fonction qui teste l'antériorité de deux fichiers
 * Si le PREMIER est plus vieux (créé avant) le SECOND, la fonction
 * retourne TRUE, sinon FALSE
 */
export function isOlder(filepath1: string, filepath2: string): boolean {
  return fs.statSync(filepath1).mtime < fs.statSync(filepath2).mtime;
}