const invisibleCharacters = [
  "U0009",
  "U0020",
  "U00A0",
  "U00AD",
  "U034F",
  "U061C",
  "U115F",
  "U1160",
  "U17B4",
  "U17B5",
  "U180E",
  "U2000",
  "U2001",
  "U2002",
  "U2003",
  "U2004",
  "U2005",
  "U2006",
  "U2007",
  "U2008",
  "U2009",
  "U200A",
  "U200B",
  "U200C",
  "U200D",
  "U200E",
  "U200F",
  "U202F",
  "U205F",
  "U2060",
  "U2061",
  "U2062",
  "U2063",
  "U2064",
  "U206A",
  "U206B",
  "U206C",
  "U206D",
  "U206E",
  "U206F",
  "U3000",
  "U2800",
  "U3164",
  "UFEFF",
  "UFFA0",
  "U1D159",
  "U1D173",
  "U1D174",
  "U1D175",
  "U1D176",
  "U1D177",
  "U1D178",
  "U1D179",
  "U1D17A",
];

const hasInvisibleCharacters = (s: string) => {
  const has = invisibleCharacters.reduce((acc, char) => {
    if (acc !== true && s.toUpperCase().includes(char)) {
      acc = true;
    }
    return acc;
  }, false);

  return has;
};

export { hasInvisibleCharacters };
