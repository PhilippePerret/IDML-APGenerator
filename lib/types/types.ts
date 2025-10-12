
export type RecType = Record<string, any>

export interface MasterSpreadType {
  type: 'master-spread';
  uuid: string;
}

export interface SpreadType {
  type: 'spread';
  uuid: string;
  src?: string;
  pageCount: number; 
  children: {
    uuid?: string,
    type: string, // TextFrame, Textpath, Rectangle, etc.
    story: string, // UUID de la story contenu dans l'élément
    bounds?: {x: number, y: number, w: number, h: number},
    next?: string, // UUID suivant (pour textframe seulement ?)
    previous?: string, // UUID de précédent (pour textframe seulement ?)
  }[]; // TODO DÉVELOPPER !
}

export interface StoryType {
  type: 'story';
  uuid: string;
  name: string; // nom du fichier
  path: string; // chemin d'accès absolu au fichier
  extension: 'md' | 'text' | 'txt' | 'mmd' | 'markdown' | 'html' | 'htm' | 'xml' | 'rtf';
  format: 'text' | 'markdown' | 'rft' | 'xml' | 'html';
  pages?: number; // nombre de pages
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
  idmlFolderName: string; // on peut aussi ne donner que le nom
  recipePath: string;
  archName: string; // Nom du fichier IDML final (avec son extension)
  book: RecType; // Toutes les informations sur le format du book, dimension, marges, etc.
  masterSpreads?: MasterSpreadType[];
  maquettes?: MasterSpreadType[];
  fonts: FontFamilyType[]; 
  graphic?: any; // je ne sais pas encore comment les définir
  preferences?: RecType;
  styles?: RecType;
  spreads: SpreadType[];
  stories: StoryType[];
  backingStories?: StoryType[];
  story?: string;
  texte?: string;
  text?: string;
  // Les textes
  textes?: StoryType[];
  texts?: StoryType[];
  // Assets
  tags?: RecType[];
  //
  // --- Propriétés volatiles (i.e. ajoutées au runtime) ---
  pageHeight: number;
  pageWidth: number;
  archivePath: string;
}


export interface XMLRootType {
  isPackage?: boolean; // si True, on a un namespace 'idPkg:<tag>'
  tag: string; 
  DOMVersion?: string;
  version?: string;
  xmlns?: string; // si isPackage, l'attribut deviendra xmlns:idPkg
  xmlns_idPkg?: string; // Bizarre, pour la map, c'est la balise sans idPkg, mais l'espace de nom avec…
  start?: string; // root du fichier, sera calculé le moment venu 
  end?: string; // fin du fichier, sera calculé le moment venu
  id?: string;
  instTreatment?: string; // instruction de traitement (sous la déclaration <?xml)
}
export type AttrsType = [string, any][];

export interface XMLTag {
  tag?: string;
  text?: string; // value
  attrs?: AttrsType;
  ns?: string; // name space
}

export interface XMLObjet extends XMLTag {
  childTag?: string;
  child?: XMLObjet;
  children?: XMLObjet[];
  items?: RecType[]; // Liste d'attributs
  properties?: XMLObjet[]; // Ajouté mais pas encore utilisé, c'est pour définir les <Property>
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