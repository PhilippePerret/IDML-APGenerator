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

* Le retrait du référencement de toutes les Stories ne plante pas le fichier, **mais, comme on s’y attend, affiche un book vide**. J’en garde **seulement trois**.

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
* Retrait de `type="book"`
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
	<idPkg:Story src="Stories/Story_u373.xml" />
</Document>

~~~

> On garde quand  même le `DOMVersion` (par superstition…)

## Réduction de la planche (spread)

### Réduction des attributs du Spread

En fait, on peut supprimer TOUS les attributs sans aucune conséquence. Même `Self`, `PageCount` et `ItemTransform`. Donc la balise `Spread` peut se résumer à :

~~~xml
<Spread>
  ...
</Spread>
~~~

### Réduction de la page

* On peut supprimer toute la partie `<Page>`, mais ça fait que les éléments ne sont plus placés pareil, ils débordent (marge gauche). Cette propriété sert donc à définir ce qu’est la « page » dans la planche.

  En fait, ce qui se passe vraiment, ce que : comme la `<Page>` ne définit plus les dimensions de la planche, cette planche prend des dimensions par défaut et les frames de texte se placent dessus. Comme le fichier IDML pris en exemple avaient une plance large, ça joue. 

  Je vais donc quand même garder la balise page, mais en essayant d’en garder le strict minimum. Et le minimum revient à définir : 

  ~~~xml
  <Page Self="uf0" GeometricBounds="0 0 600 800" ItemTransform="1 0 0 1 -400 -300"></Page>
  ~~~

  `GeometricBounds` définit `x y h w`, c’est-à-dire le point gauche (par rapport à quoi ?), le point haut (idem), la HAUTEUR et la LARGEUR.

  `ItemTransform` définit la matrice de transformation (qui va correspondre, ici, à définir l’origine des coordonnées), en sachant que pour les pages, seules les translations sont possibles (pas de rotation) donc seuls les deux derniers paramètres sont utiles, correspondant à : décalage horizontal, décalage vertical.

  C’est-à-dire que les coordonnées (si j’ai bien compris), puisqu’on part du milieu vertical de la reliure (est-elle toujours au milieu ?), vont avoir un 0, 0 se trouvant tout en haut à gauche.

### Réduction des blocs de texte

* Je garde uniquement un `<TextFrame>`, le premier, qui correspond au bloc de texte tout en bas.
* Si je supprime sa Property `PathGeometry`, il n’y a plus rien sur la planche.

### Réduction des élément du textframe

* Donc je suis obligé de garder la définition de `Property > PathGeometry`

* En revanche, pour les `<PathPointType>` je peux garder uniquement la définition de `Anchor` (et donc supprimer la définition des positions des poignées de Béziers).

* Pour la balise `<TextFrame>` elle-même j’ai juste à garder : 

  ~~~xml
  <TextFrame Self="u370" ParentStory="u373" ItemTransform="1 0 0 1 -300 200">
  ~~~

  Ces trois attributs sont indispensable.

* Je peux supprimer le `<TextFramePreference>` sans conséquence.

* Retrait du `<TextWrapPreference>` sans conséquence.

* Retrait du `<ObjectExportOption>` sans conséquence. 

## Conclusion pour la Spread

Donc, une planche, dans sa version minimale, peut se contenter de : 

~~~xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<idPkg:Spread xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="15.0">
	<Spread>
	 	<Page 
          Self="uf0" 
          GeometricBounds="0 0 600 800" 
          ItemTransform="1 0 0 1 -400 -300">
    </Page>
	  <TextFrame 
               Self="u370" 
               ParentStory="u373" 
               ItemTransform="1 0 0 1 -300 200">
			<Properties>
				<PathGeometry>
					<GeometryPathType>
						<PathPointArray>
							<PathPointType Anchor="-100 31" />
							<PathPointType Anchor="-100 78" />
							<PathPointType Anchor="620 78" />
							<PathPointType Anchor="620 31" />
						</PathPointArray>
					</GeometryPathType>
				</PathGeometry>
			</Properties>
		</TextFrame>
	</Spread>
</idPkg:Spread>
~~~

> Note : J’ai supprimé les deux fichiers storie inutilisés, ainsi que leur déclaration dans la map. La map se résumé maintenant à : 
>
> ~~~xml
> <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
> <Document xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging">
> 	<idPkg:Graphic src="Resources/Graphic.xml" />
> 	<idPkg:Spread src="Spreads/Spread_ueb.xml" />
> 	<idPkg:Story src="Stories/Story_u373.xml" />
> </Document>
> 
> ~~~



## Réduction maximale de la Story

* Suppression de tous les attributs de la balise `<Story>` sauf `Self` (indispensable pour y faire référence dans le textframe du spread.
* Suppression du nœud `<StoryPreference>`.
* Suppression du nœud `<InCopyExportOption>`.
* Suppression des attributs de la balise `<ParagraphStyleRange>`. Le texte apparait encore, mais il n’est plus formaté (bien sûr).
* Suppression des attributs de la balise `<CharacterStyleRange>`. Le texte est là, mais sans plus aucun style (à part la couleur définie).
* Suppression de la définition explicite de la fonte à utiliser, avec la balise `<Properties><AppliedFont>`. C’est la fonte par défaut qui s’applique.
* Suppression complète des balises `<ParagraphStyleRange>` et `<CharacterStyleRange>` sans conséquence sur l’affichage.

Donc, au minimum, on peut avoir : 

~~~xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<idPkg:Story xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="15.0">
	<Story Self="u373">
		<Content>Salut le monde !</Content>
	</Story>
</idPkg:Story>

~~~

## Réduction maximale des métadonnées

Pour finir, je m’attaque au fichier `META-INF/metadata.xml`

* retrait du nœud `<dc:format>` sans conséquence
* retrait du nœud `<xmp:CreateDate>` sans conséquence
* retrait du nœud `<xmp:MetadataDate>` sans conséquence
* retrait du nœud `<xmp:ModifyDate>` sans conséquence
* retrait du nœud `<xmp:CreatorTool>` sans conséquence
* retrait du nœud `<xmpMM:InstanceID>` idem
* retrait du nœud `<xmpMM:OriginalDocumentID>` idem
* retrait du nœud conséquent `<xmpMM:History>` sans conséquence
* retrait du nœud `<xmpMM:DocumentID>` sans conséquence
* retrait du nœud `<xmpMM:RenditionClass>` idem
* retrait du nœud très conséquen `<rdf:Description ...>` sans conséquence
* retrait du nœud parent `<rdf:RDF ...` sans conséquence
* retrait de son parent `<x:xmpmeta ...>` sans conséquence
* retrait de son parent (root) `<?xpacket ...>` sans conséquence

En fait, ce book n’a même pas besoin d’exister… Noter que ce book est le seul (?) à ne pas avoir besoin d’être référencé dans la map.

## Finalisation

Pour en finir avec cette minimalisation, je vais essayer de supprimer l’appel à la police Minion introuvable sur mon ordinateur.

En fait, la police n’est définie null part et elle reste introuvable…

## Conclusion

J’ai obtenu une version minimale. Elle est placée dans `minimal-ever` qui est testée. Ne pas la toucher.
