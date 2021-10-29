export default `
  *, *::after, *::before {
    box-sizing: inherit;
    border: 0;
    margin: 0;
    outline: 0;
    padding: 0;
    font: inherit;
    font-size: 100%;
    text-size-adjust: 100%;
    vertical-align: baseline;
  }
  article, aside, details, figcaption, figure, time,
  footer, header, hgroup, menu, nav, section, main {
    display: block;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote::before, blockquote::after,
  q::before, q::after {
    content: none;
  }
  table, caption, tbody, tfoot, thead, tr, th, td {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  html, body {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizelegibility;
    font-feature-settings: 'liga', 'kern';
    -webkit-print-color-adjust: exact !important;
    background: none;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
  html {
    box-sizing: border-box;
  }
  body {
    line-height: 1;
    letter-spacing: 0;
  }
  h1, h2, h3, h4, h5, h6, p, li {
    letter-spacing: inherit;
    line-height: inherit;
    color: inherit;
  }
  sup, sub {
    position: static !important;
    margin: 0;
    padding: 0;
    font: inherit !important;
    color: inherit;
    line-height: inherit !important;
    letter-spacing: inherit;
    text-transform: none;
    top: auto !important;
    left: auto;
    right: auto;
    bottom: auto;
    vertical-align: unset !important;
    font-size: 50% !important;
  }
  sup {
    vertical-align: super !important;
  }
  sub {
    vertical-align: sub !important;
  }
  a {
    text-decoration: none;
  }
  ul, ol, li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  label {
    cursor: default;
  }
  input,
  select,
  button,
  textarea {
    appearance: none;
    background: none;
    box-shadow: none;
    border-radius: 0;
    border: 0;
    outline: 0;
    padding: 0;
    margin: 0;
  }
  html {
    font-size: 62.5%;
  }
  body {
    font-size: 1.6rem;
  }
`
