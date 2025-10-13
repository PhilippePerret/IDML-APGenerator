import fs from "fs";
import path from "path";
import { throwError } from "./Messagerie";
import { option } from "./utils/utils";

type RecType = {[x: string]: any};
const AMBIGOUS_PROPS: RecType = {};
const PROP_TO_PATH: RecType = {};

const booleans = [true, false];
const integers = typeof Number;
const strings = typeof String;

/**
 * GRANDE TABLE DES PROPRIÉTÉS DE TOUS LES FICHIERS
 * 
 * Elle permet principalement de valider les données utilisateur et de
 * savoir celles qu'il faut changer dans les fichiers modèles (fichiers
 * par défaut)
 * 
 * Mais aussi de comprendre la structure des fichiers
 * 
 * Valeurs spéciales
 * -----------------
 *  $ID/    Valeur InDesign indiquant une "Key String" (cf. manuel dév)
 *  $DEF/   Valeur personnelle indiquant une valeur qui devra être calculée. Le
 *          calcul dépend de la tag. Par exemple, ci-dessous  à [001], c'est la
 *          valeur de Self qui devra être calculée.
 */
const DATA_PROPS: RecType = {
  Story: {
    Story: {
      // On indique par '__' les propriétés qui ne sont pas des noeuds. On trouve les
      // attributs (__attrs), les propriétés quand elles ne se trouve pas dans des
      // balises <Properties>...</Properties> (__properties) ou encore les enfants
      // (__children)
      __attrs: {
        Self: { values: strings, default: '$DEF/'}, // [001]
        AppliedTOCStyle: {values: ['n', 'y'], default: 'n'},
      },
      __properties: {
        StoryPreference: {
          __attrs: {
            OpticalMarginAlignment: {values: booleans, default: false},
            OpticalMarginSize: {values: integers, default: 12},
            FrameType: {values: ['TextFrameType'], default: 'TextFrameType'},
            StoryOrientation: {values: ['Vertical', 'Horizontal'], default: 'Horizontal'},
            StoryDirection: {values: ['LeftToRightDirection', 'RightToLeftDirection'], default: 'LeftToRightDirection'}
          }
        },
        InCopyExportOption: {
          __attrs: {
            IncludeGraphicProxies: {values: booleans, default: true},
            IncludeAllResources: {values: booleans, default: false}
          }
        }
      },
      __children: { // Ça signifie qu'il peut avoir plusieurs éléments composés comme ci-dessous
        ParagraphStyleRange: {
          __properties: {
            CharacterStyleRange: {
              Properties: {
                AppliedFont: {__attrs: [['type', 'string']], text: 'Arial'}
              },
              Content: {text: 'Le texte du rang de caractère'}
            }
          }
        }
      }
    }
  },
  Preferences: {
    DataMergeOption: {
      __attrs: {
        FittingOption: { values: ['Proportional'] /*todo*/, default: 'Proportional' },
        CenterImage: { values: booleans, default: false },
        LinkImages: { values: booleans, default: true },
        RemoveBlankLines: { values: booleans, default: false },
        CreateNewDocument: { values: booleans, default: false },
        DocumentSize: { values: integers, default: 50 }
      }
    },
    LayoutAdjustmentPreference: {
      __attrs: {
        EnableLayoutAdjustment: {values: booleans, default: false},
        SnapZone: {values: integers, default: 2},
        AllowGraphicsToResize: {values: booleans, default: true},
        AllowRulerGuidesToMove: {values: booleans, default: true},
        IgnoreRulerGuideAlignments: {values: booleans, default: false},
        IgnoreObjectOrLayerLocks: {values: booleans, default: true}
      } 
    },
    EPubFixedLayoutExportPreference: {
      __attrs: {
        Level: {values: integers, default: 5},
        EpubPublisher: {values: strings, default: ""},
        Id: {values: strings, default: "urn:uuid:29d919dd-24f5-4384-be78-b447c9dc299b"},
        EpubCover: {values: ["FirstPage"], default: "FirstPage"},
        CoverImageFile: {values: strings, default: ""},
        ImageExportResolution: {values: strings, default: "Ppi150"},
        ImageConversion: {values: ["Automatic"], default: "Automatic"},
        GIFOptionsPalette: {values: ["AdaptivePalette"], default: "AdaptivePalette"},
        GIFOptionsInterlaced: {values: booleans, default: false},
        JPEGOptionsQuality: {values: ["High"], default: "High"},
        JPEGOptionsFormat: {values: ["ProgressiveEncoding", "BaselineEncoding"], default: "ProgressiveEncoding"},
        TocStyleName: {values: strings, default: "$ID/"},
        ExternalStyleSheets: {values: strings, default: ""},
        Javascripts: {values: strings, default: ""},
        EpubTitle: {values: strings, default: ""},
        EpubCreator: {values: strings, default: ""},
        EpubSubject: {values: strings, default: ""},
        EpubDescription: {values: strings, default: ""},
        EpubDate: {values: strings, default: ""},
        EpubRights: {values: strings, default: ""},
        EpubPageRange: {values: strings, default: ""},
        EpubPageRangeFormat: {values: ["ExportAllPages"], default: "ExportAllPages"},
        EpubSpreadControlOptions: {values: ["SpreadsBasedOnDoc"], default: "SpreadsBasedOnDoc"},
        EpubNavigationStyles: {values: ["NoNavigation"], default: "NoNavigation"}
      }
    },
    EPubExportPreference: {
      __attrs: {
        Level: {values: integers, default: 5},
        EpubTitle: {values: strings, default: ""},
        EpubCreator: {values: strings, default: ""},
        EpubSubject: {values: strings, default: ""},
        EpubDescription: {values: strings, default: ""},
        EpubDate: {values: strings, default: ""},
        EpubRights: {values: strings, default: ""},
        UseExistingImageOnExport: {values: booleans, default: false},
        IncludeClassesInHTML: {values: booleans, default: true},
        UseSVGAs: {values: ["EmbedCode"], default: "EmbedCode"},
        EpubPublisher: {values: strings, default: ""},
        Id: {values: strings, default: "urn:uuid:29d919dd-24f5-4384-be78-b447c9dc299b"},
        ExportOrder: {values: ["LayoutOrder"], default: "LayoutOrder"},
        EpubCover: {values: ["FirstPage"], default: "FirstPage"},
        CoverImageFile: {values: strings, default: ""},
        BulletExportOption: {values: ["UnorderedList"], default: "UnorderedList"},
        NumberedListExportOption: {values: ["OrderedList"], default: "OrderedList"},
        LeftMargin: {values: integers, default: 0},
        RightMargin: {values: integers, default: 0},
        TopMargin: {values: integers, default: 0},
        BottomMargin: {values: integers, default: 0},
        ImageExportResolution: {values: strings, default: "Ppi150"},
        CustomImageSizeOption: {values: ["SizeFixed"], default: "SizeFixed"},
        PreserveLayoutAppearence: {values: booleans, default: true},
        ImageAlignment: {values: ["AlignCenter"], default: "AlignCenter"},
        ImageSpaceBefore: {values: integers, default: 0},
        ImageSpaceAfter: {values: integers, default: 0},
        UseImagePageBreak: {values: booleans, default: false},
        ImagePageBreak: {values: ["PageBreakBefore"], default: "PageBreakBefore"},
        ImageConversion: {values: ["Automatic"], default: "Automatic"},
        GIFOptionsPalette: {values: ["AdaptivePalette"], default: "AdaptivePalette"},
        GIFOptionsInterlaced: { values: booleans, default: false },
        JPEGOptionsQuality: {values: ["High"], default: "High"},
        JPEGOptionsFormat: {values: ["BaselineEncoding", "ProgressiveEncoding"], default: "ProgressiveEncoding"},
        IgnoreObjectConversionSettings: {values: booleans, default: false},
        TocStyleName: {values: strings, default: "$ID/"},
        BreakDocument: {values: booleans, default: false},
        ParagraphStyleName: {values: strings, default: "$ID/NormalParagraphStyle"},
        StripSoftReturn: {values: booleans, default: false},
        PreserveLocalOverride: {values: booleans, default: true},
        EmbedFont: {values: booleans, default: true},
        IncludeDocumentMetadata: {values: booleans, default: true},
        MarginUnit: {values: ["CssPixel"], default: "CssPixel"},
        SpaceUnit: {values: ["CssPixel"], default: "CssPixel"},
        CSSExportOption: {values: ["EmbeddedCSS"], default: "EmbeddedCSS"},
        Format: {values: booleans, default: true},
        UseTocStyle: {values: booleans, default: false},
        ExternalCSSPath: {values: strings, default: "$ID/"},
        IncludeCSSDefinition: {values: booleans, default: true},
        ApplyImageAlignmentToAnchoredObjectSettings: {values: booleans, default: true},
        FootnoteFollowParagraph: {values: booleans, default: false},
        ExternalStyleSheets: {values: strings, default: ""},
        Javascripts: {values: strings, default: ""},
        Version: {values: strings, default: "Epub2"},
        GenerateCascadeStyleSheet: {values: booleans, default: true},
        FootnotePlacement: {values: ["FootnoteAfterStory"], default: "FootnoteAfterStory"},
        UseOriginalImageOnExport: {values: booleans, default: false}
      }
    },
    HTMLExportPreference: {
      __attrs: {
        IncludeClassesInHTML: {values: booleans, default: true},
        UseSVGAs: {values: ["EmbedCode"], default: "EmbedCode"},
        ExportSelection: {values: booleans, default: false},
        ExportOrder: {values: ["LayoutOrder"], default: "LayoutOrder"},
        BulletExportOption: {values: ["UnorderedList"], default: "UnorderedList"},
        NumberedListExportOption: {values: ["OrderedList"], default: "OrderedList"},
        ViewDocumentAfterExport: {values: booleans, default: true},
        ImageExportOption: {values: ["OptimizedImage"], default: "OptimizedImage"},
        ImageExportResolution: {values: strings, default: "Ppi150"},
        PreserveLayoutAppearence: {values: booleans, default: true},
        ImageAlignment: {values: ["AlignCenter"], default: "AlignCenter"},
        ImageSpaceBefore: {values: integers, default: 0},
        ImageSpaceAfter: {values: integers, default: 0},
        ImageConversion: {values: ["Automatic"], default: "Automatic"},
        GIFOptionsPalette: {values: ["AdaptivePalette"], default: "AdaptivePalette"},
        GIFOptionsInterlaced: {values: booleans, default: false},
        JPEGOptionsQuality: {values: ["High"], default: "High"},
        JPEGOptionsFormat: {values: ["ProgressiveEncoding", "BaselineEncoding"], default: "ProgressiveEncoding"},
        Level: {values: integers, default: 5},
        IgnoreObjectConversionSettings: {values: booleans, default: false},
        ServerPath: {values: strings, default: ""},
        ImageExtension: {values: strings, default: ".jpg"},
        PreserveLocalOverride: { values: booleans, default: true }, 
        LeftMargin: {values: integers, default: 0},
        RightMargin: {values: integers, default: 0},
        TopMargin: {values: integers, default: 0},
        BottomMargin: {values: integers, default: 0},
        MarginUnit: {values: ["CssPixel"], default: "CssPixel"},
        SpaceUnit: {values: ["CssPixel"], default: "CssPixel"},
        ExternalCSSPath: {values: strings, default: "$ID/"},
        LinkToJavascript: {values: booleans, default: true},
        JavascriptURL: {values: strings, default: "$ID/"},
        IncludeCSSDefinition: {values: booleans, default: true},
        CSSExportOption: {values: ["EmbeddedCSS"], default: "EmbeddedCSS"},
        ApplyImageAlignmentToAnchoredObjectSettings: {values: booleans, default: true},
        ExternalStyleSheets: {values: strings, default: ""},
        Javascripts: {values: strings, default: ""},
        GenerateCascadeStyleSheet: {values: booleans, default: true}
      }
    },
    XMLPreference: {
      __attrs: {
        DeleteElementOnContentDeletion: {values: booleans, default: false},
        DefaultStoryTagName: {values: strings, default: 'Story'},
        DefaultTableTagName: {values: strings, default: 'Table'},
        DefaultCellTagName: {values: strings, default: 'Cell'},
        DefaultImageTagName: {values: strings, default: 'Image'}
      },
      Properties: {
        // Properties n'ayant pas de clé __attrs:, il s'agit donc de 
        // noeud ci-dessous. C'est donc la valeur #text qui est en 
        // default et les attributs sont précisées dans la propriété
        // attrs (qui ne doit pas générer de xpath dans PATH_TO_PROP)
        DefaultStoryTagColor: {values: strings, default: 'BrickRed', __attrs: {type: 'enumeration'}},
        DefaultTableTagColor: {values: strings, default: 'DarkBlue', __attrs: {type: 'enumeration'}},
        DefaultCellTagColor: {values: strings, default: 'GrassGreen', __attrs: {type: 'enumeration'}},
        DefaultImageTagColor: {values: strings, default: 'Violet', __attrs: {type: 'enumeration'}},

      }
    },
    XMLImportPreference: {
      __attrs: {
        CreateLinkToXML: {values: booleans, default: false},
        RepeatTextElements: {values: booleans, default: true},
        IgnoreUnmatchedIncoming: {values: booleans, default: false},
        ImportTextIntoTables: {values: booleans, default: true},
        IgnoreWhitespace: {values: booleans, default: false},
        RemoveUnmatchedExisting: {values: booleans, default: false},
        ImportToSelected: {values: booleans, default: true},
        ImportStyle: {values: ["MergeImport"], default: "MergeImport"},
        AllowTransform: {values: booleans, default: false},
        ImportCALSTables: {values: booleans, default: true}
      },
      __properties: {
        TransformFilename: {values: strings, default: "StylesheetInXML", __attrs: {type: 'enumeration'}},
        TransformParameters: {
          Properties: {}
        }
      }
    },
    XMLExportPreference: {
      __attrs: {
        ViewAfterExport: {values: booleans, default: false},
        ExportFromSelected: {values: booleans, default: false},
        FileEncoding: {values: ["UTF8"], default: "UTF8"},
        Ruby: {values: booleans, default: false},
        ExcludeDtd: {values: booleans, default: true},
        CopyOriginalImages: {values: booleans, default: false},
        CopyOptimizedImages: {values: booleans, default: false},
        CopyFormattedImages: {values: booleans, default: false},
        ImageConversion: {values: ["Automatic"], default: "Automatic"},
        GIFOptionsPalette: {values: ["AdaptivePalette"], default: "AdaptivePalette"},
        GIFOptionsInterlaced: {values: booleans, default: false},
        JPEGOptionsQuality: {values: ["High"], default: "High"},
        JPEGOptionsFormat: {values: ["ProgressiveEncoding", "BaselineEncoding"], default: "BaselineEncoding"},
        AllowTransform: {values: booleans, default: false},
        CharacterReferences: {values: booleans, default: false},
        ExportUntaggedTablesFormat: {values: ["CALS"], default: "CALS"}
      },
      __properties: {
        PreferredBrowser: {values: strings, default: "Nothing", __attrs: {type: "enumeration"}},
        TransformFilename: {values: strings, default: "StylesheetInXML", __attrs: {type: "enumeration"}}
      }
    },
  }, // Preferences
}


