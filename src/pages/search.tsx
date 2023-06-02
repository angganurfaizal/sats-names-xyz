import { ErrorMessage, Field, Form, Formik, FormikValues } from "formik";
import React from "react";
import { useQueryParamString } from "react-use-query-param-string";
import IconWarning from "../components/icons/outline/warning";
import { fetchSatsName } from "../loaders/sats-names";
import { hasInvisibleCharacters } from "../utils/checkForInvisibleCharacters";
import { type SatsName } from "./list";

export type SearchDataType = {
  error?: string;
  data?: SatsName & {
    genesisHeight: number;
    nameIndex: number;
    owner: string;
    registrationOp: { op: "reg"; p: "sns"; name: string };
    timestamp: string;
    queryDecoded: string;
    inscriptions: Omit<SatsName, "name, owner">[];
  };
};

export interface ErrorsType {
  search: string;
}

export default function SearchPage() {
  const [query, setQuery, initialized] = useQueryParamString("query", "");

  const [loading, setLoading] = React.useState(false);
  const [actionData, setActionData] = React.useState<SearchDataType>();

  const validate = (values: FormikValues) => {
    const errors: any = {};

    if (!values.search) {
      errors.search = "Please fill the form field before submitting";
    } else if (!values.search.match(/(.sats)$/g)) {
      errors.search = "Please make sure the name you type ends with .sats";
    }

    console.log(errors);

    return errors;
  };

  const handleSubmit = React.useCallback(
    async (values: FormikValues, actions?: any) => {
      setLoading(true);

      let searchQuery = values.search;
      const isInscriptionNumber = values.search.match(/^\d+$/g);

      if (isInscriptionNumber) {
        // console.log("is a number!", values.search);
      }

      const response = await fetchSatsName(searchQuery);

      setQuery(searchQuery);
      setLoading(false);

      if (response.status === 500 && actions) {
        actions.setFieldError(
          "search",
          "API is currently busy. Try again later!"
        );
        actions.setSubmitting(false);
      } else if (response.status === 404 && actions) {
        actions.setFieldError(
          "search",
          `${searchQuery} not found. Looks like this sats-name was not inscribed, yet.`
        );
        actions.setSubmitting(false);
      }

      const data = await response.json();

      if (data.error) {
        setActionData({
          error: data.error,
        });
      } else {
        setActionData({
          data,
        });
      }
    },
    [setQuery]
  );

  React.useEffect(() => {
    if (query && initialized) {
      setQuery(query);
      handleSubmit({ search: query });
    }
  }, [query, initialized, handleSubmit]);

  // console.log("initialized", initialized, query);

  return (
    initialized && (
      <div className="flex-grow w-full h-full p-6 space-y-6 bg-white rounded-xl">
        <Formik
          initialValues={{ search: query || "" }}
          onSubmit={handleSubmit}
          validate={validate}
        >
          <Form method="post" className="flex flex-col space-y-2">
            <label
              className="ml-2 text-xs font-bold text-gray-500 uppercase"
              htmlFor="search"
            >
              Search for a sats name
            </label>
            <div className="flex w-full">
              <Field
                id="search"
                name="search"
                type="text"
                className="w-full rounded-l-lg"
                placeholder="e.g. names.sats"
                required={true}
              />
              <button
                className="px-4 text-white rounded-r-lg bg-primary-500 md:px-6"
                type="submit"
              >
                Submit
              </button>
            </div>

            <ErrorMessage name="search">
              {(msg) => <p className="mx-2 text-red-500">{msg}</p>}
            </ErrorMessage>
          </Form>
        </Formik>
        {loading && (
          <div className="w-full py-6 text-center animate-pulse">
            Loading ...
          </div>
        )}
        {!loading && actionData && actionData.data && (
          <div className="space-y-4 break-words rounded-lg md:border md:p-6">
            <div className="flex">
              <h1 className="text-lg font-bold">{actionData.data.name}</h1>
              {hasInvisibleCharacters(actionData.data.queryDecoded) && (
                <IconWarning className="ml-2 text-red-500" />
              )}
            </div>
            {hasInvisibleCharacters(actionData.data.queryDecoded) && (
              <div className="p-6 space-y-4 bg-red-100 rounded-lg">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-red-500">Caution!</h3>
                  <p className="text-sm text-gray-700">
                    It is possible that this Sats Name is misleading, as the
                    visible characters and the decoded characters do not match.
                  </p>
                </div>
                <dl className="pl-4 border-l-4 border-red-500">
                  <dt className="text-xs font-bold uppercase text-black/50">
                    Visible:
                  </dt>
                  <dd className="font-bold">{actionData.data.name}</dd>
                  <dt className="mt-4 text-xs font-bold uppercase text-black/50">
                    Decoded:
                  </dt>
                  <dd className="font-bold">{actionData.data.queryDecoded}</dd>
                </dl>
              </div>
            )}
            <div></div>
            <div className="flex flex-col w-full sm:flex-row">
              <div className="pt-1 text-xs font-bold text-gray-500 uppercase sm:sm:w-1/3">
                Inscription Index
              </div>
              <div className="sm:sm:w-2/3">
                {actionData.data.inscriptionIndex}
              </div>
            </div>
            <div className="flex flex-col w-full sm:flex-row">
              <div className="pt-1 text-xs font-bold text-gray-500 uppercase sm:w-1/3">
                Inscription Id
              </div>
              <div className="sm:w-2/3">{actionData.data.inscriptionId}</div>
            </div>
            <div className="flex flex-col w-full sm:flex-row">
              <div className="pt-1 text-xs font-bold text-gray-500 uppercase sm:w-1/3">
                Inscriber
              </div>
              <div className="sm:w-2/3">{actionData.data.owner}</div>
            </div>
            <div className="flex flex-col w-full sm:flex-row">
              <div className="pt-1 text-xs font-bold text-gray-500 uppercase sm:w-1/3">
                Genesis Height
              </div>
              <div className="sm:w-2/3">{actionData.data.genesisHeight}</div>
            </div>
            <div className="flex flex-col w-full sm:flex-row">
              <div className="pt-1 text-xs font-bold text-gray-500 uppercase sm:w-1/3">
                Registration Operation
              </div>
              <div className="sm:w-2/3">
                {JSON.stringify(actionData.data.registrationOp, null, 2)}
              </div>
            </div>
            <div className="flex flex-col w-full sm:flex-row">
              <div className="pt-1 text-xs font-bold text-gray-500 uppercase sm:w-1/3">
                Name Index
              </div>
              <div className="sm:w-2/3">{actionData.data.nameIndex}</div>
            </div>
            <div className="flex flex-col w-full sm:flex-row">
              <div className="pt-1 text-xs font-bold text-gray-500 uppercase sm:w-1/3">
                Timestamp
              </div>
              <div className="sm:w-2/3">{actionData.data.timestamp}</div>
            </div>
            <div className="flex flex-col w-full sm:flex-row">
              <div className="pt-1 text-xs font-bold text-gray-500 uppercase sm:w-1/3">
                Query Decoded
              </div>
              <div className="sm:w-2/3">{actionData.data.queryDecoded}</div>
            </div>
            <hr className="!my-4" />
            <div className="flex flex-row flex-wrap w-full">
              <div className="w-full pt-1 mb-2 text-xs font-bold text-gray-500 uppercase">
                Inscriptions
              </div>
              {actionData.data.inscriptions &&
                actionData.data.inscriptions.map(
                  (i: Omit<SatsName, "name, owner">) => (
                    <div className="w-full" key={i.inscriptionId}>
                      <div className="flex flex-col w-full sm:flex-row">
                        <div className="pt-1 text-xs font-bold text-gray-500 uppercase sm:w-1/3">
                          Inscription Index
                        </div>
                        <div className="sm:w-2/3">{i.inscriptionIndex}</div>
                      </div>
                      <div className="flex flex-col w-full sm:flex-row">
                        <div className="pt-1 text-xs font-bold text-gray-500 uppercase sm:w-1/3">
                          Inscription Id
                        </div>
                        <div className="sm:w-2/3">{i.inscriptionId}</div>
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>
        )}
      </div>
    )
  );
}
