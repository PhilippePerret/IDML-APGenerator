# IDML-APGenerator

[TOC]



## Principes généraux

* On ne refait jamais tout. Quand un dossier IDML a déjà été préparé (notamment avec les gros fichiers de ressources), on le laisse intact pour se concentrer uniquement sur ce qui a changé. En général, ce sont les stories, les spreads, les objets.



## Fonctionnement divers

### Fonctionnement par modification de fichiers modèle

Il y a tellement de propriétés pour que le fichier soit valide qu’on a décidé de fonctionner par fichiers modèles qui seront modifiés. Ils sont comme la « configuration d’usine » du document. La recette se contente donc de modifier au besoin les valeurs différentes.

Pour accélérer la fabrication des fichiers, on prend les fichiers modèle du dossier `lib/assets/models/` et on les transforme sans les parser intégralement, en streaming, en faisant des recherches sur les balises et les attributs.

Une immense table (qui est alimentée au besoin) donne les indications sur le fait qu’une propriété est un #text de nœud ou un attribut, et peut préciser les valeurs qu’elle peut recevoir. Elle sert autant à valider les demandes de l’utilisateur qu’à indiquer où et comment modifier la valeur. Voir le fichier `DATA_PROPS.ts` et la table `DATA_PROPS`.



## Annexe

### Fonctionnement des positions et dimensionnement

#### Résumé

| Propriété | Empreinte | Description |
| --------- | --------- | ---- |
| **`<Page GeometricBounds>`** | ∆y, ∆x, h, w | Offset vertical par rapport à la planche, offset horizontal par rapport à la planche, hauteur, largeur, le tout en points. |
|           |           |      |
|           |           |      |



#### Explications détaillées

C’est une des parties difficiles, en tout cas au début. Car les positions peuvent être exprimées de différentes manière et les valeurs ne précisent jamais s’il s’agit du vertical, de l’horizontal, du relatif ou de l’absolu, etc. Parfois, le x est avant le y, parfois c’est l’inverse…

Prenons pour l’exemple les points d’un TextFrame :

~~~xml
<PathPointArray>
  <PathPointType Anchor="0 0" />
	<PathPointType Anchor="0 300" />
	<PathPointType Anchor="620 300" />
	<PathPointType Anchor="620 0" />
</PathPointArray>
~~~

<strike>Ici, il faut bien comprendre que le premier point se trouve à la position y:0 et x:0, le deuxième point à la position y:0 (=> même hauteur) et x:300, le troisième point à y:620 et x:300, donc sous le deuxième, et le quatrième est sur y:620 et x:0 donc sous le premier. Par défaut, le bloc se referme.</strike>

Non, en fait (cf. plus bas), le premier chiffre concerne bien la valeur `x` (horizontale) et le deuxième la valeur `y` (verticale).

Mais ça n’est pas suffisant de savoir ça. Car ces coordonées sont relatives à la position du TextFrame dans la page. Dans l’exemple que je prends, le y:0 est vraiment tout en haut de la page, tandis que le x:0 est à 100 pixels à peu près.

Pour comprendre les translations (propriété `ItemTransform` de la page et du bloc de texte, il faut comprendre que le « zéro absolu » se trouve toujours **au centre de la planche**. 

Prenons une page qui a ces dimensions :

~~~xml
<Page GeometryBounds="0 0 600 800">
~~~

Il faut déjà comprendre que ces coordonnées définissent « y, x, h, w » c’est-à-dire « décalage vertical, décalage horiztontal, hauteur, largeur ».

… Après quelques essais, je ne comprends plus… Mes mesures semblent contredire le fait que le 0,0 serait en bas à gauche. En effet, si je fais une page comme décrite ci-dessus, donc partant au point tout en haut à gauche, de 800 points de large et 600 points de haut… si je règle son item transform à : 

~~~xml
<Page ... ItemTransform="1 0 0 1 0 0">
~~~

Donc aucune translation (ce sont les deux derniers nombres qui gèrent la translation, les autres concernent la rotation et l’on ne peut pas tourner une page.

Et si le règle le bloc de texte à : 

~~~xml
<TextFrame ... ItemTransform="1 0 0 1 0 0">
~~~

… donc là-aussi sans translation et que je règle les points à :

~~~xml
<PathPointType Anchor="0 0" />
<PathPointType Anchor="0 300" />
<PathPointType Anchor="800 300" />
<PathPointType Anchor="800 0" />
~~~

… alors ces points sont bien calculés d’après le zéro en haut à gauche, c’est-à-dire qu’on obtient les points : 

~~~
	PT. 1																			PT. 4
x:0, y:0  +------------------------------+ x:800/y:0
					|																|
					|																|
	PT. 2		|																|	PT. 3
x:0/y:300 +-------------------------------+ x:800/y:300
					
~~~





### `$ID/`

Ce signe, dans les codes IDML/XML, indique que le string qui suit est un *key string*, une clé-string, c’est-à-dire un nom, un texte, qui devra être interprété, à l’importation, suivant la locale définie (la langue). 

Pour la production de documents destinés à Affinity Publisher, cette marque est donc inutile, *a priori*.

### Unités de mesure

Sauf précision contraire, toutes les valeurs nombres sont exprimées en **points** (le point étant lui-même le 72e d’un pouce — donc **`pt * 72 = inch`**).

### Espace dans valeur de propriétés

Si une espace doit être utilisée dans une valeur de propriété, elle doit être remplacée par `%20` pour que la valeur ne soit pas confondu avec une liste.

~~~
Attr="0 0 0 100" => [0, 0, 0, 100]
Attr="0%{20}0%{20}0%{20}100" => "0 0 0 100"
# ou
Attrs="C'est%20bon"
~~~

### Référence à un élément imbriqué

En règle général, on fait référence à un élément **non imbriqué** par  :

~~~xml
<... Reference="Parent/Self-enfant"...>
~~~

Par exemple : 

~~~xml
<... AppliedParagraphStyle="ParagraphStyle/MonStyle"...>
~~~

Mais lorsque la cible est un sous-élément, donc un **élément imbriqué**, on utilise des `%30a` (« : ») pour marquer le nœud :

~~~xml
<... ReferenceA="Parent/Sousparent%30aSelf-enfant"...>
~~~

Par exemple :

~~~xml
<... AppliedParagraphStyle="ParagraphStyle/List%30aMaList"
~~~

### Traduction de termes

Quelques termes utiles à connaitre en anglais pour bien lire la documentation.

| Terme anglais |      | terme français |
| ------------- | ---- | -------------- |
| Binding       |      | Reliure        |
|               |      |                |
|               |      |                |

### IDML

Cette section comprend un résumé des généralités relevées dans le document des spécificités IDML.

#### Story

Pour apparaitre sur le document, une « story », donc **un texte** doit appartenir à un `<TextFrame>` (bloc de texte) ou un `<TextPath>` (chemin de texte) contenu par un `<Spread>` (planche).