export class DataProps {

  /**
   * Méthode principale pour obtenir les données d'une propriété
   * 
   * @param prop Propriété dont il faut voir les données
   */
  public static get(prop: string){
    if (AMBIGOUS_PROPS[prop]){
      throwError('ambigous-prop', [prop, AMBIGOUS_PROPS[prop].join(' ou ')]);
    }
    if (undefined === PROP_TO_PATH[prop]) {
      throwError('unknown-data-prop', [prop]);
    }
    const xpath = PROP_TO_PATH[prop].split(':');
    let container = DATA_PROPS;
    let key: string;
    while (key = xpath.shift()) { container = container[key]; }
    return container;
  }

  public static async init(){
    if (!fs.existsSync(this.prop2path_file) || option('force')) {
      console.log("Je construit le fichier");
      const { DataPropsBuilder } = await import('./assets/data/builder');
      DataPropsBuilder.buildProp2PathFile(DATA_PROPS, this.prop2path_file);
    }
    // Ici on peut toujours les requérir
    // @ts-ignore
    const { PREPARED_AMBIGOUS_PROPS, PREPARED_PROP_TO_PATH } = await import('./assets/data/PROP2PATH_AUTO');
    // Pour les tests, il ne faut pas multiplier
    const keyone = Object.keys(PREPARED_AMBIGOUS_PROPS)[0] as string;
    if (undefined === AMBIGOUS_PROPS[keyone]) {
      Object.assign(AMBIGOUS_PROPS, PREPARED_AMBIGOUS_PROPS);
      Object.assign(PROP_TO_PATH, PREPARED_PROP_TO_PATH);
    }
  }
  private static get prop2path_file() {
    return path.join('lib', 'assets', 'data', 'PROP2PATH_AUTO.ts');
  }
}
