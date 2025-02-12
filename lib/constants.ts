export const SIDEBAR_COOKIE_NAME = "sidebar:state";
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = "12rem";
export const SIDEBAR_WIDTH_MOBILE = "12rem";
export const SIDEBAR_WIDTH_ICON = "3rem";
export const SIDEBAR_KEYBOARD_SHORTCUT = "b";
export const BASE_URL = "http://localhost:3000";
export const ALLOWED_HTML_TAGS = [
  "p",
  "br",
  "b",
  "i",
  "em",
  "strong",
  "a",
  "img",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "pre",
  "code",
  "div",
  "span",
  "table",
  "thead",
  "tbody",
  "tr",
  "td",
  "th",
];

export const ALLOWED_HTML_ATTRIBUTES = {
  a: ["href", "target", "rel"],
  img: ["src", "alt", "width", "height"],
  "*": ["style", "class"],
};

export const ALLOWED_HTML_STYLES = {
  "*": {
    color: [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
    "background-color": [
      /^#(0x)?[0-9a-f]+$/i,
      /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
    ],
    "text-align": [/^left$/, /^right$/, /^center$/],
    "font-size": [/^\d+(?:px|em|%)$/],
  },
};

export const EMAIL_HTML_TEMPLATE = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          margin: 0;
          padding: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.5;
          color: var(--foreground);
          background: var(--background);
        }
        img { max-width: 100%; height: auto; }
        pre, code { 
          background: var(--secondary);
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-size: 0.9em;
        }
        pre code {
          background: none;
          padding: 0;
        }
        blockquote {
          margin: 0;
          padding-left: 1em;
          border-left: 3px solid var(--border);
          color: var(--muted-foreground);
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 8px;
          border: 1px solid var(--border);
        }
        a { color: var(--primary); }
      </style>
    </head>
    <body>
      {{content}}
    </body>
  </html>`;
