import path from "path";
import fs from "fs";
import YAML from 'yaml';

import './utils/utils_string';
import type { 
  BookDataType, 
  XMLRootType,
  XMLObjet,
  RecType,
  SpreadType
} from "./types/types";
import { BuilderXML } from "./BuilderXML";
import { IDML } from "./IDML";
import { Font } from "./elements/Fonts";
import { throwError } from "./Messagerie";
import { DataProps } from "./DATA_PROPS";
import { Styles } from "./elements/Styles";
import { Story } from "./elements/Story";
import { Spread } from "./elements/Spread";
import { Preferences } from "./elements/Preferences";
import { Graphic } from "./elements/Graphic";
import { BackingStory } from "./elements/BackingStory";
import { TagsFile } from "./elements/Tags";
import { Metadata } from "./elements/Metadata";
import { MasterSpread } from "./elements/MasterSpread";
import { execSync } from "child_process";
import { Recipe } from "./elements/Recipe";

export class Builder {

  /**
   * Méthode appelée avec le chemin d'accès au dossier d'un livre
   * qui doit contenir tous les éléments nécessaires
   * 
   * @return True en cas de succès, False otherwise
   * 
   * OPTIONS
   * -------
   * force_rebuild      Si true, reconstruit tout en détruisant ce qui existe déjà.
   * only_return_data   (mode test) Retourne seulement les donnée DataBookType une fois qu'elles ont été défaultisées.
   * rebuild            Si False, les fichiers de l'archive en sont pas touchés, seule est produite l'archive elle-même. Ce mode permet de "trafiquer" le code pour essayer des choses et voir tout de suite le résultat. Utiliser le test 'test/sandbox_test.ts' pour faire ces essais, en indiquant le path du livre.
   * open_in_AP         Si true, après construction l'archive est aussitôt ouverte dans affinity Publisher.
   * 
   */
  public static async buildBook(bookPath: string, options?: RecType): Promise<boolean | BookDataType> {
    // console.log("Book path à l'entrée", bookPath);
    if (!path.isAbsolute(bookPath)){ bookPath = path.resolve(bookPath); }
    // console.log("Book path finale : ", bookPath);
    fs.existsSync(bookPath) || throwError('book-folder-unfound', [bookPath]);
    const recipePath = path.join(bookPath, 'recipe.yaml');
    fs.existsSync(recipePath) || throwError('recipe-unfound', [recipePath]);

    // Instanciation du constructeur qui va produire l'archive
    const builder = new Builder();
 
    // Initialisation des données propriétés
    await DataProps.init();

    const yamlcode = fs.readFileSync(recipePath, 'utf-8');
    let bookData = YAML.parse(yamlcode) || {};
    Object.assign(bookData, {
      bookFolder: bookPath,
      recipePath: recipePath,
      builder: builder
    });
    /* bookData = */ Recipe.defaultize(bookData);
    // console.log("bookData (defaultised) = ", bookData);
    if (options && options.only_return_data) { return bookData; }

   // Si on doit forcer la reconstruction complète (option 
    // force-rebuild), il faut déruire le dossier s'il existe
    if (options && options.force_rebuild) {
      builder.removeIdmlElements(bookData)
    }

    let ok = true;

    /**
     * Sauf si l'option rebuild est mise à false, on construit
     * tous les fichiers IDML
     */
    if (options && options.rebuild === false) {
      // On ne fait rien
    } else {
      console.log("Construction de tous les fichiers XML…");
      ok = builder.buildAllIdmlFiles(bookData);
      console.log("ok après buildAllIdmlFiles", ok);
    }
    if (ok) { 
      console.log("Génération de l'archive")
      ok = await builder.generateArchiveIdml(bookData); 
    }
    console.log("OK après generateArchiveIdml", ok);
    if (ok) { ok = builder.openInFinder(bookData); }
    console.log("OK après openInFinder", ok);

    if (ok && options && options.open_in_AP){
      execSync(`open -a "Affinity Publisher" "${bookData.archivePath}"`);
    }
    if (ok) {
      console.log("\n\nArchive construite avec succès.");
    } else {
      console.error("Un problème est survenu. Consultez la console.");
    }
    return true;
  }
  

