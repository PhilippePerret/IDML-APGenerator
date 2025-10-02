export function firstLetterOf(
  str: string,
  maj: boolean = true
): string {
  let l = str.substring(0,1);
  if (maj) { l = l.toLocaleUpperCase(); }
  return l;
}