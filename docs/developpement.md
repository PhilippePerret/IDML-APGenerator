# IDML-APGenerator

## Principes généraux

* On ne refait jamais tout. Quand un dossier IDML a déjà été préparé (notamment avec les gros fichiers de ressources), on le laisse intact pour se concentrer uniquement sur ce qui a changé. En général, ce sont les stories, les spreads, les objets.



## Fonctionnement divers

### Modification des fichiers templates

Pour accélérer la fabrication des fichiers, on prend les fichiers modèle du dossier `lib/assets/models/` et on les transforme sans les parser intégralement, en streaming, en faisant des recherches sur les balises et les attributs.

Une immense table (qui est alimentée au besoin) donne les indications sur le fait qu’une propriété est un #text de nœud ou un attribut, et peut préciser les valeurs qu’elle peut recevoir. Elle sert autant à valider les demandes de l’utilisateur qu’à indiquer où et comment modifier la valeur. Voir le fichier `DATA_PROPS.ts` et la table `DATA_PROPS`.