const _ = require('lodash');
const Promise = require('bluebird');
const path = require('path');
const {
  createFilePath
} = require('gatsby-source-filesystem');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `).then(result => {
      result.data.allMarkdownRemark.edges.forEach(
        ({ node }) => {
          createPage({
            path: node.fields.slug,
            component: path.resolve(
              `./src/templates/blog-post.js`
            ),
            context: {
              slug: node.fields.slug
            }
          });
        }
      );
      resolve();
    });
  });
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({
      node,
      getNode,
      basePath: `pages`
    });
    createNodeField({
      node,
      name: `slug`,
      value: slug
    });
  }
};

exports.onCreateWebpackConfig = ({ getConfig, stage }) => {
  const config = getConfig();
  if (stage.startsWith('develop') && config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom': '@hot-loader/react-dom'
    };
  }
};
