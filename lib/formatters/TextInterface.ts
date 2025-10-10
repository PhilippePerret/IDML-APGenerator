import { AbstractInterfaceClass } from "./AbstractInterfaceClass";
import type { MainFormatter } from "./Formatter";

export class TextInterface extends AbstractInterfaceClass {

  constructor(
    private formatter: MainFormatter
  ){ 
    super(); 
  }

  public formate(raw: string): string {
    let c = raw;
    c = c.replace(/\n/, '&xA;');
    return c; 
  }
}