import Typography from 'typography';
import CodePlugin from 'typography-plugin-code';
import Theme from 'typography-theme-fairy-gates';

Theme.plugins = [new CodePlugin()];

Theme.overrideThemeStyles = ({ adjustFontSizeTo, scale, rhythm }, options) => ({
  blockquote: {
    ...scale(1 / 5),
    color: 'hsla(0,0%,60%,1.0)',
    fontStyle: 'italic',
    paddingLeft: rhythm(13 / 16),
    marginLeft: rhythm(-1),
    borderLeft: `${rhythm(3 / 16)} solid ${'hsla(0,0%,100%,0.1)'}`
  },
  'blockquote > :last-child': {
    marginBottom: 0
  },
  'blockquote cite': {
    ...adjustFontSizeTo(options.baseFontSize),
    color: options.bodyColor,
    fontWeight: options.bodyWeight
  },
  'blockquote cite:before': {
    content: '"— "'
  },
  ul: {
    listStyle: 'disc'
  },
  'ul,ol': {
    marginLeft: 0
  },
  'h1,h2,h3,h4,h5,h6': {
    marginTop: rhythm(2)
  },
  h4: {
    textTransform: 'uppercase'
  },
  h6: {
    fontStyle: 'italic'
  },
  a: {
    textDecoration: 'none'
  },
  'a:hover,a:active': {
    boxShadow: 'none',
    textDecoration: 'none'

  },
  'mark,ins': {
    background: '#007acc',
    color: 'white',
    padding: `${rhythm(1 / 16)} ${rhythm(1 / 8)}`,
    textDecoration: 'none'
  }
});

const typography = new Typography(Theme);

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles();
}

export default typography;
