import path from "path";
import fs from "fs";

import type { 
  MasterSpreadType, 
  SpreadType,
  StoryType,
  BookDataType, 
  XMLRootType,
  XMLObjet,
  FontFamilyType,
  FontType
} from "./types/types";
import { BuilderXML } from "./BuilderXML";
import { IDML } from "./IDML";
import { FontClass } from "./FontClass";
import { throwError } from "./Messagerie";
import YAML from 'yaml'
import { DataProps } from "./DATA_PROPS";

export class Builder {

  /**
   * Méthode appelée avec le chemin d'accès au dossier d'un livre
   * qui doit contenir tous les éléments nécessaires
   * 
   * @return True en cas de succès, False otherwise
   */
  public static async buildBook(bookPath: string): Promise<boolean> {
    fs.existsSync(bookPath) || throwError('book-folder-unfound', [bookPath]);
    const recipePath = path.join(bookPath, 'recipe.yaml');
    fs.existsSync(recipePath) || throwError('recipe-unfound', [recipePath]);

    // Initialisation des données propriétés
    await DataProps.init();

    const yamlcode = fs.readFileSync(recipePath, 'utf-8');
    const bookData = YAML.parse(yamlcode);
    Object.assign(bookData, {bookFolder: bookPath});
    this.defaultizeBookData(bookData);
    console.log("bookData = ", bookData);
    const builder = new Builder();
    builder.build(bookData);

    return true;
  }

  private static defaultizeBookData(bdata: BookDataType){
    function assign(prop: string, value: any) {
      Object.assign(bdata, {[prop]: value});
    }
    bdata.idmlFolder || assign('idmlFolder', path.join(bdata.bookFolder, 'idml'));
    bdata.masterSpreads || assign('masterSpreads', []);
    bdata.spreads || assign('spreads', []);
    bdata.stories || assign('stories', []);
  }

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
  
  private get assetsFolder(){ return path.join('.', 'lib', 'assets');}
  private get modelsFolder(){ return path.join(this.assetsFolder, 'models');}

  /**
   * Construction du dossier principal
   */
  build_mainFolder(bookData: BookDataType): void{
    if (!fs.existsSync(bookData.idmlFolder)) {
      fs.mkdirSync(bookData.idmlFolder);
    }
  }

  /**
   * Construction du fichier mimetype (simple)
   */
  build_mimetype(bookData: BookDataType){
    const p = path.join(bookData.idmlFolder, 'mimetype');
    fs.writeFileSync(p, 'application/vnd.adobe.indesign-idml-package');
  }
  build_meta_inf_folder(bookData: BookDataType) {
    // Construction du dossier
    const metainfFolder = path.join(bookData.idmlFolder, 'META-INF');
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
    const folderResources = path.join(bookData.idmlFolder, 'Resources')
    if (!fs.existsSync(folderResources)) { fs.mkdirSync(folderResources); }

    let pth: string, content: XMLObjet, root: XMLRootType, model: string;
    // Fichier Fonts (Fontes utilisées)
    pth = path.join(folderResources, 'Fonts.xml')
    root = {
      isPackage: true,
      tag: 'Fonts',
      xmlns: 'http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging',
      DOMVersion: '15.0'
    }
    const fontData = bookData.fonts;
    content = { 
      children: []
    } as XMLObjet;
    fontData.forEach((family: FontFamilyType) => {
      family.self = IDML.generateId();
      // On fabrique toutes les tags des différentes fontes de
      // la famille courante.
      const fontTags = family.fonts.map((font: FontType) => {
        return new FontClass(
          path.join(family.folder, font.fname),
          family.self as string,
          font.extraParams
        ).asXmlTag();
      }).join("\n");
      (content.children as any).push({
        tag: 'FontFamily',
        content: fontTags,
        attrs: [['Self', family.self], ['Name', family.familyName]]
      })
    })
    console.log("\nCONTENT = ", content);
    new BuilderXML({path: pth, content: content, root: root}).output();    

    // Fichier Graphics (images)
    // Si aucune donnée graphic n'est définie, on copie simplement le
    // document par défaut
    if (undefined === bookData.graphic) {
      pth = path.join(folderResources, 'Graphic.xml');
      model = path.join(this.modelsFolder, 'Graphic.xml');
      fs.copyFileSync(model, pth);
    }

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