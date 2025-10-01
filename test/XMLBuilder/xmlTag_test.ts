import { describe, test, expect } from "bun:test";
import { BuilderXML } from "../../lib/BuilderXML";

function expectXmlTag(
  args: any[],
  expected: string
){
  // @ts-ignore
  const actual = xmlTag.call(null, ...args);
  expect(actual).toBe(expected);
}
function xmlTag(
  tagName: string,
  content: string | number,
  attrs: Array<[string, string | number]>,
  spaceName: string | undefined = undefined
){
  // @ts-ignore
  return BuilderXML.xmlTag.call(BuilderXML, tagName, content, attrs, spaceName);
}

describe("XMBuilder.xmlTag", () => {

  test("retourne la tag simple", () => {
    expectXmlTag(
      ['div', 'contenu', []],
      '<div>contenu</div>'
    )
  })

  test('retourne le contenu échappé', () => {
    expectXmlTag(
      ['div', '&contenu<', []], 
      '<div>&amp;contenu&lt;</div>'
    )
  })

  test('retourne la tag avec l’attributs', () => {
    expectXmlTag(
      ['div', 'contenu', [['attr', 'valeur']]],
      '<div attr="valeur">contenu</div>'
    )
  })
  test("retourne la tag avec les attributs", () => {
    expectXmlTag(
      ['div', 'contenu', [['data','valeur'], ['count', 10]]],
      '<div data="valeur" count="10">contenu</div>'
    )
  })

  test('traite l’espace de nom', () => {
    expectXmlTag(
      ['div', 'contenu', [], 'idPkg'],
      '<idPkg:div>contenu</idPkg:div>'
    )
  })

  test('ne traite pas une tag intérieure', () => {
    const tag = xmlTag('span', 'intérieure', []);
    expectXmlTag(
      ['div', tag, []],
      '<div><span>intérieure</span></div>'
    )
  });

  test('retourne le bon code avec tout', () => {
    const tag1 = xmlTag('span', 'intérieur', [["at", 'home'], ['ds','quick']]);
    const str1 = '<span at="home" ds="quick">intérieur</span>';
    const tag2 = xmlTag('quote', 'citation', [], 'idK');
    const str2 = '<idK:quote>citation</idK:quote>';
    const tag3 = xmlTag('block', '', [["var", "val"]]);
    const str3 = '<block var="val"></block>';
    expectXmlTag(
      ['Story', tag1 + tag2 + tag3, [['data','val']], 'idPkg'],
      `<idPkg:Story data="val">${str1}${str2}${str3}</idPkg:Story>`
    );
  });
})