import { graphql, Link, PageProps } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";

type DataType = {
  allClubs: {
    edges: {
      node: {
        id: string;
        name: string;
        label: string;
        description: string;
        image: {
          local: {
            childImageSharp: {
              gatsbyImageData: IGatsbyImageData;
            };
          };
        };
        count: number;
      };
    }[];
  };
};

const Clubs = ({ data }: PageProps<DataType>) => {
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 sm:gap-6">
        <div className="flex items-center justify-center h-12 col-span-4 lg:h-16">
          <h2 className="text-2xl font-bold text-center">.sats Clubs</h2>
        </div>
        {data.allClubs.edges.map(({ node: club }) => (
          <Link
            to={`/clubs/${club.name}`}
            key={club.id}
            className="col-span-2 p-6 text-center border text-red sm:col-span-1 bg-primary-500 rounded-xl"
          >
            <GatsbyImage
              image={club.image.local.childImageSharp.gatsbyImageData}
              alt={club.label}
              className="aspect-square"
            />
            <h3 className="sr-only">{club.label}</h3>
            <p className="text-sm text-white/75">{club.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Clubs;

export const query = graphql`
  query clubPageTemplateQuery {
    allClubs {
      edges {
        node {
          id
          name
          label
          description
          image {
            local {
              childImageSharp {
                gatsbyImageData(width: 256, placeholder: BLURRED)
              }
            }
          }
          count
        }
      }
    }
  }
`;
