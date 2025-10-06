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
    const content = this.INCIPIT + "\n\n" + 
      this.AmbigousDescription + "\n\n" + 
      'export const PREPARED_AMBIGOUS_PROPS = ' +
      JSON.stringify(AMBIGOUS_PROPS, null, 2) + ";\n\n" +
      this.xPathsDescription + "\n\n" +
      'export const PREPARED_PROP_TO_PATH = ' +
      JSON.stringify(PROP_TO_PATH, null, 2) + ';';
    fs.writeFileSync(finalFilePath, content, 'utf-8');
  }

  private static fouilleContainer(container: RecType, path: string) {

    for (const key in container) {
      if (String(key) === '0' ) { return ; /* ? */}
      const finalPath = `${path}:${key}`;
      const curValue = container[key];
      if (curValue.values && 'undefined' !== typeof curValue.default) {
        // <= La valeur courante définit 'values' et 'default'
        // => C'est une valeur terminale
        let finalKey: string;
        if (PROP_TO_PATH[key] || AMBIGOUS_PROPS[key]) {
          // Propriété ambigue

          if (PROP_TO_PATH[key]) {
            // Dans le cas de la première ambiguïté trouvé,
            // Il faut commencer par retirer la première propriété pour
            //  lui mettre un autre identifiant
            const firstPath = PROP_TO_PATH[key].split(':');
            firstPath.pop(); // la key elle-même
            let firstParent = firstPath.pop();
            if (firstParent === '__attrs' || firstParent === '__properties') { firstParent = firstPath.pop(); }
            const firstFinalKey = `${firstParent}:${key}`;
 
            Object.assign(AMBIGOUS_PROPS, { [key]: [] });
            AMBIGOUS_PROPS[key].push(firstFinalKey);
            Object.assign(PROP_TO_PATH, {[firstFinalKey]: PROP_TO_PATH[key]});
            delete PROP_TO_PATH[key];
          }
         
          // [ICI] (cf. ci-dessous)
          const splitedPath = path.split(':');
          let parent = splitedPath.pop();
          if (parent === '__attrs' || parent === '__properties') { parent = splitedPath.pop(); }
          finalKey = `${parent}:${key}`;
          AMBIGOUS_PROPS[key].push(finalKey)
        } else {
          finalKey = key;
        }
        // Verrou de protection
        if (undefined === PROP_TO_PATH[finalKey]) {
          // ok
          Object.assign(PROP_TO_PATH, { [finalKey]: finalPath });
        } else {
          // ok clé existante !!! (si ça arrive il faut un autre calcul [ICI])
          throw new Error("ERREUR FATALE SYSTÉMIQUE Deux clés se retrouvent avec le même path, dans PROP_TO_PATH… (" + finalKey + ")");
        }
      } else {
        // => Ce n'est pas une valeur "terminale", c'est donc un
        //    "container" qu'on fouille.
        // console.log("Fouille de (path: %s): ", finalPath, curValue);
        // console.log("Fouille de path: %s", finalPath);
        if (finalPath.endsWith(':0')) {
          // Une valeur produisant un ':0' en fin de path est une 
          // donnée terminale qui ne contient ni 'values' ni 'default'
          // On n'en fait rien, on arrête la boucle ici
          throw new Error("On ne devrait plus avoir cette erreur de fin de path = :0");
        } else {
          // Ce n'est pas une valeur terminale ni une valeur terminal
          // qui ne définit pas son 'values' et son 'default'
          this.fouilleContainer(curValue, finalPath);
        }
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


  `.trim();

  static AmbigousDescription = `
/**
 * Table des propriétés ambigues, c'est-à-dire les propriétés qui 
 * peuvent appartenir à deux choses différentes. Elles génères une
 * erreur et demandent précision
 */
  `.trim();

  static xPathsDescription = `
 /**
 * Grande table automatique qui donne le xpath d'une propriété dans
 * la table DATA_PROPS. Par exemple, 'link_images' va retourner :
 * 'preferences.data_merge_option.args.link_images'. Si la propriété
 * est ambigues (deux ou plus xpath possibles), une erreur est 
 * générée avant.
 */ 
  `.trim();

}