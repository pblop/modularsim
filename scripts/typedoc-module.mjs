// @ts-check
import { MarkdownPageEvent } from 'typedoc-plugin-markdown';

function escapeLatex(str) {
  return str;
  // return str.replaceAll(/(?<!\\)_/g, '\\_');
}
function unescapeLatex(str) {
  // Unescape _
  return str.replaceAll(/\\_/g, '_')
    .replaceAll(/\\</g, "\\protect\\textless ")
    .replaceAll(/\\>/g, "\\protect\\textgreater ");
}

function fileLabel(url) {
 return "file:"+ unescapeLatex(url.replaceAll("/", ".").replace(".md", ""));
}
function sectionLabel(url, section) {
  return fileLabel(url) + ":" + unescapeLatex(section.replaceAll(/[\()\s]/g, "").toLowerCase());
}

/**
 * @param {import('typedoc-plugin-markdown').MarkdownApplication} app
 */
export function load(app) {
  app.renderer.markdownHooks.on("page.begin", 
    (c) => {
      const url = c.page.url;
      const label = fileLabel(url);
      // console.log(c.page.url)
      return `\\label{${label}}`;
    }
  );
  app.renderer.on(MarkdownPageEvent.END, 
    (c) => {
      const replacedTitles = c.contents.replaceAll(
        /# (.*)/g,
        (str) => {
          const match = str.match(/# (.*)/);
          if (!match)
            throw new Error(`Failed to match title: ${str}`);
          const label = sectionLabel(c.url, match[1]);
          return `${str}\n\\label{${label}}`;
        }
      );
      c.contents = replacedTitles;
      const replacedLinks = c.contents.replaceAll(
        /\[(.*?)\]\((.*?)\)/g,
        (str) => {
          const match = str.match(/\[(.*?)\]\((.*?)\)/);
          if (!match)
            throw new Error(`Failed to match link: ${str}`);
          const name = match[1];
          const url = match[2];
          const split = url.split("#");
          if (split.length === 1) {
            // This is a link to a file
            return `\\hyperref[${fileLabel(split[0])}]{${name}}`;
          } else {
            const section = sectionLabel(split[0], split[1]);
            return `\\hyperref[${section}]{${name}}`;
          }
        }
      );
      c.contents = replacedLinks;
    }
  );
}
