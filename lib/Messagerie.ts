const ERRORS = {
  'book-folder-unfound': 'Dossier du livre "_0_" introuvable.',
  'recipe-unfound': 'Recette du livre introuvable dans "_0_"',
  // Recette
  'undef-element-type-in-children': 'Type d’enfant non défini dans : _0_',
  'unknown-element-type': 'Type d’élément inconnu : _0_',
  // Story/textes
  'unfound-story': 'Impossible de trouver le texte de path "_0_"…', 
  'none-texte': 'Aucun texte n’est défini, je ne peux rien faire. Pour y remédier, vous pouvez par exemple créer un fichier "story.txt" à la racine du dossier du livre et mettre un court texte dedans.',
  // Element Text Frame
  'story-undef-in-textframe': "La story (id) n'est pas définie dans le TextFrame _0_…",
  // Builder XML
  'xmltag-undef-tagname': 'Il est impératif de définir le tag (tag) dans _0_.',
  // Data Props
  'ambigous-prop': 'la propriété "_0_" est ambigue. Choisissez entre _1_.',
  'unknown-data-prop': 'La propriété "_0_" est inconnue….',
}
export function throwError(
  errId: string, 
  params: string[] | undefined = undefined
){
  let msg = (ERRORS as any)[errId];
  if (params) {
    for(var i = 0, len = params.length; i < len; ++i){
      const tag = `_${i}_`;
      msg = msg.replace(tag, params[i]);
    }
  }
  throw new Error(msg);
}