import { Link } from "gatsby";
import React from "react";
import { useCopyToClipboard } from "usehooks-ts";
import IconSparkles from "../components/icons/outline/sparkles";
import { fetchSatsNames, fetchStatus } from "../loaders/sats-names";
import { SatsName } from "./about";
import { SatsNames } from "./list";

export type StatusData = {
  syncHeight: number;
  lastSync: string;
  message: string;
  totalNames: number;
};

const HomePage = () => {
  const [numInscriptions, setNumInscriptions] = React.useState<string>();
  const [lastSync, setLastSync] = React.useState<string>();
  // const [checkInput, setCheckInput] = React.useState<string>();

  const [latestInscriptions, setLatestInscriptions] =
    React.useState<SatsName[]>();

  const [, copy] = useCopyToClipboard();

  React.useEffect(() => {
    const getStatus = async () => {
      const statusRes = await fetchStatus();
      const status: StatusData = await statusRes.json();

      setNumInscriptions(status.totalNames.toLocaleString());
      setLastSync(
        new Date(status.lastSync).toLocaleString("en-US", {
          timeStyle: "short",
        })
      );
    };

    const getLatestInscriptions = async () => {
      const inscriptionsRes = await fetchSatsNames();
      const inscriptions: SatsNames = await inscriptionsRes.json();
      setLatestInscriptions(inscriptions.names.slice(0, 10));
    };

    getStatus();
    getLatestInscriptions();
  }, []);

  // const handleCheckClick = () => {
  //   if (checkInput && checkInput !== "") {
  //     try {
  //       const checkResult = ens_normalize(checkInput);
  //       console.log("ens check", checkResult);
  //     } catch (error) {
  //       console.log("ens error", error);
  //     }
  //   }
  // };

  return (
    <div className="h-full">
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-6 p-6 space-y-2 text-center bg-white sm:col-span-3 rounded-xl">
          {numInscriptions ? (
            <h1 className="h-12 text-5xl font-bold text-primary-500">
              {numInscriptions}
            </h1>
          ) : (
            <div className="flex items-center justify-center h-12 text-primary-500">
              <IconSparkles className="w-6 h-6 animate-pulse anima" />
            </div>
          )}
          <p className="text-xs font-bold text-gray-500 uppercase">
            Total Sats Name Inscriptions
          </p>
        </div>
        <div className="col-span-6 p-6 space-y-2 text-center bg-white sm:col-span-3 rounded-xl">
          {lastSync ? (
            <h1 className="h-12 text-5xl font-bold text-primary-500">
              {lastSync}
            </h1>
          ) : (
            <div className="flex items-center justify-center h-12 text-primary-500">
              <IconSparkles className="w-6 h-6 animate-pulse anima" />
            </div>
          )}
          <p className="text-xs font-bold text-gray-500 uppercase">Last Sync</p>
        </div>
        <div className="relative col-span-6 bg-white rounded-xl">
          <div className="flex items-end w-full p-4">
            <p className="flex-grow text-xs font-bold text-gray-500 uppercase">
              Latest inscriptions
            </p>
            <Link
              className="text-xs font-bold uppercase text-primary-500"
              to="/list"
            >
              See all
            </Link>
          </div>
          <hr className="m-0" />
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
          {latestInscriptions ? (
            <div>
              {latestInscriptions.map((data) => (
                <div
                  key={data.inscriptionId}
                  className="flex items-center px-4 py-2 space-x-3 text-sm border-b sm:space-x-6"
                >
                  <Link
                    className="flex-grow font-mono font-bold text-gray-900 break-all"
                    to={`/search?query=${data.name}`}
                  >
                    {data.name}
                  </Link>
                  <div className="flex-shrink-0 w-12 font-mono text-right text-gray-700 sm:w-24">
                    {data.inscriptionIndex}
                  </div>
                  <div
                    className="flex-shrink-0 w-px overflow-hidden font-mono text-gray-700 cursor-pointer sm:block sm:w-32 md:w-48 text-ellipsis lg:w-64"
                    title="click to copy"
                    onClick={() => copy(data.inscriptionId)}
                  >
                    {data.inscriptionId}
                  </div>
                  <div
                    className="flex-shrink-0 w-12 overflow-hidden font-mono text-gray-700 cursor-pointer sm:w-32 md:w-48 text-ellipsis lg:w-64"
                    title="click to copy"
                    onClick={() => copy(data.owner)}
                  >
                    {data.owner}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {Array.from(Array(10).keys()).map((key) => (
                <div
                  key={key}
                  className="flex items-center px-4 py-2 space-x-3 text-sm border-b sm:space-x-6"
                >
                  <div className="text-gray-500 animate-pulse">Loading ...</div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* <div className="col-span-6 p-6 space-x-2 bg-white rounded-xl">
          <input
            value={checkInput || ""}
            onChange={(event) => {
              setCheckInput(event.target.value);
            }}
          />
          <button className="" onClick={handleCheckClick}>
            Check
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default HomePage;
