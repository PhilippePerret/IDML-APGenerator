import { $ } from "bun";
import { throwError } from "../Messagerie";

/**
 * Pour faire des calculs de dimension
 */
export class Calc {

  /**
   * Convertit une valeur de n'importe quel type (millimètre, centimètre, 
   * pixels, etc.) en points.
   * 
   * Impératif : les deux derniers caractères doivent être l'unité.
   * (par exemple 'mm', 'cm', 'px' etc.)
   */
  public static any2pt(val: string | number | undefined): number | undefined {
    if (undefined === val) { return val; }
    if ('number' === typeof val) { return val; }
    const len = val.length;
    const quant = parseFloat(val.substring(0, len - 2));
    const unite = val.substring(len - 2, len);
    switch(unite){
      case 'mm': return parseFloat(this.mm2pt(quant));
      case 'cm': return parseFloat(this.mm2pt(10 * quant));
      case 'px': return parseFloat(this.px2pt(quant));
      case 'po': case 'in': return parseFloat(this.po2pt(quant));
      default: throwError('unknown-unite', [unite]);
    }
    return 0;
  }
  /**
   * Convertit des millimètres en points (string)
   * 
   * @param mm Nombre de millimètres
   * @returns la valeur arrondie de points correspondte au nombre de millimètres.
   */
  public static mm2pt(mm: number): string {
    return (mm * 72 / 25.4).toFixed(2);
  }

  /**
   * Convertit des pixels en points (string)
   * 
   */
  public static px2pt(px: number): string {
    return (px * 0.75).toFixed(2); // à 96 ppi
  }

  /**
   * Convertit des pouces en points (string)
   */
  public static po2pt(po: number): string {
    return (po * 72).toFixed(2);
  }

}