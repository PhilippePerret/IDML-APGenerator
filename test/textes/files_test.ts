import { describe, test, expect } from "bun:test";
import fs from "fs";
import path from "path";
import { Builder } from "../../lib/Builder";
import type { BookDataType, RecType, StoryType } from "../../lib/types/types";
import type { RecordWithTtl } from "dns";
import { doesNotMatch } from "assert";


describe("Les/Le fichier/s texte peut", () => {

  test("être défini dans ./texte.<ext>", async () => {
    const pathBook = 'books/book_with_texte';
    let bdata = await Builder.buildBook(pathBook, {only_return_data: true});
    bdata = bdata as BookDataType;
    const texte = bdata.stories[0] as StoryType;
    expect(texte.name).toBe('texte.text');
    expect(texte.extension).toBe('text');
    expect(texte.format).toBe('text');
  })

  test("être défini dans ./text.<ext>", async () => {
    const pathBook = 'books/book_with_text';
    let bdata = await Builder.buildBook(pathBook, {only_return_data: true});
    bdata = bdata as BookDataType;
    const texte = bdata.stories[0] as StoryType;
    expect(texte.name).toBe('text.md');
    expect(texte.extension).toBe('md');
    expect(texte.format).toBe('markdown');
  })

  test('être défini dans ./content.<ext>', async () => {
    const pathBook = 'books/book_with_content';
    let bdata = await Builder.buildBook(pathBook, {only_return_data: true});
    bdata = bdata as BookDataType;
    const texte = bdata.stories[0] as StoryType;
    expect(texte.name).toBe('Content.txt');
    expect(texte.extension).toBe('txt');
    expect(texte.format).toBe('text');
  });

  async function expectDosContains(dossier: string, files: [string, string, string, string][]){
    const fulldossier = path.resolve(dossier);
    let bdata = await Builder.buildBook(dossier, { only_return_data: true });
    bdata = bdata as BookDataType;
    expect(bdata.stories.length).toBe(files.length);
    // On fait une table avec les stories
    const tbStories = {}
    bdata.stories.forEach((story: StoryType) => {
      const dstory = path.parse(story.path);
      Object.assign(tbStories, {[dstory.base]: story})
    })
    files.forEach(file => {
      const [subfolder, base, ext, format] = file;
      const story = (tbStories as any)[base];
      if (!story) {
        console.error("Impossible de trouver la story %s dans", base, tbStories);
      }
      // console.log("STORY = ", story);
      expect(story).toBeDefined();
      expect(story.path).toBe(path.join(fulldossier, subfolder, base));
      expect(story.extension).toBe(ext);
      expect(story.format).toBe(format);
    });
  }


  test('être défini dans le dossier stories', async () => {
    const pathBook = 'books/book_with_text_in_stories';
    await expectDosContains(pathBook, [
      ['stories', 'montexte.txt', 'txt', 'text']]
    );
  })

  test('être défini dans le dossier textes', async () => {
    const pathBook = 'books/book_with_text_in_textes';
    await expectDosContains(pathBook, [
      ['textes', 'texte1.txt', 'txt', 'text'],
      ['textes', 'texte2.mmd', 'mmd', 'markdown']
    ])
  })

  test('être défini dans le dossier texts', async () => {
    const pathBook = 'books/book_with_text_in_texts';
    await expectDosContains(pathBook, [
      ['texts', 'text.html', 'html', 'html'],
      ['texts', 'textestrict.xml', 'xml', 'xml'],
      ['texts', 'bonduel.rtf', 'rtf', 'rtf']
    ])
  })

  async function expectStory(story: StoryType, expected: string[]){
    const [name, ext, format, path] = expected as any
    expect(story.name).toBe(name);
    expect(story.extension).toBe(ext);
    expect(story.path).toBe(path);
    expect(story.format).toBe(format);
  }

  test("peut être défini dans la donnée :textes", async () => {
    let spath;
    const bpath = 'books/book_texte_by_textes';
    let bdata = await Builder.buildBook(bpath, {only_return_data: true});
    bdata = bdata as BookDataType;
    expect(bdata.stories.length).toBe(2);
    spath = path.join(path.resolve(bpath), 'story.txt');
    expectStory(bdata.stories[0] as any, ['story.txt', 'txt', 'text', spath]);
    spath = path.join(path.resolve(bpath), 'tx', 'monfichier.rtf');
    expectStory(bdata.stories[1] as any, ['monfichier.rtf', 'rtf', 'rtf', spath]);

  })
  
  test("peut être défini dans la donnée :texts", async () => {
    let spath;
    const bpath = 'books/book_texte_by_texts';
    let bdata = await Builder.buildBook(bpath, {only_return_data: true});
    bdata = bdata as BookDataType;
    expect(bdata.stories.length).toBe(2);
    spath = path.join(path.resolve(bpath), 'tstory.txt');
    expectStory(bdata.stories[0] as any, ['tstory.txt', 'txt', 'text', spath]);
    spath = path.join(path.resolve(bpath), 'txt', 'monfichier.rtf');
    expectStory(bdata.stories[1] as any, ['monfichier.rtf', 'rtf', 'rtf', spath]);
  })
 
  test("peut être défini dans la donnée :story", async () => {
    const bpath = 'books/book_texte_by_story';
    let bdata = await Builder.buildBook(bpath, {only_return_data: true});
    bdata = bdata as BookDataType;
    const story = (bdata.stories as any)[0];
    const spath = path.join(path.resolve(bpath), 'story.txt');
    expectStory(story, ['story.txt', 'txt', 'text', spath])
  });

  test("peut être défini dans la donnée :texte", async () => {
    const bpath = 'books/book_texte_by_texte';
    let bdata = await Builder.buildBook(bpath, {only_return_data: true});
    bdata = bdata as BookDataType;
    const story = (bdata.stories as any)[0];
    const spath = path.join(path.resolve(bpath), 'story.txt');
    expectStory(story, ['story.txt', 'txt', 'text', spath])
  })

  test("peut être défini dans la donnée :text", async () => {
    const bpath = 'books/book_texte_by_text';
    let bdata = await Builder.buildBook(bpath, {only_return_data: true});
    bdata = bdata as BookDataType;
    const story = (bdata.stories as any)[0];
    const spath = path.join(path.resolve(bpath), 'story.txt');
    expectStory(story, ['story.txt', 'txt', 'text', spath]);
  })

});