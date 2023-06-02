import { Link } from "gatsby";
import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { useCopyToClipboard } from "usehooks-ts";
import { fetchSatsNamesPromise } from "../loaders/sats-names";

export type SatsNames = {
  names: SatsName[];
};

export type SatsName = {
  name: string;
  inscriptionId: string;
  inscriptionIndex: number;
  owner: string;
};

export default function ListPage() {
  const [inited, setInited] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<SatsName[]>([]);
  const [earliestInscription, setEarliestInscription] =
    React.useState<number>();

  const [, copy] = useCopyToClipboard();

  const loadMoreRows = React.useCallback(async () => {
    if (!loading) {
      setLoading(true);

      const response = await fetchSatsNamesPromise(earliestInscription);
      const d: SatsNames = await response.json();

      if (d.names) {
        setData([...data, ...d.names]);
        setEarliestInscription(d.names[d.names.length - 1].inscriptionIndex);
      }

      setLoading(false);
    }
  }, [loading, data, earliestInscription]);

  React.useEffect(() => {
    if (!inited) {
      loadMoreRows();
      setInited(true);
    }
  }, [inited, loadMoreRows]);

  const isItemLoaded = (index: number) => (data ? index < data.length : false);

  const Item = ({ index, style }: { index: number; style: {} }) => (
    <div
      className="flex items-center px-4 py-2 space-x-3 text-sm border-b sm:space-x-6"
      style={style}
    >
      {!isItemLoaded(index) ? (
        <div className="text-gray-500 animate-pulse">Loading ...</div>
      ) : (
        <>
          <Link
            className="flex-grow font-mono font-bold text-gray-900 break-all"
            to={`/search?query=${data[index].name}`}
          >
            {data[index].name}
          </Link>
          <div className="flex-shrink-0 w-12 font-mono text-right text-gray-700 sm:w-24">
            {data[index].inscriptionIndex}
          </div>
          <div
            className="flex-shrink-0 w-px overflow-hidden font-mono text-gray-700 cursor-pointer sm:block sm:w-32 md:w-48 text-ellipsis lg:w-64"
            title="click to copy"
            onClick={() => copy(data[index].inscriptionId)}
          >
            {data[index].inscriptionId}
          </div>
          <div
            className="flex-shrink-0 w-12 overflow-hidden font-mono text-gray-700 cursor-pointer sm:w-32 md:w-48 text-ellipsis lg:w-64"
            title="click to copy"
            onClick={() => copy(data[index].owner)}
          >
            {data[index].owner}
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <div className="flex-grow w-full h-full bg-white rounded-xl">
        <div className="flex flex-row items-center h-12 px-4 py-2 space-x-3 border-b sm:space-x-6">
          <div className="flex-grow text-xs font-bold text-gray-500 uppercase">
            Name
          </div>
          <div className="w-12 text-xs font-bold text-right text-gray-500 uppercase sm:w-24">
            <span>#</span>
          </div>
          <div className="hidden w-12 overflow-hidden text-xs font-bold text-gray-500 uppercase sm:block sm:w-32 md:w-48 lg:w-64">
            <span className="hidden sm:inline">Inscription Id</span>
            <span className="sm:hidden">Id</span>
          </div>
          <div className="w-12 overflow-hidden text-xs font-bold text-gray-500 uppercase sm:w-32 md:w-48 lg:w-64">
            <span>Inscriber</span>
          </div>
        </div>
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={data.length + 50}
          loadMoreItems={loading ? () => {} : loadMoreRows}
        >
          {({ onItemsRendered, ref }) => (
            <AutoSizer>
              {({ width, height }: { width: number; height: number }) => (
                <FixedSizeList
                  ref={ref}
                  onItemsRendered={onItemsRendered}
                  itemCount={data.length + 50}
                  itemSize={48}
                  height={height! - 48}
                  width={width!}
                >
                  {Item}
                </FixedSizeList>
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      </div>
      {loading && (
        <div className="absolute z-50 px-4 py-2 -translate-x-1/2 rounded-full text-primary-400 animate-pulse bottom-12 left-1/2 bg-primary-50">
          Loading ...
        </div>
      )}
    </>
  );
}
