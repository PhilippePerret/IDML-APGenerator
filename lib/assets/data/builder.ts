import fs from "fs";
type RecType = {[x: string]: any};

const PROP_TO_PATH: RecType = {};
const AMBIGOUS_PROPS: RecType = {};

export class DataPropsBuilder {
  /**
  * Méthode qui construit, au besoin, le fichier qui définit :
  * 1) les xpaths dans data_props des propriétés
  * 2) la table AMBIGOUS_PROPS des propriétés ambigües
  */
  public static buildProp2PathFile(
    data_props: RecType,
    finalFilePath: string
  ) {
    for (const key in data_props) {
      this.fouilleContainer(data_props[key], `${key}`)
    }
    const content = this.INCIPIT + 'export const AMBIGOUS_PROPS = ' +
      JSON.stringify(AMBIGOUS_PROPS, null, 2) + ";\n" +
      'export const PROP_TO_PATH = ' +
      JSON.stringify(PROP_TO_PATH, null, 2) + ';';
    fs.writeFileSync(finalFilePath, content, 'utf-8');
  }
  private static fouilleContainer(container: RecType, path: string) {

    for (const key in container) {
      const finalPath = `${path}:${key}`;
      const curValue = container[key];
      if (curValue.values && 'undefined' !== typeof curValue.default) {
        // <= La valeur courante définit 'values' et 'default'
        // => C'est une valeur terminale
        let finalKey: string;
        if (PROP_TO_PATH[key]) {
          // Propriété ambigue
          if (undefined === AMBIGOUS_PROPS[key]) {
            // Propriété ambigue non connue
            Object.assign(AMBIGOUS_PROPS, { [key]: [] });
          }
          const parent = path.split(':').pop();
          finalKey = `${parent}:${key}`;
          AMBIGOUS_PROPS[key].push(finalKey)
        } else {
          finalKey = key;
        }
        Object.assign(PROP_TO_PATH, { [finalKey]: finalPath });
      } else {
        // => Ce n'est pas une valeur "terminale", c'est donc un
        //    "container" qu'on fouille.
        this.fouilleContainer(curValue, finalPath);
      }
    }
  }

  static INCIPIT = `
  /**
   * Fichier fabriqué automatiquement à partir des données DATA_PROPS
   * du fichier DATA_PROPS.ts. NE PAS LE TOUCHER.
   * Pour actualiser les valeurs :
   * SOIT : le détruire
   * SOIT : mettre la propriété 'force' des configurations
   *        (config.json) à true.
   */

  `
}