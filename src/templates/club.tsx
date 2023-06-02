import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { graphql, Link, PageProps } from "gatsby";
import React, { Fragment } from "react";
import ReactPaginate from "react-paginate";
import { useMediaQuery } from "usehooks-ts";
import IconCaretDown from "../components/icons/outline/caret-down";
import IconCaretLeft from "../components/icons/outline/caret-left";
import { fetchClubInscriptions } from "../loaders/sats-names";

type DataType = {
  allClubs: {
    edges: {
      node: {
        id: string;
        name: string;
        label: string;
        count: number;
      };
    }[];
  };
};

type PageContextType = {
  name: string;
  label: string;
  count: number;
  endpoint: string;
};

type SatsName = {
  inscriptionId: string;
  inscriptionIndex: number;
  name: string;
};

const postsPerPage = 100;

const Club = ({ data, pageContext }: PageProps<DataType, PageContextType>) => {
  const isTabletOrHigher = useMediaQuery("(min-width: 768px)");

  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [pageData, setPageData] = React.useState<SatsName[]>();
  const [pageCount, setPageCount] = React.useState<number>(1);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async (start: number, limit: number) => {
      const result = await fetchClubInscriptions(
        pageContext.endpoint,
        start,
        limit
      );

      if (result) {
        const data: SatsName[] = await result.json();
        setPageData(data);

        if (pageContext.count > data.length) {
          setPageCount(Math.ceil(pageContext.count / data.length));
        } else {
          setPageCount(1);
        }
      }
    };

    fetchData(currentPage * postsPerPage, postsPerPage);
  }, []);

  const handlePageClick = async ({ selected }: { selected: number }) => {
    console.log("page click", selected);

    setLoading(true);

    setCurrentPage(selected);

    const result = await fetchClubInscriptions(
      pageContext.endpoint,
      selected * postsPerPage,
      postsPerPage
    );

    if (result) {
      const data: SatsName[] = await result.json();
      setPageData(data);
    }

    setLoading(false);
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between h-12 col-span-4 p-4 mb-6 text-center lg:h-16">
        <Link
          className="flex items-center space-x-1 text-slate-700"
          to="/clubs"
        >
          <IconCaretLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex items-center justify-center w-full px-4 py-2 space-x-2 text-sm font-medium text-white rounded-md bg-primary-500 hover:bg-opacity-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              <span className="text-lg font-bold">{pageContext.label}</span>
              <IconCaretDown className="w-5 h-5" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute w-56 mt-2 origin-top-right -translate-x-1/2 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-slate-900 ring-opacity-5 focus:outline-none left-1/2">
              <div className="px-1 py-1 ">
                {data.allClubs.edges.map(({ node: club }) => (
                  <Menu.Item key={club.id}>
                    {({ active }) => (
                      <Link
                        to={`/clubs/${club.name}`}
                        className={classNames([
                          "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                          {
                            "text-gray-900": !active,
                            "bg-primary-100": pageContext.name === club.name,
                            "!bg-primary-500 !text-white": active,
                          },
                        ])}
                      >
                        {club.label}
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        <div className="flex invisible space-x-1">
          <IconCaretDown className="w-4 h-4" />
          <span>Back</span>
        </div>
      </div>
      <div
        className={classNames("grid grid-cols-4 gap-4 sm:gap-6", {
          "animate-pulse": loading,
        })}
      >
        {pageData &&
          pageData.map((name) => (
            <Link
              key={name.inscriptionIndex}
              to={`/search?query=${name.name}`}
              className="col-span-2 overflow-hidden bg-white border rounded-xl border-primary-100 sm:col-span-1"
            >
              <div className="flex items-center justify-center aspect-square bg-primary-500">
                <h3 className="text-xl font-bold text-white">{name.name}</h3>
              </div>
              <div className="p-4">
                <p className="space-x-2 text-slate-700">
                  <span className="hidden text-xs font-bold text-gray-500 uppercase md:inline">
                    Inscription
                  </span>
                  <span className="text-sm font-bold">
                    #{name.inscriptionIndex}
                  </span>
                </p>
              </div>
            </Link>
          ))}
      </div>
      {pageCount > 1 && (
        <div className="col-span-4 py-12">
          <ReactPaginate
            breakLabel=""
            nextLabel="NEXT"
            onPageChange={handlePageClick}
            pageRangeDisplayed={isTabletOrHigher ? 3 : 2}
            marginPagesDisplayed={isTabletOrHigher ? 3 : 0}
            pageCount={pageCount}
            previousLabel="PREVIOUS"
            renderOnZeroPageCount={null}
            className="flex justify-center space-x-1 md:space-x-2 text-slate-700"
            pageLinkClassName="py-2 px-3 text-center"
            disabledClassName="text-slate-500"
            activeLinkClassName="bg-white text-primary-500 rounded-xl"
            previousLinkClassName="text-sm text-xs font-bold text-gray-500 uppercase px-2"
            nextLinkClassName="text-sm text-xs font-bold text-gray-500 uppercase px-2"
          />
        </div>
      )}
    </div>
  );
};

export default Club;

export const query = graphql`
  query clubPageTemplateQuery {
    allClubs {
      edges {
        node {
          id
          name
          label
          count
        }
      }
    }
  }
`;
