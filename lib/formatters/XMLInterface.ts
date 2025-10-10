import { AbstractInterfaceClass } from "./AbstractInterfaceClass";
import type { MainFormatter } from "./Formatter";

export class XMLInterface extends AbstractInterfaceClass {

  constructor(
    private formatter: MainFormatter
  ){ 
    super(); 
  }

  public formate(raw: string): string {
    return raw; // TODO
  }
}