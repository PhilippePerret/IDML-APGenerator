import fs from "fs";
import path from "path";
import type { BookDataType, XMLObjet, XMLRootType } from "../types/types";
import { isOlder } from "../utils/utils";
import { BuilderXML } from "../BuilderXML";
import { IDML } from "../IDML";

export abstract class AbstractFileClass {
  protected abstract Name: string;
  protected abstract bookProperty: string;
  protected abstract folder: string;

  constructor(
    protected bookData: BookDataType
  ) { }

  public build(){
    const bdata = this.bookData;
    if (fs.existsSync(this.filePath) && isOlder(bdata.recipePath, this.filePath)){
      // Rien à faire
    } else {
      if ((bdata as any)[this.bookProperty]) {
        this.buildFile(); 
      } else {
        this.buildMinimalFile();
      }
    }
  }

  protected buildMinimalFile(content?: XMLObjet){
    const dataBuilder = {
      path: this.filePath,
      root: this.root
    }
    if (content) { Object.assign(dataBuilder, {content: content}); }
    new BuilderXML(dataBuilder).output();
  }
  
  protected buildFile(content?: XMLObjet) {
    const dataBuilder = {
      path: this.filePath,
      root: this.root
    };
    if (content) { Object.assign(dataBuilder, { content: content }); }
    new BuilderXML(dataBuilder).output();
  }

  protected get root(){
    return {
      isPackage: true,
      tag: this.Name,
      DOMVersion: IDML.DOMVersion,
      xmlns: IDML.AIDHttpPackaging
    } as XMLRootType
  }
  protected get filePath(){
    return this._filepath || (this._filepath = path.join((this.bookData as BookDataType).idmlFolder, this.folder, `${this.Name}.xml`));
  }

  private _filepath?: string;

}