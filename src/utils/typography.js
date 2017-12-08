import Typography from 'typography';
import CodePlugin from 'typography-plugin-code';

const typography = new Typography({
  baseFontSize: '18px',
  baseLineHeight: 1.45,
  googleFonts: [
    {
      name: 'Montserrat',
      styles: ['400', '700']
    },
    {
      name: 'Open Sans',
      styles: ['400', '700']
    }
  ],
  headerFontFamily: [
    'Montserrat',
    'Helvetica Neue',
    'Segoe UI',
    'Helvetica',
    'Arial',
    'sans-serif'
  ],
  bodyFontFamily: ['Open Sans', 'sans-serif'],
  bodyColor: 'hsla(0,0%,0%,0.9)',
  headerWeight: 700,
  bodyWeight: 400,
  boldWeight: 700,
  plugins: [new CodePlugin()],
  overrideStyles: ({ adjustFontSizeTo, scale, rhythm }, options) => ({
    h1: {
      fontFamily: ['Montserrat', 'sans-serif'].join(',')
    },
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
      letterSpacing: '0.140625em',
      textTransform: 'uppercase'
    },
    h6: {
      fontStyle: 'italic'
    },
    a: {
      boxShadow: '0 1px 0 0 currentColor',
      color: '#007acc',
      textDecoration: 'none'
    },
    'a:hover,a:active': {
      boxShadow: 'none'
    },
    'mark,ins': {
      background: '#007acc',
      color: 'white',
      padding: `${rhythm(1 / 16)} ${rhythm(1 / 8)}`,
      textDecoration: 'none'
    }
  })
});

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles();
}

export default typography;
