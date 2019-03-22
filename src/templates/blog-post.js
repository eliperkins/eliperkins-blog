import * as React from 'react';
import Helmet from 'react-helmet';

import Bio from '../components/Bio';
import Layout from '../components/layout';
import Typography from '../utils/typography';
import { graphql } from 'gatsby';

const { rhythm, scale } = Typography;

const BlogPost = ({ data }) => {
  const { markdownRemark, site } = data;
  if (!markdownRemark) {
    console.log({ data, markdownRemark });
    return null;
  }
  return (
    <Layout>
      <div>
        <Helmet
          title={`${markdownRemark.frontmatter.title} | ${
            site.siteMetadata.title
          }`}
        />
        <p
          style={{
            ...scale(-1 / 2),
            color: 'hsla(0,0%,60%,1.0)',
            marginBottom: rhythm(-2)
          }}
        >
          {markdownRemark.frontmatter.date}
        </p>
        <h1>{markdownRemark.frontmatter.title}</h1>
        <div
          dangerouslySetInnerHTML={{
            __html: markdownRemark.html
          }}
        />
        <hr
          style={{
            marginBottom: rhythm(1)
          }}
        />
        <Bio />
      </div>
    </Layout>
  );
};

export const pageQuery = graphql`
  query($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`;

export default BlogPost;
