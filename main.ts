import { argv } from "bun";


async function build(){
}
/**
 * Pour le moment, on laisse comme ça, mais ensuite on pourra traiter
 * différemment suivant les options/commandes
 */
// console.log("argv = ", argv);
switch (argv[2]) {
  case 'help': case 'aide':
    console.log("Je dois apprendre à afficher l'aide.");
    break;
  default:
    // Par défaut, c'est la construction de l'archive qui est lancée
    const builder = await import("./lib/Builder");
    const ibuilder = new builder.Builder();
    ibuilder.build({
      folder: '/Users/philippeperret/Documents/EssaiIDMLAPGenerator',
      masterSpreads: [],
      spreads: [],
      stories: []
    });

}