# Book-A4-with-style

Ce livre doit permettre plusieurs choses :

* travailler sur la définition des styles et leur application dans l'archive IDML,
* voir comment les définir dans le texte initial
* accessoirement, voir comment est défini un style de paragraphe par défaut

## Définition des styles

Après réflexion, on définit les styles par un fichier CSS amélioré, où on peut "assembler" des classes pour former un style. C'est-à-dire qu'au lieu d'avoir dans 'class' une liste de sélecteurs répétés tout le temps, on forme des styles à partir de plusieurs classes, par exemple : 

~~~css
maitre {
  font-family: Arial;
  font-size: 12pt;
}

W200 {
  display: block;
  width: 200px;
}

colorPale {
  color: cmyk(0%, 0%, 0%, 45%); // CSS4
}

rAlign { text-align: right; }

PParag = maitre & W200 & colorPage & rAlign & {
  // Modifications ou extra propriétés
}
~~~

> Où définir les assemblages dans la recette ?

Formule pour passer de CMYK en RGB avant améliration de CSS, en javascript :

~~~javascript
function cmyk2Rgb(c, m, y, k) {
  var r, g, b;
  r = 255 - ((Math.min(1, c * (1 - k) + k)) * 255);
  g = 255 - ((Math.min(1, m * (1 - k) + k)) * 255);
  b = 255 - ((Math.min(1, y * (1 - k) + k)) * 255);
  return {r : r, g : g, b : b};
}
~~~

Reste à déterminer comment on les utilise dans un texte. 

Ce qui serait bien, c'est : 

* une façon de déterminer le style de paragraphe pour toute la suite :

  ~~~text
  nomDuStyle::
  Paragraphe avec ce style
  Autre paragraphe avec le même style

  ~~~
* avec possibilité ponctuellement d'avoir un autre style :

  ~~~text
  nomDuStyle::
  Paragraphe avec le style nomDuStyle
  Autre paragraphe avec le style nomDuStyle
  stylePonctuel:: Paragraphe dans le style ponctuel
  À nouveau un paragraphe dans le style nomDuStyle
  ~~~~

Donc le style pour affecter tous les paragraphes suivants se met seul sur une ligne. Le style pour affecter seulement un paragraphe se met avant le paragraphe. 

Pour les styles de character, on pourrait utiliser : 

~~~text
Un texte avec styleCharacter:: un style de character ::styleCharacter.
~~~

On conseillerait pour les styles de caractères fréquents d'utiliser des lettres uniques en ayant la possibilité de toutes les utiliser (26 styles de caractères x par 26 si on double les lettres, ça fait 676 possibilités).

Par exemple :

~~~text
Un texte avec sc:: un style de caractère ::sc.
~~~

On rend l'espace après les '::' obligatoires. Donc il y a une espace avant et après. 

Mais quid d'un style de caractères qui serait dans un mot, par exemple si on veut mettre en italique que "pot" à l'intérieur d'"hyppopotame" ?… On ne pourrait pas faire `hyppo sc:: pot ::sc ame` ce qui donnerait "hyppo *pot* ame". Il faudrait pouvoir faire ponctuellement : `hyppo{sc:: pot ::sc}ame`.

> Au niveau de la programmation, on rechercherait les `/(\{?[a-zA-Z0-9]+)::(.+)::\1}/`.

Par convention, on proposerait d'utiliser les mots qui commencent par des minuscules pour les styles de caractère et par des majuscules pour les styles de paragraphe.