  private async generateArchiveIdml(bookData: BookDataType): Promise<boolean> {
    // On commence toujours par détruire celle qui existe peut-être
    if (fs.existsSync(bookData.archivePath)) { fs.unlinkSync(bookData.archivePath);}
    // console.log("Est-ce que le fichier '%s' existe ? ",bookData.archivePath, fs.existsSync(bookData.archivePath));
    let cmd1 = `zip -X0 ../${bookData.archName} mimetype`;
    let cmd2 = `zip -Xr ../${bookData.archName} . -x mimetype`
    let result = execSync(cmd1, {cwd: bookData.idmlFolder}); 
    // console.log("Résultat command 1", result.toString());
    result = execSync(cmd2, {cwd: bookData.idmlFolder});
    // console.log("Résultat commande 2", result.toString());
    return true ; // Si ok
  }

  private openInFinder(bookData: BookDataType): boolean {
    return true; // si ok
  }

  /**
   * Méthode appelée pour forcer la reconstruction en détruisant
   * tous les éléments qui peuvent exister.
   * 
   * Cette méthode est appelée quand l'option force_rebuild est 
   * envoyée à la méthode buildBook
   */
  removeIdmlElements(bookData: BookDataType){
    if( fs.existsSync(bookData.idmlFolder)) {
      fs.rmSync(bookData.idmlFolder, {recursive: true, force: true});
      console.log("Dossier IDML entièrement détruit");
    }
    if (fs.existsSync(bookData.archivePath)) {
      fs.unlinkSync(bookData.archivePath);
      console.log("Ancienne archive idml détruite.");
    }
  }
  /**
   * Méthode principale appelée pour construire une archive IDML
   * permettant de produire un fichier pour Affinity Publisher.
   */
  buildAllIdmlFiles(bookData: BookDataType): boolean {
    // console.log("Je dois continuer à apprendre à construire l'archive IDML à partir des données ", bookData)
    // On construit tous les fichiers/dossiers dans l'ordre
    this.build_mainFolder(bookData);
    this.build_mimetype(bookData);
    this.build_meta_inf_folder(bookData);
    this.build_master_spread_folder(bookData); // maquettes maitresse
    this.build_spreads_folder(bookData); // maquettes
    this.build_stories_folder(bookData); 
    this.build_resources_folder(bookData);
    this.build_xml_folder(bookData);
    this.build_designmap_file(bookData);

    return true;
  }
  
  private get assetsFolder(){ return path.join('.', 'lib', 'assets');}
  private get modelsFolder(){ return path.join(this.assetsFolder, 'models');}

  /**
   * 
   * 
   * ========= FONCTIONS DE CONSTRUCTION ================
   * 
   */

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
    // Construction du dossier META-INF (toujours)
    const metainfFolder = path.join(bookData.idmlFolder, 'META-INF');
    if (!fs.existsSync(metainfFolder)) { fs.mkdirSync(metainfFolder); }

    // Construction du fichier container.xml (toujours)
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
    
