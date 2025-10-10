import path from "path";
import fs from "fs";
import type { BookDataType, RecType, StoryType, XMLObjet, XMLRootType } from "../types/types";
import { AbstractElementClass } from "./AbstractElementClass";
import { BuilderXML } from "../BuilderXML";
import { IDML } from "../IDML";
import { AbstractFileClass } from "./AbstractFileClass";
import { throwError } from "../Messagerie";

export class Story extends AbstractElementClass {

  /**
   * Méthode appelé à la défautisation de la donnée recette pour
   * définir la donnée `stories' dans les données du livre.
   * 
   * Les textes peuvent être définis de différentes manières :
   * -  explicement dans une donnée 'texts', 'textes' ou 'stories'
   *    dans la recette
   * -  dans un dossier 'texts', 'stories' ou 'textes'
   * -  dans un unique fichier 'texte.<ext>', 'text.<ext>' ou 'content.<ext>'
   * 
   */
  public static getStories(bookData: BookDataType): StoryType[] {
    let textes: string[] = [];
    if (bookData.story || bookData.text || bookData.texte) {textes = [bookData.story || bookData.texte|| bookData.text as any]}
    else if (bookData.texts || bookData.textes || bookData.stories) { textes = bookData.texts || bookData.textes as any}
    else if (this.rootText(bookData)) { textes = [this.rootText(bookData) as string]; }
    else if (this.textFolder(bookData)) {
      const textFolder = this.textFolder(bookData) as string;
      textes = fs.readdirSync(textFolder).map(fn => path.join(textFolder, fn));
    }

    console.log("Textes trouvés : ", textes);


    let stories: StoryType[] = [];
    if (textes.length) {
      stories = textes.map((f: string): StoryType => {
        const dataf = path.parse(f);
        dataf.ext = dataf.ext.substring(1, dataf.ext.length);
        const format = ((ext) => {
          switch(ext){
            case 'txt': case 'text': return 'text';
            case 'md': case 'mmd': case 'markdown' : return 'markdown';
            case 'html': case 'htm': return 'html';
            default: return ext; // xml, rtf etc.
          }
        })(dataf.ext);
        let fullpath = f;
        if (fs.existsSync(path.join(bookData.bookFolder, f))) {
          fullpath = path.join(bookData.bookFolder, f);
        }
        fs.existsSync(fullpath) || throwError('unfound-story', [fullpath]);
        return {
          uuid: IDML.generateId(), path: fullpath, name: dataf.base, extension: dataf.ext, format: format
        } as StoryType;
      })
    }



    return stories;
  }

  /**
   * Retourne le chemin d'accès au texte peut-être défini à la 
   * racine du livre dans un fichier 'Texte.md' ou 'texte.md', etc.
   * 
   * @param bdata Données complètes du livre
   * @returns 
   */
  private static rootText(bdata: BookDataType): string | undefined {
    return this._roottext || (this._roottext = this.searchRootText(bdata));
  }
  private static _roottext: string | undefined;
  private static searchRootText(bdata: BookDataType): string | undefined {
    const candNames = ['Texte', 'Text', 'Content', 'Story'];
    const elements = fs.readdirSync(bdata.bookFolder).map(f => path.parse(f));
    for(const candName of candNames) {
      const candName_min = candName.toLowerCase();
      for(const element of elements){
        if (element.name === candName || element.name === candName_min){
          return path.join(element.dir, element.base);
        }
      } 
    }
  }

  private static textFolder(bdata: BookDataType): string | undefined {
    return this._textfolder || (this._textfolder = this.searchTextFolder(bdata)); 
  }
  private static searchTextFolder(bdata: BookDataType): string | undefined {
    const candNames: string[] = ['stories', 'texts', 'textes', 'content'];
    for(let candName of candNames){
      const candPath = path.join(bdata.bookFolder, candName);
      if (fs.existsSync(candPath)) { return candPath; }
    }
  }
  private static _textfolder?: string;


  constructor(data: RecType, bookData: BookDataType){super(data, bookData);}

  buildFile(){
    console.log("Construction d'une Story avec : ", this.data);
    const root: XMLRootType = {
      isPackage: true,
      tag: 'Story',
      DOMVersion: IDML.DOMVersion,
      xmlns: IDML.AIDHttpPackaging 
    };

    const content: XMLObjet = {
      tag: 'Story',
      text: `<Content>${this.formate(this.text)}</Content>`,
      attrs: [['Self', this.self]]
    };
    
    console.log("Données story définies, construction du fichier");
    new BuilderXML({
      path: path.join(this.bookData.idmlFolder, 'Stories', `Story_${this.self}.xml`),
      content: content,
      root: root
    }).output();
  }

  /**
   * Formatage complet du texte
   * --------------------------
   * Cette méthode est appelée à se développer énormément, en prenant
   * en compte, notamment, le format initial du texte ainsi que les
   * méthodes de formatage de l'utilisateur.
   */
  private formate(str: string){
    return str.replace(/\n/g, '&#xA;');
  }
  /**
   * Retourne le code String XML à inscrire dans la designmap.xml 
   */
  toXml(){

    
  }

  private get text(): string{
    if ( this.data.text.path ) {
      // Texte défini dans un fichier
      return fs.readFileSync(path.join(this.bookData.bookFolder, this.data.text.path), 'utf-8');
    } else {
      return this.data.text || 'Bonjour le monde !'
    }
     
  }
}