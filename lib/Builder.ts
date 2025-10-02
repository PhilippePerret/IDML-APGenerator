import path from "path";
import fs from "fs";

import type { 
  MasterSpreadType, 
  SpreadType,
  StoryType,
  BookDataType, 
  XMLRootType,
  XMLObjet
} from "./types/types";
import { BuilderXML } from "./BuilderXML";

export class Builder {

  /**
   * Méthode principale appelée pour construire une archive IDML
   * permettant de produire un fichier pour Affinity Publisher.
   */
  build(bookData: BookDataType){
    console.log("Je dois apprendre à construire l'archive IDML à partir de ", bookData)
    // On construit tous les fichiers/dossiers dans l'ordre
    this.build_mainFolder(bookData);
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
   * Construction du dossier principal
   */
  build_mainFolder(bookData: BookDataType): void{
    if (!fs.existsSync(bookData.folder)) {
      fs.mkdirSync(bookData.folder);
    }
  }

  /**
   * Construction du fichier mimetype (simple)
   */
  build_mimetype(bookData: BookDataType){
    const p = path.join(bookData.folder, 'mimetype');
    fs.writeFileSync(p, 'application/vnd.adobe.indesign-idml-package');
  }
  build_meta_inf_folder(bookData: BookDataType) {
    // Construction du dossier
    const metainfFolder = path.join(bookData.folder, 'META-INF');
    if (!fs.existsSync(metainfFolder)) { fs.mkdirSync(metainfFolder); }
    // Construction du fichier container.xml
    const pth = path.join(metainfFolder, 'container.xml');
    const root: XMLRootType = {
      isPackage: false,
      tag: 'container',
      version: "1.0",
      xmlns: "urn:oasis:names:tc:opendocument:xmlns:container"
    };
    const content: XMLObjet = {
      child: {
        tag: 'rootfiles',
        children: [
          {attrs: [['full-path', 'designmap.xml'], ['media-type', 'text/xml']]} as XMLObjet
        ]
      } as XMLObjet
    };
    new BuilderXML({path: pth, content: content, root: root}).output();
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
    // Dossier ressources
    const folderResources = path.join(bookData.folder, 'Resources')
    if (!fs.existsSync(folderResources)) { fs.mkdirSync(folderResources); }

    let pth: string, content: XMLObjet, root: XMLRootType;
    // Fichier Fonts (Fontes utilisées)
    pth = path.join(folderResources, 'Fonts.xml')
    root = {
      isPackage: true,
      tag: 'Fonts',
      xmlns: 'http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging',
      DOMVersion: '15.0'
    }
    // Pour l'instant, je fais 
    content = { 
      children: []
    } 
    

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