import path from "path";
import type { 
  MasterSpreadType, 
  SpreadType,
  StoryType,
  BookDataType 
} from "./types/types";

import fs from "fs";

export class Builder {

  /**
   * Méthode principale appelée pour construire une archive IDML
   * permettant de produire un fichier pour Affinity Publisher.
   */
  build(bookData: BookDataType){
    console.log("Je dois apprendre à construire l'archive IDML à partir de ", bookData)
    // On construit tous les fichiers/dossiers dans l'ordre
    this.build_mimetype(bookData);
    this.build_meta_inf_folder(bookData);
    this.build_master_spread_folder(bookData); // maquettes maitresse
    this.build_spreads_folder(bookData); // maquettes
    this.build_stories_folder(bookData); // Les textes
    this.build_resources_folder(bookData);
    this.build_xml_folder(bookData);
    this.build_designmap_file(bookData);
  }
  
  /**
   * Construction du fichier mimetype (simple)
   */
  build_mimetype(bookData: BookDataType){
    const p = path.join(bookData.folder, 'mimetype');
    fs.writeFileSync(p, 'application/vnd.adobe.indesign-idml-package');
  }
  build_meta_inf_folder(bookData: BookDataType) {
    // Construction du fichier container.xml
    // Todo
    // Construction du fichier metadata.xml
    // Todo
  }

  /**
   * Construction du dossier des maquettes maitresses
   */
  build_master_spread_folder(bookData: BookDataType){
    // Construire chaque maquette maitresse
    bookData.masterSpreads.forEach((masterSpread: MasterSpreadType) => {
      // Construire le fichier pour la maquette maitresse
    })
  }

  build_spreads_folder(bookData: BookDataType){
    bookData.spreads.forEach((spread: SpreadType) => {
      // traiter la maquette
    })
  }

  /**
   * Construction des textes du livre
   * 
   * @param bookData Données totales du livre
   */
  build_stories_folder(bookData: BookDataType){
    bookData.stories.forEach((story: StoryType) => {
      // Traitement du texte
    })
  }

  /**
   * Construction du dossier des ressources.
   * 
   */
  build_resources_folder(bookData: BookDataType){
    // Fichier Fonts (Fontes utilisées)
    // Todo

    // Fichier Graphics (images)
    // Todo

    // Fichier Préférences
    // Todo

    // Fichier Styles
    // Todo
  }

  /**
   * Construction du dossier XML
   * 
   */
  build_xml_folder(bookData: BookDataType){
    // Fichier BackingStory
    // Todo

    // Fichier des tags (Tags)
    // Todo

  }

  /**
   * Construction du fichier principal designmap
   * 
   */
  build_designmap_file(bookData: BookDataType) {
    // Todo
  }
}