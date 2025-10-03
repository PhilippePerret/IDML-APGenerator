/**
   * Fichier fabriqué automatiquement à partir des données DATA_PROPS
   * du fichier DATA_PROPS.ts. NE PAS LE TOUCHER.
   * Pour actualiser les valeurs :
   * SOIT : le détruire
   * SOIT : mettre la propriété 'force' des configurations
   *        (config.json) à true.
   */

/**
 * Table des propriétés ambigues, c'est-à-dire les propriétés qui 
 * peuvent appartenir à deux choses différentes. Elles génères une
 * erreur et demandent précision
 */

export const PREPARED_AMBIGOUS_PROPS = {
  "Level": [
    "EPubExportPreference:Level",
    "HTMLExportPreference:Level"
  ],
  "EpubTitle": [
    "EPubExportPreference:EpubTitle"
  ],
  "EpubCreator": [
    "EPubExportPreference:EpubCreator"
  ],
  "EpubSubject": [
    "EPubExportPreference:EpubSubject"
  ],
  "EpubDescription": [
    "EPubExportPreference:EpubDescription"
  ],
  "EpubDate": [
    "EPubExportPreference:EpubDate"
  ],
  "EpubRights": [
    "EPubExportPreference:EpubRights"
  ],
  "EpubPublisher": [
    "EPubExportPreference:EpubPublisher"
  ],
  "Id": [
    "EPubExportPreference:Id"
  ],
  "EpubCover": [
    "EPubExportPreference:EpubCover"
  ],
  "CoverImageFile": [
    "EPubExportPreference:CoverImageFile"
  ],
  "ImageExportResolution": [
    "EPubExportPreference:ImageExportResolution",
    "HTMLExportPreference:ImageExportResolution"
  ],
  "ImageConversion": [
    "EPubExportPreference:ImageConversion",
    "HTMLExportPreference:ImageConversion"
  ],
  "GIFOptionsPalette": [
    "EPubExportPreference:GIFOptionsPalette",
    "HTMLExportPreference:GIFOptionsPalette"
  ],
  "GIFOptionsInterlaced": [
    "EPubExportPreference:GIFOptionsInterlaced",
    "HTMLExportPreference:GIFOptionsInterlaced"
  ],
  "JPEGOptionsQuality": [
    "EPubExportPreference:JPEGOptionsQuality",
    "HTMLExportPreference:JPEGOptionsQuality"
  ],
  "JPEGOptionsFormat": [
    "EPubExportPreference:JPEGOptionsFormat",
    "HTMLExportPreference:JPEGOptionsFormat"
  ],
  "TocStyleName": [
    "EPubExportPreference:TocStyleName"
  ],
  "ExternalStyleSheets": [
    "EPubExportPreference:ExternalStyleSheets",
    "HTMLExportPreference:ExternalStyleSheets"
  ],
  "Javascripts": [
    "EPubExportPreference:Javascripts",
    "HTMLExportPreference:Javascripts"
  ],
  "IncludeClassesInHTML": [
    "HTMLExportPreference:IncludeClassesInHTML"
  ],
  "UseSVGAs": [
    "HTMLExportPreference:UseSVGAs"
  ],
  "ExportOrder": [
    "HTMLExportPreference:ExportOrder"
  ],
  "BulletExportOption": [
    "HTMLExportPreference:BulletExportOption"
  ],
  "NumberedListExportOption": [
    "HTMLExportPreference:NumberedListExportOption"
  ],
  "PreserveLayoutAppearence": [
    "HTMLExportPreference:PreserveLayoutAppearence"
  ],
  "ImageAlignment": [
    "HTMLExportPreference:ImageAlignment"
  ],
  "ImageSpaceBefore": [
    "HTMLExportPreference:ImageSpaceBefore"
  ],
  "ImageSpaceAfter": [
    "HTMLExportPreference:ImageSpaceAfter"
  ],
  "IgnoreObjectConversionSettings": [
    "HTMLExportPreference:IgnoreObjectConversionSettings"
  ],
  "PreserveLocalOverride": [
    "HTMLExportPreference:PreserveLocalOverride"
  ],
  "LeftMargin": [
    "HTMLExportPreference:LeftMargin"
  ],
  "RightMargin": [
    "HTMLExportPreference:RightMargin"
  ],
  "TopMargin": [
    "HTMLExportPreference:TopMargin"
  ],
  "BottomMargin": [
    "HTMLExportPreference:BottomMargin"
  ],
  "MarginUnit": [
    "HTMLExportPreference:MarginUnit"
  ],
  "SpaceUnit": [
    "HTMLExportPreference:SpaceUnit"
  ],
  "ExternalCSSPath": [
    "HTMLExportPreference:ExternalCSSPath"
  ],
  "IncludeCSSDefinition": [
    "HTMLExportPreference:IncludeCSSDefinition"
  ],
  "CSSExportOption": [
    "HTMLExportPreference:CSSExportOption"
  ],
  "ApplyImageAlignmentToAnchoredObjectSettings": [
    "HTMLExportPreference:ApplyImageAlignmentToAnchoredObjectSettings"
  ],
  "GenerateCascadeStyleSheet": [
    "HTMLExportPreference:GenerateCascadeStyleSheet"
  ]
};

