import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Quartz 4",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "quartz.jzhao.xyz",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
     colors: {
      lightMode: {
        light: "#FFFCF9",       // A very subtle 'Warm Paper' off-white (matches Literata)
        lightgray: "#E8E4E1",   // Borders (Warm grey)
        gray: "#9E9E9E",        // Metadata text
        darkgray: "#2C2C2C",    // Body text (Almost black, softer for reading)
        dark: "#1A1A1A",        // Headers (Pure dark)
        
        // THE PANDA COLORS
        secondary: "#C0392B",   // Links & Current Page (Deep Rust/Red)
        tertiary: "#E67E22",    // Hover states & Graph Nodes (Vibrant Orange)
        
        // Highlights
        highlight: "rgba(192, 57, 43, 0.08)", // Very faint red wash for backlinks
        textHighlight: "#ffecb388",           // Soft Amber highlighter
      },
      darkMode: {
        light: "#121212",       // 'OLED Black' (Deep coding environment)
        lightgray: "#2A2A2A",   // Borders
        gray: "#888888",        // Metadata
        darkgray: "#D4D4D4",    // Body text (Soft white)
        dark: "#FFFFFF",        // Headers (Pure white)
        
        // THE PANDA COLORS (Neon/Terminal Versions)
        secondary: "#FF9F43",   // Links (Glowing Amber)
        tertiary: "#D35400",    // Hover/Graph (Burnt Orange)
        
        // Highlights
        highlight: "rgba(255, 159, 67, 0.15)", // Faint amber wash
        textHighlight: "#b36b0088",            // Dark Amber highlighter
      },
    },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
