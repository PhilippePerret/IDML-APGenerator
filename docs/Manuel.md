# IDMLBuilder :: Manuel

<a name="recette"></a>

## Recette du livre/document

La *recette* du livre est un document YAML capital puisqu’il définit (presque) tout ce qui concerne le livre en dehors du texte.

## Type du livre

Une des données capitales de la recette est le **type du livre** (`book.type`). Pour le moment, ce type peut être soit `book` (livre) soit `magazine`.

**Cette donnée détermine comment le texte sera traité et comment le livre sera calculé**. Principalement :

| Type « book »                                                | Type « Magazine »                                            |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Le générateur considère qu’il s’agit, à la base, d’un document avec un texte, long, qui court de page en page. À la base toujour, il va donc estimer le nombre de pages en fonction du texte principal, si ce nombre de pages n’est pas explicitement défini, et va créer autant de blocks de texte que nécessaire pour afficher tout le texte. | Le générateur considère qu’il s’agit, à la base, d’un document avec des pages indépendantes, qui peuvent être similaires mais sont surtout constituées de bloc de textes, d’images et de formes qui peuvent être complètement différentes d’une page à l’autre, sans forcément de rapport. |
| **Requis** : type a besoin de connaitre le texte principal. C’est le texte qui se trouve par défaut à la racine du livre (cf. ci-dessous). | **Requis** : Ce type a besoin de la définition précise de chaque page, mais elle peut être définie par une maquette (dans ce cas, le nombre de pages de chaque maquette est nécessaire). |
| **Exemple** : un roman, un dictionnaire où les entrées sont présentées dans un seul bloc de texte. | **Exemple** : un recueil d’exercices, un recueil de chansons ou de partitions. |
|                                                              |                                                              |

Par défaut (non précision de la donnée `book.type` dans la [recette][]), la valeur est `book`.

## Texte du livre

Il existe de nombreux moyens de définir le texte.

1. En créant un fichier de nom `Texte.<ext>`, `Text.<ext>`, `Content.<ext>` ou `Story.<ext>` à la racine du dossier du livre, avec ce nom qui peut être tout en minuscule, et l'une des [extensions autorisées](#extensions).
2. En mettant le ou les textes dans un dossier portant l'un de ces noms : `textes`, `stories`, `texts`. Noter que dans ce cas, les textes seront chargés dans le désordre en fonction de l'ordinateur.
3. En définissant leur chemin absolu ou relatif par rapport au dossier du livre dans la [recette][], dans une des propriétés racine suivante, au choix (mais une seule) : `story`, `texte` ou `text` pour un unique fichier, `textes` ou `texts` pour plusieurs fichier.

Les fichiers seront traités en fonction de leur format (extension).

<a name="extensions"></a>

### Extensions/formats autorisées

Le fichier, pour le moment, peut être en Markdown (`.md`, `.mmd`) en Texte Simple (`.txt`, `.text`) ou en XML/IDML (`.xml`).

À l'avenir, il pourrait être en HTML, en RTF ou d'autres formats à implémenter.



[recette]: #recette