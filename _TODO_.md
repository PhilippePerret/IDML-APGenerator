# TODO

- [ ] Comment gérer les TextFrames successifs ?
- [ ] Comment définir les marges d'une page ?
- [ ] [Recette] Comment définir les choses.
- [ ] Comment définir la grille de référence ?
- [ ] Faire un premier style de paragraphe
- [ ] Faire un premier style de character
- [ ] [Texte] Comment définir le nombre de pages ? Il faut un outil qui permette de calculer approximativement le nombre de page en fonction du style et de la longueur du texte. Paramètres à prendre en compte :
  - longueur du texte
  - hauteur de ligne (ou nombre de lignes par page)
  - hauteur de la page/textframe contenant le texte
  - taille de la police (hauteur et surtout largeur)
- [x] Obtention, par retro-ingeniering, d’une version minimal d’une archive IDML
- [x] On doit pouvoir maintenant produire une version minimale avec le texte fourni (il faut modifier les dimensions.
- [ ] Faire le détail des propriétés et des attributs de chaque élément (énorme travail)

## Réflexions

### Conception par page

Il y a deux façons (au moins) de voir les choses: 

* VUE 1. On considère un texte, c’est le centre du document. Suivant sa longueur et d’autres paramètres de mise en page, on construit autant de pages qu’il en a besoin.
* VUE 2. On considère le document, et donc ses pages. Sur ces pages, il y a des éléments et notamment des TextFrame(s) qui contient des textes. On met les textes dans ces textframe(s).

La seconde approche semblerait la plus en correspondance avec le fonctionne-ment actuel du IDML-Generator. On peut avoir un peu un mix des deux (?) en calculant le nombre de pages à partir du texte principal.

On pourrait voir les choses aussi en se disant que cette application est faite spécifiquement pour produire des livres, donc, à la base, des textes qui sont présentés dans des frames qui s’enchainent sur plusieurs pages.

> Noter que je peux avoir deux utilisations très différentes dans mes prochains livres : le dictionnaire est typiquement un texte qui court de page en page, avec index final et section de références. Le Virtuose intelligent est un livre qui se construit de page en page, sans textframes liés (sauf rare expression).

En fait, je pense qu’il faut qu’il y ait plusieurs mode d’utilisation du générateur. Et notamment LIVRE ou MAGAZINE.