/**
 * Grande table automatique qui donne le xpath d'une propriété dans
 * la table DATA_PROPS. Par exemple, 'link_images' va retourner :
 * 'preferences.data_merge_option.args.link_images'. Si la propriété
 * est ambigues (deux ou plus xpath possibles), une erreur est 
 * générée avant.
 */

export const PREPARED_PROP_TO_PATH = {
  "FittingOption": "Preferences:DataMergeOption:attrs:FittingOption",
  "CenterImage": "Preferences:DataMergeOption:attrs:CenterImage",
  "LinkImages": "Preferences:DataMergeOption:attrs:LinkImages",
  "RemoveBlankLines": "Preferences:DataMergeOption:attrs:RemoveBlankLines",
  "CreateNewDocument": "Preferences:DataMergeOption:attrs:CreateNewDocument",
  "DocumentSize": "Preferences:DataMergeOption:attrs:DocumentSize",
  "EnableLayoutAdjustment": "Preferences:LayoutAdjustmentPreference:attrs:EnableLayoutAdjustment",
  "SnapZone": "Preferences:LayoutAdjustmentPreference:attrs:SnapZone",
  "AllowGraphicsToResize": "Preferences:LayoutAdjustmentPreference:attrs:AllowGraphicsToResize",
  "AllowRulerGuidesToMove": "Preferences:LayoutAdjustmentPreference:attrs:AllowRulerGuidesToMove",
  "IgnoreRulerGuideAlignments": "Preferences:LayoutAdjustmentPreference:attrs:IgnoreRulerGuideAlignments",
  "IgnoreObjectOrLayerLocks": "Preferences:LayoutAdjustmentPreference:attrs:IgnoreObjectOrLayerLocks",
  "Level": "Preferences:EPubFixedLayoutExportPreference:attrs:Level",
  "EpubPublisher": "Preferences:EPubFixedLayoutExportPreference:attrs:EpubPublisher",
  "Id": "Preferences:EPubFixedLayoutExportPreference:attrs:Id",
  "EpubCover": "Preferences:EPubFixedLayoutExportPreference:attrs:EpubCover",
  "CoverImageFile": "Preferences:EPubFixedLayoutExportPreference:attrs:CoverImageFile",
  "ImageExportResolution": "Preferences:EPubFixedLayoutExportPreference:attrs:ImageExportResolution",
  "ImageConversion": "Preferences:EPubFixedLayoutExportPreference:attrs:ImageConversion",
  "GIFOptionsPalette": "Preferences:EPubFixedLayoutExportPreference:attrs:GIFOptionsPalette",
  "GIFOptionsInterlaced": "Preferences:EPubFixedLayoutExportPreference:attrs:GIFOptionsInterlaced",
  "JPEGOptionsQuality": "Preferences:EPubFixedLayoutExportPreference:attrs:JPEGOptionsQuality",
  "JPEGOptionsFormat": "Preferences:EPubFixedLayoutExportPreference:attrs:JPEGOptionsFormat",
  "TocStyleName": "Preferences:EPubFixedLayoutExportPreference:attrs:TocStyleName",
  "ExternalStyleSheets": "Preferences:EPubFixedLayoutExportPreference:attrs:ExternalStyleSheets",
  "Javascripts": "Preferences:EPubFixedLayoutExportPreference:attrs:Javascripts",
  "EpubTitle": "Preferences:EPubFixedLayoutExportPreference:attrs:EpubTitle",
  "EpubCreator": "Preferences:EPubFixedLayoutExportPreference:attrs:EpubCreator",
  "EpubSubject": "Preferences:EPubFixedLayoutExportPreference:attrs:EpubSubject",
  "EpubDescription": "Preferences:EPubFixedLayoutExportPreference:attrs:EpubDescription",
  "EpubDate": "Preferences:EPubFixedLayoutExportPreference:attrs:EpubDate",
  "EpubRights": "Preferences:EPubFixedLayoutExportPreference:attrs:EpubRights",
  "EpubPageRange": "Preferences:EPubFixedLayoutExportPreference:attrs:EpubPageRange",
  "EpubPageRangeFormat": "Preferences:EPubFixedLayoutExportPreference:attrs:EpubPageRangeFormat",
  "EpubSpreadControlOptions": "Preferences:EPubFixedLayoutExportPreference:attrs:EpubSpreadControlOptions",
  "EpubNavigationStyles": "Preferences:EPubFixedLayoutExportPreference:attrs:EpubNavigationStyles",
  "EPubExportPreference:Level": "Preferences:EPubExportPreference:attrs:Level",
  "EPubExportPreference:EpubTitle": "Preferences:EPubExportPreference:attrs:EpubTitle",
  "EPubExportPreference:EpubCreator": "Preferences:EPubExportPreference:attrs:EpubCreator",
  "EPubExportPreference:EpubSubject": "Preferences:EPubExportPreference:attrs:EpubSubject",
  "EPubExportPreference:EpubDescription": "Preferences:EPubExportPreference:attrs:EpubDescription",
  "EPubExportPreference:EpubDate": "Preferences:EPubExportPreference:attrs:EpubDate",
  "EPubExportPreference:EpubRights": "Preferences:EPubExportPreference:attrs:EpubRights",
  "UseExistingImageOnExport": "Preferences:EPubExportPreference:attrs:UseExistingImageOnExport",
  "IncludeClassesInHTML": "Preferences:EPubExportPreference:attrs:IncludeClassesInHTML",
  "UseSVGAs": "Preferences:EPubExportPreference:attrs:UseSVGAs",
  "EPubExportPreference:EpubPublisher": "Preferences:EPubExportPreference:attrs:EpubPublisher",
  "EPubExportPreference:Id": "Preferences:EPubExportPreference:attrs:Id",
  "ExportOrder": "Preferences:EPubExportPreference:attrs:ExportOrder",
  "EPubExportPreference:EpubCover": "Preferences:EPubExportPreference:attrs:EpubCover",
  "EPubExportPreference:CoverImageFile": "Preferences:EPubExportPreference:attrs:CoverImageFile",
  "BulletExportOption": "Preferences:EPubExportPreference:attrs:BulletExportOption",
  "NumberedListExportOption": "Preferences:EPubExportPreference:attrs:NumberedListExportOption",
  "LeftMargin": "Preferences:EPubExportPreference:attrs:LeftMargin",
  "RightMargin": "Preferences:EPubExportPreference:attrs:RightMargin",
  "TopMargin": "Preferences:EPubExportPreference:attrs:TopMargin",
  "BottomMargin": "Preferences:EPubExportPreference:attrs:BottomMargin",
  "EPubExportPreference:ImageExportResolution": "Preferences:EPubExportPreference:attrs:ImageExportResolution",
  "CustomImageSizeOption": "Preferences:EPubExportPreference:attrs:CustomImageSizeOption",
  "PreserveLayoutAppearence": "Preferences:EPubExportPreference:attrs:PreserveLayoutAppearence",
  "ImageAlignment": "Preferences:EPubExportPreference:attrs:ImageAlignment",
  "ImageSpaceBefore": "Preferences:EPubExportPreference:attrs:ImageSpaceBefore",
  "ImageSpaceAfter": "Preferences:EPubExportPreference:attrs:ImageSpaceAfter",
  "UseImagePageBreak": "Preferences:EPubExportPreference:attrs:UseImagePageBreak",
  "ImagePageBreak": "Preferences:EPubExportPreference:attrs:ImagePageBreak",
  "EPubExportPreference:ImageConversion": "Preferences:EPubExportPreference:attrs:ImageConversion",
  "EPubExportPreference:GIFOptionsPalette": "Preferences:EPubExportPreference:attrs:GIFOptionsPalette",
  "EPubExportPreference:GIFOptionsInterlaced": "Preferences:EPubExportPreference:attrs:GIFOptionsInterlaced",
  "EPubExportPreference:JPEGOptionsQuality": "Preferences:EPubExportPreference:attrs:JPEGOptionsQuality",
  "EPubExportPreference:JPEGOptionsFormat": "Preferences:EPubExportPreference:attrs:JPEGOptionsFormat",
  "IgnoreObjectConversionSettings": "Preferences:EPubExportPreference:attrs:IgnoreObjectConversionSettings",
  "EPubExportPreference:TocStyleName": "Preferences:EPubExportPreference:attrs:TocStyleName",
  "BreakDocument": "Preferences:EPubExportPreference:attrs:BreakDocument",
  "ParagraphStyleName": "Preferences:EPubExportPreference:attrs:ParagraphStyleName",
  "StripSoftReturn": "Preferences:EPubExportPreference:attrs:StripSoftReturn",
  "PreserveLocalOverride": "Preferences:EPubExportPreference:attrs:PreserveLocalOverride",
  "EmbedFont": "Preferences:EPubExportPreference:attrs:EmbedFont",
  "IncludeDocumentMetadata": "Preferences:EPubExportPreference:attrs:IncludeDocumentMetadata",
  "MarginUnit": "Preferences:EPubExportPreference:attrs:MarginUnit",
  "SpaceUnit": "Preferences:EPubExportPreference:attrs:SpaceUnit",
  "CSSExportOption": "Preferences:EPubExportPreference:attrs:CSSExportOption",
  "Format": "Preferences:EPubExportPreference:attrs:Format",
  "UseTocStyle": "Preferences:EPubExportPreference:attrs:UseTocStyle",
  "ExternalCSSPath": "Preferences:EPubExportPreference:attrs:ExternalCSSPath",
  "IncludeCSSDefinition": "Preferences:EPubExportPreference:attrs:IncludeCSSDefinition",
  "ApplyImageAlignmentToAnchoredObjectSettings": "Preferences:EPubExportPreference:attrs:ApplyImageAlignmentToAnchoredObjectSettings",
  "FootnoteFollowParagraph": "Preferences:EPubExportPreference:attrs:FootnoteFollowParagraph",
  "EPubExportPreference:ExternalStyleSheets": "Preferences:EPubExportPreference:attrs:ExternalStyleSheets",
  "EPubExportPreference:Javascripts": "Preferences:EPubExportPreference:attrs:Javascripts",
  "Version": "Preferences:EPubExportPreference:attrs:Version",
  "GenerateCascadeStyleSheet": "Preferences:EPubExportPreference:attrs:GenerateCascadeStyleSheet",
  "FootnotePlacement": "Preferences:EPubExportPreference:attrs:FootnotePlacement",
  "UseOriginalImageOnExport": "Preferences:EPubExportPreference:attrs:UseOriginalImageOnExport",
  "HTMLExportPreference:IncludeClassesInHTML": "Preferences:HTMLExportPreference:attrs:IncludeClassesInHTML",
  "HTMLExportPreference:UseSVGAs": "Preferences:HTMLExportPreference:attrs:UseSVGAs",
  "ExportSelection": "Preferences:HTMLExportPreference:attrs:ExportSelection",
  "HTMLExportPreference:ExportOrder": "Preferences:HTMLExportPreference:attrs:ExportOrder",
  "HTMLExportPreference:BulletExportOption": "Preferences:HTMLExportPreference:attrs:BulletExportOption",
  "HTMLExportPreference:NumberedListExportOption": "Preferences:HTMLExportPreference:attrs:NumberedListExportOption",
  "ViewDocumentAfterExport": "Preferences:HTMLExportPreference:attrs:ViewDocumentAfterExport",
  "ImageExportOption": "Preferences:HTMLExportPreference:attrs:ImageExportOption",
  "HTMLExportPreference:ImageExportResolution": "Preferences:HTMLExportPreference:attrs:ImageExportResolution",
  "HTMLExportPreference:PreserveLayoutAppearence": "Preferences:HTMLExportPreference:attrs:PreserveLayoutAppearence",
  "HTMLExportPreference:ImageAlignment": "Preferences:HTMLExportPreference:attrs:ImageAlignment",
  "HTMLExportPreference:ImageSpaceBefore": "Preferences:HTMLExportPreference:attrs:ImageSpaceBefore",
  "HTMLExportPreference:ImageSpaceAfter": "Preferences:HTMLExportPreference:attrs:ImageSpaceAfter",
  "HTMLExportPreference:ImageConversion": "Preferences:HTMLExportPreference:attrs:ImageConversion",
  "HTMLExportPreference:GIFOptionsPalette": "Preferences:HTMLExportPreference:attrs:GIFOptionsPalette",
  "HTMLExportPreference:GIFOptionsInterlaced": "Preferences:HTMLExportPreference:attrs:GIFOptionsInterlaced",
  "HTMLExportPreference:JPEGOptionsQuality": "Preferences:HTMLExportPreference:attrs:JPEGOptionsQuality",
  "HTMLExportPreference:JPEGOptionsFormat": "Preferences:HTMLExportPreference:attrs:JPEGOptionsFormat",
  "HTMLExportPreference:Level": "Preferences:HTMLExportPreference:attrs:Level",
  "HTMLExportPreference:IgnoreObjectConversionSettings": "Preferences:HTMLExportPreference:attrs:IgnoreObjectConversionSettings",
  "ServerPath": "Preferences:HTMLExportPreference:attrs:ServerPath",
  "ImageExtension": "Preferences:HTMLExportPreference:attrs:ImageExtension",
  "HTMLExportPreference:PreserveLocalOverride": "Preferences:HTMLExportPreference:attrs:PreserveLocalOverride",
  "HTMLExportPreference:LeftMargin": "Preferences:HTMLExportPreference:attrs:LeftMargin",
  "HTMLExportPreference:RightMargin": "Preferences:HTMLExportPreference:attrs:RightMargin",
  "HTMLExportPreference:TopMargin": "Preferences:HTMLExportPreference:attrs:TopMargin",
  "HTMLExportPreference:BottomMargin": "Preferences:HTMLExportPreference:attrs:BottomMargin",
  "HTMLExportPreference:MarginUnit": "Preferences:HTMLExportPreference:attrs:MarginUnit",
  "HTMLExportPreference:SpaceUnit": "Preferences:HTMLExportPreference:attrs:SpaceUnit",
  "HTMLExportPreference:ExternalCSSPath": "Preferences:HTMLExportPreference:attrs:ExternalCSSPath",
  "LinkToJavascript": "Preferences:HTMLExportPreference:attrs:LinkToJavascript",
  "JavascriptURL": "Preferences:HTMLExportPreference:attrs:JavascriptURL",
  "HTMLExportPreference:IncludeCSSDefinition": "Preferences:HTMLExportPreference:attrs:IncludeCSSDefinition",
  "HTMLExportPreference:CSSExportOption": "Preferences:HTMLExportPreference:attrs:CSSExportOption",
  "HTMLExportPreference:ApplyImageAlignmentToAnchoredObjectSettings": "Preferences:HTMLExportPreference:attrs:ApplyImageAlignmentToAnchoredObjectSettings",
  "HTMLExportPreference:ExternalStyleSheets": "Preferences:HTMLExportPreference:attrs:ExternalStyleSheets",
  "HTMLExportPreference:Javascripts": "Preferences:HTMLExportPreference:attrs:Javascripts",
  "HTMLExportPreference:GenerateCascadeStyleSheet": "Preferences:HTMLExportPreference:attrs:GenerateCascadeStyleSheet",
  "DeleteElementOnContentDeletion": "Preferences:XMLPreference:attrs:DeleteElementOnContentDeletion",
  "DefaultStoryTagName": "Preferences:XMLPreference:attrs:DefaultStoryTagName",
  "DefaultTableTagName": "Preferences:XMLPreference:attrs:DefaultTableTagName",
  "DefaultCellTagName": "Preferences:XMLPreference:attrs:DefaultCellTagName",
  "DefaultImageTagName": "Preferences:XMLPreference:attrs:DefaultImageTagName",
  "DefaultStoryTagColor": "Preferences:XMLPreference:Properties:DefaultStoryTagColor",
  "DefaultTableTagColor": "Preferences:XMLPreference:Properties:DefaultTableTagColor",
  "DefaultCellTagColor": "Preferences:XMLPreference:Properties:DefaultCellTagColor",
  "DefaultImageTagColor": "Preferences:XMLPreference:Properties:DefaultImageTagColor"
};