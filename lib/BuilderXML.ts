import { stringWidth } from "bun";

/**
 * Outil constructeur des fichiers XML
 */
export class BuilderXML {

  constructor(params: {
    path: string; // Chemin d'accès au fichier final
    content: Record<string, any>; // Définition du contenu
  }){

  }

  private static ESCAPED_STR: [string, string][] = [['&', '&amp;'], ['<', '&lt;'], ['>', '&gt;'], ['"', '&quot;'], ["'", '&apos;']];
  /**
   * 
   * @param tagName Nom de la tag
   * @param content Contenu de la tag (nombre ou string ou indéfini)
   * @param attributes Liste des attributs ([attr, val], [attr, val], etc.)
   * @param spaceName Espace de nom ou vide
   * @returns 
   */
  private static xmlTag(
    tagName: string,
    content: string | number,
    attrs: Array<[string, string | number]>,
    spaceName: string | undefined = undefined
  ): string {
    // Échappement du contenu
    content = ((c: string | number) => {
      if ('number' === typeof c) { return c ;}
      if (c.startsWith('<') && c.endsWith('>') && (/^<([^ >]+).*>.*<\/\1>/.test(c)) && (/.*<([^ >]+).*>.*<\/\1>$/.test(c))) { return c /* tag(s) formatée(s) */}
      if (!/[&<>"']/.test(c)) return c;
      let bad: string, bon: string;
      for([bad, bon] of this.ESCAPED_STR){ c = c.replace(bad, bon) }
      return c
    })(content);
    // Traitement des attributs
    let attrsStr = attrs.map(([x, y]) => `${x}="${y}"`).join(' ');
    if (attrsStr) attrsStr = ` ${attrsStr}`; 
    // Traitement de l'espace de nom
    if (spaceName) { tagName = `${spaceName}:${tagName}`}
    // La chaine retourné
    return `<${tagName}${attrsStr}>${content}</${tagName}>`
  }
}