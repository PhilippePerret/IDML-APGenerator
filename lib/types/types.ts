import type { BlobOptions } from "buffer";


export interface MasterSpreadType {
  type: 'master-spread';
  uuid: string;
}

export interface SpreadType {
  type: 'spread';
  uuid: string;
}

export interface StoryType {
  type: 'story';
  uuid: string;
}

export interface FontType {
  fname: string; // Chemin d'accès absolu ou relatif par rapport au dossier de la famille
  extraParams?: {[x: string]: string}; // Propriétés optionnelles
}

export interface FontFamilyType {
  self?: string; // Identifiant défini au cours du travail
  familyName: string;  
  folder: string;   // chemin d'accès au dossier contenant les fontes
  fonts: FontType[];
}

export interface BookDataType {
  // Dossier principal du livre (contenant au moins la recette)
  bookFolder: string;
  idmlFolder: string; // Dossier IDML pour construire l'archive (path absolue ou relative à l'endroit d'où est jouée la commande)
  masterSpreads: MasterSpreadType[];
  fonts: FontFamilyType[]; 
  graphic?: any; // je ne sais pas encore comment les définir
  spreads: SpreadType[];
  // Les textes
  stories: StoryType[];
}


export interface XMLRootType {
  isPackage?: boolean; // si True, on a un namespace 'idPkg:<tag>'
  tag: string; 
  DOMVersion?: string;
  version?: string;
  xmlns: string; // si isPackage, l'attribut deviendra xmlns:idPkg
  start?: string; // root du fichier, sera calculé le moment venu 
  end?: string; // fin du fichier, sera calculé le moment venu
}

export interface XMLObjet {
  tag?: string;
  content?: string | undefined;
  child?: XMLObjet;
  children?: XMLObjet[];
  attrs?: [string, any][];
  ns?: string; // name space (if any)
}

// === FONTES ===

export interface FontType {
  Self: string; // Identifiant long (id font family + font name + font style)
  FontStyleName: string; // Style, par exemple 'Cond Italic'
  FontFamily?: string; // Renseigné par le parent, lors de la formation
  Name?: string; // Calculé à partir de "<FontFamily.Name> <FontStyleName>" p.e. "Minion Pro Cond Italic"
  PostScriptName: string; // le nom postscript, par exemple "MinionPro-CnIt"
  Status: 'substituted' | 'installed'; // ?
  FontType: 'OpenTypeCFF' | 'OpenTypeCID' | 'TrueType'; // Le type de font
  WritingScript: "0" | "1"; // ?
  FullName?: string; // Apparemment = Name
  FullNameNative?: string; // Le nom natif, original (peut-être en coréen, etc.), sinon = Name
  FullStyleNameNative?: string; // = FontStyleName ou le nom original
  PlatformName: "$ID/";
  Version: string; // Contenu très très compliqué…
  TypeKitID: "$ID/";
}
export interface FontFamilyType {
  Self: string; // Identifiant (4 lettres)
  Name: string; // Nom de la fonte (p.e. "Minion Pro" ou "Times New Roman")
  fonts: FontType[]; // Liste des fontes de la famille
}