# IDML-APGenerator

## INTRODUCTION

Comprendre ce nom comme : « Format IDML pour la génération de fichiers pour Affinity Publisher »

**IDML** est le langage développé par Adobe pour exprimer les fichiers en **XML**. Un fichier `.idml` est en réalité une archive contenant plusieurs fichiers définissant le fichier.

### Ré-archivage

Pour réarchiver un fichier décompressé, on ne peut pas utiliser le « compresser ce dossier » de macOs. Il faut faire une archive non compressée et qui contient, surtout, le mimetype en premier fichier. Pour produire ce fichier `idml`, se placer dans un dossier bien constitué pour IDML et jouer la commande : 

~~~bash
zip -X0 ../fichier.idml mimetype
zip -Xr ../fichier.idml . -x mimetype
~~~

Cela produira le fichier **`fichier.idml`** qui pourra alors être ouvert dans AP (ou InDesign, bien entendu).

## APPLICATION JAVASCRIPT

Ce dossier est le développement de l’application javascript qui doit permettre de produire de façon assistée des fichiers **`.idml`** pour produire des fichiers Affinity Publisher qu’on pourra ensuite ajuster. 

Le grand avantage de cette application — et de passer par IDML — est le fait de pouvoir automatiser des opérations qui peuvent être rédhibitoires comme la création d’index ou de références croisées, la gestion de bibliographies, etc.

Cette application a été développée pour permettre la production du *Grand Dictionnaire du Scénario et de la Narration*. Au départ, on devait le faire avec Prawn-for-book, mais la complexité de la mise en page n’a pas permis de le faire.

Elle peut être lancée, dans un dossier contenant les fichiers requis, à l’aide de la commande : 

~~~bash
idml-apg build dossier
~~~



## DOCUMENTATION

Cette application puise en premier lieu dans les deux sources de documentation les plus importantes, situées dans le dossier `xDocumentation`, à savoir :

* [**idml-cookbook.idml**](xDocumentation/idml-cookbook.pdf) qui comme son nom l’indique présente la recette d’un fichier `idml`
* [**idml-specification.pdf**](xDocumentation/idml-specification.pdf) qui est la somme de toutes les spécifications des archives idml.

## PRINCIPES GÉNÉRAUX

### Langage de développement

C’est le JavaScript/TypeScript qui a été choisi comme langage de développement, avec `bun`, pour sa vitesse d’exécution et son confort de développement.

### Fichiers de base

Le fichier utilisateur doit donc être exprimée dans un langage simplifié et transformé par l’application en une archive `idml`. On peut imaginer 4 fichiers au moins pour exprimer un fichier **`idml.apg`** (extension qu’on utilisera pour les fichiers utilisateur) :

* **`recipe.imdl.apg.yaml`**. Le fichier recette du fichier qui définira en tout premier lieu les méta-données du fichier, à commencer par la taille de la page, des marges, du fond perdu, mais aussi les polices, les styles, etc.
* **`content.imdl.apg.txt`**. C’est le fichier contenant le texte, sans aucune mise en forme (mais avec des balises pouvant définir la nature des éléments, qui permettra ensuite de les mettres en forme).
* **`formater.imdl.apg.ts`**. Fichier qui interface le fichier de contenu et l’application pour définir les formats. Par exemple, si une balise `todo` est définie et qu’on rencontre `todo(faire ceci et cela)` dans le contenu, c’est ce fichier qui définit la fonction qui va transformer cette balise en code IDML.
* **`parser.imdl.apg.ts`**. Fichier qui peut servir d’interface entre l’application et le contenu pour adapter ce contenu aux attentes de l’application. Grâce à ce fichier, tout type de contenu peut être utiliser pour nourir le contenu du fichier final.
* **`references.idml.apg.json`**. Fichier contenant les références (livres, films, peoople, etc.) qui sont utilisées dans le document.

## Annexe

### Terminologie (anglais/français)

| Anglais       |      | Français              |
| ------------- | ---- | --------------------- |
| Spread        |      | Planche               |
| Master spread |      | Maquette (de planche) |
|               |      |                       |

