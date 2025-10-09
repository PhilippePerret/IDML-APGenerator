import path from "path";
import fs from "fs";
import YAML from 'yaml';

import './utils_string';
import type { 
  BookDataType, 
  XMLRootType,
  XMLObjet,
  RecType
} from "./types/types";
import { BuilderXML } from "./BuilderXML";
import { IDML } from "./IDML";
import { Font, FontClass } from "./elements/Fonts";
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
import { exec, execSync } from "child_process";

export class Builder {

  /**
   * Méthode appelée avec le chemin d'accès au dossier d'un livre
   * qui doit contenir tous les éléments nécessaires
   * 
   * @return True en cas de succès, False otherwise
   */
  public static async buildBook(bookPath: string, options?: RecType): Promise<boolean> {
    // console.log("Book path à l'entrée", bookPath);
    if (!path.isAbsolute(bookPath)){ bookPath = path.resolve(bookPath); }
    // console.log("Book path finale : ", bookPath);
    fs.existsSync(bookPath) || throwError('book-folder-unfound', [bookPath]);
    const recipePath = path.join(bookPath, 'recipe.yaml');
    fs.existsSync(recipePath) || throwError('recipe-unfound', [recipePath]);

    // Initialisation des données propriétés
    await DataProps.init();

    const yamlcode = fs.readFileSync(recipePath, 'utf-8');
    const bookData = YAML.parse(yamlcode) || {};
    Object.assign(bookData, {
      bookFolder: bookPath,
      recipePath: recipePath,
    });
    this.defaultizeBookData(bookData);
    console.log("bookData (defaultised) = ", bookData);
    const builder = new Builder();
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
    if (!(options && options.rebuild === false)) {
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

  private static defaultizeBookData(bdata: BookDataType){
    function assign(prop: string, value: any) {
      Object.assign(bdata, {[prop]: value});
    }
    bdata.idmlFolder || assign('idmlFolder', path.join(bdata.bookFolder, bdata.idmlFolderName || 'idml'));
    bdata.spreads || assign('spreads', []);
    bdata.stories || assign('stories', []);

    bdata.archName || assign('archName', 'document.idml')
    assign('archivePath', path.join(bdata.bookFolder, bdata.archName));
    // Document par défaut
    const doc = bdata.document || {};
    bdata.document || assign('document', {
      width: doc.width || 595,
      height: doc.height || 842,
      bleed: doc.bleed || 8.5,      // 3 mm
      Tmargin: doc.Tmargin || 56.7, // 20 mm
      Bmargin: doc.Bmargin || 56.7,
      Lmargin: doc.Lmargin || 42.5, // 15 mm
      Rmargin: doc.Rmargin || 42.5,
      Imargin: doc.Imargin || 42.5,
      Emargin: doc.Emargin || 28.3
    });
    assign('pageHeight', bdata.document.height);
    assign('pageWidth', bdata.document.width);
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
    bookData.stories.forEach(story => new Story(story, bookData).buildFile());
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
   * Construction du fichier principal designmap
   * 
   */
  build_designmap_file(bookData: BookDataType) {
    // Todo
    let pth: string, content: XMLObjet, root: XMLRootType, model: string;

    pth = path.join(bookData.idmlFolder, 'designmap.xml');
    root = {
      isPackage: true,
      tag: 'Document',
      id: 'd',
      DOMVersion: IDML.DOMVersion,
      xmlns: 'http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging',
      instTreatment: '<?aid style="50" type="document" readerVersion="6.0" featureSet="257" product="15.0(209)" ?>'
    }

    // Tous les éléments à mettre dans le fichier
    content = {children: []};
    // Fichier des styles et fichier des fontes (toujours);
    (content.children as XMLObjet[]).push(...[
        {attrs: [['src', 'XML/BackingStory.xml']], tag: 'idPkg:BackingStory'} as XMLObjet,
        {attrs: [['src', 'XML/Tags.xml']], tag: 'idPkg:Tags'} as XMLObjet,
        {attrs: [['src', 'Resources/Styles.xml']], tag: 'idPkg:Styles'} as XMLObjet,
        {attrs: [['src', 'Resources/Fonts.xml']], tag: 'idPkg:Fonts'} as XMLObjet,
        {attrs: [['src', 'Resources/Graphic.xml']], tag: 'idPkg:Graphics'} as XMLObjet,
        {attrs: [['src', 'Resources/Preferences.xml']], tag: 'idPkg:Preferences'} as XMLObjet
      ]
    );
    bookData.spreads.forEach(spread => {
      (content.children as XMLObjet[]).push(
        {attrs: [['src', `Spreads/Spread_${spread.uuid}.xml`]], tag:'idPkg:Spread'}
      )
    });
    bookData.stories.forEach(story => {
      (content.children as XMLObjet[]).push(
        {attrs: [['src', `Stories/Story_${story.uuid}.xml`]], tag: 'idPkg:Story'}
      )
    });
    if (bookData.masterSpreads) {
      bookData.masterSpreads.forEach(master => {
        (content.children as XMLObjet[]).push(
          { attrs: [['src', `MasterSpreads/MasterSpread_${master.uuid}.xml`]], tag: 'idPkg:MasterSpread' }
        )
      }),
        new BuilderXML({ path: pth, content: content, root: root }).output();
    }
  }
}