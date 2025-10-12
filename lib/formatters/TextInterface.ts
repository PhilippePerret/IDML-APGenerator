import { AbstractInterfaceClass } from "./AbstractInterfaceClass";
import type { MainFormatter } from "./Formatter";

export class TextInterface extends AbstractInterfaceClass {

  constructor(
    private formatter: MainFormatter
  ){ 
    super(); 
  }

  public formate(raw: string): string {
    return raw
    .trim()
    .split("\n")
    .map(s => `<Content>${s}</Content>`)
    .join('<Br />')
  }
}