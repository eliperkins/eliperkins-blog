module.exports = {
  siteMetadata: {
    title: 'Blog — Eli Perkins',
    author: 'Eli Perkins',
    description: 'A bunch of ramblings from Eli Perkins.',
    siteUrl: 'https://blog.eliperkins.me/',
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-47801301-1',
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: "Blog – Eli Perkins",
        short_name: "Blog – Eli Perkins",
        start_url: "/",
        background_color: "#d17821",
        theme_color: "#a2466c",
        display: "browser",
      },
    },
    `gatsby-plugin-feed`,
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
  ],
}
