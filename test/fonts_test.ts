import { describe, test, expect } from "bun:test";
import { FontClass } from "../lib/FontClass";
import { IDML } from "../lib/IDML";


describe("FontClass", () => {

  test("permet d'obtenir les infos d'une police OTF", () => {
    const p = 'test/assets/fontes/PhilHarmony.otf'
    const ffId = IDML.generateId();
    const font = new FontClass(p, ffId);
    [
      ['fullName', 'PhilHarmonyFont8 Standard'],
      ['fontFamily', 'PhilHarmonyFont8'],
      ['writingScript', '0'],
      ['platformName', '$ID/'],
      ['status', 'Installed'],
      ['postscriptName', 'PhilHarmonyFont8-Standard'],
      ['self', `${ffId}${font.name}`]
    ].forEach(([prop, value]) => {
      expect((font as any)[prop as string]).toBe(value);
    })

  });

  test("permet d'obtenir les infos d'une police TTF", () => {
    const p = 'test/assets/fontes/OlympicSerif-MediumItalic.ttf'
    const ffId = IDML.generateId();
    const font = new FontClass(p, ffId);
    [
      ['fontFamily', 'Olympic Serif Medium'],
      ['version', 'Version 1.000'],
      ['postscriptName', 'OlympicSerif-MediumItalic'],
      ['status', 'Installed'],
      ['name', 'Olympic Serif Medium (TTF) Italic'],
      ['self', `${ffId}${font.name}`]
    ].forEach(([prop, value]) => {
      expect((font as any)[prop as string]).toBe(value);
    });
  });

  test("retourne la tag prête à écrire", () => {
    const p = 'test/assets/fontes/Arial Italic.ttf';
    const ffId = IDML.generateId();
    const font = new FontClass(p, ffId);
    console.log("font Arial: ", font.infos);
    const actual = font.asXmlTag();
    const expected = '<Font Self="'+ffId+'Arial (TTF) Italic" '+
    'FontFamily="Arial" '+
    'Name="Arial (TTF) Italic" '+
    'PostScriptName="Arial-ItalicMT" '+
    'Status="Installed" '+
    'FontStyleName="Italic" '+
    'FontType="OpenTypeCFF" '+
    'WritingScript="0" '+
    'FullName="Arial Italic" '+
    'FullNameNative="Arial Italic" '+
    'FontStyleNameNative="Italic" '+
    'PlatformName="$ID/" '+
    'Version="Version 5.00.2x" '+
    'TypekitID="$ID/"'+
    '></Font>';
    expect(actual).toBe(expected);
  });

  test("On peut forcer des valeurs", () => {
    const p = 'test/assets/fontes/OlympicSerif-MediumItalic.ttf'
    const ffId = IDML.generateId();
    const font = new FontClass(p, ffId, {
      writingScript: '2', 
      platformName: 'APgenerator',
      status: 'substituted',
      typekitID: 'APGen'
    });
    [
      ['platformName', 'APgenerator'],
      ['status', 'substituted'],
      ['writingScript', '2'],
      ['typekitID', 'APGen']
    ].forEach(([prop, value]) => {
      expect((font as any)[prop as string]).toBe(value);
    });

  });

})