declare global {
  interface Array<T> {
    prettyJoin(this: string[]): string;
  }
}
Array.prototype.prettyJoin = function(this: string[]){
  const list = structuredClone(this);
  const last = list.pop();
  const rest = list.join(', ');
  return rest + ' et ' + last;
}

export {}