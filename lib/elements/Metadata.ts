import fs from "fs";
import type { XMLObjet } from "../types/types";
import { AbstractFileClass } from "./AbstractFileClass";

export class Metadata extends AbstractFileClass {
  protected Name = 'metadata';
  protected folder = 'META-INF';
  protected bookProperty = 'metadata';

  protected override buildMinimalFile(content?: XMLObjet): void {
    // On compose le texte
    let c: string[] | string = []
    c.push('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
    c.push('<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>');
    c.push('<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.6-c148 79.164036, 2019/08/13-01:06:57        ">');
    c.push('<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">');

    c.push('</rdf:RDF>');
    c.push('</x:xmpmeta>');
    c.push('<?xpacket end="r"?>');

    c = c.join("\n");

    fs.writeFileSync(this.filePath, c, 'utf-8')
  }
}