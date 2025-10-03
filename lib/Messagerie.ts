const ERRORS = {
  'book-folder-unfound': 'Dossier du livre "_0_" introuvable.',
  'recipe-unfound': 'Recette du livre introuvable dans "_0_"',
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