import fs from "fs";
const fontkit = require('fontkit') as any;
import { execSync } from 'child_process';
import { BuilderXML } from "./BuilderXML";

/**
 * FontClass
 * 
 * Pour gérer les données fontes
 * 
 */
export class FontClass {

  /**
   * Instanciation d'une fonte
   *  
   * @param fontPath Chemin d'accès à la police
   * @param fontFamilyId Identifiant InDesign de la famille de fonte
   * @param extraParams Paramètres optionnels (par exemple pour forcer le writing-script)
   */
  constructor(
    private fontPath: string, 
    private fontFamilyId: string, 
    private extraParams: {[x: string]: any} = {}
  ) {
    if (!fs.existsSync(this.fontPath)) { throw new Error(`La police '${this.fontPath}' est introuvable…`); }
    this.dispatchInfos();
  }

  /**
   * Méthode qui retourne le 'content' à envoyer à BuildXML.xmlTag
  * pour construire les tags de la font
*/
  asXmlTag(): string {
    return BuilderXML.xmlTag('Font', '', [
      ['Self', this.self],
      ['FontFamily', this.fontFamily],
      ['Name', this.name],
      ['PostScriptName', this.postscriptName],
      ['Status', this.status],
      ['FontStyleName', this.fontStyleName],
      ['FontType', this.fontType],
      ['WritingScript', this.writingScript],
      ['FullName', this.fullName],
      ['FullNameNative', this.fullNameNative],
      ['FontStyleNameNative', this.fontStyleNameNative],
      ['PlatformName', this.platformName],
      ['Version', this.version],
      ['TypekitID', this.typekitID]
    ])
  }

  get self(){ return this._self; }
  get fontFamily() { return this._ftfamily; }
  get fontType() { return this._fttype; }
  get writingScript() { return this.extraParams.writingScript || this._ftwscript; }
  get name(){ return this._ftname; }
  get postscriptName() { return this._ftpostscriptname; }
  get status() { return this.extraParams.status || 'Installed'; }
  get fontStyleName(){ return this._ftstylename; } // p.e. "EL" pour "ExtraLight"
  get fontStyleNameNative(){ return this.fontStyleName;}
  get version() { return this._ftversion; } 
  get fullName() { return this._ftfullname; }
  get fullNameNative(){ return this.infos.fullNameNative || this.fullName;}

  get platformName(){return this.extraParams.platformName || '$ID/';}
  get typekitID(){ return this.extraParams.typekitID || '$ID/';}


  // 
  // et sources possibles
  /**
   * Tous les infos sur la police, récupérées de toutes les manières
   * et sources possibles :
   * - fc-query
   * - otfont
   * - fontkit
   */
  get infos(){ return this._infos || (this._infos = this.getAllInfos()); }

  private _self!: string;
  private _ftfamily!: string;
  private _fttype!: string;
  private _ftwscript!: string;
  private _ftpostscriptname!: string;
  private _ftstylename!: string;
  private _ftversion!: string;
  private _ftname!: string;
  private _ftfullname!: string;

  private dispatchInfos(){
    const infs = this.infos;
    this._ftfamily = infs.family || infs.OI_Infos.PreferredFamily;
    this._fttype = (() => {
      if (this.extraParams.fontType) { return this.extraParams.fontType;}
      else if (infs.FontType) { return infs.FontType;}
      else { return 'OpenTypeCFF';}
    })();
    this._ftwscript = infs.AdobeScript || '0';
    this._ftpostscriptname = infs.postscriptname || infs.PostscriptName;
    // let sty = `${infs.style}${infs.SubfamilyName || infs.PreferredSubfamily}`.trim()
    // Object.entries(FontClass.STYLE2LETTER).forEach(([style, lettre]) => {
    //   sty = sty.replace(style, lettre);
    // })
    this._ftstylename = infs.style;
    this._ftversion = infs.Version || infs.FontVersion || infs.OI_Infos.Version;
    this._ftfullname = infs.fullname || infs.FullName || infs.OI.Infos.FullName;
    
    this._ftname = `${infs.family} (${infs.Type}) ${infs.OI_Infos.Subfamily}`;
    // Parfois c'est aussi `${infs.family} ${sty}`
    
    this._self = `${this.fontFamilyId}${this.name}`;
  }



