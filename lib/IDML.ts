export class IDML {
  private static indexId: number;

  public static init(){
    this.indexId = 0;
  }
  public static generateId(): string {
    ++ this.indexId;
    return 'di' + this.indexId.toString(36);
  }
  public static get DOMVersion(): string { return '15.0'; }
  public static get AIDHttpPackaging(): string {return 'http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging';}
}
IDML.init();