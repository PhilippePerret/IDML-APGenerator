# Rapport de minimalité

Il s’agit de voir le code minimal qu’il faut pour obtenir une archive valide (ouvrage dans Affinity Publisher).

* On peut supprimer le fichier `XML/Tags` sans conséquence (même déclaré dans `designmap.xml` (qui sera appelé ci-dessous la « map »)
* On peut supprimer le fichier `XML/BackingStory` sans conséquence (même déclaré dans la map)
* On ne peut pas supprimer une seul Story
* On ne peut pas supprimer une seule Spread
* On ne peut pas supprimer un seul des fichiers du dossier `Resources` (Fonts, Graphic, Preferences, Styles) en tout cas quand ils sont déclarés.
* On ne peut pas supprimer une seule MasterSpread

### Essai en supprimant les déclarations

* En supprimant la déclaration de Graphic dans la map, le fichier s’ouvre (mais plus rien ne s’affiche)
* Idem en supprimant la **déclaraction de Fonts** dans la map.
* Idem en supprimant la **déclaration de Styles** dans la map.
* Idem en supprimant la **déclaration de Preferences** dans la map (mais, « bizarrement », une erreur de police manquante est survenue — en fait, ça a dû arriver avant, à la suppression de la déclaration de Fonts ?).
* Une fois les quatre déclarations retirées, on peut supprimer les fichiers ressources sans problème.
* Il faut quand même noter qu’ici, **plus rien de s’affiche** à part les frames de texte.

### En remettant déclarations et fichiers

* En remettant la déclaration de **Graphic**, ça s’ouvre toujours, mais rien ne s’affiche encore.
* En remettant le fichier `Resources/Graphic.xml`, tout le contenu se raffiche correctement.

*Soupçons : le fichier Graphic définissant les couleurs, peut être que les textes sont là mais sans couleur. Vérifier. Bingo ! Les textes sont bien dans les frames mais invisibles.*

=> Le fichier Graphic doit exister pour définir au moins une couleur.

* En ne gardant que la première ligne de définission du noir, ça fonctionne ! (sauf les textes en couleur, évidemment, qui n’apparaissent pas)

### Suppression des informations de couleur

* Je supprime les informations de couleur pour trouver le minimum.
  * on peut supprimer **`ColorValue** mais le texte devient invisible.

**=> La valeur minimale de la couleur est :**

~~~xml
<Color Self="Color/Black" ColorValue="0 0 0 100" />
~~~

Bien entendu, la valeur `Color/Black` doit dépendre de la référence dans l’élément qui fait appel à cette couleur. 

J’ai essayé de modifier les valeurs de couleur, mais sans beaucoup de résultat.

*Trouver une valeur CMYK et l’appliquer pour voir. Bingo ! Ça marche à merveille.*

**=> L’espace de couleur par défaut est l’espace CMYK** (4 valeurs, dont la dernière est le noir). (pour le modifier, il suffit de mettre par exemple `Space="RGB"` (il faut alors trois valeurs 0-255 correspond à rouge (red), vert (green) et bleu (blue).

### Conclusion pour Graphic

On arrive donc à ce fichier minimum : 

~~~xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<idPkg:Graphic xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="15.0">
	<Color Self="Color/Black" ColorValue="0 0 0 100" />
</idPkg:Graphic>
~~~

## Épuration du fichier map

* Rappel : les référencements des fichiers Fonts.xml, Styles.xml et Preferences.xml ont été supprimés, on n’a gardé que celui du fichier Graphic.xml (qui définit la couleur noire).

* Retrait de la définition propriété « kAdobeDPS_Version » (déclarée par une « keyValuePair » : 

  ~~~xml
  <Properties>
    <Label>
      <KeyValuePair Key="kAdobeDPS_Version" Value="2" />
    </Label>
  </Properties>
  ~~~

* Retrait de la définition du langage.

* Retrait de `NumberingList`

* Retrait de la `NamedGrid`

* Retrait des préférences `HTMLFXLExportPreference`

* Retrait des préférences d’export `PublishExportPreference`

* Retrait des préférences d’alignement des frames `AdjustLayoutPreference`

* Retrait des options de notes de fin `EndnoteOption`

* Retrait des options de notes de bas de page (?) `TextFrameFootnoteOptionsObject`

* Retrait des options de liens de Stories (?) `LinkedStoryOption`

* Retrait des liens d’item de page (?) `LinkedPageItemOption`

* Retrait des préférences de PDF taggué (?) `TaggedPDFPreference`

* Retrait des préférences de watermark `WatermarkPreference`

* Retrait des préférences de texte conditionnel `ConditionalTextPreference`

* Retrait de tous les `TextVariable` (?)

* Retrait de la référence au fichier Tags.xml

* Retrait de la définition de `Layer` (une propriété)

* Retrait du référencement de la MasterSpread (qui existe dans le dossier — mais le fichier a pu être supprimé sans problème)

* Retrait de la définition d’une `Section`

* Retrait de la définition de `DocumentUser` (`UserColor` ?)

* Retrait de toutes les définitions (nombreuses) de `CrossReferenceFormat`

* Retrait du référencement du fichier BackStories.xml (le fichier avait été retiré plus haut)

* Le retrait du référencement de la planche (Spread) plante le fichier

* **=> Référencement au fichier Spread obligatoire.**

* Le retrait du référencement de toutes les Stories ne plante pas le fichier, **mais, comme on s’y attend, affiche un document vide**. J’en garde **seulement trois**.

  * Si on retire tous les fichiers du dossier `Stories`, ça génère une erreur (et plante)
  * Avec les trois fichiers référencés, ça marche.

* Retrait de toutes les options de classement d’index `IndexingSortOption`.

* Retrait de toutes les coches (bullets) `ABullet`

* Retrait de l’assignement (définition de FrameColor) `Assignment`

### Réduction des attributs de `Document`

* Retrait de `Self="d"`
* Retrait de `StoryList`
* Retrait de `Name`
* Retrait de `DOMVersion`
* Retrait de `ZeroPoint`
* Retrait de `ActiveLayer`
* Retrait de `CMYKProfile`
* Retrait de `RGBProfile`
* Retrait de `SolidColorIntent`
* Retrait de `AfterBlendingIntent`
* Retrait de `DefaultImageIntent`
* Retrait de `RGBPolicy`
* Retrait de `CMYKPolicy`
* Retrait de `AccurateLABSpot`

### Réduction des attributs de `<?aid ...?>`

> Remarquer qu’il n’y a pas de capitales au début des noms d’attributs, ici.

* Retrait de `style="50"`
* Retrait de `type="document"`
* Retrait de `readerVersion="6.0"`
* Retrait de `featureSet`
* Retrait de `product`

En fait, on peut retirer complètement cette instruction de traitement (qui est certainement réservée à InDesign lui-même.

## Conclusion pour la map (designmap.xml)

Le code minimal de `designmap.xml` est donc :

~~~xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Document xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="15.0">
	<idPkg:Graphic src="Resources/Graphic.xml" />
	<idPkg:Spread src="Spreads/Spread_ueb.xml" />
	<idPkg:Story src="Stories/Story_u39c.xml" />
</Document>

~~~

> On garde quand  même le `DOMVersion` (par superstition…)

## Réduction de la planche (spread)

* On peut supprimer toute la partie `<Page>`, mais ça fait que les éléments ne sont plus placés pareil, ils débordent (marge gauche). Cette propriété sert donc à définir ce qu’est la « page » dans la planche.

