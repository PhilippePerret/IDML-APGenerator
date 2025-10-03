import fs from "fs";
import path from "path";
import { throwError } from "./Messagerie";
import { option } from "./utils";

type RecType = {[x: string]: any};

export class DataProps {

  /**
   * Méthode principale pour obtenir les données d'une propriété
   * 
   * @param prop Propriété dont il faut voir les données
   */
  public static get(prop: string){
    if (AMBIGOUS_PROPS[prop]){
      throwError('ambigous-prop', [prop, AMBIGOUS_PROPS[prop].join(' ou ')])
    }
    const path = PROP_TO_PATH[prop];

    return DATA_PROPS[prop];
  }

  public static async init(){
    console.log("L'option force est à ", option('force'));
    if (!fs.existsSync(this.prop2path_file) || option('force')) {
      const { DataPropsBuilder } = await import('./assets/data/builder');
      DataPropsBuilder.buildProp2PathFile(DATA_PROPS, this.prop2path_file);
    }
    // Ici on peut toujours les requérir
  }
 private static get prop2path_file(){
    return path.join('lib', 'assets', 'data', 'PROP2PATH_AUTO.ts');
  }
}

const booleans = [true, false];
const integers = Number;

const DATA_PROPS: {[x: string]: any} = {
  preferences: {
    data_merge_option: {
      attrs: {
        fitting_options: { values: ['Proportionnal'] /*todo*/, default: 'Proportionnal' },
        center_image: { values: booleans, default: false },
        link_images: { values: booleans, default: true },
        remove_blank_lines: { values: booleans, default: false },
        create_new_document: { values: booleans, default: false },
        document_size: { values: integers, default: 50 }
      }
    }
  }
}

/**
 * Table des propriétés ambigues, c'est-à-dire les propriétés qui 
 * peuvent appartenir à deux choses différentes. Elles génères une
 * erreur et demandent précision
 */
const AMBIGOUS_PROPS: RecType = {};

/**
 * Grande table automatique qui donne le xpath d'une propriété dans
 * la table DATA_PROPS. Par exemple, 'link_images' va retourner :
 * 'preferences.data_merge_option.args.link_images'. Si la propriété
 * est ambigues (deux ou plus xpath possibles), une erreur est 
 * générée avant.
 */
const PROP_TO_PATH: RecType = {}