module.exports = {
  siteMetadata: {
    title: 'Blog — Eli Perkins',
    author: 'Eli Perkins',
    description: 'A bunch of ramblings from Eli Perkins.',
    siteUrl: 'https://blog.eliperkins.me/'
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages'
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590
            }
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`
            }
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
          'gatsby-remark-autolink-headers'
        ]
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-47801301-1'
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Blog – Eli Perkins',
        short_name: 'Blog – Eli Perkins',
        start_url: '/',
        background_color: '#d17821',
        theme_color: '#a2466c',
        display: 'browser'
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        // this base query will be merged with any queries in each feed
        query: `
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
              site_url: siteUrl
            }
          }
        }
      `,
        feeds: [
          {
            serialize: ({
              query: { site, allMarkdownRemark }
            }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign(
                  {},
                  edge.node.frontmatter,
                  {
                    description: edge.node.excerpt,
                    date: edge.node.frontmatter.date,
                    url:
                      site.siteMetadata.siteUrl +
                      edge.node.fields.slug,
                    guid:
                      site.siteMetadata.siteUrl +
                      edge.node.fields.slug,
                    custom_elements: [
                      { 'content:encoded': edge.node.html }
                    ]
                  }
                );
              });
            },
            query: `
            {
              allMarkdownRemark(
                limit: 1000,
                sort: { order: DESC, fields: [frontmatter___date] },
                filter: {frontmatter: { draft: { ne: true } }}
              ) {
                edges {
                  node {
                    excerpt
                    html
                    fields { slug }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            }
          `,
            output: '/rss.xml',
            title: 'Eli Perkins’ Blog'
          }
        ]
      }
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography'
      }
    }
  ]
};
