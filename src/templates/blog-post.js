import * as React from 'react';

import Bio from '../components/Bio';
import Layout from '../components/layout';
import SEO from '../components/SEO';
import Typography from '../utils/typography';
import { graphql } from 'gatsby';

const { rhythm, scale } = Typography;

const BlogPost = ({ data }) => {
  const { markdownRemark } = data;
  const { frontmatter, fields, html } = markdownRemark;
  return (
    <Layout>
      <div>
        <SEO title={frontmatter.title} slug={fields.slug} />
        <p
          style={{
            ...scale(-1 / 2),
            color: 'hsla(0,0%,60%,1.0)',
            marginBottom: rhythm(-2)
          }}
        >
          {frontmatter.date}
        </p>
        <h1>{frontmatter.title}</h1>
        <div
          dangerouslySetInnerHTML={{
            __html: html
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
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`;

export default BlogPost;
