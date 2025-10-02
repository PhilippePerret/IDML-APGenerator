export class IDML {
  private static indexId: number;

  public static init(){
    this.indexId = 0;
  }
  public static generateId(): string {
    ++ this.indexId;
    return 'di' + this.indexId.toString(36);
  }
}
IDML.init();