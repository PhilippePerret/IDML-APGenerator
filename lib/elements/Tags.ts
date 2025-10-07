import { AbstractFileClass } from "./AbstractFileClass";

export class TagsFile extends AbstractFileClass {
  protected Name = "Tags";
  protected folder = 'XML';
  protected bookProperty = 'tags';

}
