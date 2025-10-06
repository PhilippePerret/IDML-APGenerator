import type { AttrsType } from "./types/types";

export function firstLetterOf(
  str: string,
  maj: boolean = true
): string {
  let l = str.substring(0,1);
  if (maj) { l = l.toLocaleUpperCase(); }
  return l;
}

declare global {
  interface String {
    wrapIn(tagName: string, attrs?: AttrsType): string;
  }
}
String.prototype.wrapIn = function(
  tagName: string,
  attrs?: AttrsType
): string {
  let attrsStr = '';
  if ( attrs) {
    attrsStr = ' ' + attrs.map(([k, v]) => `${k}="${v}"`).join(' ');
  }
  return `<${tagName}${attrsStr}>${this}</${tagName}>`;
}