import * as React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

import Bio from '../components/Bio';
import Layout from '../components/layout';
import Typography from '../utils/typography';

const { rhythm } = Typography;

const BlogIndex = props => {
  const { site, allMarkdownRemark } = props;
  const siteTitle = site.siteMetadata.title;
  const posts = allMarkdownRemark.edges;

  return (
    <Layout>
      <div>
        <Helmet title={siteTitle} />
        <Bio />
        {posts.map(({ node }) => {
          const title =
            node.frontmatter.title || node.fields.slug;
          return (
            <div key={node.fields.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4)
                }}
              >
                <Link
                  style={{ boxShadow: 'none' }}
                  to={node.fields.slug}
                >
                  {title}
                </Link>
              </h3>
              <small>{node.frontmatter.date}</small>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.excerpt
                }}
              />
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default () => (
  <StaticQuery
    query={graphql`
      query IndexQuery {
        site {
          siteMetadata {
            title
          }
        }
        allMarkdownRemark(
          sort: {
            fields: [frontmatter___date]
            order: DESC
          }
        ) {
          edges {
            node {
              excerpt
              fields {
                slug
              }
              frontmatter {
                date(formatString: "DD MMMM, YYYY")
                title
              }
            }
          }
        }
      }
    `}
    render={BlogIndex}
  />
);
