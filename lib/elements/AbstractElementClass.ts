import { IDML } from "../IDML";
import type { BookDataType, RecType } from "../types/types";

export abstract class AbstractElementClass {
  constructor(
    protected data: RecType,
    protected bookData: BookDataType
  ){ }

  protected get self(){
    let uuid: string;
    uuid = this.data.uuid || this.data.id || this.data.Self || IDML.generateId();
    return uuid;
  }
  protected get children() {
    return this.data.children || this.data.elements || [];
  }
}