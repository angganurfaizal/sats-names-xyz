import classNames from "classnames";
import { graphql, Link, useStaticQuery } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";
import IconCheck from "../components/icons/outline/check";
import IconHome from "../components/icons/outline/home";
import IconList, { type IconProps } from "../components/icons/outline/list";
import IconSearch from "../components/icons/outline/search";
import IconVIP from "../components/icons/outline/vip";
import IconWand from "../components/icons/outline/wand";
import IconCheckSolid from "../components/icons/solid/check";
import IconHomeSolid from "../components/icons/solid/home";
import IconListSolid from "../components/icons/solid/list";
import IconSearchSolid from "../components/icons/solid/search";
import IconVIPSolid from "../components/icons/solid/vip";
import IconWandSolid from "../components/icons/solid/wand";
import ResponsiveSizes from "../components/responsive-sizes";

export interface LayoutProps {
  children?: React.ReactNode;
}

export type LayoutData = {
  logo: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData;
    };
  };
};

const navData: {
  id: string;
  title: string;
  target: string;
  icon: React.FC<IconProps>;
  iconActive: React.FC<IconProps>;
}[] = [
  {
    id: "719179F0-E9F5-49D0-891F-2FF1BA761F7B",
    title: "Home",
    target: "/",
    icon: IconHome,
    iconActive: IconHomeSolid,
  },
  {
    id: "5A8D11E1-0530-4E95-A26E-7502BEC122AB",
    title: "About",
    target: "/about/",
    icon: IconWand,
    iconActive: IconWandSolid,
  },
  {
    id: "7E9E6873-E010-4C39-92AE-71D8FBC55C28",
    title: "List",
    target: "/list/",
    icon: IconList,
    iconActive: IconListSolid,
  },
  {
    id: "0409E175-53FF-4C59-850E-4575773DFFC7",
    title: "Search",
    target: "/search",
    icon: IconSearch,
    iconActive: IconSearchSolid,
  },
  {
    id: "03D13AF7-EA10-49EE-8ECD-480AB16FBE3C",
    title: "First?",
    target: "/am-i-first/",
    icon: IconCheck,
    iconActive: IconCheckSolid,
  },
  {
    id: "E70220B7-26A1-4F04-89DC-933AAF682B13",
    title: "Clubs",
    target: "/clubs/",
    icon: IconVIP,
    iconActive: IconVIPSolid,
  },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const {
    logo: {
      childImageSharp: { gatsbyImageData: logo },
    },
  }: LayoutData = useStaticQuery(query);

  return (
    <div className="bg-gray-100">
      <div className="container-7xl">
        <div className="flex w-full min-h-screen">
          <div className="flex flex-col flex-grow h-full min-h-screen container-7xl lg:flex-row">
            <header className="flex flex-row justify-between flex-shrink-0 w-full pt-4 space-x-3 lg:w-16 lg:flex-col lg:justify-start lg:space-x-0 lg:space-y-4 lg:border-b lg:py-6">
              <Link to="/" className="shrink-0">
                <h1 className="w-12 h-12 lg:w-16 lg:h-16 bg-primary-500 rounded-xl">
                  <GatsbyImage
                    image={logo}
                    alt="Sats Names"
                    className="w-12 h-12 border rounded-xl aspect-square lg:h-16 lg:w-16"
                  />
                </h1>
              </Link>
              <nav className="flex flex-row items-center justify-center lg:flex-col lg:space-y-2 lg:space-x-0">
                {navData.map((navItem, index) => (
                  <Link
                    key={navItem.id}
                    to={navItem.target}
                    activeClassName="bg-white bg-opacity-50 isActive"
                    className={classNames([
                      "group",
                      "flex flex-row items-center justify-center space-x-1  p-2 text-sm",
                      "lg:h-16 lg:w-16 lg:flex-col lg:space-y-1 lg:space-x-0 lg:p-6 rounded-xl",
                      "transition-colors duration-300",
                    ])}
                  >
                    <div>
                      <navItem.iconActive className="hidden w-5 h-5 lg:h-7 lg:w-7 text-primary-500 group-[.isActive]:block" />
                      <navItem.icon className="block w-5 h-5 text-gray-700 lg:h-7 lg:w-7 group-[.isActive]:hidden" />
                    </div>
                    <div className="hidden text-xs sm:block lg:text-xs text-slate-500 group-[.isActive]:text-primary-500">
                      {navItem.title}
                    </div>
                  </Link>
                ))}
              </nav>
            </header>
            <main className="relative flex flex-col flex-grow w-full min-h-full py-4 lg:ml-6 lg:flex-grow-0 lg:py-6">
              {children}
            </main>
          </div>
          <ResponsiveSizes />
        </div>
      </div>
    </div>
  );
};

const query = graphql`
  query LayoutQuery {
    logo: file(relativePath: { eq: "logo.png" }) {
      childImageSharp {
        gatsbyImageData(placeholder: BLURRED)
      }
    }
  }
`;

export default Layout;
