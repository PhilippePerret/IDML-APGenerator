import { Options } from "./Options";

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