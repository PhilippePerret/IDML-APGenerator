# Historique de travail - IDML-APGenerator

**IMPORTANT : PROJET POUR AFFINITY PUBLISHER, PAS INDESIGN**
**NE JAMAIS MENTIONNER INDESIGN - UTILISER SEULEMENT AFFINITY PUBLISHER COMME RÉFÉRENCE**

## 14 octobre 2025

- Retour sur le projet IDML après interruptions techniques
- Investigation sur l'application des MasterSpread : clarification que les MasterSpread s'appliquent bien aux Pages individuelles dans IDML, pas aux Spreads entiers
- Question cruciale : pour document complet avec TextFrames liés contenant même story, faut-il créer les TextFrames sur chaque Spread malgré MasterSpread ?
- Réponse : OUI, il faut créer les TextFrames sur chaque Spread
- Clarification : les MasterSpread ne servent qu'à éviter de redéfinir les propriétés des Pages
- Question : utilité réelle des MasterSpread si pages identiques dans un document ?
- Contradiction relevée : les en-têtes de chapitre ne se définissent pas dans <Page> mais dans les éléments du MasterSpread
- Conclusion : MasterSpread = mauvaise conception pour génération automatique
- Demande : liste complète des attributs et éléments du nœud <Page>
- Précision : marquer les éléments hérités du MasterSpread (*) et ceux qui écrasent (!) 
- Demande explication termes : recouvrement, tabulation, surcharges, mise en page alternative, fusion instantanés, descripteur numérotation
- Question : modèles de TextFrame - confirmation, définition et application
- Précision : ObjectStyle s'applique-t-il à d'autres éléments que TextFrame ?
- Intérêt : ObjectStyle permet modèles pour tous éléments (TextFrame, Rectangle, etc.) - fonctionnalité manquante dans AP
