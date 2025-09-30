

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


export interface BookDataType {
  // Dossier principal du livre (contenant au moins la recette)
  folder: string;
  masterSpreads: MasterSpreadType[];
  spreads: SpreadType[];
  // Les textes
  stories: StoryType[];
}