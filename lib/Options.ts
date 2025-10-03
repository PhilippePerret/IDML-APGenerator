import fs from "fs";
import path from "path";

type RecType = {[x: string]: any};

/**
 * Gestionnaire des options, soit en ligne de commande soit dans le
 * fichier de configuration.
 * 
 */
export class Options {
  private static config: RecType = {loaded: false};

  public static getOption(opt: string){
    this.config.loaded || this.init()
    // console.log("this.config = ", this.config);
    return this.config[opt];
  }
  
  private static init(){
    this.getConfig();
    // Analyser la ligne de commande
    // Todo
    Object.assign(this.config, {loaded: true});
  }
  private static getConfig(){
    Object.assign(this.config, JSON.parse(fs.readFileSync(this.configPath, 'utf-8')));
  }
  private static get configPath(){
    return path.join('.', 'config.json')
  }
}