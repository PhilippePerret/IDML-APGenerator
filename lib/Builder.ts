import path from "path";
import fs from "fs";
import { $ } from "bun";
import YAML from 'yaml';

import './utils_string';
import type { 
  MasterSpreadType, 
  BookDataType, 
  XMLRootType,
  XMLObjet,
  FontFamilyType,
  FontType
} from "./types/types";
import { BuilderXML } from "./BuilderXML";
import { IDML } from "./IDML";
import { FontClass } from "./elements/Fonts";
import { throwError } from "./Messagerie";
import { DataProps } from "./DATA_PROPS";
import { Styles } from "./elements/Styles";
import { isOlder } from "./utils";
import { Story } from "./elements/Story";
import { Spread } from "./elements/Spread";
import { XMLValidator } from "fast-xml-parser";

export class Builder {

  /**
   * Méthode appelée avec le chemin d'accès au dossier d'un livre
   * qui doit contenir tous les éléments nécessaires
   * 
   * @return True en cas de succès, False otherwise
   */
  public static async buildBook(bookPath: string): Promise<boolean> {
    // console.log("Book path à l'entrée", bookPath);
    if (!path.isAbsolute(bookPath)){ bookPath = path.resolve(bookPath); }
    // console.log("Book path finale : ", bookPath);
    fs.existsSync(bookPath) || throwError('book-folder-unfound', [bookPath]);
    const recipePath = path.join(bookPath, 'recipe.yaml');
    fs.existsSync(recipePath) || throwError('recipe-unfound', [recipePath]);

    // Initialisation des données propriétés
    await DataProps.init();

    const yamlcode = fs.readFileSync(recipePath, 'utf-8');
    const bookData = YAML.parse(yamlcode);
    Object.assign(bookData, {
      bookFolder: bookPath,
      recipePath: recipePath,
    });
    this.defaultizeBookData(bookData);
    // console.log("bookData = ", bookData);
    const builder = new Builder();
    let ok = builder.buildAllIdmlFiles(bookData);
    console.log("ok après buildAllIdmlFiles", ok);
    if (ok) { ok = await builder.generateArchiveIdml(bookData); }
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
    console.log("-> generateArchiveIdml ")
    let result = await $`zip -X0 ../document.idml mimetype`.cwd(bookData.idmlFolder);
    console.log("Retour de command", result.text());
    result = await $`zip -Xr ../document.idml -x mimetype`.cwd(bookData.idmlFolder);
    console.log("Retour de commande", result.text());
    return true ; // Si ok
  }

  private openInFinder(bookData: BookDataType): boolean {
    return true; // si ok
  }

  private static defaultizeBookData(bdata: BookDataType){
    function assign(prop: string, value: any) {
      Object.assign(bdata, {[prop]: value});
    }
    bdata.idmlFolder || assign('idmlFolder', path.join(bdata.bookFolder, 'idml'));
    bdata.masterSpreads || assign('masterSpreads', []);
    bdata.spreads || assign('spreads', []);
    bdata.stories || assign('stories', []);

    assign('pageHeight', bdata.document.height || 297);
    assign('pageWidth', bdata.document.width || 210);
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
 
    // Fonction interne pour la copie du modèle
    // Si +affectIds+ est true, les __SELF__ dans le code seront 
    // remplacés par des identifiants uniques
    const copieModel = (filename: string, affectIds: boolean) => {
      pth = path.join(folderResources, filename);
      model = path.join(this.modelsFolder, filename);
      if (affectIds) {
        let code = fs.readFileSync(model, 'utf-8');
        while (code.match(/__SELF__/)) { code = code.replace(/__SELF__/, IDML.generateId()); }
        fs.writeFileSync(pth, code);
      } else {
        fs.copyFileSync(model, pth);
      }
    }
 
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
   // -------------------------
    // Si aucune donnée graphic n'est définie, on n'a pas besoin de 
    // de fichier (d'après Claude)
    // document par défaut
    if (undefined === bookData.graphic) {
   } else {
      // [N0001] Sinon, on modifie le document modèle en fonction des
      // propriétés modifiées. On fonctionne par streaming, en 
      // recherchant les balises (tag + attribut). On peut checker 
      // les valeurs à l'aide des DATA_PROPS
      copieModel('Graphic.xml', false);
      // TODO 
    }

    // Fichier Préférences
    // -------------------
    // D'après Claude, si on n'a pas de préférences, on n'a pas 
    // besoin de ce fichier
    if (undefined === bookData.preferences) {
    } else {
      // Lire la [N0001]
      copieModel('Preferences.xml', false);
      throw new Error("Il faut apprendre à définir les préférences");
    }

    // Fichier Styles
    // --------------
    // D'après Claude ce fichier est nécessaire, même vide.
    //
    Styles.init(bookData);
    // dernier fichier des styles construits
    if (bookData.styles) {
      if (fs.existsSync(Styles.filePath) && isOlder(bookData.recipePath, Styles.filePath)) {
        // rien à faire, aucune modification
      } else {
        // Il faut refaire le fichier
        // On fait une copie du fichier modèle
        copieModel('Styles.xml', true);
        // Mais on ne le modifie que si des styles ont été définis
        Styles.buildResourceFile(bookData);
      }
    } else {
      // Aucunes données style et le fichier existe : on le détruit
      // pour le refaire
      if (fs.existsSync(Styles.filePath)) { fs.unlinkSync(Styles.filePath); }
      Styles.buildMinimalFile(bookData);
   }

 }// /build_resources_folder

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
        {attrs: [['src', 'Resources/Styles.xml']], tag: 'idPkg:Styles'} as XMLObjet,
        {attrs: [['src', 'Resources/Fonts.xml']], tag: 'idPkg:Fonts'} as XMLObjet
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
    })
    new BuilderXML({path: pth, content: content, root: root}).output();

  }
}