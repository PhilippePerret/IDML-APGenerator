import fs from "fs";
import type { RecType, XMLTag, XMLObjet, XMLRootType } from "./types/types";
import { throwError } from "./Messagerie";
import { execSync } from "child_process";

/**
 * Outil constructeur des fichiers XML
 */
export class BuilderXML {

  private CONST = {
    version: "1.0",
    encoding: "UTF-8",
    standalone: "yes"
  }

  private path: string;
  private content?: XMLObjet;
  private root: XMLRootType;


  /**
   * Fonction qui formate correctement le fichier XML +path+
   * 
   * @param pth Chemin d'accès au fichier à bien formater
   */
  public static wellFormat(pth: string) {
    execSync(`xmllint --format --output "${pth}" "${pth}"`);
  }

  constructor(params: {
    path: string; // Chemin d'accès au fichier final
    content?: XMLObjet; // Définition du contenu
    root: XMLRootType;
  }){
    this.path = params.path;
    this.content = params.content;
    this.root = this.prepareRoot(params.root);
   }
  
  public output() {
    this.prepareFile();
    this.write(`<?xml version="${this.CONST.version}" encoding="${this.CONST.encoding}" standalone="${this.CONST.standalone}"?>`)
    // S'il y a une instruction de traitement, comme le <?aid dans le
    // fichier designmap.xml
    if (this.root.instTreatment){ this.write(this.root.instTreatment) }
    this.write(this.root.start as string);
    // On ajoute tout le contenu
    this.content && this.write(this.buildContent(this.content));
    // On ferme le book
    this.write(this.root.end as string);
    // Par défaut, on le formate bien, avec une belle identation, et
    // à l'avenir, si vraiment c'est nécessaire, on pourra avoir une
    // option qui l'empêche
    BuilderXML.wellFormat(this.path);
  }

  private prepareRoot(root: XMLRootType): XMLRootType {
    if (root.isPackage) {
      Object.assign(root, {
        start: `<idPkg:${root.tag} xmlns:idPkg="${root.xmlns}" DOMVersion="${root.DOMVersion}">`,
        end: `</idPkg:${root.tag}>`
      });
    } else {
      const propNamespace = root.xmlns_idPkg ? 'xmlns:idPkg' : 'xmlns';
      const namespace = root.xmlns_idPkg ? root.xmlns_idPkg : root.xmlns;
      Object.assign(root, {
        start: `<${root.tag} version="${root.version}" ${propNamespace}="${namespace}">`,
        end: `</${root.tag}>`
      });
    }
    return root;
  }

  /**
   * Construction du contenu du book
   * -----------------------------------
   * C'est la grande méthode construisant l'intégralité du contenu du
   * book produit à partir de this.content.
   * 
   * Format de this.content
   * C'est un objet de type XMLObjet, c'est-à-dire :
   * - contenant  SOIT un child (balise unique) définit un XMLObjet avec tag, children ou chilf, attrs
   *              SOIT un children (balises multiples) définissant des XMLObjet(s)
   * 
   * 
   */
  private buildContent(xmlObj: XMLObjet): string {
    if (xmlObj.child) {
      if (xmlObj.tag) {
        const content = this.buildContent(xmlObj.child);
        return BuilderXML.xmlTag(xmlObj.tag, content, xmlObj.attrs || [], xmlObj.ns);
      } else {
        // Pour un premier objet principal (juste child défini)
        return this.buildContent(xmlObj.child);
      }
    } else if (xmlObj.children) {
      // Deux cas, avec des enfants :
      // 1) l'objet a un tag et c'est vraiment une balise
      // 2) l'objet n'a pas de tag et c'est juste une liste d'enfants avec
      //    leurs propres tags
      if (xmlObj.tag) {
        // Il faut ajouter le tag aux enfants (singulier du parent ou childTag défini)
        let childTag = xmlObj.childTag || xmlObj.tag.substring(0, xmlObj.tag?.length - 1);
        xmlObj.children.forEach((child: XMLObjet) => Object.assign(child, { tag: childTag }));
      } 
      const content = xmlObj.children
        .map((xmlSubObj: XMLObjet) => this.buildContent(xmlSubObj))
        .join("\n");

      if (undefined === xmlObj.tag) {
        // Enfants "orphelins"
        return content;
      } else {
        // Enfants de parents
        return BuilderXML.xmlTag(xmlObj.tag, content, xmlObj.attrs || [], xmlObj.ns);
      }
    } else if (xmlObj.items) {
      // Des éléments de même type. Cette propriété contient les 
      // attributs et peut-être le contenu (text)
      xmlObj.tag || throwError('xmltag-undef-tagname', [JSON.stringify(xmlObj)]);
      const content = xmlObj.items
        .map((item: RecType) => {
          return BuilderXML.xmlTag(item.tag, item.text, item.attrs || [], item.ns);
        })
        .join("\n");
      return BuilderXML.xmlTag(xmlObj.tag as string,content, xmlObj.attrs || [], xmlObj.ns);
    } else /* noeud sans enfant */ {
      return BuilderXML.xmlTag(
        xmlObj.tag as string, 
        xmlObj.text, 
        xmlObj.attrs || [], 
        xmlObj.ns
      );
    }
  }

  private prepareFile(){
    if (fs.existsSync(this.path)) { fs.unlinkSync(this.path); }
  }
  /**
   * Écriture dans le fichier XML
   * 
   * @param content Texte/code à écrire dans le fichier
   */
  private write(content: string){
    fs.writeFileSync(this.path, content + "\n", {encoding: 'utf-8', flag: 'a+'});
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
  public static xmlTag(
    tagName: string,
    content: string | number | undefined,
    attrs: Array<[string, string | number]>,
    spaceName: string | undefined = undefined
  ): string {
    // Échappement du contenu
    content = ((c: string | number | undefined) => {

      if (undefined === c) { return c; }
      // Pour le moment on ne traite pas encore car ça pose problème
      return String(c);

      // if ('number' === typeof c) { return c ;}
      // if (c.startsWith('<') && c.endsWith('>') && (/^<([^ >]+).*>.*<\/\1>/m.test(c)) && (/.*<([^ >]+).*>.*<\/\1>$/m.test(c))) { return c /* tag(s) formatée(s) */}
      // if (!/[&<>"']/.test(c)) return c;
      // let bad: string, bon: string;
      // for([bad, bon] of this.ESCAPED_STR){ c = c.replace(bad, bon) }
      // return c
    })(content);
    // Traitement des attributs
    let attrsStr = attrs.map(([x, y]) => `${x}="${y}"`).join(' ');
    if (attrsStr) attrsStr = ` ${attrsStr}`; 
    // Traitement de l'espace de nom
    if (spaceName) { tagName = `${spaceName}:${tagName}`}
    // La chaine retourné
    if (content) {
      return `<${tagName}${attrsStr}>${content}</${tagName}>`;
    } else {
      
      return `<${tagName}${attrsStr}/>`;

    }
  }
}