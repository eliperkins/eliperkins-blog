import Typography from 'typography';
import CodePlugin from 'typography-plugin-code';
import Theme from 'typography-theme-fairy-gates';
import { MOBILE_MEDIA_QUERY } from 'typography-breakpoint-constants';

Theme.plugins = [new CodePlugin()];

const linkColor = '#d17821';

Theme.overrideThemeStyles = (
  { adjustFontSizeTo, scale, rhythm },
  options
) => ({
  blockquote: {
    ...scale(1 / 5),
    borderLeft: `${rhythm(6 / 16)} solid ${linkColor}`,
    color: 'hsla(0,0%,60%,1.0)',
    fontStyle: 'italic',
    paddingLeft: rhythm(10 / 16),
    marginLeft: rhythm(-1),
    borderLeft: `${rhythm(
      3 / 16
    )} solid ${'hsla(0,0%,100%,0.1)'}`
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
    color: linkColor,
    textDecoration: 'none',
    textShadow:
      '.03em 0 #fff,-.03em 0 #fff,0 .03em #fff,0 -.03em #fff,.06em 0 #fff,-.06em 0 #fff,.09em 0 #fff,-.09em 0 #fff,.12em 0 #fff,-.12em 0 #fff,.15em 0 #fff,-.15em 0 #fff', // eslint-disable-line
    backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 1px, ${linkColor} 1px, ${linkColor} 2px, rgba(0, 0, 0, 0) 2px)` // eslint-disable-line
  },
  'a:hover,a:active': {
    boxShadow: 'none',
    textDecoration: 'none'
  },
  'a.anchor': {
    boxShadow: 'none',
    backgroundImage: 'none'
  },
  'a.anchor svg[aria-hidden="true"]': {
    stroke: linkColor
  },
  'mark,ins': {
    background: '#007acc',
    color: 'white',
    padding: `${rhythm(1 / 16)} ${rhythm(1 / 8)}`,
    textDecoration: 'none'
  },
  'p code': {
    fontSize: '1rem'
  },
  // TODO: why tho
  'h1 code, h2 code, h3 code, h4 code, h5 code, h6 code': {
    fontSize: 'inherit'
  },
  'li code': {
    fontSize: '1rem'
  },
  [MOBILE_MEDIA_QUERY]: {
    blockquote: {
      borderLeft: `${rhythm(3 / 16)} solid ${linkColor}`,
      color: 'hsla(0,0%,60%,1.0)',
      paddingLeft: rhythm(9 / 16),
      fontStyle: 'italic',
      marginLeft: rhythm(-3 / 4),
      marginRight: 0
    }
  }
});

const typography = new Typography(Theme);

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles();
}

export default typography;
