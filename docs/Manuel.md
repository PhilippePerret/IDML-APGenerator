# IDMLBuilder :: Manuel

<a name="recette"></a>

## Recette du livre/document


## Texte du livre/document

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