    // Construction du fichier metadata.xml (si nécessaire)
    new Metadata(bookData).build();
  }


  /**
   * Construction du dossier des maquettes maitresses
   */
  build_master_spread_folder(bookData: BookDataType){
    // Si aucune maquelle n'est définie, on n'en a pas besoin
    if (undefined === bookData.masterSpreads) { return; }
    const theFolder = path.join(bookData.idmlFolder, 'MasterSpreads');
    if (!fs.existsSync(theFolder)) { fs.mkdirSync(theFolder); }
    // Construire chaque maquette maitresse
    bookData.masterSpreads.forEach((master) => {
      // Construire le fichier pour la maquette maitresse
      new MasterSpread(master, bookData).buildFile();
    })
  }

  build_spreads_folder(bookData: BookDataType){
    const theFolder = path.join(bookData.idmlFolder, 'Spreads');
    if (!fs.existsSync(theFolder)) { fs.mkdirSync(theFolder); }
    bookData.spreads.forEach(spread => new Spread(spread, bookData).buildFile()); 
  }

  /**
   * Construction des textes du livre
   * 
   * @param bookData Données totales du livre
   */
  build_stories_folder(bookData: BookDataType){
    const theFolder = path.join(bookData.idmlFolder, 'Stories');
    if (!fs.existsSync(theFolder)) { fs.mkdirSync(theFolder); }
    bookData.stories.forEach(story => {
      const instance = new Story(story, bookData);
      instance.buildFile();
      Object.assign(story, {
        uuid: instance.getSelf(),
        instance: instance
      });
    });
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

    // Construction (seulement au besoin) du fichier Resources/Fonts.xml
    new Font(bookData).build();

    // Fichier Graphic (images)
    // -------------------------
    new Graphic(bookData).build();

    // Fichier Préférences
    // -------------------
    new Preferences(bookData).build();

    // Fichier Styles
    // --------------
    // D'après Claude ce fichier est nécessaire, même vide.
    //
    new Styles(bookData).build();
 

 }// /build_resources_folder

  /**
   * Construction du dossier XML
   * 
   */
  build_xml_folder(bookData: BookDataType){
    const folderXML = path.join(bookData.idmlFolder, 'XML') 
    if (!fs.existsSync(folderXML)) { fs.mkdirSync(folderXML); }

    // Fichier BackingStory (optionnel)
    new BackingStory(bookData).build();

    // Fichier des tags (optionnel) 
    new TagsFile(bookData).build();

  }

  /**
   * 
   * Construction du fichier map principal designmap
   * 
   */
  build_designmap_file(bookData: BookDataType) {
    // Todo
    let pth: string, content: XMLObjet, root: XMLRootType, model: string;

    pth = path.join(bookData.idmlFolder, 'designmap.xml');
    root = {
      isPackage: false,
      tag: 'Document',
      id: 'd',
      DOMVersion: IDML.DOMVersion,
      xmlns_idPkg: 'http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging'
    }

    // Tous les éléments à mettre dans le fichier
    content = {children: [] as XMLObjet[]} as XMLObjet;

    function addChild(child: XMLObjet){
      (content.children as any).push(child);
    }
    // Le seul fichier obligatoire (mais je ne crois même pas qu'il est
    // obligatoire dans la map)
    addChild({attrs: [['src', 'Resources/Graphic.xml']], tag: 'idPkg:Graphic'});

    if (bookData.backingStories) {
      addChild({attrs: [['src', 'XML/BackingStory.xml']], tag: 'idPkg:BackingStory'}); 
    }
    if (bookData.tags){
      addChild({attrs: [['src', 'XML/Tags.xml']], tag: 'idPkg:Tags'});
    }
    if (bookData.styles) {
      addChild({attrs: [['src', 'Resources/Styles.xml']], tag: 'idPkg:Styles'});
    }
    if (bookData.styles) {
      addChild({attrs: [['src', 'Resources/Fonts.xml']], tag: 'idPkg:Fonts'})
    }
    if (bookData.preferences){
      addChild({attrs: [['src', 'Resources/Preferences.xml']], tag: 'idPkg:Preferences'})
    }
    
    bookData.spreads.forEach(spread => {
      addChild({attrs: [['src', `Spreads/Spread_${spread.uuid}.xml`]], tag:'idPkg:Spread'})
    });

    bookData.stories.forEach(story => {
      addChild({attrs: [['src', `Stories/Story_${story.uuid}.xml`]], tag: 'idPkg:Story'});
    });

    if (bookData.masterSpreads) {
      bookData.masterSpreads.forEach(master => {
        addChild({ attrs: [['src', `MasterSpreads/MasterSpread_${master.uuid}.xml`]], tag: 'idPkg:MasterSpread'});
      })
    }

    // On construit le fichier de la map
    new BuilderXML({ path: pth, content: content, root: root }).output();
  }
}