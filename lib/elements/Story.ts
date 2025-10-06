import path from "path";
import fs from "fs";
import type { BookDataType, RecType, XMLObjet, XMLRootType } from "../types/types";
import { AbstractElementClass } from "./AbstractElementClass";
import { BuilderXML } from "../BuilderXML";
import { IDML } from "../IDML";

export class Story extends AbstractElementClass {
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
      text: `<Content>${this.formate(this.text)}</Content>`, // Pour le moment, un simple contenu simple…
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
   * Formatage du texte
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