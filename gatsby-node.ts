import { CreatePagesArgs } from "gatsby";
import path from "path";

export interface ClubPagesData {
  allClubs: {
    edges: {
      node: {
        id: string;
        name: string;
        label: string;
        endpoint: string;
        count: number;
      };
    }[];
  };
}

exports.createPages = async ({
  graphql,
  actions,
  reporter,
}: CreatePagesArgs) => {
  const { createPage } = actions;

  const result = await graphql(`
    query clubPagesQuery {
      allClubs {
        edges {
          node {
            id
            name
            label
            count
            endpoint
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(`Error while building.`);
    return;
  }

  const clubPageTemplate = path.resolve("./src/templates/club.tsx");
  const data = result.data as ClubPagesData;

  data.allClubs.edges.forEach(({ node }) => {
    createPage({
      path: `clubs/${node.name}`,
      component: clubPageTemplate,
      context: {
        pagePath: `clubs/${node.name}`,
        label: node.label,
        name: node.name,
        count: node.count,
        endpoint: node.endpoint,
      },
    });
  });
};
