import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Motorola 6809 Simulator",
  tagline: "A simulator for the Motorola 6809 microprocessor",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://your-docusaurus-site.example.com",
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "pblop",
  projectName: "tfg",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "es",
    locales: ["en", "es"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/pblop/tfg/tree/main/docs/",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/pblop/tfg/tree/main/docs/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    [
      // Plugin for generating API documentation from TypeScript source code
      "docusaurus-plugin-typedoc",
      {
        entryPoints: ["../src/main.ts"],
        tsconfig: "../tsconfig.json",
      },
    ],
  ],
  themeConfig: {
    // Replace with your project's social card
    image: "./img/MC6809EP.jpg",
    navbar: {
      title: "Motorola 6809 Simulator",
      logo: {
        alt: "My Site Logo",
        src: "./img/MC6809EP.jpg",
      },
      items: [
        {
          type: "doc",
          docId: "introduction",
          position: "left",
          label: "Docs",
        },
        {
          type: "docSidebar",
          sidebarId: "api",
          position: "left",
          label: "API",
        },
        { to: "blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/pblop/tfg",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Docs",
              to: "/docs/introduction",
            },
            {
              label: "API",
              to: "/docs/api",
            },
          ],
        },
        {
          title: "Community",
          items: [],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/pblop/tfg",
            },
            {
              label: "Simulator",
              href: "https://m6809.milu.0000234.xyz/",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} @pblop. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
