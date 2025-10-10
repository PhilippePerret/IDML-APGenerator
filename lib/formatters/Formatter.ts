import { throwError } from "../Messagerie";
import type { BookDataType } from "../types/types";
import { MarkdownInterface } from "./MarkdownInterface";
import { TextInterface } from "./TextInterface";
import { XMLInterface } from "./XMLInterface";

const KNOWS_FORMATS = ['text', 'markdown', 'xml'];

export class MainFormatter {
  private forgery: any;

  constructor(
    private raw_content: string,
    private format: string, 
    private bookData: BookDataType
  ) {

    this.forgery = ((fmt) => {
      switch(fmt){
        case 'text': return new TextInterface(this);
        case 'markdown': return new MarkdownInterface(this);
        case 'xml': return new XMLInterface(this);
        default: throwError('unknown-text-format', [fmt, KNOWS_FORMATS.prettyJoin()]);
      }
    })(format);
  }

  output(): string{
    let content = this.forgery.formate(this.raw_content);
    // Peut-être des traitements récurrents ?
    return content;
  }
}