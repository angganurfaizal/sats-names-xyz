const fetchSatsNames = async (cursor?: string) => {
  let res = (await !cursor)
    ? fetch(`https://api.sats.id/names`)
    : fetch(`https://api.sats.id/names?cursor=${cursor}`);
  return res;
};

const fetchSatsNamesPromise = (cursor?: number) => {
  let res = !cursor
    ? fetch(`https://api.sats.id/names`)
    : fetch(`https://api.sats.id/names?cursor=${cursor}`);
  return res;
};

const fetchSatsName = async (name?: string) => {
  let res = await fetch(`https://api.sats.id/names/${name}`);
  return res;
};

const fetchBISInscription = async (num?: string) => {
  fetch(`https://ordapi.bestinslot.xyz/v1/get_inscription_with_number/${num}`)
    .then((res) => {
      const data = res.json();
      // console.log(data);
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const fetchStatus = async () => {
  let res = await fetch(`https://api.sats.id/status`);
  return res;
};

const fetchClubInscriptions = async (
  club: string,
  start: number,
  limit: number
) => {
  let res = await fetch(`${club}?_start=${start}&_limit=${limit}`);
  return res;
};

export {
  fetchSatsNames,
  fetchSatsNamesPromise,
  fetchSatsName,
  fetchBISInscription,
  fetchStatus,
  fetchClubInscriptions,
};