  private getAllInfos(){
    // Table des infos à récupérer avec fc-query
    const infos = {
      'family': 'undef',
      'familylang': 'undef',
      'style': 'undef',
      'fullname': 'undef',
      'fullnamelang': 'undef',
      'foundry': 'undef',
      'capability': 'undef',
      'fontformat': 'undef',
      'postscriptname': 'undef',
      'fontwrapper': 'undef'
    }
    const regProp = /^"([^"]+)"(?:\(([sifdb])\)){1,2}/g;
    const fcquery = execSync(`fc-query "${this.fontPath}"`).toString();
    fcquery
    .split("\n")
    .filter(line => /".+"/.test(line))
    .map(line => {
      return line.split(':', 2).map(x => x.trim());
    })
    // On en garde que les propriétés "intéressantes"
    .filter(keyval => {
      return (infos as any)[keyval[0] as string] === 'undef'
    })
    // On extrait les valeurs
    .map(paire => {
      let key, value: any;
      [key, value] = paire as string[];
      const founds = [...(value as string).matchAll(regProp)];
      const res = founds.map(found => {
        let val: any = found[1] as string;
        if (val.length === 1) { val = val[0]; }
        Object.assign(infos, {[key as string]: val});
      })
    })

    // On supprime les valeurs non définies
    Object.keys(infos).forEach(key => {
      if ((infos as any)[key] === 'undef') { Object.assign(infos, {[key]: undefined})}
    })

    // Recherche des informations avec fontkit
    const fkinfos = fontkit.openSync(this.fontPath);
    Object.assign(infos, {
      Type: fkinfos.type,
      PostscriptName: fkinfos.postscriptName,
      FullName: fkinfos.fullName,
      FamilyName: fkinfos.familyName,
      SubfamilyName: fkinfos.subfamilyName,
      Copyright: fkinfos.copyright,
      Version: fkinfos.version,
      AvailableFeatures: fkinfos.availableFeatures
    })

    Object.assign(infos, {
      Scripts: this.getByOptionOtfinfo('s'),
      Features: this.getByOptionOtfinfo('f'),
      PSName: this.getByOptionOtfinfo('p'),
      OI_Family: this.getByOptionOtfinfo('a'),
      FontVersion: this.getByOptionOtfinfo('v'),
      OI_Infos: this.decomposeOtfInfos(this.getByOptionOtfinfo('i'))
    })
    
    this._infos = infos;
    return this._infos;
  }
  private _infos: any;

  private getByOptionOtfinfo(opt: string): string {
    return execSync(`otfinfo -${opt} "${this.fontPath}"`).toString().trim();
  }
  // Décomposition de la donnée 'info' de otfinfo. Fournira les données
  // OI_Infos de la données des infos de la fonte.
  private decomposeOtfInfos(compactStr: string): {[x: string]: string} {
    const infos = {}
    compactStr
    .split("\n")
    .forEach(line => {
      const [key, value] = line.split(':', 2).map(s => s.trim());
      const realKey = (key as string).split(' ').map(s => s.substring(0,1).toLocaleUpperCase() + s.substring(1, s.length)).join('');
      Object.assign(infos, {[realKey as string]: value});
    })
    return infos;
  }

  static STYLE2LETTER = {
    'Extra': 'E',
    'Light': 'L',
    'Italic': 'I',
    'Bold': 'B',
    'Heavy': 'H',
    'Medium': 'M',
    'Regular': 'R',
    'Thin': 'T',
    'Semi': 'S',
    'Condensed': 'C'
  }

}