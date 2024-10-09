declare var $: any;
const EntityCompanyConst = {
  lineChart: {
    height: '200',
    width: '320',
    axisX: true,
    axisY: true,
    gridy: true,
    marginTop: 0,
    marginBottom: 50,
    marginRight: 50,
    marginLeft: 10,
    showxYaxis: true
  },
  WebSocketTwitterUrl: 'wss://smg2iyozn9.execute-api.eu-west-1.amazonaws.com/Prod'
};
const Company_Unwanted_End_Points = [
  'ltd.',
  'international',
  'limited',
  'corporation',
  'organization',
  'pvt.',
  'private',
  'llc.',
  'inc.',
  'corp.',
  'agency',
  'co.',
  'incorporated',
  'corporated',
  'cooperatives'
]

const chartsConst = {
  countryRisk: [
    {
      "ISO": "AF",
      "COUNTRY": "AFGHANISTAN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "AX",
      "COUNTRY": "ÅLAND ISLANDS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "AL",
      "COUNTRY": "ALBANIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "DZ",
      "COUNTRY": "ALGERIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "AS",
      "COUNTRY": "AMERICAN SAMOA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "AD",
      "COUNTRY": "ANDORRA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "AO",
      "COUNTRY": "ANGOLA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "AI",
      "COUNTRY": "ANGUILLA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "AQ",
      "COUNTRY": "ANTARCTICA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "AG",
      "COUNTRY": "ANTIGUA AND BARBUDA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "AR",
      "COUNTRY": "ARGENTINA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "AM",
      "COUNTRY": "ARMENIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "AW",
      "COUNTRY": "ARUBA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "AC",
      "COUNTRY": "ASCENSION ISLANDS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "AU",
      "COUNTRY": "AUSTRALIA",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "AT",
      "COUNTRY": "AUSTRIA",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "AZ",
      "COUNTRY": "AZERBAIJAN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "BS",
      "COUNTRY": "BAHAMAS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "BH",
      "COUNTRY": "BAHRAIN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "BD",
      "COUNTRY": "BANGLADESH",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "BB",
      "COUNTRY": "BARBADOS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "BY",
      "COUNTRY": "BELARUS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "BE",
      "COUNTRY": "BELGIUM",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "BZ",
      "COUNTRY": "BELIZE",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "BJ",
      "COUNTRY": "BENIN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "BM",
      "COUNTRY": "BERMUDA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "BT",
      "COUNTRY": "BHUTAN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "BO",
      "COUNTRY": "BOLIVIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "BQ",
      "COUNTRY": "BONAIRE SINT EUSTATIUS AND SABA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "BA",
      "COUNTRY": "BOSNIA AND HERZEGOVINA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "BW",
      "COUNTRY": "BOTSWANA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "BV",
      "COUNTRY": "BOUVET ISLAND",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "BR",
      "COUNTRY": "BRAZIL",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "IO",
      "COUNTRY": "BRITISH INDIAN OCEAN TERRITORY",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "BN",
      "COUNTRY": "BRUNEI DARUSSALAM",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "BG",
      "COUNTRY": "BULGARIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "BF",
      "COUNTRY": "BURKINA FASO",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "BI",
      "COUNTRY": "BURUNDI",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "CV",
      "COUNTRY": "CABO VERDE",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "KH",
      "COUNTRY": "CAMBODIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "CM",
      "COUNTRY": "CAMEROON",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "CA",
      "COUNTRY": "CANADA",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "KY",
      "COUNTRY": "CAYMAN ISLANDS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "CF",
      "COUNTRY": "CENTRAL AFRICAN REPUBLIC",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "TD",
      "COUNTRY": "CHAD",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "CL",
      "COUNTRY": "CHILE",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "CN",
      "COUNTRY": "CHINA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "CX",
      "COUNTRY": "CHRISTMAS ISLAND",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "CC",
      "COUNTRY": "COCOS (KEELING) ISLANDS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "CO",
      "COUNTRY": "COLOMBIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "KM",
      "COUNTRY": "COMOROS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "CG",
      "COUNTRY": "CONGO REP.",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "CD",
      "COUNTRY": "CONGO DEM. REP.",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "CK",
      "COUNTRY": "COOK ISLANDS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "CR",
      "COUNTRY": "COSTA RICA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "CI",
      "COUNTRY": "COTE D'IVOIRE",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "HR",
      "COUNTRY": "CROATIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "CU",
      "COUNTRY": "CUBA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "CW",
      "COUNTRY": "CURACAO",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "CY",
      "COUNTRY": "CYPRUS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "CZ",
      "COUNTRY": "CZECH REPUBLIC",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "DK",
      "COUNTRY": "DENMARK",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "DJ",
      "COUNTRY": "DJIBOUTI",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "DM",
      "COUNTRY": "DOMINICA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "DO",
      "COUNTRY": "DOMINICAN REPUBLIC",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "EC",
      "COUNTRY": "ECUADOR",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "EG",
      "COUNTRY": "EGYPT",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "SV",
      "COUNTRY": "EL SALVADOR",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "GQ",
      "COUNTRY": "EQUATORIAL GUINEA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "ER",
      "COUNTRY": "ERITREA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "EE",
      "COUNTRY": "ESTONIA",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "Gb",
      "COUNTRY": "England",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "ET",
      "COUNTRY": "ETHIOPIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "FK",
      "COUNTRY": "FALKLAND ISLANDS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "FO",
      "COUNTRY": "FAROE ISLANDS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "FJ",
      "COUNTRY": "FIJI",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "FI",
      "COUNTRY": "FINLAND",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "FR",
      "COUNTRY": "FRANCE",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "GF",
      "COUNTRY": "FRENCH GUIANA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "PF",
      "COUNTRY": "FRENCH POLYNESIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "TF",
      "COUNTRY": "FRENCH SOUTHERN TERRITORIES",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "GA",
      "COUNTRY": "GABON",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "GM",
      "COUNTRY": "GAMBIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "GE",
      "COUNTRY": "GEORGIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "DE",
      "COUNTRY": "GERMANY",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "GH",
      "COUNTRY": "GHANA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "GI",
      "COUNTRY": "GIBRALTAR",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "GR",
      "COUNTRY": "GREECE",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "GL",
      "COUNTRY": "GREENLAND",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "GD",
      "COUNTRY": "GRENADA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "GP",
      "COUNTRY": "GUADELOUPE",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "GU",
      "COUNTRY": "GUAM",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "GT",
      "COUNTRY": "GUATEMALA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "GG",
      "COUNTRY": "GUERNSEY",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "GN",
      "COUNTRY": "GUINEA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "GW",
      "COUNTRY": "GUINEA-BISSAU",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "GY",
      "COUNTRY": "GUYANA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "HT",
      "COUNTRY": "HAITI",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "HM",
      "COUNTRY": "HEARD ISLAND AND MCDONALD ISLANDS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "VA",
      "COUNTRY": "VATICAN CITY",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "HN",
      "COUNTRY": "HONDURAS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "HK",
      "COUNTRY": "HONG KONG",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "HU",
      "COUNTRY": "HUNGARY",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "IS",
      "COUNTRY": "ICELAND",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "IN",
      "COUNTRY": "INDIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "ID",
      "COUNTRY": "INDONESIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "IR",
      "COUNTRY": "IRAN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "IQ",
      "COUNTRY": "IRAQ",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "IE",
      "COUNTRY": "IRELAND",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "IM",
      "COUNTRY": "ISLE OF MAN",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "IL",
      "COUNTRY": "ISRAEL",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "IT",
      "COUNTRY": "ITALY",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "JM",
      "COUNTRY": "JAMAICA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "JP",
      "COUNTRY": "JAPAN",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "JE",
      "COUNTRY": "JERSEY",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "JO",
      "COUNTRY": "JORDAN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "KZ",
      "COUNTRY": "KAZAKHSTAN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "KE",
      "COUNTRY": "KENYA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "KI",
      "COUNTRY": "KIRIBATI",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "KP",
      "COUNTRY": "KOREA, NORTH",
      "FEC/ESR Risk Level": "UHRC"
    },
    {
      "ISO": "KR",
      "COUNTRY": "KOREA, SOUTH",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "KW",
      "COUNTRY": "KUWAIT",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "KG",
      "COUNTRY": "KYRGYZSTAN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "LA",
      "COUNTRY": "LAOS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "LV",
      "COUNTRY": "LATVIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "LB",
      "COUNTRY": "LEBANON",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "LS",
      "COUNTRY": "LESOTHO",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "LR",
      "COUNTRY": "LIBERIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "LY",
      "COUNTRY": "LIBYA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "LI",
      "COUNTRY": "LIECHTENSTEIN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "LT",
      "COUNTRY": "LITHUANIA",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "LU",
      "COUNTRY": "LUXEMBOURG",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "MO",
      "COUNTRY": "MACAO",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MK",
      "COUNTRY": "MACEDONIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MG",
      "COUNTRY": "MADAGASCAR",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MW",
      "COUNTRY": "MALAWI",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MY",
      "COUNTRY": "MALAYSIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MV",
      "COUNTRY": "MALDIVES",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "ML",
      "COUNTRY": "MALI",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MT",
      "COUNTRY": "MALTA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MH",
      "COUNTRY": "MARSHALL ISLANDS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MQ",
      "COUNTRY": "MARTINIQUE",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MR",
      "COUNTRY": "MAURITANIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MU",
      "COUNTRY": "MAURITIUS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "YT",
      "COUNTRY": "MAYOTTE",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MX",
      "COUNTRY": "MEXICO",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "FM",
      "COUNTRY": "MICRONESIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MD",
      "COUNTRY": "MOLDOVA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MC",
      "COUNTRY": "MONACO",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MN",
      "COUNTRY": "MONGOLIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "ME",
      "COUNTRY": "MONTENEGRO",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MS",
      "COUNTRY": "MONTSERRAT",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MA",
      "COUNTRY": "MOROCCO",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MZ",
      "COUNTRY": "MOZAMBIQUE",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MM",
      "COUNTRY": "MYANMAR",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "NA",
      "COUNTRY": "NAMIBIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "NR",
      "COUNTRY": "NAURU",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "NP",
      "COUNTRY": "NEPAL",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "NL",
      "COUNTRY": "NETHERLANDS",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "AN",
      "COUNTRY": "NETHERLANDS DUTCH ANTILLES",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "NC",
      "COUNTRY": "NEW CALEDONIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "NZ",
      "COUNTRY": "NEW ZEALAND",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "NI",
      "COUNTRY": "NICARAGUA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "NE",
      "COUNTRY": "NIGER",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "NG",
      "COUNTRY": "NIGERIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "NU",
      "COUNTRY": "NIUE",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "NF",
      "COUNTRY": "NORFOLK ISLAND",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MP",
      "COUNTRY": "NORTHERN MARIANA ISLANDS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "NO",
      "COUNTRY": "NORWAY",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "OM",
      "COUNTRY": "OMAN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "PK",
      "COUNTRY": "PAKISTAN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "PW",
      "COUNTRY": "PALAU",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "PS",
      "COUNTRY": "PALESTINE",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "PA",
      "COUNTRY": "PANAMA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "PG",
      "COUNTRY": "PAPUA NEW GUINEA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "PY",
      "COUNTRY": "PARAGUAY",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "PE",
      "COUNTRY": "PERU",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "PH",
      "COUNTRY": "PHILIPPINES",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "PN",
      "COUNTRY": "PITCAIRN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "PL",
      "COUNTRY": "POLAND",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "PT",
      "COUNTRY": "PORTUGAL",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "PR",
      "COUNTRY": "PUERTO RICO",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "QA",
      "COUNTRY": "QATAR",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "RE",
      "COUNTRY": "REUNION",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "RO",
      "COUNTRY": "ROMANIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "RU",
      "COUNTRY": "RUSSIA",
      "FEC/ESR Risk Level": "Medium"
    },
    {
      "ISO": "RU",
      "COUNTRY": "RUSSIAN FEDERATION",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "RW",
      "COUNTRY": "RWANDA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "BL",
      "COUNTRY": "SAINT BARTHELEMY",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "SH",
      "COUNTRY": "SAINT HELENA",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "KN",
      "COUNTRY": "SAINT KITTS & NEVIS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "LC",
      "COUNTRY": "SAINT LUCIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "MF",
      "COUNTRY": "SAINT MARTIN",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "PM",
      "COUNTRY": "SAINT PIERRE & MIQUELON",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "VC",
      "COUNTRY": "SAINT VINCENT & GRENADINES",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "WS",
      "COUNTRY": "SAMOA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "SM",
      "COUNTRY": "SAN MARINO",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "ST",
      "COUNTRY": "SAO TOME & PRINCIPE",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "SA",
      "COUNTRY": "SAUDI ARABIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "SN",
      "COUNTRY": "SENEGAL",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "RS",
      "COUNTRY": "SERBIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "SC",
      "COUNTRY": "SEYCHELLES",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "SL",
      "COUNTRY": "SIERRA LEONE",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "SG",
      "COUNTRY": "SINGAPORE",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "SX",
      "COUNTRY": "SINT MAARTEN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "SK",
      "COUNTRY": "SLOVAKIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "SI",
      "COUNTRY": "SLOVENIA",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "SB",
      "COUNTRY": "SOLOMON ISLANDS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "SO",
      "COUNTRY": "SOMALIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "ZA",
      "COUNTRY": "SOUTH AFRICA",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "GS",
      "COUNTRY": "SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "SS",
      "COUNTRY": "SOUTH SUDAN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "ES",
      "COUNTRY": "SPAIN",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "LK",
      "COUNTRY": "SRI LANKA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "SD",
      "COUNTRY": "SUDAN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "SR",
      "COUNTRY": "SURINAME",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "SJ",
      "COUNTRY": "SVALBARD",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "SZ",
      "COUNTRY": "SWAZILAND",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "SE",
      "COUNTRY": "SWEDEN",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "CH",
      "COUNTRY": "SWITZERLAND",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "SY",
      "COUNTRY": "SYRIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "TW",
      "COUNTRY": "TAIWAN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "TJ",
      "COUNTRY": "TAJIKISTAN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "TZ",
      "COUNTRY": "TANZANIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "TH",
      "COUNTRY": "THAILAND",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "TL",
      "COUNTRY": "TIMOR-LESTE",
      "FEC/ESR Risk Level": "High"
    },
    {
      "COUNTRY": "EAST TIMOR",
      "ISO": "Tl",
      "FEC/ESR Risk Level": "Medium"
    },
    {
      "ISO": "TG",
      "COUNTRY": "TOGO",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "TK",
      "COUNTRY": "TOKELAU",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "TO",
      "COUNTRY": "TONGA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "TT",
      "COUNTRY": "TRINIDAD AND TOBAGO",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "TN",
      "COUNTRY": "TUNISIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "TR",
      "COUNTRY": "TURKEY",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "TM",
      "COUNTRY": "TURKMENISTAN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "TC",
      "COUNTRY": "TURKS AND CAICOS ISLANDS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "TV",
      "COUNTRY": "TUVALU",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "UG",
      "COUNTRY": "UGANDA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "UA",
      "COUNTRY": "UKRAINE",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "AE",
      "COUNTRY": "UNITED ARAB EMIRATES",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "GB",
      "COUNTRY": "UNITED KINGDOM",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "UM",
      "COUNTRY": "UNITED STATES MINOR OUTLYING ISLANDS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "US",
      "COUNTRY": "UNITED STATES OF AMERICA",
      "FEC/ESR Risk Level": "Low"
    },
    {
      "ISO": "UY",
      "COUNTRY": "URUGUAY",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "UZ",
      "COUNTRY": "UZBEKISTAN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "VU",
      "COUNTRY": "VANUATU",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "VA",
      "COUNTRY": "VATICAN CITY (HOLY SEE)",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "VE",
      "COUNTRY": "VENEZUELA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "VN",
      "COUNTRY": "VIETNAM",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "VG",
      "COUNTRY": "VIRGIN ISLANDS (BRITISH)",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "VI",
      "COUNTRY": "VIRGIN ISLANDS (U.S.)",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "WF",
      "COUNTRY": "WALLIS & FUTUNA ISLANDS",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "EH",
      "COUNTRY": "WESTERN SAHARA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "YE",
      "COUNTRY": "YEMEN",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "ZM",
      "COUNTRY": "ZAMBIA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "ZW",
      "COUNTRY": "ZIMBABWE",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "KX",
      "COUNTRY": "CRIMEA",
      "FEC/ESR Risk Level": "High"
    },
    {
      "ISO": "XK",
      "COUNTRY": "KOSOVO",
      "FEC/ESR Risk Level": "Medium"
    },
    {
      "ISO": "KK",
      "COUNTRY": "TURKISH REPUBLIC OF NORTHERN CYPRUS",
      "FEC/ESR Risk Level": "High"
    }
  ]

}

const customEntites = {
  editedEnties: [],
  adddeleteEntity: [],
  deleteEntityChart: [],
  screeningaddition: [],
  screeningEdit: [],
  screeningDelete: []
}


const utilityConstant = {
  conplianceMapKeys: [
    {
      'key': 'trade_register_number',
      'value': 'Trade/Commerce',
      'class': 'fa-shopping-cart',
      'texts': '',
      'edit': false,
      'title': 'Registered Trade/Commerce Sources'
    },
    {
      'key': 'vat_tax_number',
      'value': 'VAT/TIN',
      'class': 'VAT',
      'texts': '',
      'edit': false,
      'title': 'Registered VAT/TIN Sources'
    },
    {
      'key': 'trade_register',
      'value': 'Trade register',
      'class': '',
      'texts': '',
      'edit': false,
      'title': 'Trade Register'
    },
    {
      'key': 'industry',
      'value': 'Industry',
      'class': 'fa-industry',
      'texts': '',
      'edit': false,
      'title': 'Registed Industry-Type Sources'
    },
    {
      'key': 'bst:businessClassifier',
      'value': 'Business Activity',
      'class': '',
      'texts': '',
      'edit': false,
      'title': 'Business Activity'
    },
    {
      'key': 'hasActivityStatus',
      'value': 'Company Status',
      'class': 'fa-check-square',
      'texts': '',
      'edit': false,
      'title': 'Registered Company Status Sources'
    },
    {
      'key': 'country',
      'value': 'Country',
      'class': 'fa-globe',
      'texts': '',
      'edit': false,
      'title': 'Registered Country Sources'
    },
    {
      'key': 'fullAddress',
      'value': 'Registered Address',
      'class': 'fa-map-marker',
      'texts': '',
      'edit': false,
      'title': 'Registered Address Sources'
    },
    {
      'key': 'zip',
      'value': 'Postal Code',
      'class': 'fa-map-signs',
      'texts': '',
      'edit': false,
      'title': 'Registered Postal Code Sources'
    },
    {
      'key': 'isIncorporatedIn',
      'value': 'Date of Incorporation',
      'class': 'fa-calendar-o',
      'texts': '',
      'edit': false,
      'title': 'Registed Date of Incorporation Sources'
    },
    {
      'key': 'tr-org:hasRegisteredPhoneNumber',
      'value': 'Registered Phone Number',
      'class': 'fa-phone',
      'texts': '',
      'edit': false,
      'title': 'Registered Phone Number Sources'
    },
    {
      'key': 'hasRegisteredFaxNumber',
      'value': 'Registered Fax Number',
      'class': 'fa-fax',
      'texts': '',
      'edit': false,
      'title': 'Registered Fax Number Sources'
    },
    // {
    // 	'key': 'isDomiciledIn',
    // 	'value': 'Domiciled In',
    // 	'class': 'fa-home',
    // 	'texts': '',
    // 	'edit': false,
    // 	'title': 'Registered Domiciled In Sources'
    // },
    {
      'key': 'bst:email',
      'value': 'Email',
      'class': 'fa-home',
      'texts': '',
      'edit': false,
      'title': 'Registered Email'
    },
    {
      'key': 'founder',
      'value': 'Founder',
      'class': '',
      'texts': '',
      'edit': false,
      'title': 'Founder'
    },
    {
      'key': 'country_connectios',
      'value': 'Country Connecions',
      'class': '',
      'texts': '',
      'edit': false,
      'title': 'Founder'
    },
    // {
    // 	'key': 'bst:aka',
    // 	'value': 'Alias Name',
    // 	'class': ' fa-building-o',
    // 	'texts': '',
    // 	'edit': false,
    // 	'title': 'Registered Alias Name Sources'
    // },
    // {
    // 	'key': 'streetAddress',
    // 	'value': 'Street Address',
    // 	'class': 'fa-road',
    // 	'texts': '',
    // 	'edit': false,
    // 	'title': 'Registered street Address Sources'
    // }
    // , {
    // 	'key': 'city',
    // 	'value': 'City',
    // 	'class': 'fa-city',
    // 	'texts': '',
    // 	'edit': false,
    // 	'title': 'Registered City Sources'
    // },
    // {
    // 	'key': 'industryType',
    // 	'value': 'Industry-Type',
    // 	'class': 'fa-industry',
    // 	'texts': '',
    // 	'edit': false,
    // 	'title': 'Registed Industry-Type Sources'
    // },
    // {
    // 	'key': 'lei:legalForm',
    // 	'value': 'Legal Type',
    // 	'class': 'fa-briefcase',
    // 	'texts': '',
    // 	'edit': false,
    // 	'title': 'Registed Legal Type Sources'
    // },
    // {
    // 	'key': 'main_exchange',
    // 	'value': 'Stock Exchange',
    // 	'class': 'fa-area-chart',
    // 	'texts': '',
    // 	'edit': false,
    // 	'title': 'Registered Stock Exchange Sources'
    // },
    // {
    // 	'key': 'ticket_symbol',
    // 	'value': 'Stock Ticker',
    // 	'class': 'fa-tag',
    // 	'texts': '',
    // 	'edit': false,
    // 	'title': 'Registered Stock Ticker In Sources'
    // },
    // {
    // 	'key': 'hasIPODate',
    // 	'value': 'IPO Date',
    // 	'class': 'fa-calendar-o',
    // 	'texts': '',
    // 	'edit': false,
    // 	'title': 'Registered IPO Date Sources'
    // },


    // {
    // 	'key': 'tr-org:hasHeadquartersPhoneNumber',
    // 	'value': 'Headquater Phone Number',
    // 	'class': 'fa-phone',
    // 	'texts': '',
    // 	'edit': false,
    // 	'title': 'Registered Headquater Phone Number Sources'
    // },
    // {
    // 	'key': 'tr-org:hasHeadquartersFaxNumber',
    // 	'value': 'Headquarters Fax Number',
    // 	'class': 'fa-fax',
    // 	'texts': '',
    // 	'edit': false,
    // 	'title': 'Registered Headquarters Fax Number Sources'
    // },


    // {
    // 	'key': 'hasURL',
    // 	'value': 'Website',
    // 	'class': 'fa-link',
    // 	'texts': '',
    // 	'edit': false,
    // 	'title': 'Registered Website In Sources'
    // },
    // {
    // 	'key': 'RegulationStatus',
    // 	'value': 'Regulation Status',
    // 	'class': 'fa-gavel',
    // 	'texts': '',
    // 	'edit': false,
    // 	'title': 'Registered Regulation Status In Sources'
    // },
    // {
    // 	'key': 'RegulationStatusEffectiveDate',
    // 	'value': 'Regulation Status Effective Date',
    // 	'class': 'fa-calendar',
    // 	'texts': '',
    // 	'edit': false,
    // 	'title': 'Registered Regulation Status Effective Date In Sources'
    // }

  ],
  conplianceIdentifiers: [
    {
      'key': '',
      'value': 'Existing Customer',
      'class': '',
      'texts': '',
      'edit': false,
      'title': ''
    },
    {
      'key': '',
      'value': 'Products',
      'class': '',
      'texts': '',
      'edit': false,
      'title': ''
    },
    {
      'key': '',
      'value': 'Potential Further Products',
      'class': '',
      'texts': '',
      'edit': false,
      'title': ''
    }
    // {
    // 	'key': 'vat_tax_number',
    // 	'value': 'VAT/TIN',
    // 	'class': 'VAT',
    // 	'texts': '',
    // 	'edit': false,
    // 	'title': 'Registered VAT/TIN Sources'
    // },
    // {
    // 	'key': 'legal_entity_identifier',
    // 	'value': 'LEI',
    // 	'class': 'LEI',
    // 	'texts': '',
    // 	'edit': false,
    // 	'title': 'Registered LEI Sources'
    // },
    // {
    // 	'key': 'trade_register_number',
    // 	'value': 'Trade/Commerce',
    // 	'class': 'fa-shopping-cart',
    // 	'texts': '',
    // 	'edit': false,
    // 	'title': 'Registered Trade/Commerce Sources'
    // },
    // {
    // 	'key': 'international_securities_identifier',
    // 	'value': 'International Securities Identification Number',
    // 	'class': 'fa-barcode',
    // 	'texts': '',
    // 	'edit': false,
    // 	'title': 'Registered International Securities Identification Number Sources'
    // },
    // {
    // 	'key': 'swift_code',
    // 	'value': 'BIC / Swift Codes',
    // 	'class': 'fa-barcode',
    // 	'texts': '',
    // 	'edit': false,
    // 	'title': 'Registered BIC / Swift Codes Sources'
    // },
  ],
  conplianceMapKeysReport: [{
    'key': 'vcard:organization-name',
    'value': 'Legal Name',
    'class': 'fa-check-square',
    'texts': '',
    'edit': false,
    'title': 'Registered Legal Name Sources',
    'showSource': false
  },
  {
    'key': 'bst:aka',
    'value': 'Alias Name',
    'class': ' fa-building-o',
    'texts': '',
    'edit': false,
    'title': 'Registered Alias Name Sources',
    'showSource': true
  },
  {
    'key': 'hasActivityStatus',
    'value': 'Company Status',
    'class': 'fa-check-square',
    'texts': '',
    'edit': false,
    'title': 'Registered Company Status Sources',
    'showSource': true
  },
  {
    'key': 'hasURL',
    'value': 'Company Website',
    'class': 'fa-link',
    'texts': '',
    'edit': false,
    'title': 'Registered Website In Sources',
    'showSource': true
  },
  {
    'key': 'fullAddress',
    'value': 'Registered Address',
    'class': 'fa-map-marker',
    'texts': '',
    'edit': false,
    'title': 'Registered Address Sources',
    'showSource': true
  },
  {
    'key': 'lei:legalForm',
    'value': 'Legal Form',
    'class': 'fa-briefcase',
    'texts': '',
    'edit': false,
    'title': 'Registed Legal Form Sources',
    'showSource': true
  },
  {
    'key': 'zip',
    'value': 'ZIP/Postal Code',
    'class': 'fa-map-signs',
    'texts': '',
    'edit': false,
    'title': 'Registered Postal Code Sources',
    'showSource': true
  },
  {
    'key': 'main_exchange',
    'value': 'Listed on Stock Exchange',
    'class': 'fa-area-chart',
    'texts': '',
    'edit': false,
    'title': 'Registered Stock Exchange Sources',
    'showSource': true
  },
  {
    'key': 'country',
    'value': 'Country',
    'class': 'fa-globe',
    'texts': '',
    'edit': false,
    'title': 'Registered Country Sources',
    'showSource': true
  },
  {
    'key': 'ticket_symbol',
    'value': 'Ticker Code',
    'class': 'fa-tag',
    'texts': '',
    'edit': false,
    'title': 'Registered  Ticker Code In Sources',
    'showSource': true
  },
  {
    'key': 'vat_tax_number',
    'value': 'VAT/TIN',
    'class': 'VAT',
    'texts': '',
    'edit': false,
    'title': 'Registered VAT/TIN Sources',
    'showSource': true
  },
  {
    'key': 'legal_entity_identifier',
    'value': 'LEI',
    'class': 'LEI',
    'texts': '',
    'edit': false,
    'title': 'Registered LEI Sources',
    'showSource': true
  },
  {
    'key': 'trade_register_number',
    'value': 'Trade Registration',
    'class': 'fa-shopping-cart',
    'texts': '',
    'edit': false,
    'title': 'Registered Trade Registration# Sources',
    'showSource': true
  },
  {
    'key': 'industryType',
    'value': 'Industry',
    'class': 'fa-industry',
    'texts': '',
    'edit': false,
    'title': 'Registed Industry-Type Sources',
    'showSource': true
  },
  {
    'key': 'isIncorporatedIn',
    'value': 'Date of Incorporation',
    'class': 'fa-calendar-o',
    'texts': '',
    'edit': false,
    'title': 'Registed Date of Incorporation Sources',
    'showSource': true
  },
  {
    'key': 'swift_code',
    'value': 'BIC / Swift Codes',
    'class': 'fa-barcode',
    'texts': '',
    'edit': false,
    'title': 'Registered BIC / Swift Codes Sources',
    'showSource': true
  },
  {
    'key': '',
    'value': '',
    'class': '',
    'texts': '',
    'edit': false,
    'title': '',
    'showSource': false
  },
  {
    'key': 'RegulationStatus',
    'value': 'Regulation Status',
    'class': 'fa-gavel',
    'texts': '',
    'edit': false,
    'title': 'Registered Regulation Status In Sources',
    'showSource': true
  },
  {
    'key': '',
    'value': '',
    'class': '',
    'texts': '',
    'edit': false,
    'title': '',
    'showSource': false
  },
  {
    'key': 'RegulationStatusEffectiveDate',
    'value': 'Regulation Status Effective Date',
    'class': 'fa-calendar',
    'texts': '',
    'edit': false,
    'title': 'Registered Regulation Status Effective Date In Sources',
    'showSource': true
  }],
  reportv2Data: {
    ['CDD_Process_and_CDD_Results_Fields']: [],
    ['information_recevied_from_ing']: [],
    ['party_information']: [],
    ['Party_Address_Details']: [],
    ['Registration_and_TAX_Details']: [],
    ['outreach_required']: '',
    ['level_due_diligence']: '',
    ['mlro_management_approval']: '',
    ['sourceOfFundOutreach']: '',
    ['Associated_Parties_QuesAns']: {},
    ['main_priociples_data']: [],
    ['sourceOfFundOutreachInfo']: '',
    ['regulated_by']: '',
    ['stock_exchange']: '',
    ['ticker_code']: '',
    ['legal_ultimate_parent']: '',
    ['#UHRC']: {
      selected: '',
      values: []
    },
    ['#Party/Customer Product Information']: [],
    ['#Party/Customer Activity – High Risk']: [],

    ['#Party/Customer_Product_InformationQuestionAns']: 'No',
    ['#Party/Customer_Activity_High_RiskQuestionAns']: 'No',
    ['#UBO_Identified_in_ownership']: 'No',
    ['#Main_principals_question']: 'No',
    ['#Principals_question']: 'No',
    ['#screeing_question']: 'No',
    ['#RiskRating']: '',
    ['#CountryRisk']: '',
    ['#Trade_Registration_No']: ''
  }


}
let basicSharedObject = {
  actualScreeningData: [],
  companyName: '',
  totalOfficers_link: [],
  org_structure_link: '',
  ceriSearchResultObject: {},
  addModelClassification: {
    companyModel: [],
    personModel: [],
    companyListData: [{ id: 1, label: "General Partner" }, { id: 2, label: "Director" }, { id: 3, label: "Intermediate Parent" }, { id: 4, label: "Ultimate Legal Parent" }],
    personListData: [{ id: 1, label: "General Partner" }, { id: 2, label: "Director" }, { id: 3, label: "Main Prinicipals" }, { id: 4, label: "Principals" }, { id: 5, label: "Pesudo UBO" }, { id: 6, label: "UBO" }],
    personRoleData: [{ id: 1, label: "Chief Executive Officer" }, { id: 2, label: "Chief Financial Officer" }, { id: 3, label: "Chief Operating Officer" }, { id: 4, label: "Chief Risk Officer" }, { id: 5, label: "Chief Compliance Officer" }, { id: 6, label: "Director" }, { id: 7, label: "Executive Board" }, { id: 8, label: "Management Board" }, { id: 10, label: "Vice President" }, { id: 11, label: "President" }, { id: 12, label: "Branch Manager" }, { id: 11, label: "Chairman" }],
    personRoleModel: [],
  },
  editModelClassification: {
    editPersonListData: [],
    editPersonModel: [],
    editCompanyModel: [],
    editCompanyListData: [],
    editRoleModel: [],
    editRoleData: []
  },
  screeningModelClassification: {
    screeningPersonRoleModel: [],
    screeningPersonRoleData: [],
    screeningPersonListData: [],
    screeningPersonModel: [],
    screeningCompanyListData: [],
    screeningCompanyModel: [],
  },
  subsidiaries: [{
    "name": '',
    "source_url": '',
    "subsidiaries": [],
    "natures_of_control": [],
    "parent_companies": []
  }],
  stockModalData: {
    top_owners: [],
    locations: [],
    top_mutual_holding: [],
    recent_institutional_activity: [],
    balance_sheet: {},
    total_assets: '',
    total_liabilities: '',
    long_term_debt: '',
    net_income: '',
    net_revenues: '',
    'net_cash_flow_-_operating_activities': '',
    'net_cash_flow_investing': '',
    'net_cash_flow_-_financing': '',
    income_statement: {},
    cash_flow_statement: {},
    stock_profile: {
      growth_and_valuation: {},
      today_trading: {},
      company_profile: {},
      competitors: [],
      other_values: [],
      financials: {}
    },
    company_profile: {
      data: {},
      shareholders: {}
    },
    'press_releases': [],
    'adverse_news': [],
    source: 'stocks.money.cnn.com'
  },
  yahooStockData: {
    company_profile: {
      data: {},
      keyStaff: []
    },
    stock_holders: {
      direct_holders_list: []
    },
    financial_statements: {
      financevalues: [],
      financedates: []
    },
    stock_graphs: {
      last_5year_stock_history: [],
      last_6month_stock_history: [],
      last_day_stock_history: [],
      last_year_stock_history: [],
      last_5d_stock_history: [],
      last_month_stock_history: []
    },
    stock_statistics: {
      dividends_Splits: {},
      stock_price_history: {},
      fiscal_year: {},
      profitability: {},
      balance_sheet: {},
      management_effectiveness: {},
      other_stock_values: {},
      cash_flow_statement: {},
      income_statement: {}
    },
    source: 'finance.yahoo.com'
  },
  tagCloudPopularOptions: {
    header: "MY ENTITIES",
    container: "#tagCloudPopularTags",
    height: 220,
    width: 300,
    data: [],
    margin: {
      bottom: 10,
      top: 10,
      right: 10,
      left: 10
    }
  },
  bloombergStockLineChartData: {
    'five year stock prices': [],
    'one year stock prices': [],
    'one month stock prices': [],
    'current day stock prices': []
  },
  list: {
    key_staff: [],
    'sex-offenders': [],
    'fbi_data': [],
    similar_companies: [],
    resolve_related_similar_companies: [],
    search_related_similar_companies: [],
    stocks_bloomberg_similar_companies: [],
    bloomberg_similar_companies: [],
    specialities: [],
    people_also_viewd: [],
    company_boardmembers: [],
    stock_company_boardmembers: [],
    company_key_executives: [],
    mixed_company_key_executives: [],
    stock_company_key_executives: [],
    other_board_members: [],
    corporate_governance_committee: [],
    nominating_committee: [],
    compensation_committee: [],
    audit_committee: [],
    industry: [],
    products: [],
    five_year_stock_prices: [],
    one_month_stock_prices: [],
    one_year_stock_prices: [],
    current_day_stock_prices: [],
    key_persons: [],
    stock_holders: [],
    recent_user_comments: [],
    stock_graphs: [],
    stock_statistics: [],
    financial_statements: [],
    news_articles: [],
    all_news_articles: [],
    following: [],
    followers: [],
    near_by_companies: [],
    has_returns: {},
    has_accounts: {},
    has_company_members: [],
    risidata: [],
    key_staff_attended_schools: [],
    key_relationships: [],
    supplierblacklist: {},
    badbbuyer_initial: true,
    scam: [],
    tradedAs: '',
    founders: '',
    services: '',
    key_people: '',
    exclusion_fraud: [],
    crimeList: {
      interpol: []
    },
    badbuyerslist: {},
    hunterData: {},
    blackhatworld: [],
    latestReleases: [],
    xforceibmcloud: [],
    domain_servers: [],
    locations: [],
    cypherpunk: [],
    reddit: [],
    ratings_trends: [],
    current_job_openings: [],
    sanctionssearch: [],
    imsasllc: [],
    unlimitedcriminalchecks: [],
    truecaller: [],
    meetupData: [],
    highcountryRisk: 0,
    'url_analysis': [],
    'fan_counts_numbric': 0,
    'fan_counts': 0,
    'followers_numberic': 0,
    'twitter_following_numberic': 0,
    'social_media_count': 0,
    'follower_following_count': [],
    'news_deep_web': [],
    'inc-us-eu': [],
    'companies-corporationwiki': [],
    'company_locations': [],
    'top_holders': [],
    'associated_companies': {
      'memberships': [],
      'owners': [],
      'leadership & staff': [],
      'services transactions': [],
      'political_financial_supports': [],
      'politicians': [],
      'political_organizations': [],
      'transaction': [],
      'child_organizations': [],
      'holdings': [],
      'donation_grant_recipients': []
    },
    'associated_persons': {
      'transaction': [],
      'lobbying': [],
      'hierarchy': [],
      'donation': [],
      'membership': [],
      'position': [],
      'ownership': [],
    },
    'connected_industries': [],
    'press_releases': [],
    'sanctionList': [],
    'adverse_news': [],
    'pep': [],
    'denied_personlist': [],
    'crimestoppers_uk': [],
    'answerstedhctbek': [],
    'related_persons_tags': true,
    'related_company_tags': true,
    'twitter_socket_network_chart': true,
    'social_followers_bubble_chart': true,
    'is_popular_tag_chart': true,
    'is_traffic_by_countries': true,
    'is_search_keywords': true,
    'is_traffic_by_domain': true,
    'is_badbuyerslist': true,
    tagCloudOrganizationNameList: [],
    'traffic_by_countries': [],
    'search_keywords': [],
    'local_ranking': [],
    'traffic_by_domain': [],
    videos_list: [],
    phoneno: [],
    topHeaderObject: {
      "vcard:organization-name": "",
      "date": "",
      "country": "",
      "RegulationStatus": "",
      "hasActivityStatus": "",
      "city": "",
      "international_securities_identifier": "",
      "source": "",
      "type": "",
      "lei:legalForm": "",
      "tr-org:hasHeadquartersFaxNumber": "",
      "@source-id": "",
      "ticket_symbol": "",
      "legal_entity_identifier": "",
      "main_exchange": "",
      "tr-org:hasLEI": "",
      "other_company_id_number": "",
      "bst:aka": "",
      "zip": "",
      "isDomiciledIn": "",
      "isIncorporatedIn": "",
      "tr-org:hasRegisteredPhoneNumber": "",
      "trade_register_number": "",
      "bst:registryURI": "",
      "bst:registrationId": "",
      "hasRegisteredFaxNumber": "",
      "source_screenshot": "",
      "tr-org:hasHeadquartersPhoneNumber": "",
      "CountryOperations": "",
      "zipcode": "",
      "hasURL": "",
      "bst:description": "",
      "bst:businessClassifier": "",
      "hasIPODate": "",
      "size": "",
      "european_vat_number": "",
      "streetAddress": "",
      "fullAddress": "",
      "vat_tax_number": "",
      "hasLatestOrganizationFoundedDate": "",
      "@identifier": "",
      "identifier": "",
      "industry": ''
    },
    isSignificant: false,//siginifiance false by default
    significantTitle: '',
    summaryCount: {
      highRiskCount: 0,
      financeCount: 0,
      adverseCount: 0,
      pepCount: 0,
      sanctionCount: 0
    },
    addEntitymodalChart: 'person',
    addActiveTab: 0,
    recognized_entity: {
      entityType: ""
    },
    graphviewIndex: 1,
    currentVLArendered: 'vlaContainer',
    orgChartSources: [],
    graphSourceSelected: '',
    intialSourceSelected: '',
    previousSourceSelected: '',
    sourceFirsttimeSelected: true,
    sourceFilterChart_not_Started: true,
    searchedSourceURLCompany: '',
    searchedSourceURLValuePerson: '',
    selectedScreeningRow: {},
    keymangerSourceselected: '',
    keymangerapplybutton: true,
    entityGooglePlusList: [],
    entityInstagramList: [],
    entityTwitterList: [],
    entityFacebookList: [],
    entityLinkedinList: [],
  },
  is_data_not_found: {
    is_data_leadership: true,
    is_stock_performance: true,
    is_traffic_by_country: true,
    is_traffic_key_word: true,
    is_traffic_bydomain: true,
    associated_company: true,
    board_of_director: true,
    is_committe: true,
    is_people_visited: true,
    is_nearby_company: true,
    is_company_member: true,
    is_topholders: true,
    is_balancesheet: true,
    is_incomeStatement: true,
    is_financialStatement: true,
    is_stockHistory: true,
    is_cyberalert: true,
    is_sanctionedlist: true,
    is_adversenews: true,
    is_indus_security_inc: true,
    is_latestnews: true,
    is_top_influencers: true,
    is_press_releases: true,
    is_recent_events: true,
    is_googlepost: true,
    is_linkedin_post: true,
    is_recentTweets: true,
    is_instagramlist: true,
    is_ratings_trends: true,
    is_facebook_list: true,
    is_twitter_list: true,
    is_carrer_opportuny: true,
    is_risk_ratio: true,
    is_politcal_donation: true,
    is_populartags: true,
    is_keyExecutive: true,
    is_networkgraph: true,
    is_interactionration: true,
    is_committe_audit: true,
    is_committe_compensation: true,
    is_committe_nominating: true,
    is_committe_corporate: true,
    is_shareholder: true,
    is_supplierlist: true,
    is_crimelist: true,
    is_sexoffender: true,
    is_deninedperson: true,
    is_exclusions: true,
    is_fbidata: true,
    is_investment: true,
    is_interlockdata: true,
    shareholder_div: false,
    stockprice_div: false,
    is_data_industry: true,
    is_bySource_pie: true,
    is_autodesk_Vla: true,
    is_autodesk_chart: false,
    is_rightScreening_data: true,
    is_rightadverseNews: true,
    is_complianceDetails: false
  },
  pageloader: {

    comapnyinformation: true,
    screeningLoader: true,
    directorsloader: true,
    coropoateloader: true,
    countriesloader: true,
    associatedDocumentloader: true,
    treeGraphloader: true,
    companyDetailsloader: true,
    loadingText: false,//loading flag is off by default
    disableFilters: false,//inital filters are clickable
    companyInfoReview: false,
    companyDocumentsReview: false,
    companyIdentifiersReview: true,
    companyOperationReview: false,
    companyStructureReview: false,
    companyResultsReview: false,
    companyDetailsReview: false,
    chartFailureMessage: '',
    locationHourLoader: true
  },
  // bloombergChartDetailsOptions : {
  //     container: "#bloomberg-line-chart-details",
  //     height: '350',
  //     width: $("#bloomberg-line-chart-details").width(),
  //     uri: "../vendor/data/bloombergdata.json",
  //     data: {}
  // },
  filteredChart: {
    company_eachlevel: [5, 10, 20, 30, 40, 50],
    numberofcomapnies: 5,
    numberOfLevel: [1, 5, 10, 15, 20, 30],
    selectedNumberofLevel: 5,
    risklevel: ["low", "high"],
    riskRatio: 1,
    applyButton: true,
    yearliderMinValue: 0,
    yearsliderMaxValue: 2,
    fromyear: ((new Date().getFullYear()) + '-' + (("0" + (new Date().getMonth() + 1)).slice(-2)) + '-' + ("0" + (new Date().getDate())).slice(-2)),
    toyear: ((new Date().getFullYear() - 2) + '-' + (("0" + (new Date().getMonth() + 1)).slice(-2)) + '-' + ("0" + (new Date().getDate())).slice(-2)),
    startYear: 0,
    endYear: 2,
    show_subsidaries_filter: false,
    pep_slider_min: 85,
    pep_slider_max: 100,
    sanction_slider_min: 70,
    sanction_slider_max: 100,
    not_screening: true
  },
  newOfficer: {
    firstName: '',
    lastName: '',
    country: '',
    dob: '',
    ScreeeningModal: 'person',
    CompanyName: '',
    website: '',
    requiredComapnyname: false,
    requiredPersonname: false,
    dateOfBirth: ''
  },
  tagCloudPersonOptions: {
    header: "MY ENTITIES",
    container: "#tagcloudCompanyPerson",
    height: 200,
    width: 300,
    data: [],
    margin: {
      bottom: 10,
      top: 10,
      right: 10,
      left: 10
    },
    domain: {
      x: 1,
      y: 10000
    },
  },
  'riskScoreData': [],
  entites_renderedIn_chart: [],
  curr_time_to_20min: new Date(),
  overViewDataLinksUrls: {},
}

let common = function () {
  this.sourceUrl = "";
  this.valueRef = "";
  this.primarySource = [];
  this.isUserData = '';
  this.sourceDisplayName = "";
  this.isOverriddenData = '';
  this.conflicts = [];
  this.credibility = 0,
    this.source = "";
  this.secondarySource = [];
  this.sourceRef = "";
  this.value = "";
  this.value2 = "";
}
let complianceObject = {
  "vcard:organization-name": new common(),
  "date": new common(),
  "country": new common(),
  "hasActivityStatus": new common(),
  "city": new common(),
  "international_securities_identifier": new common(),
  "source": new common(),
  "type": new common(),
  "lei:legalForm": new common(),
  "tr-org:hasHeadquartersFaxNumber": new common(),
  "@source-id": new common(),
  "ticket_symbol": new common(),
  "legal_entity_identifier": new common(),
  "main_exchange": new common(),
  "tr-org:hasLEI": new common(),
  "other_company_id_number": new common(),
  "zip": new common(),
  "isDomiciledIn": new common(),
  "tr-org:hasRegisteredPhoneNumber": new common(),
  "trade_register_number": new common(),
  "bst:registryURI": new common(),
  "bst:registrationId": new common(),
  "hasRegisteredFaxNumber": new common(),
  "source_screenshot": new common(),
  "tr-org:hasHeadquartersPhoneNumber": new common(),
  "CountryOperations": new common(),
  "zipcode": new common(),
  "hasURL": new common(),
  "bst:description": new common(),
  "bst:businessClassifier": new common(),
  "hasIPODate": new common(),
  "size": new common(),
  "european_vat_number": new common(),
  "streetAddress": new common(),
  "fullAddress": new common(),
  "vat_tax_number": new common(),
  "hasLatestOrganizationFoundedDate": new common(),
  "isIncorporatedIn": new common()
}

let entityChartSharedObject = {
  bubbleSocialOptions: {
    "container": "#socialBubbleChart",
    "height": 310,
    data: {
      name: '',
      children: []
    }
  },
  twitter_tag_words: [],
  tagCloudTwitterTagsOptions: {
    header: "MY ENTITIES",
    container: "#tagcloudCompanyTwitterTags",
    height: 200,
    width: ($("#tagcloudCompanyTwitterTags").width() ? $("#tagcloudCompanyTwitterTags").width() : 300),
    data: [],
    margin: {
      bottom: 10,
      top: 10,
      right: 10,
      left: 10
    }
  },
  'financeData': {},
  'officerData': {
    officership: []
  },
  'vlaDataArr': {},
  'dataWithDate': {},
  'tagCloudNameList': [],
  'comapnyInfo': {},
  'social_activity_locations': [],
  'locationList': []
},
  countriesData: any[] = [],
  fetchLink_officershipScreeningData: any[] = [],
  dummyscreeening: any = {
    "data": [
      {
        "country": "Germany",
        "sources": [
          "finance.yahoo.com",
          "BST",
          "boerse-frankfurt.de",
          "boerse-muenchen.de",
          "boerse-duesseldorf.de"
        ],

        "jurisdiction": "DE",
        "innerSource": "BST",
        "parentIds": [
          {
            "indircetPercentage": 0,
            "from": "2017-03-31",
            "source": "AR",
            "parentId": "GB00237958",
            "totalPercentage": 0
          },
          {
            "indircetPercentage": 0.7,
            "from": "2016-02-26",
            "source": "ZP",
            "parentId": "GBOC388966",
            "totalPercentage": 0.7
          },
          {
            "indircetPercentage": 20,
            "from": "2017-12-31",
            "source": "WW",
            "parentId": "DE*110007791477",
            "totalPercentage": 20
          },
          {
            "indircetPercentage": 17,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "DE6070561511",
            "totalPercentage": 17
          },
          {
            "indircetPercentage": 0.15,
            "from": "2018-04-30",
            "source": "FS",
            "parentId": "US149144472L",
            "totalPercentage": 0.15
          },
          {
            "indircetPercentage": 0,
            "from": "2018-05-31",
            "source": "DN",
            "parentId": "NG11301R",
            "totalPercentage": 0
          },
          {
            "indircetPercentage": 0,
            "from": "2017-06-30",
            "source": "AR",
            "parentId": "MU30031AO",
            "totalPercentage": 0
          },
          {
            "indircetPercentage": 52.2,
            "from": "2017-12-31",
            "source": "WW",
            "parentId": "DE7330003759",
            "totalPercentage": 52.2
          },
          {
            "indircetPercentage": 1.01,
            "from": "2015-09-29",
            "source": "ZP",
            "parentId": "IE489713",
            "totalPercentage": 1.01
          },
          {
            "indircetPercentage": 0,
            "from": "2017-06-30",
            "source": "AR",
            "parentId": "GB00024299",
            "totalPercentage": 0
          },
          {
            "indircetPercentage": 0,
            "from": "2016-06-30",
            "source": "AR",
            "parentId": "MU*1550137554",
            "totalPercentage": 0
          },
          {
            "indircetPercentage": 1.35,
            "from": "2018-05-31",
            "source": "FS",
            "parentId": "NO*J00S1220",
            "totalPercentage": 1.35
          },
          {
            "indircetPercentage": 0.14,
            "from": "2018-06-06",
            "source": "FS",
            "parentId": "US320174431",
            "totalPercentage": 0.14
          },
          {
            "indircetPercentage": 0,
            "from": "2016-12-31",
            "source": "HO",
            "parentId": "IT01071060162",
            "totalPercentage": 0
          },
          {
            "indircetPercentage": 0,
            "from": "2016-12-31",
            "source": "WW",
            "parentId": "FI05332979",
            "totalPercentage": 0
          },
          {
            "indircetPercentage": 17,
            "from": "2017-12-31",
            "source": "WW",
            "parentId": "QA0000119769",
            "totalPercentage": 17
          },
          {
            "role": "",
            "indircetPercentage": 50,
            "isCustom": true,
            "from": "2019-09-04",
            "source": "permid.org",
            "basic": {
              "vcard:organization-name": "dddddddd",
              "sourceUrl": "https://permid.org",
              "isDomiciledIn": "",
              "hasURL": "",
              "entity_type": "C",
              "mdaas:RegisteredAddress": {
                "zip": "",
                "country": "",
                "streetAddress": "",
                "city": "",
                "fullAddress": ""
              },
              "created_at": "2019-09-04 06:36:52",
              "dateOfBirth": "",
              "source": "element"
            },
            "classification": "",
            "user": "permid.org",
            "parentId": "b65582c1-2930-47bf-ac3f-6d46e2d918ff",
            "totalPercentage": 50
          },
          {
            "role": "",
            "indircetPercentage": 52.2,
            "isCustom": true,
            "from": "2017-12-31",
            "source": "",
            "basic": {
              "vcard:organization-name": "Porsche Automobil Holding SE",
              "sourceUrl": "",
              "isDomiciledIn": "DE",
              "hasURL": "www.porsche-se.com",
              "entity_type": "C",
              "mdaas:RegisteredAddress": {
                "zip": "",
                "country": "",
                "streetAddress": "",
                "city": "",
                "fullAddress": ""
              },
              "created_at": "2019-09-03 12:41:10",
              "dateOfBirth": "",
              "source": "element"
            },
            "classification": "",
            "user": "",
            "parentId": "2dde87b1-05b0-4403-b3a5-7bdc5049bb83",
            "totalPercentage": 52.2
          }
        ],
        "title": "Volkswagen AG",
        "screeningFlag": true,
        "bvdId": "DE2070000543",
        "id": "p00",
        "totalPercentage": 100,
        "identifier": "de0007664039",
        "level": 0,
        "source_evidence": "BST",
        "entity_id": "orgChartmainEntity",
        "classification": "[\"Main Prinicipals\",\"Pesudo UBO\",\"UBO\",\"Director\",\"General Partner\"]",
        "hasURL": "www.volkswagenag.com",
        "is-error": false,
        "entity_type": "organization",
        "isCustom": false,
        "name": "Volkswagen AG",
        "subsidiaries": [],
        "basic": {
          "vcard:organization-name": "Volkswagen Aktiengesellschaft",
          "isDomiciledIn": "DE",
          "hasURL": "www.volkswagenag.com",
          "mdaas:RegisteredAddress": {
            "zip": "38440",
            "country": "Germany",
            "streetAddress": "Berliner Ring 2",
            "city": "Wolfsburg",
            "fullAddress": "Berliner Ring 2 Wolfsburg Germany 38440"
          }
        },
        "isSubsidiarie": false,
        "indirectPercentage": 100,
        "parents": [
          "p17",
          "p116",
          "p117"
        ],
        "status": "inprogress"
      },
      {
        "country": "Germany",
        "jurisdiction": "DE",
        "innerSource": "Company Website",
        "parentIds": [
          {
            "indircetPercentage": 52.2,
            "from": "2017-11-09",
            "source": "AR",
            "parentId": "DE7330220574",
            "totalPercentage": 100
          },
          {
            "indircetPercentage": 52.2,
            "from": "2016-03-24",
            "source": "WW",
            "parentId": "DE*850267597",
            "totalPercentage": 100
          }
        ],
        "title": "Porsche Automobil Holding SE",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "id": "p00",
            "indirectPercentage": 52.2,
            "totalPercentage": 52.2
          }
        ],
        "bvdId": "DE7330003759",
        "from": "2017-12-31",
        "id": "p17",
        "totalPercentage": 52.2,
        "identifier": "DE7330003759",
        "level": 1,
        "source_evidence": "BST",
        "entity_id": "orgChartParentEntity",
        "hasURL": "www.porsche-se.com",
        "entity_type": "organization",
        "childIdentifier": "DE2070000543",
        "isCustom": false,
        "name": "Porsche Automobil Holding SE",
        "isConflict": true,
        "subsidiaries": [],
        "childLevel": 0,
        "basic": {
          "vcard:organization-name": "Porsche Automobil Holding SE",
          "isDomiciledIn": "DE",
          "hasURL": "www.porsche-se.com",
          "mdaas:RegisteredAddress": {
            "zip": "70435",
            "country": "Germany",
            "streetAddress": "Porscheplatz 1",
            "city": "Stuttgart",
            "fullAddress": "Porscheplatz 1 Stuttgart Germany 70435"
          }
        },
        "isSubsidiarie": false,
        "indirectPercentage": 52.2,
        "parents": [
          "p281",
          "p282"
        ],
        "child": "p00"
      },
      {
        "country": "",
        "role": "",
        "jurisdiction": "",
        "parentIds": [],
        "title": "dddddddd",
        "sourceUrl": "https://permid.org",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "id": "p00",
            "indirectPercentage": 50,
            "totalPercentage": 50
          }
        ],
        "bvdId": "b65582c1-2930-47bf-ac3f-6d46e2d918ff",
        "from": "2019-09-04",
        "id": "p116",
        "totalPercentage": 50,
        "identifier": "b65582c1-2930-47bf-ac3f-6d46e2d918ff",
        "level": 1,
        "source_evidence": "permid.org",
        "dateOfBirth": "",
        "entity_id": "orgChartParentEntity",

        "hasURL": "",
        "entity_type": "organization",
        "childIdentifier": "DE2070000543",
        "isCustom": true,
        "name": "dddddddd",
        "isConflict": true,
        "subsidiaries": [],
        "childLevel": 0,
        "classification": "[\"Main Prinicipals\",\"Pesudo UBO\",\"UBO\",\"Director\",\"General Partner\"]",
        "sources": [
          "finance.yahoo.com",
          "BST",
          "boerse-frankfurt.de",
          "boerse-muenchen.de",
          "boerse-duesseldorf.de"
        ],
        "basic": {
          "vcard:organization-name": "dddddddd",
          "sourceUrl": "https://permid.org",
          "isDomiciledIn": "",
          "hasURL": "",
          "entity_type": "C",
          "mdaas:RegisteredAddress": {
            "zip": "",
            "country": "",
            "streetAddress": "",
            "city": "",
            "fullAddress": ""
          },
          "created_at": "2019-09-04 06:36:52",
          "dateOfBirth": "",
          "source": "element"
        },
        "isSubsidiarie": false,
        "indirectPercentage": 50,
        "parents": [],
        "child": "p00"
      },
      {
        "country": "",
        "role": "",
        "jurisdiction": "DE",
        "parentIds": [
          {
            "role": "",
            "indircetPercentage": 26.1,
            "isCustom": true,
            "from": "2019-09-04",
            "source": "weekly",
            "basic": {
              "vcard:organization-name": "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
              "sourceUrl": "http://weekly.ahram.org.eg/",
              "isDomiciledIn": "ru",
              "hasURL": "",
              "entity_type": "C",
              "updated_at": "2019-09-09 05:20:43",
              "mdaas:RegisteredAddress": {
                "zip": "",
                "country": "",
                "streetAddress": "",
                "city": "",
                "fullAddress": ""
              },
              "created_at": "2019-09-04 06:09:51",
              "dateOfBirth": "",
              "source": "element"
            },
            "classification": "",
            "user": "weekly",
            "parentId": "fc4a9d98-d036-4b4f-b402-b0f2c49b6ddb",
            "totalPercentage": 50
          },
          {
            "role": "",
            "indircetPercentage": 52.2,
            "isCustom": true,
            "from": "2016-03-24",
            "source": "",
            "basic": {
              "vcard:organization-name": "Familien Porsche/Piech",
              "sourceUrl": "",
              "isDomiciledIn": "DE",
              "hasURL": "",
              "entity_type": "I",
              "mdaas:RegisteredAddress": {
                "zip": "",
                "country": "",
                "streetAddress": "",
                "city": "",
                "fullAddress": ""
              },
              "created_at": "2019-09-03 12:41:11",
              "dateOfBirth": "",
              "source": "element"
            },
            "classification": "",
            "user": "",
            "parentId": "8dea39ba-1470-42d2-b67b-2cb13b6dabbc",
            "totalPercentage": 100
          },
          {
            "role": "",
            "indircetPercentage": 52.2,
            "isCustom": true,
            "from": "2017-11-09",
            "source": "",
            "basic": {
              "vcard:organization-name": "Porsche Gesellschaft mit beschraenkter Haftung",
              "sourceUrl": "",
              "isDomiciledIn": "DE",
              "hasURL": "",
              "entity_type": "C",
              "mdaas:RegisteredAddress": {
                "zip": "",
                "country": "",
                "streetAddress": "",
                "city": "",
                "fullAddress": ""
              },
              "created_at": "2019-09-03 12:41:11",
              "dateOfBirth": "",
              "source": "element"
            },
            "classification": "",
            "user": "",
            "parentId": "881b36df-6bae-48e6-bdf1-e064a9342216",
            "totalPercentage": 100
          }
        ],
        "title": "Porsche Automobil Holding SE",
        "sourceUrl": "",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "id": "p00",
            "indirectPercentage": 52.2,
            "totalPercentage": 52.2
          }
        ],
        "bvdId": "2dde87b1-05b0-4403-b3a5-7bdc5049bb83",
        "from": "2017-12-31",
        "id": "p117",
        "totalPercentage": 52.2,
        "identifier": "2dde87b1-05b0-4403-b3a5-7bdc5049bb83",
        "level": 1,
        "source_evidence": "",
        "dateOfBirth": "",
        "entity_id": "orgChartParentEntity",
        "classification": "",
        "hasURL": "www.porsche-se.com",
        "entity_type": "organization",
        "childIdentifier": "DE2070000543",
        "isCustom": true,
        "name": "Porsche Automobil Holding SE",
        "isConflict": true,
        "subsidiaries": [],
        "childLevel": 0,
        "basic": {
          "vcard:organization-name": "Porsche Automobil Holding SE",
          "sourceUrl": "",
          "isDomiciledIn": "DE",
          "hasURL": "www.porsche-se.com",
          "entity_type": "C",
          "mdaas:RegisteredAddress": {
            "zip": "",
            "country": "",
            "streetAddress": "",
            "city": "",
            "fullAddress": ""
          },
          "created_at": "2019-09-03 12:41:10",
          "dateOfBirth": "",
          "source": "element"
        },
        "isSubsidiarie": false,
        "indirectPercentage": 52.2,
        "parents": [
          "p2179",
          "p2180",
          "p2181"
        ],
        "child": "p00",
        "status": "inprogress"
      },
      {
        "country": "Germany",
        "jurisdiction": "DE",
        "innerSource": "Annual Report",
        "parentIds": [
          {
            "indircetPercentage": 2.26026,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT*110158516109",
            "totalPercentage": 4.33
          },
          {
            "indircetPercentage": 1.12752,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT*110005497091",
            "totalPercentage": 2.16
          },
          {
            "indircetPercentage": 2.5003800000000003,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "DE*110137894528",
            "totalPercentage": 4.79
          },
          {
            "indircetPercentage": 0.43326,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT*110001301506",
            "totalPercentage": 0.83
          },
          {
            "indircetPercentage": 1.12752,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT*772849144",
            "totalPercentage": 2.16
          },
          {
            "indircetPercentage": 2.5003800000000003,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT*110178946830",
            "totalPercentage": 4.79
          },
          {
            "indircetPercentage": 33.147000000000006,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT9130018626",
            "totalPercentage": 63.5
          },
          {
            "indircetPercentage": 9.082799999999999,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "DE8330373001",
            "totalPercentage": 17.4
          }
        ],
        "title": "Porsche Gesellschaft mit beschraenkter Haftung",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "id": "p17",
            "indirectPercentage": 52.2,
            "totalPercentage": 100
          }
        ],
        "bvdId": "DE7330220574",
        "from": "2017-11-09",
        "id": "p281",
        "totalPercentage": 100,
        "identifier": "DE7330220574",
        "level": 2,
        "source_evidence": "BST",
        "entity_id": "orgChartParentEntity",
        "entity_type": "organization",
        "childIdentifier": "DE7330003759",
        "isCustom": false,
        "name": "Porsche Gesellschaft mit beschraenkter Haftung",
        "isConflict": true,
        "subsidiaries": [],
        "childLevel": 1,
        "basic": {
          "vcard:organization-name": "Porsche Gesellschaft mit beschraenkter Haftung",
          "isDomiciledIn": "DE",
          "mdaas:RegisteredAddress": {
            "zip": "82031",
            "country": "Germany",
            "streetAddress": "Toelzer Str. 1",
            "city": "Gruenwald",
            "fullAddress": "Toelzer Str. 1 Gruenwald Germany 82031"
          }
        },
        "isSubsidiarie": false,
        "indirectPercentage": 52.2,
        "parents": [
          "p386"
        ],
        "child": "p17"
      },
      {
        "country": "",
        "isUbo": true,
        "jurisdiction": "DE",
        "innerSource": "Company Website",
        "parentIds": [],
        "title": "Familien Porsche/Piech",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "level": 1,
            "id": "p17",
            "indirectPercentage": 52.2,
            "isDirect": true,
            "totalPercentage": 100
          }
        ],
        "bvdId": "DE*850267597",
        "from": "2016-03-24",
        "id": "p282",
        "totalPercentage": 100,
        "identifier": "DE*850267597",
        "level": 2,
        "source_evidence": "BST",
        "entity_id": "orgChartParentEntity",
        "entity_type": "person",
        "childIdentifier": "DE7330003759",
        "isCustom": false,
        "name": "Familien Porsche/Piech",
        "isConflict": true,
        "subsidiaries": [],
        "childLevel": 1,
        "basic": {
          "vcard:hasName": "Familien Porsche/Piech"
        },
        "isSubsidiarie": false,
        "indirectPercentage": 52.2,
        "parents": [],
        "child": "p17"
      },
      {
        "country": "",
        "role": "",
        "jurisdiction": "ru",
        "parentIds": [],
        "title": "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "sourceUrl": "http://weekly.ahram.org.eg/",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "id": "p117",
            "indirectPercentage": 26.1,
            "totalPercentage": 50
          }
        ],
        "bvdId": "fc4a9d98-d036-4b4f-b402-b0f2c49b6ddb",
        "from": "2019-09-04",
        "id": "p2179",
        "totalPercentage": 50,
        "identifier": "fc4a9d98-d036-4b4f-b402-b0f2c49b6ddb",
        "level": 2,
        "source_evidence": "weekly",
        "dateOfBirth": "",
        "entity_id": "orgChartParentEntity",
        "classification": "",
        "hasURL": "",
        "entity_type": "organization",
        "childIdentifier": "2dde87b1-05b0-4403-b3a5-7bdc5049bb83",
        "isCustom": true,
        "name": "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "isConflict": true,
        "subsidiaries": [],
        "childLevel": 1,
        "basic": {
          "vcard:organization-name": "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
          "sourceUrl": "http://weekly.ahram.org.eg/",
          "isDomiciledIn": "ru",
          "hasURL": "",
          "entity_type": "C",
          "updated_at": "2019-09-09 05:20:43",
          "mdaas:RegisteredAddress": {
            "zip": "",
            "country": "",
            "streetAddress": "",
            "city": "",
            "fullAddress": ""
          },
          "created_at": "2019-09-04 06:09:51",
          "dateOfBirth": "",
          "source": "element"
        },
        "isSubsidiarie": false,
        "indirectPercentage": 26.1,
        "parents": [],
        "child": "p117"
      },
      {
        "country": "",
        "role": "",
        "isUbo": true,
        "jurisdiction": "DE",
        "parentIds": [
          {
            "role": "",
            "indircetPercentage": 26.1,
            "isCustom": true,
            "from": "2019-09-04",
            "source": "1prime",
            "basic": {
              "vcard:organization-name": "aoiii",
              "sourceUrl": "http://www.1prime.biz/",
              "isDomiciledIn": "ES",
              "hasURL": "",
              "entity_type": "C",
              "mdaas:RegisteredAddress": {
                "zip": "",
                "country": "",
                "streetAddress": "",
                "city": "",
                "fullAddress": ""
              },
              "created_at": "2019-09-04 05:49:16",
              "dateOfBirth": "",
              "source": "element"
            },
            "classification": "",
            "user": "1prime",
            "parentId": "d99ec075-7f7e-4ca1-b64b-a5d76d30df0b",
            "totalPercentage": 50
          },
          {
            "role": "",
            "indircetPercentage": 26.1,
            "isCustom": true,
            "from": "2019-09-04",
            "source": "companyhouse.co.uk",
            "basic": {
              "vcard:organization-name": "aaaaaa",
              "sourceUrl": "https://companyhouse.co.uk",
              "isDomiciledIn": "",
              "hasURL": "",
              "entity_type": "C",
              "mdaas:RegisteredAddress": {
                "zip": "",
                "country": "",
                "streetAddress": "",
                "city": "",
                "fullAddress": ""
              },
              "created_at": "2019-09-04 04:51:08",
              "dateOfBirth": "",
              "source": "element"
            },
            "classification": "",
            "user": "companyhouse.co.uk",
            "parentId": "fa0b6918-ca7d-4a1a-8b6c-2ca45fec4b40",
            "totalPercentage": 50
          },
          {
            "role": "",
            "indircetPercentage": 26.1,
            "isCustom": true,
            "from": "2019-09-04",
            "source": "companyhouse.co.uk",
            "basic": {
              "vcard:organization-name": "aaaaa1111111111111",
              "sourceUrl": "https://companyhouse.co.uk",
              "isDomiciledIn": "",
              "hasURL": "",
              "entity_type": "I",
              "mdaas:RegisteredAddress": {
                "zip": "",
                "country": "",
                "streetAddress": "",
                "city": "",
                "fullAddress": ""
              },
              "created_at": "2019-09-04 05:32:16",
              "dateOfBirth": "",
              "source": "element"
            },
            "classification": "",
            "user": "companyhouse.co.uk",
            "parentId": "e60ab61a-ab48-4db3-a538-b7a82ea7cddf",
            "totalPercentage": 50
          },
          {
            "role": "",
            "indircetPercentage": 26.1,
            "isCustom": true,
            "from": "2019-09-04",
            "source": "companyhouse.co.uk",
            "basic": {
              "vcard:organization-name": "lllll",
              "sourceUrl": "https://companyhouse.co.uk",
              "isDomiciledIn": "RU",
              "hasURL": "",
              "entity_type": "C",
              "mdaas:RegisteredAddress": {
                "zip": "",
                "country": "",
                "streetAddress": "",
                "city": "",
                "fullAddress": ""
              },
              "created_at": "2019-09-04 04:34:16",
              "dateOfBirth": "",
              "source": "element"
            },
            "classification": "",
            "user": "companyhouse.co.uk",
            "parentId": "089ca2e1-2786-4ee5-b3db-eac37c0ab80c",
            "totalPercentage": 50
          }
        ],
        "title": "Familien Porsche/Piech",
        "sourceUrl": "",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "level": 1,
            "id": "p117",
            "indirectPercentage": 52.2,
            "isDirect": true,
            "totalPercentage": 100
          }
        ],
        "bvdId": "8dea39ba-1470-42d2-b67b-2cb13b6dabbc",
        "from": "2016-03-24",
        "id": "p2180",
        "totalPercentage": 100,
        "identifier": "8dea39ba-1470-42d2-b67b-2cb13b6dabbc",
        "level": 2,
        "source_evidence": "",
        "dateOfBirth": "",
        "entity_id": "orgChartParentEntity",
        "classification": "",
        "hasURL": "",
        "entity_type": "person",
        "childIdentifier": "2dde87b1-05b0-4403-b3a5-7bdc5049bb83",
        "isCustom": true,
        "name": "Familien Porsche/Piech",
        "isConflict": true,
        "subsidiaries": [],
        "childLevel": 1,
        "basic": {
          "vcard:organization-name": "Familien Porsche/Piech",
          "sourceUrl": "",
          "isDomiciledIn": "DE",
          "hasURL": "",
          "entity_type": "I",
          "mdaas:RegisteredAddress": {
            "zip": "",
            "country": "",
            "streetAddress": "",
            "city": "",
            "fullAddress": ""
          },
          "created_at": "2019-09-03 12:41:11",
          "dateOfBirth": "",
          "source": "element"
        },
        "isSubsidiarie": false,
        "indirectPercentage": 52.2,
        "parents": [
          "p31087",
          "p31088",
          "p31089",
          "p31090"
        ],
        "child": "p117"
      },
      {
        "country": "",
        "role": "",
        "jurisdiction": "DE",
        "parentIds": [
          {
            "role": "",
            "indircetPercentage": 52.2,
            "isCustom": true,
            "from": "2019-09-03",
            "source": "companyhouse.co.uk",
            "basic": {
              "vcard:organization-name": "sssssssss",
              "sourceUrl": "https://companyhouse.co.uk",
              "isDomiciledIn": "nl",
              "hasURL": "",
              "entity_type": "C",
              "updated_at": "2019-09-03 12:50:09",
              "mdaas:RegisteredAddress": {
                "zip": "",
                "country": "",
                "streetAddress": "",
                "city": "",
                "fullAddress": ""
              },
              "created_at": "2019-09-03 12:47:26",
              "dateOfBirth": "",
              "source": "element"
            },
            "classification": "[\"General Partner\",\"Director\",\"Intermediate Parent\",\"Ultimate Legal Parent\"]",
            "user": "companyhouse.co.uk",
            "parentId": "739a9808-cc71-4e01-a1fa-7b50f829667e",
            "totalPercentage": 100
          },
          {
            "role": "",
            "indircetPercentage": 33.147000000000006,
            "isCustom": true,
            "from": "2018-05-01",
            "source": "",
            "basic": {
              "vcard:organization-name": "Porsche Gesellschaft m.b.H.",
              "sourceUrl": "",
              "isDomiciledIn": "AT",
              "hasURL": "www.porsche.at",
              "entity_type": "C",
              "mdaas:RegisteredAddress": {
                "zip": "",
                "country": "",
                "streetAddress": "",
                "city": "",
                "fullAddress": ""
              },
              "created_at": "2019-09-03 12:41:12",
              "dateOfBirth": "",
              "source": "element"
            },
            "classification": "",
            "user": "",
            "parentId": "302c5c97-65a0-4947-b3c8-60c9743ee188",
            "totalPercentage": 63.5
          },
          {
            "role": "",
            "indircetPercentage": 26.1,
            "isCustom": true,
            "from": "2019-09-03",
            "source": "alquds",
            "basic": {
              "vcard:organization-name": "aaaaaa",
              "sourceUrl": "http://www.alquds.co.uk",
              "isDomiciledIn": "NL",
              "hasURL": "",
              "entity_type": "C",
              "mdaas:RegisteredAddress": {
                "zip": "",
                "country": "",
                "streetAddress": "",
                "city": "",
                "fullAddress": ""
              },
              "created_at": "2019-09-03 13:06:57",
              "dateOfBirth": "",
              "source": "element"
            },
            "classification": "",
            "user": "alquds",
            "parentId": "5e5400d5-b8b2-4ad8-925e-55063ef58b5a",
            "totalPercentage": 50
          }
        ],
        "title": "Porsche Gesellschaft mit beschraenkter Haftung",
        "sourceUrl": "",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "id": "p117",
            "indirectPercentage": 52.2,
            "totalPercentage": 100
          }
        ],
        "bvdId": "881b36df-6bae-48e6-bdf1-e064a9342216",
        "from": "2017-11-09",
        "id": "p2181",
        "totalPercentage": 100,
        "identifier": "881b36df-6bae-48e6-bdf1-e064a9342216",
        "level": 2,
        "source_evidence": "",
        "dateOfBirth": "",
        "entity_id": "orgChartParentEntity",
        "classification": "",
        "hasURL": "",
        "entity_type": "organization",
        "childIdentifier": "2dde87b1-05b0-4403-b3a5-7bdc5049bb83",
        "isCustom": true,
        "name": "Porsche Gesellschaft mit beschraenkter Haftung",
        "isConflict": true,
        "subsidiaries": [],
        "childLevel": 1,
        "basic": {
          "vcard:organization-name": "Porsche Gesellschaft mit beschraenkter Haftung",
          "sourceUrl": "",
          "isDomiciledIn": "DE",
          "hasURL": "",
          "entity_type": "C",
          "mdaas:RegisteredAddress": {
            "zip": "",
            "country": "",
            "streetAddress": "",
            "city": "",
            "fullAddress": ""
          },
          "created_at": "2019-09-03 12:41:11",
          "dateOfBirth": "",
          "source": "element"
        },
        "isSubsidiarie": false,
        "indirectPercentage": 52.2,
        "parents": [
          "p31091",
          "p31092",
          "p31093"
        ],
        "child": "p117",
        "status": "inprogress"
      },
      {
        "country": "Austria",
        "jurisdiction": "AT",
        "innerSource": "Creditreform",
        "parentIds": [
          {
            "indircetPercentage": 33.147000000000006,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT9130066333",
            "totalPercentage": 100
          }
        ],
        "title": "Porsche Gesellschaft m.b.H.",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "id": "p281",
            "indirectPercentage": 33.147000000000006,
            "totalPercentage": 63.5
          }
        ],
        "bvdId": "AT9130018626",
        "from": "2018-05-01",
        "id": "p386",
        "totalPercentage": 63.5,
        "identifier": "AT9130018626",
        "level": 3,
        "source_evidence": "BST",
        "entity_id": "orgChartParentEntity",
        "hasURL": "www.porsche.at",
        "entity_type": "organization",
        "childIdentifier": "DE7330220574",
        "isCustom": false,
        "name": "Porsche Gesellschaft m.b.H.",
        "subsidiaries": [],
        "childLevel": 2,
        "basic": {
          "vcard:organization-name": "Porsche Gesellschaft m.b.H.",
          "isDomiciledIn": "AT",
          "hasURL": "www.porsche.at",
          "mdaas:RegisteredAddress": {
            "zip": "5020",
            "country": "Austria",
            "streetAddress": "Luise-Piech-Str. 2",
            "city": "Salzburg",
            "fullAddress": "Luise-Piech-Str. 2 Salzburg Austria 5020"
          }
        },
        "isSubsidiarie": false,
        "indirectPercentage": 33.147000000000006,
        "parents": [
          "p4373"
        ],
        "child": "p281"
      },
      {
        "country": "",
        "role": "",
        "jurisdiction": "ES",
        "parentIds": [
          {
            "role": "",
            "indircetPercentage": 26.1,
            "isCustom": true,
            "from": "2019-09-04",
            "source": "test santhi",
            "basic": {
              "vcard:organization-name": "santhi",
              "sourceUrl": "http://ddddd.com",
              "isDomiciledIn": "sg",
              "hasURL": "",
              "entity_type": "I",
              "updated_at": "2019-09-04 09:19:49",
              "mdaas:RegisteredAddress": {
                "zip": "",
                "country": "",
                "streetAddress": "",
                "city": "",
                "fullAddress": ""
              },
              "created_at": "2019-09-04 09:18:30",
              "dateOfBirth": "1234-02-02",
              "source": "element"
            },
            "classification": "[\"Main Prinicipals\",\"Pesudo UBO\",\"UBO\",\"Director\",\"General Partner\"]",
            "user": "test santhi",
            "parentId": "790938c7-bc80-447c-8d8b-3ab8e9ceaffb",
            "totalPercentage": 100
          }
        ],
        "title": "aoiii",
        "sourceUrl": "http://www.1prime.biz/",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "id": "p2180",
            "indirectPercentage": 26.1,
            "totalPercentage": 50
          }
        ],
        "bvdId": "d99ec075-7f7e-4ca1-b64b-a5d76d30df0b",
        "from": "2019-09-04",
        "id": "p31087",
        "totalPercentage": 50,
        "identifier": "d99ec075-7f7e-4ca1-b64b-a5d76d30df0b",
        "level": 3,
        "source_evidence": "1prime",
        "dateOfBirth": "",
        "entity_id": "orgChartParentEntity",
        "classification": "",
        "hasURL": "",
        "entity_type": "organization",
        "childIdentifier": "8dea39ba-1470-42d2-b67b-2cb13b6dabbc",
        "isCustom": true,
        "name": "aoiii",
        "isConflict": true,
        "subsidiaries": [],
        "childLevel": 2,
        "basic": {
          "vcard:organization-name": "aoiii",
          "sourceUrl": "http://www.1prime.biz/",
          "isDomiciledIn": "ES",
          "hasURL": "",
          "entity_type": "C",
          "mdaas:RegisteredAddress": {
            "zip": "",
            "country": "",
            "streetAddress": "",
            "city": "",
            "fullAddress": ""
          },
          "created_at": "2019-09-04 05:49:16",
          "dateOfBirth": "",
          "source": "element"
        },
        "isSubsidiarie": false,
        "indirectPercentage": 26.1,
        "parents": [
          "p44286"
        ],
        "child": "p2180"
      },
      {
        "country": "",
        "role": "",
        "jurisdiction": "",
        "parentIds": [],
        "title": "aaaaaa",
        "sourceUrl": "https://companyhouse.co.uk",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "id": "p2180",
            "indirectPercentage": 26.1,
            "totalPercentage": 50
          }
        ],
        "bvdId": "fa0b6918-ca7d-4a1a-8b6c-2ca45fec4b40",
        "from": "2019-09-04",
        "id": "p31088",
        "totalPercentage": 50,
        "identifier": "fa0b6918-ca7d-4a1a-8b6c-2ca45fec4b40",
        "level": 3,
        "source_evidence": "companyhouse.co.uk",
        "dateOfBirth": "",
        "entity_id": "orgChartParentEntity",
        "classification": "",
        "hasURL": "",
        "entity_type": "organization",
        "childIdentifier": "8dea39ba-1470-42d2-b67b-2cb13b6dabbc",
        "isCustom": true,
        "name": "aaaaaa",
        "isConflict": true,
        "subsidiaries": [],
        "childLevel": 2,
        "basic": {
          "vcard:organization-name": "aaaaaa",
          "sourceUrl": "https://companyhouse.co.uk",
          "isDomiciledIn": "",
          "hasURL": "",
          "entity_type": "C",
          "mdaas:RegisteredAddress": {
            "zip": "",
            "country": "",
            "streetAddress": "",
            "city": "",
            "fullAddress": ""
          },
          "created_at": "2019-09-04 04:51:08",
          "dateOfBirth": "",
          "source": "element"
        },
        "isSubsidiarie": false,
        "indirectPercentage": 26.1,
        "parents": [],
        "child": "p2180"
      },
      {
        "country": "",
        "role": "",
        "isUbo": true,
        "jurisdiction": "",
        "parentIds": [],
        "title": "aaaaa1111111111111",
        "sourceUrl": "https://companyhouse.co.uk",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "level": 2,
            "id": "p2180",
            "indirectPercentage": 26.1,
            "isDirect": true,
            "totalPercentage": 50
          }
        ],
        "bvdId": "e60ab61a-ab48-4db3-a538-b7a82ea7cddf",
        "from": "2019-09-04",
        "id": "p31089",
        "totalPercentage": 50,
        "identifier": "e60ab61a-ab48-4db3-a538-b7a82ea7cddf",
        "level": 3,
        "source_evidence": "companyhouse.co.uk",
        "dateOfBirth": "",
        "entity_id": "orgChartParentEntity",
        "classification": "",
        "hasURL": "",
        "entity_type": "person",
        "childIdentifier": "8dea39ba-1470-42d2-b67b-2cb13b6dabbc",
        "isCustom": true,
        "name": "aaaaa1111111111111",
        "isConflict": true,
        "subsidiaries": [],
        "childLevel": 2,
        "basic": {
          "vcard:organization-name": "aaaaa1111111111111",
          "sourceUrl": "https://companyhouse.co.uk",
          "isDomiciledIn": "",
          "hasURL": "",
          "entity_type": "I",
          "mdaas:RegisteredAddress": {
            "zip": "",
            "country": "",
            "streetAddress": "",
            "city": "",
            "fullAddress": ""
          },
          "created_at": "2019-09-04 05:32:16",
          "dateOfBirth": "",
          "source": "element"
        },
        "isSubsidiarie": false,
        "indirectPercentage": 26.1,
        "parents": [],
        "child": "p2180"
      },
      {
        "country": "",
        "role": "",
        "jurisdiction": "RU",
        "parentIds": [],
        "title": "lllll",
        "sourceUrl": "https://companyhouse.co.uk",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "id": "p2180",
            "indirectPercentage": 26.1,
            "totalPercentage": 50
          }
        ],
        "bvdId": "089ca2e1-2786-4ee5-b3db-eac37c0ab80c",
        "from": "2019-09-04",
        "id": "p31090",
        "totalPercentage": 50,
        "identifier": "089ca2e1-2786-4ee5-b3db-eac37c0ab80c",
        "level": 3,
        "source_evidence": "companyhouse.co.uk",
        "dateOfBirth": "",
        "entity_id": "orgChartParentEntity",
        "classification": "",
        "hasURL": "",
        "entity_type": "organization",
        "childIdentifier": "8dea39ba-1470-42d2-b67b-2cb13b6dabbc",
        "isCustom": true,
        "name": "lllll",
        "isConflict": true,
        "subsidiaries": [],
        "childLevel": 2,
        "basic": {
          "vcard:organization-name": "lllll",
          "sourceUrl": "https://companyhouse.co.uk",
          "isDomiciledIn": "RU",
          "hasURL": "",
          "entity_type": "C",
          "mdaas:RegisteredAddress": {
            "zip": "",
            "country": "",
            "streetAddress": "",
            "city": "",
            "fullAddress": ""
          },
          "created_at": "2019-09-04 04:34:16",
          "dateOfBirth": "",
          "source": "element"
        },
        "isSubsidiarie": false,
        "indirectPercentage": 26.1,
        "parents": [],
        "child": "p2180"
      },
      {
        "country": "united Kingdom",
        "role": "",
        "jurisdiction": "gb",
        "parentIds": [
          {
            "role": "",
            "indircetPercentage": 26.1,
            "isCustom": true,
            "from": "2019-09-04",
            "source": "famagusta-gazette",
            "basic": {
              "vcard:organization-name": "aassssssssssssqqaa",
              "sourceUrl": "http://famagusta-gazette.com/",
              "isDomiciledIn": "CZ",
              "hasURL": "",
              "entity_type": "C",
              "mdaas:RegisteredAddress": {
                "zip": "",
                "country": "",
                "streetAddress": "",
                "city": "",
                "fullAddress": ""
              },
              "created_at": "2019-09-04 06:42:28",
              "dateOfBirth": "",
              "source": "element"
            },
            "classification": "",
            "user": "famagusta-gazette",
            "parentId": "fca69686-5d86-4153-9593-22bbc855c3d0",
            "totalPercentage": 50
          },
          {
            "role": "",
            "indircetPercentage": 26.1,
            "isCustom": true,
            "from": "2019-09-04",
            "source": "europetodayonline",
            "basic": {
              "vcard:organization-name": "ggggggggggggggggggggg",
              "sourceUrl": "http://europetodayonline.com/",
              "isDomiciledIn": "GB",
              "hasURL": "",
              "entity_type": "C",
              "mdaas:RegisteredAddress": {
                "zip": "",
                "country": "",
                "streetAddress": "",
                "city": "",
                "fullAddress": ""
              },
              "created_at": "2019-09-04 06:58:15",
              "dateOfBirth": "",
              "source": "element"
            },
            "classification": "",
            "user": "europetodayonline",
            "parentId": "c50e547a-c653-4208-8b9c-7cae3118faa7",
            "totalPercentage": 50
          }
        ],
        "title": "british airways",
        "sourceUrl": "https://companyhouse.co.uk",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "id": "p2181",
            "indirectPercentage": 52.2,
            "totalPercentage": 100
          }
        ],
        "bvdId": "739a9808-cc71-4e01-a1fa-7b50f829667e",
        "from": "2019-09-03",
        "id": "p31091",
        "totalPercentage": 100,
        "identifier": "739a9808-cc71-4e01-a1fa-7b50f829667e",
        "level": 3,
        "source_evidence": "companyhouse.co.uk",
        "dateOfBirth": "",
        "entity_id": "orgChartParentEntity",
        "classification": "[\"General Partner\",\"Director\",\"Intermediate Parent\",\"Ultimate Legal Parent\"]",
        "hasURL": "",
        "entity_type": "organization",
        "childIdentifier": "881b36df-6bae-48e6-bdf1-e064a9342216",
        "isCustom": true,
        "name": "british airways",
        "isConflict": true,
        "subsidiaries": [],
        "childLevel": 2,
        "basic": {
          "vcard:organization-name": "british airways",
          "sourceUrl": "https://companyhouse.co.uk",
          "isDomiciledIn": "nl",
          "hasURL": "",
          "entity_type": "C",
          "updated_at": "2019-09-03 12:50:09",
          "mdaas:RegisteredAddress": {
            "zip": "",
            "country": "",
            "streetAddress": "",
            "city": "",
            "fullAddress": ""
          },
          "created_at": "2019-09-03 12:47:26",
          "dateOfBirth": "",
          "source": "element"
        },
        "isSubsidiarie": false,
        "indirectPercentage": 52.2,
        "parents": [
          "p44287",
          "p44288"
        ],
        "child": "p2181"
      },
      {
        "country": "",
        "role": "",
        "jurisdiction": "AT",
        "parentIds": [
          {
            "role": "",
            "indircetPercentage": 33.147000000000006,
            "isCustom": true,
            "from": "2018-05-01",
            "source": "",
            "basic": {
              "vcard:organization-name": "Porsche Piech Holding GmbH",
              "sourceUrl": "",
              "isDomiciledIn": "AT",
              "hasURL": "www.porsche.at",
              "entity_type": "C",
              "mdaas:RegisteredAddress": {
                "zip": "",
                "country": "",
                "streetAddress": "",
                "city": "",
                "fullAddress": ""
              },
              "created_at": "2019-09-03 12:41:13",
              "dateOfBirth": "",
              "source": "element"
            },
            "classification": "",
            "user": "",
            "parentId": "4adb260a-db5d-4686-a846-701b6eb55bbd",
            "totalPercentage": 100
          }
        ],
        "title": "Porsche Gesellschaft m.b.H.",
        "sourceUrl": "",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "id": "p2181",
            "indirectPercentage": 33.147000000000006,
            "totalPercentage": 63.5
          }
        ],
        "bvdId": "302c5c97-65a0-4947-b3c8-60c9743ee188",
        "from": "2018-05-01",
        "id": "p31092",
        "totalPercentage": 63.5,
        "identifier": "302c5c97-65a0-4947-b3c8-60c9743ee188",
        "level": 3,
        "source_evidence": "",
        "dateOfBirth": "",
        "entity_id": "orgChartParentEntity",
        "classification": "",
        "hasURL": "www.porsche.at",
        "entity_type": "organization",
        "childIdentifier": "881b36df-6bae-48e6-bdf1-e064a9342216",
        "isCustom": true,
        "name": "Porsche Gesellschaft m.b.H.",
        "isConflict": true,
        "subsidiaries": [],
        "childLevel": 2,
        "basic": {
          "vcard:organization-name": "Porsche Gesellschaft m.b.H.",
          "sourceUrl": "",
          "isDomiciledIn": "AT",
          "hasURL": "www.porsche.at",
          "entity_type": "C",
          "mdaas:RegisteredAddress": {
            "zip": "",
            "country": "",
            "streetAddress": "",
            "city": "",
            "fullAddress": ""
          },
          "created_at": "2019-09-03 12:41:12",
          "dateOfBirth": "",
          "source": "element"
        },
        "isSubsidiarie": false,
        "indirectPercentage": 33.147000000000006,
        "parents": [
          "p44289"
        ],
        "child": "p2181"
      },
      {
        "country": "",
        "role": "",
        "jurisdiction": "NL",
        "parentIds": [],
        "title": "aaaaaa",
        "sourceUrl": "http://www.alquds.co.uk",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "id": "p2181",
            "indirectPercentage": 26.1,
            "totalPercentage": 50
          }
        ],
        "bvdId": "5e5400d5-b8b2-4ad8-925e-55063ef58b5a",
        "from": "2019-09-03",
        "id": "p31093",
        "totalPercentage": 50,
        "identifier": "5e5400d5-b8b2-4ad8-925e-55063ef58b5a",
        "level": 3,
        "source_evidence": "alquds",
        "dateOfBirth": "",
        "entity_id": "orgChartParentEntity",
        "classification": "",
        "hasURL": "",
        "entity_type": "organization",
        "childIdentifier": "881b36df-6bae-48e6-bdf1-e064a9342216",
        "isCustom": true,
        "name": "aaaaaa",
        "isConflict": true,
        "subsidiaries": [],
        "childLevel": 2,
        "basic": {
          "vcard:organization-name": "aaaaaa",
          "sourceUrl": "http://www.alquds.co.uk",
          "isDomiciledIn": "NL",
          "hasURL": "",
          "entity_type": "C",
          "mdaas:RegisteredAddress": {
            "zip": "",
            "country": "",
            "streetAddress": "",
            "city": "",
            "fullAddress": ""
          },
          "created_at": "2019-09-03 13:06:57",
          "dateOfBirth": "",
          "source": "element"
        },
        "isSubsidiarie": false,
        "indirectPercentage": 26.1,
        "parents": [],
        "child": "p2181",
        "status": "inprogress"
      },
      {
        "country": "Austria",
        "jurisdiction": "AT",
        "innerSource": "Creditreform",
        "parentIds": [
          {
            "indircetPercentage": 1.0242423,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT*770415954",
            "totalPercentage": 3.09
          },
          {
            "indircetPercentage": 3.3147,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT*54514",
            "totalPercentage": 10
          },
          {
            "indircetPercentage": 1.3789152000000002,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT*770072485",
            "totalPercentage": 4.16
          },
          {
            "indircetPercentage": 1.0242423,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "DE*770072476",
            "totalPercentage": 3.09
          },
          {
            "indircetPercentage": 1.0242423,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "DE*770072487",
            "totalPercentage": 3.09
          },
          {
            "indircetPercentage": 1.3789152000000002,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT*770065329",
            "totalPercentage": 4.16
          },
          {
            "indircetPercentage": 1.65735,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT*772849144",
            "totalPercentage": 5
          },
          {
            "indircetPercentage": 3.3147,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT*822443119",
            "totalPercentage": 10
          },
          {
            "indircetPercentage": 1.65735,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "CH*772120157",
            "totalPercentage": 5
          },
          {
            "indircetPercentage": 1.2430125000000003,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT*772120156",
            "totalPercentage": 3.75
          },
          {
            "indircetPercentage": 1.0242423,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "DE*772031174",
            "totalPercentage": 3.09
          },
          {
            "indircetPercentage": 3.3147,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT9110625700",
            "totalPercentage": 10
          },
          {
            "indircetPercentage": 1.2728448,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT*110008743193",
            "totalPercentage": 3.84
          },
          {
            "indircetPercentage": 4.106913300000001,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT*770174570",
            "totalPercentage": 12.39
          },
          {
            "indircetPercentage": 0.03314700000000001,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT*110010020098",
            "totalPercentage": 0.1
          },
          {
            "indircetPercentage": 3.3147,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT9130077834",
            "totalPercentage": 10
          },
          {
            "indircetPercentage": 1.65735,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT*110001245079",
            "totalPercentage": 5
          },
          {
            "indircetPercentage": 1.3789152000000002,
            "from": "2018-05-01",
            "source": "VC",
            "parentId": "AT*770072489",
            "totalPercentage": 4.16
          }
        ],
        "title": "Porsche Piech Holding GmbH",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "id": "p386",
            "indirectPercentage": 33.147000000000006,
            "totalPercentage": 100
          }
        ],
        "bvdId": "AT9130066333",
        "from": "2018-05-01",
        "id": "p4373",
        "totalPercentage": 100,
        "identifier": "AT9130066333",
        "level": 4,
        "source_evidence": "BST",
        "entity_id": "orgChartParentEntity",
        "hasURL": "www.porsche.at",
        "entity_type": "organization",
        "childIdentifier": "AT9130018626",
        "isCustom": false,
        "name": "Porsche Piech Holding GmbH",
        "subsidiaries": [],
        "childLevel": 3,
        "basic": {
          "vcard:organization-name": "Porsche Piech Holding GmbH",
          "isDomiciledIn": "AT",
          "hasURL": "www.porsche.at",
          "mdaas:RegisteredAddress": {
            "zip": "5020",
            "country": "Austria",
            "streetAddress": "Vogelweiderstrasse 75",
            "city": "Salzburg",
            "fullAddress": "Vogelweiderstrasse 75 Salzburg Austria 5020"
          }
        },
        "isSubsidiarie": false,
        "indirectPercentage": 33.147000000000006,
        "parents": [],
        "child": "p386"
      },
      {
        "country": "",
        "role": "",
        "isUbo": true,
        "jurisdiction": "sg",
        "parentIds": [],
        "title": "santhi",
        "sourceUrl": "http://ddddd.com",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "level": 3,
            "id": "p31087",
            "indirectPercentage": 26.1,
            "isDirect": true,
            "totalPercentage": 100
          }
        ],
        "bvdId": "790938c7-bc80-447c-8d8b-3ab8e9ceaffb",
        "from": "2019-09-04",
        "id": "p44286",
        "totalPercentage": 100,
        "identifier": "790938c7-bc80-447c-8d8b-3ab8e9ceaffb",
        "level": 4,
        "source_evidence": "test santhi",
        "dateOfBirth": "1234-02-02",
        "entity_id": "orgChartParentEntity",
        "classification": "[\"Main Prinicipals\",\"Pesudo UBO\",\"UBO\",\"Director\",\"General Partner\"]",
        "hasURL": "",
        "entity_type": "person",
        "childIdentifier": "d99ec075-7f7e-4ca1-b64b-a5d76d30df0b",
        "isCustom": true,
        "name": "santhi",
        "subsidiaries": [],
        "childLevel": 3,
        "basic": {
          "vcard:organization-name": "santhi",
          "sourceUrl": "http://ddddd.com",
          "isDomiciledIn": "sg",
          "hasURL": "",
          "entity_type": "I",
          "updated_at": "2019-09-04 09:19:49",
          "mdaas:RegisteredAddress": {
            "zip": "",
            "country": "",
            "streetAddress": "",
            "city": "",
            "fullAddress": ""
          },
          "created_at": "2019-09-04 09:18:30",
          "dateOfBirth": "1234-02-02",
          "source": "element"
        },
        "isSubsidiarie": false,
        "indirectPercentage": 26.1,
        "parents": [],
        "child": "p31087"
      },
      {
        "country": "",
        "role": "",
        "jurisdiction": "CZ",
        "parentIds": [],
        "title": "aassssssssssssqqaa",
        "sourceUrl": "http://famagusta-gazette.com/",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "id": "p31091",
            "indirectPercentage": 26.1,
            "totalPercentage": 50
          }
        ],
        "bvdId": "fca69686-5d86-4153-9593-22bbc855c3d0",
        "from": "2019-09-04",
        "id": "p44287",
        "totalPercentage": 50,
        "identifier": "fca69686-5d86-4153-9593-22bbc855c3d0",
        "level": 4,
        "source_evidence": "famagusta-gazette",
        "dateOfBirth": "",
        "entity_id": "orgChartParentEntity",
        "classification": "",
        "hasURL": "",
        "entity_type": "organization",
        "childIdentifier": "739a9808-cc71-4e01-a1fa-7b50f829667e",
        "isCustom": true,
        "name": "aassssssssssssqqaa",
        "subsidiaries": [],
        "childLevel": 3,
        "basic": {
          "vcard:organization-name": "aassssssssssssqqaa",
          "sourceUrl": "http://famagusta-gazette.com/",
          "isDomiciledIn": "CZ",
          "hasURL": "",
          "entity_type": "C",
          "mdaas:RegisteredAddress": {
            "zip": "",
            "country": "",
            "streetAddress": "",
            "city": "",
            "fullAddress": ""
          },
          "created_at": "2019-09-04 06:42:28",
          "dateOfBirth": "",
          "source": "element"
        },
        "isSubsidiarie": false,
        "indirectPercentage": 26.1,
        "parents": [],
        "child": "p31091"
      },
      {
        "country": "",
        "role": "",
        "jurisdiction": "GB",
        "parentIds": [],
        "title": "ggggggggggggggggggggg",
        "sourceUrl": "http://europetodayonline.com/",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "id": "p31091",
            "indirectPercentage": 26.1,
            "totalPercentage": 50
          }
        ],
        "bvdId": "c50e547a-c653-4208-8b9c-7cae3118faa7",
        "from": "2019-09-04",
        "id": "p44288",
        "totalPercentage": 50,
        "identifier": "c50e547a-c653-4208-8b9c-7cae3118faa7",
        "level": 4,
        "recognizedEntityType": "Standard",
        "source_evidence": "europetodayonline",
        "dateOfBirth": "",
        "entity_id": "orgChartParentEntity",
        "classification": "",
        "hasURL": "",
        "entity_type": "organization",
        "childIdentifier": "739a9808-cc71-4e01-a1fa-7b50f829667e",
        "isCustom": true,
        "name": "ggggggggggggggggggggg",
        "subsidiaries": [],
        "childLevel": 3,
        "basic": {
          "vcard:organization-name": "ggggggggggggggggggggg",
          "sourceUrl": "http://europetodayonline.com/",
          "isDomiciledIn": "GB",
          "hasURL": "",
          "entity_type": "C",
          "mdaas:RegisteredAddress": {
            "zip": "",
            "country": "",
            "streetAddress": "",
            "city": "",
            "fullAddress": ""
          },
          "created_at": "2019-09-04 06:58:15",
          "dateOfBirth": "",
          "source": "element"
        },
        "isSubsidiarie": false,
        "indirectPercentage": 26.1,
        "parents": [],
        "child": "p31091"
      },
      {
        "country": "",
        "role": "",
        "jurisdiction": "AT",
        "parentIds": [],
        "title": "Porsche Piech Holding GmbH",
        "sourceUrl": "",
        "screeningFlag": true,
        "indirectChilds": [
          {
            "id": "p31092",
            "indirectPercentage": 33.147000000000006,
            "totalPercentage": 100
          }
        ],
        "bvdId": "4adb260a-db5d-4686-a846-701b6eb55bbd",
        "from": "2018-05-01",
        "id": "p44289",
        "totalPercentage": 100,
        "identifier": "4adb260a-db5d-4686-a846-701b6eb55bbd",
        "level": 4,
        "source_evidence": "",
        "dateOfBirth": "",
        "entity_id": "orgChartParentEntity",
        "classification": "",
        "hasURL": "www.porsche.at",
        "entity_type": "organization",
        "childIdentifier": "302c5c97-65a0-4947-b3c8-60c9743ee188",
        "isCustom": true,
        "name": "Porsche Piech Holding GmbH",
        "subsidiaries": [],
        "childLevel": 3,
        "basic": {
          "vcard:organization-name": "Porsche Piech Holding GmbH",
          "sourceUrl": "",
          "isDomiciledIn": "AT",
          "hasURL": "www.porsche.at",
          "entity_type": "C",
          "mdaas:RegisteredAddress": {
            "zip": "",
            "country": "",
            "streetAddress": "",
            "city": "",
            "fullAddress": ""
          },
          "created_at": "2019-09-03 12:41:13",
          "dateOfBirth": "",
          "source": "element"
        },
        "isSubsidiarie": false,
        "indirectPercentage": 33.147000000000006,
        "parents": [],
        "child": "p31092",
        "status": "completed"
      }
    ],
    "status": "completed"
  }

let tabsWorldMap = {
  worldChartTwitterLocationsOptions: {
    container: "#twitter-locations-chart",
    uri1: "../vendor/data/worldCountries.json",// Url of data
    uri2: "../vendor/data/worldMapData.json",// Url of data
    height: 200,
    width: 300,
    markers: {}
  },
  worldComplianceLocationsOptions: {
    container: "#companyexample5",
    uri1: "../vendor/data/worldCountries.json",// Url of data
    uri2: "../vendor/data/worldMapData.json",// Url of data
    // "proxy/api/cases/all"
    height: 200,
    width: 300,
    markers: {}
  },
  worldComplianceLocationsOptionsForReport: {
    container: "#companyexampleReport",
    uri1: "../vendor/data/worldCountries.json",// Url of data
    uri2: "../vendor/data/worldMapData.json",// Url of data
    // "proxy/api/cases/all"
    height: 700,
    markers: {}
  },
  worldComplianceLocationsOptionsAtBottom: {
    container: "#companyComplianceWorldMap",
    uri1: "../vendor/data/worldCountries.json",// Url of data
    uri2: "../vendor/data/worldMapData.json",// Url of data
    height: 300,
    width: 500,
    markers: {}
  },
  worldChartOptions1: {
    container: "#companyexample4",
    uri1: "../vendor/data/worldCountries.json",// Url of data
    uri2: "../vendor/data/worldMapData.json",// Url of data
    dontShowAmount: true,										// "proxy/api/cases/all"
    height: 200,
    width: 300,
    markers: {}
  },
  worldChartOptions2: {
    container: "#companyexample5",
    uri1: "../vendor/data/worldCountries.json",// Url of data
    uri2: "../vendor/data/worldMapData.json",// Url of data
    dontShowAmount: true,																// "proxy/api/cases/all"
    height: 200,
    width: 300,
    markers: {}
  },
  worldChartNewsLocationsOptions: {
    container: "#worldMapNewsSources",
    uri1: "../vendor/data/worldCountries.json",// Url of data
    uri2: "../vendor/data/worldMapData.json",// Url of data
    // "proxy/api/cases/all"
    height: 200,
    width: 300,
    markers: {}
  },
  // worldChartTwitterLocationsOptions: {
  //     container: "#twitter-locations-chart",
  //     uri1: "../vendor/data/worldCountries.json",// Url of data
  //     uri2: "../vendor/data/worldMapData.json",// Url of data
  //     // "proxy/api/cases/all"
  //     height: 200,
  //     width: 300,
  //     markers: {}
  // },
  digitalFootPrintChart: {
    container: "#digitalFootprint",
    uri1: "../vendor/data/worldCountries.json",// Url of data
    uri2: "../vendor/data/worldMapData.json",// Url of data
    dontShowAmount: true,																// "proxy/api/cases/all"
    height: 200,
    width: 300,
    markers: {}
  }
}

let basicsharedObject: any = {
  companyName: '',
  totalOfficers_link: [],
  addModelClassification: {
    companyModel: [],
    personModel: [],
    companyListData: [],
    personListData: [],
    personRoleData: [],
    personRoleModel: [],
  },
  editModelClassification: {
    editPersonListData: [],
    editPersonModel: [],
    editCompanyModel: [],
    editCompanyListData: [],
    editRoleModel: [],
    editRoleData: []
  },
  screeningModelClassification: {
    screeningPersonRoleModel: [],
    screeningPersonRoleData: [],
    screeningPersonListData: [],
    screeningPersonModel: [],
    screeningCompanyListData: [],
    screeningCompanyModel: [],
  },
  subsidiaries: [{
    "name": '',
    "source_url": '',
    "subsidiaries": [],
    "natures_of_control": [],
    "parent_companies": []
  }],
  stockModalData: {
    top_owners: [],
    locations: [],
    top_mutual_holding: [],
    recent_institutional_activity: [],
    balance_sheet: {},
    total_assets: '',
    total_liabilities: '',
    long_term_debt: '',
    net_income: '',
    net_revenues: '',
    'net_cash_flow_-_operating_activities': '',
    'net_cash_flow_investing': '',
    'net_cash_flow_-_financing': '',
    income_statement: {},
    cash_flow_statement: {},
    stock_profile: {
      growth_and_valuation: {},
      today_trading: {},
      company_profile: {},
      competitors: [],
      other_values: [],
      financials: {}
    },
    company_profile: {
      data: {},
      shareholders: {}
    },
    'press_releases': [],
    'adverse_news': [],
    source: 'stocks.money.cnn.com'
  },
  yahooStockData: {
    company_profile: {
      data: {},
      keyStaff: []
    },
    stock_holders: {
      direct_holders_list: []
    },
    financial_statements: {
      financevalues: [],
      financedates: []
    },
    stock_graphs: {
      last_5year_stock_history: [],
      last_6month_stock_history: [],
      last_day_stock_history: [],
      last_year_stock_history: [],
      last_5d_stock_history: [],
      last_month_stock_history: []
    },
    stock_statistics: {
      dividends_Splits: {},
      stock_price_history: {},
      fiscal_year: {},
      profitability: {},
      balance_sheet: {},
      management_effectiveness: {},
      other_stock_values: {},
      cash_flow_statement: {},
      income_statement: {}
    },
    source: 'finance.yahoo.com'
  },
  tagCloudPopularOptions: {
    header: "MY ENTITIES",
    container: "#tagCloudPopularTags",
    height: 220,
    width: 300,
    data: [],
    margin: {
      bottom: 10,
      top: 10,
      right: 10,
      left: 10
    }
  },
  bloombergStockLineChartData: {
    'five year stock prices': [],
    'one year stock prices': [],
    'one month stock prices': [],
    'current day stock prices': []
  },
  list: {
    key_staff: [],
    'sex-offenders': [],
    'fbi_data': [],
    similar_companies: [],
    resolve_related_similar_companies: [],
    search_related_similar_companies: [],
    stocks_bloomberg_similar_companies: [],
    bloomberg_similar_companies: [],
    specialities: [],
    people_also_viewd: [],
    company_boardmembers: [],
    stock_company_boardmembers: [],
    company_key_executives: [],
    mixed_company_key_executives: [],
    stock_company_key_executives: [],
    other_board_members: [],
    corporate_governance_committee: [],
    nominating_committee: [],
    compensation_committee: [],
    audit_committee: [],
    industry: [],
    products: [],
    five_year_stock_prices: [],
    one_month_stock_prices: [],
    one_year_stock_prices: [],
    current_day_stock_prices: [],
    key_persons: [],
    stock_holders: [],
    recent_user_comments: [],
    stock_graphs: [],
    stock_statistics: [],
    financial_statements: [],
    news_articles: [],
    all_news_articles: [],
    following: [],
    followers: [],
    near_by_companies: [],
    has_returns: {},
    has_accounts: {},
    has_company_members: [],
    risidata: [],
    key_staff_attended_schools: [],
    key_relationships: [],
    supplierblacklist: {},
    badbbuyer_initial: true,
    scam: [],
    tradedAs: '',
    founders: '',
    services: '',
    key_people: '',
    exclusion_fraud: [],
    crimeList: {
      interpol: []
    },
    badbuyerslist: {},
    hunterData: {},
    blackhatworld: [],
    latestReleases: [],
    xforceibmcloud: [],
    domain_servers: [],
    locations: [],
    cypherpunk: [],
    reddit: [],
    ratings_trends: [],
    current_job_openings: [],
    sanctionssearch: [],
    imsasllc: [],
    unlimitedcriminalchecks: [],
    truecaller: [],
    meetupData: [],
    highcountryRisk: 0,
    'url_analysis': [],
    'fan_counts_numbric': 0,
    'fan_counts': 0,
    'followers_numberic': 0,
    'twitter_following_numberic': 0,
    'social_media_count': 0,
    'follower_following_count': [],
    'news_deep_web': [],
    'inc-us-eu': [],
    'companies-corporationwiki': [],
    'company_locations': [],
    'top_holders': [],
    'associated_companies': {
      'memberships': [],
      'owners': [],
      'leadership & staff': [],
      'services transactions': [],
      'political_financial_supports': [],
      'politicians': [],
      'political_organizations': [],
      'transaction': [],
      'child_organizations': [],
      'holdings': [],
      'donation_grant_recipients': []
    },
    'associated_persons': {
      'transaction': [],
      'lobbying': [],
      'hierarchy': [],
      'donation': [],
      'membership': [],
      'position': [],
      'ownership': [],
    },
    'connected_industries': [],
    'press_releases': [],
    'sanctionList': [],
    'adverse_news': [],
    'pep': [],
    'denied_personlist': [],
    'crimestoppers_uk': [],
    'answerstedhctbek': [],
    'related_persons_tags': true,
    'related_company_tags': true,
    'twitter_socket_network_chart': true,
    'social_followers_bubble_chart': true,
    'is_popular_tag_chart': true,
    'is_traffic_by_countries': true,
    'is_search_keywords': true,
    'is_traffic_by_domain': true,
    'is_badbuyerslist': true,
    tagCloudOrganizationNameList: [],
    'traffic_by_countries': [],
    'search_keywords': [],
    'local_ranking': [],
    'traffic_by_domain': [],
    videos_list: [],
    phoneno: [],
    topHeaderObject: {
      FoundedDate: '',
      industry: "",
      hasURL: ""
    },
    isSignificant: false,//siginifiance false by default
    significantTitle: '',
    summaryCount: {
      highRiskCount: 0,
      financeCount: 0,
      adverseCount: 0,
      pepCount: 0,
      sanctionCount: 0
    },
    addEntitymodalChart: 'person',
    addActiveTab: 0,
    recognized_entity: {
      entityType: ""
    },
    graphviewIndex: 1,
    currentVLArendered: 'vlaContainer',
    orgChartSources: [],
    graphSourceSelected: '',
    intialSourceSelected: '',
    previousSourceSelected: '',
    sourceFirsttimeSelected: true,
    sourceFilterChart_not_Started: true,
    searchedSourceURLCompany: '',
    searchedSourceURLValuePerson: '',
    selectedScreeningRow: {},
    keymangerSourceselected: '',
    keymangerapplybutton: true
  },
  is_data_not_found: {
    is_data_leadership: true,
    is_stock_performance: true,
    is_traffic_by_country: true,
    is_traffic_key_word: true,
    is_traffic_bydomain: true,
    associated_company: true,
    board_of_director: true,
    is_committe: true,
    is_people_visited: true,
    is_nearby_company: true,
    is_company_member: true,
    is_topholders: true,
    is_balancesheet: true,
    is_incomeStatement: true,
    is_financialStatement: true,
    is_stockHistory: true,
    is_cyberalert: true,
    is_sanctionedlist: true,
    is_adversenews: true,
    is_indus_security_inc: true,
    is_latestnews: true,
    is_top_influencers: true,
    is_press_releases: true,
    is_recent_events: true,
    is_googlepost: true,
    is_linkedin_post: true,
    is_recentTweets: true,
    is_instagramlist: true,
    is_ratings_trends: true,
    is_facebook_list: true,
    is_twitter_list: true,
    is_carrer_opportuny: true,
    is_risk_ratio: true,
    is_politcal_donation: true,
    is_populartags: true,
    is_keyExecutive: true,
    is_networkgraph: true,
    is_interactionration: true,
    is_committe_audit: true,
    is_committe_compensation: true,
    is_committe_nominating: true,
    is_committe_corporate: true,
    is_shareholder: true,
    is_supplierlist: true,
    is_crimelist: true,
    is_sexoffender: true,
    is_deninedperson: true,
    is_exclusions: true,
    is_fbidata: true,
    is_investment: true,
    is_interlockdata: true,
    shareholder_div: false,
    stockprice_div: false,
    is_data_industry: true,
    is_bySource_pie: true,
    is_autodesk_Vla: true,
    is_autodesk_chart: false,
    is_rightScreening_data: true,
    is_rightadverseNews: true,
    is_complianceDetails: false
  },
  // pageloader: {
  //     comapnyinformation: true,
  //     screeningLoader: true,
  //     directorsloader: true,
  //     coropoateloader: true,
  //     countriesloader: true,
  //     associatedDocumentloader: true,
  //     treeGraphloader: true,
  //     companyDetailsloader: true,
  //     loadingText: false,//loading flag is off by default
  //     disableFilters: false,//inital filters are clickable
  //     companyInfoReview: false,
  //     companyDocumentsReview: false,
  //     companyOperationReview: false,
  //     companyStructureReview: false,
  //     companyResultsReview: false,
  //     companyDetailsReview: false,
  //     chartFailureMessage: ''
  // },
  bloombergChartDetailsOptions: {
    container: "#bloomberg-line-chart-details",
    height: '350',
    width: $("#bloomberg-line-chart-details").width(),
    uri: "../vendor/data/bloombergdata.json",
    data: {}
  },
  filteredChart: {
    company_eachlevel: [5, 10, 20, 30, 40, 50],
    numberofcomapnies: 5,
    numberOfLevel: [1, 5, 10, 15, 20, 30],
    selectedNumberofLevel: 5,
    risklevel: ["low", "high"],
    riskRatio: 1,
    applyButton: true,
    yearliderMinValue: 0,
    yearsliderMaxValue: 2,
    fromyear: ((new Date().getFullYear()) + '-' + (("0" + (new Date().getMonth() + 1)).slice(-2)) + '-' + ("0" + (new Date().getDate())).slice(-2)),
    toyear: ((new Date().getFullYear() - 2) + '-' + (("0" + (new Date().getMonth() + 1)).slice(-2)) + '-' + ("0" + (new Date().getDate())).slice(-2)),
    startYear: 0,
    endYear: 2,
    show_subsidaries_filter: false,
    pep_slider_min: 85,
    pep_slider_max: 100,
    sanction_slider_min: 70,
    sanction_slider_max: 100,
    not_screening: true
  },
  newOfficer: {
    firstName: '',
    lastName: '',
    country: '',
    dob: '',
    ScreeeningModal: 'person',
    CompanyName: '',
    website: '',
    requiredComapnyname: false,
    requiredPersonname: false,
    dateOfBirth: ''
  },
  tagCloudPersonOptions: {
    header: "MY ENTITIES",
    container: "#tagcloudCompanyPerson",
    height: 200,
    width: 300,
    data: [],
    margin: {
      bottom: 10,
      top: 10,
      right: 10,
      left: 10
    },
    domain: {
      x: 1,
      y: 10000
    },
  },
  'riskScoreData': [],
  entites_renderedIn_chart: []
}
// shravani:19-5-2020 new Obj for Main Entity page
const newEntityObj: any = {
  "_request": "_accepted",
  "search_query": "kaffee burger gmbh",
  "_job_id": "1590127464.273058",
  "start_time": "2020-05-22 06:04:24.273038",
  "end_time": "2020-05-22 06:04:42.886203",
  "x-ray-id": "1590127464.273058",
  "STACK_NAME": "INFO SOURCES",
  "results": {
    "overview": {
      "vcard:organization-name": "Kaffee Burger",
      "mdaas:RegisteredAddress": {
        "streetAddress": "Torstr. 58/60",
        "city": "Berlin",
        "country": "DE",
        "zip": "10119",
        "fullAddress": "Torstr. 58/60, Berlin, 10119, DE"
      },
      "isDomiciledIn": "DE",
      "tr-org:hasRegisteredPhoneNumber": "+493028046495",
      "@context": "http://schema.org/",
      "images": [
        "https://s3-media0.fl.yelpcdn.com/bphoto/IgtSnSPL_XSM8SP3ZpI0uQ/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/ZO-NfEvEbv8L6xch88HC3Q/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/5bxFzJqNGPyXSDmsUAvqlQ/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/mZsLmrfTRnupa8C6MoLGfA/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/dugI7yPom51oQS1BZC0diA/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/TnoO22Uumu3WvVhinm6f9A/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/397s-hwdrjaHfw7Qyy-mOQ/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/jbtP0uauBFCS_o3xePhV6A/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/YYEHOzHO6UBMJcJOM4YaPw/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/JGd_pzOjetAOpzk2vzmSVg/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/0qBcNX0aJsv20pti_WSMYQ/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/ji5XivyDhkKjfn4YORsbTA/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/WXt8yzq5mYxI27oPYd93aA/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/nj4icAQhoOIQ8H1ZC65WHg/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/HL7JIUkbmm9BkIcttvCkKw/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/qpwzin2pkbLuEHDnKNkmpA/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/GuO-xiPWyHetnC2c_ccAFA/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/SSiOHh2AaO1KvKOGZR5-JA/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/IgtSnSPL_XSM8SP3ZpI0uQ/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/ZO-NfEvEbv8L6xch88HC3Q/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/5bxFzJqNGPyXSDmsUAvqlQ/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/mZsLmrfTRnupa8C6MoLGfA/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/dugI7yPom51oQS1BZC0diA/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/TnoO22Uumu3WvVhinm6f9A/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/397s-hwdrjaHfw7Qyy-mOQ/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/jbtP0uauBFCS_o3xePhV6A/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/YYEHOzHO6UBMJcJOM4YaPw/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/JGd_pzOjetAOpzk2vzmSVg/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/0qBcNX0aJsv20pti_WSMYQ/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/ji5XivyDhkKjfn4YORsbTA/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/WXt8yzq5mYxI27oPYd93aA/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/nj4icAQhoOIQ8H1ZC65WHg/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/HL7JIUkbmm9BkIcttvCkKw/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/qpwzin2pkbLuEHDnKNkmpA/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/GuO-xiPWyHetnC2c_ccAFA/258s.jpg",
        "https://s3-media0.fl.yelpcdn.com/bphoto/SSiOHh2AaO1KvKOGZR5-JA/258s.jpg"
      ],
      "OpeningHours": [
        "Mo 21:00-05:00",
        "Tu-We 22:00-05:00",
        "Th 21:00-05:00",
        "Fr-Sa 21:00-06:00",
        "Su 22:00-05:00"
      ],
      "rating_summary": [
        {
          "rating_group": "5",
          "ratings": 23
        },
        {
          "rating_group": "4",
          "ratings": 27
        },
        {
          "rating_group": "3",
          "ratings": 14
        },
        {
          "rating_group": "2",
          "ratings": 7
        },
        {
          "rating_group": "1",
          "ratings": 7
        }
      ],
      "aggregateRating": {
        "reviewCount": 78,
        "@type": "AggregateRating",
        "ratingValue": 3.5
      },
      "review": [
        {
          "reviewRating": {
            "ratingValue": 5
          },
          "datePublished": "2016-04-23",
          "description": "Came here a few years ago with one of my best friends and we had suuuuuuuuch an amazing time!\n\nIt was nighttime and while we had both done some research on some supposedly hoppin' places we ended up getting disappointed by a few. Kaffee Berger made me nervous because yanno, it sounds like \"Coffee Burger\" and while I hold both of these things neat and dear to my heart - they're not necessarily what I think about when I'm looking for a place to shake my tailfeather.\n\nThere wasn't a long line to enter, but there was a cover charge. If I remember correctly, we kindly mentioned that we were from New York at the door (this was garnering lots of positivity everywhere at the time so I figured it wouldn't hurt!) and our cover charge was waived. Huzzah!\n\nIt was a ravey, indie rock dance party a la Misshapes 2004-05. Plenty of lights, lasers, thumping Brit pop/indie rock/dance songs and lots of attractive sweaty bodies dancing as if it were going to be the last night they could dance.\n\nIt was here that I let some guy buy me a beer (I was single and whatevs) and then he made clear that I was to go back to his home and make good on his beer purchase. I educated him and made it clear that isn't how I roll, he should never assume that and it's now how things work where I'm from. After some more drunk words from him (I was as sober as Mr. Feeny on \"Boy Meets World\") I asked him to wait for me at a certain spot, rescued my friend from an equally awkward and potentially bad AF situation and we ran outta there.\n\nWe did have an amazing time, hence the 5 stars. I'm not going to hold it against Kaffee Berger if their clients is a bit lame and seems to think girls from NY cost a beer. But yeahhhhh...great scene here and if this party (with AMAZING MUSIC) is reflective of their normal parties (sans loser guys) then this place is a great place to party!",
          "author": "Stephanie P."
        },
        {
          "reviewRating": {
            "ratingValue": 4
          },
          "datePublished": "2016-02-09",
          "description": "A place to come late for great music a drinks. Better check their site for program. Each night a different sound.  People start arriving after midnight. Usually coming from other bars. Party people.\n\nThere are biers from different types and drinks are affordable with daily specials hanging on the black boards on the walls.\n\nMusic is really good and trendy expect listening good quality housemusic eletro and others",
          "author": "Vladio D."
        },
        {
          "reviewRating": {
            "ratingValue": 2
          },
          "datePublished": "2014-01-08",
          "description": "I came here on a Tuesday night. When I entered, I was instantly charged a cover fee, which was fine except for the fact that my boyfriend and I were the only people charged for the rest of the night. The drinks were a little pricey, but strong. The bartender spoke perfect English, yet was rude to me and my boyfriend. The dj was alright, yet there were only two people dancing on the dance floor the entire time. This was not the fun, up-beat nightlife I expected from Berlin.",
          "author": "Josiah A."
        },
        {
          "reviewRating": {
            "ratingValue": 3
          },
          "datePublished": "2011-04-01",
          "description": "I only came here once, for Russendisko. It was full of people dancing and animations on tv. The drinks were okay, but not great. \nI didn't eat anything. A lot of people were smoking.",
          "author": "Allison R."
        },
        {
          "reviewRating": {
            "ratingValue": 5
          },
          "datePublished": "2011-08-22",
          "description": "good times, cheap drinks, fun music, good dancing/party atmosphere. Also good if you're on the pull; but if you're a single woman and not looking to go home with anybody, you might want to change your mind and bring a friend with you, either that, or get good at telling random dudes to piss off.\nThe bar staff and door guys are always chill and respectful. There is also a cloakroom here that is pretty cheap, 50 cents or a euro or so, and you can go and get stuff out of your bag if you like without any attitude from the attendant.\nPeople are generally in a nice mood and happy here, you don't have to be a star to grace the dance floor, which is usually filled with people of all ages and walks of life. A really fun way to spend an evening; no one thinks they're too cool for school hereit's all about having fun and living in the moment.\nImmer gerne wieder, I love the Kaffee Burger.",
          "author": "dessa_dangerous"
        },
        {
          "reviewRating": {
            "ratingValue": 4
          },
          "datePublished": "2008-06-13",
          "description": "Kaffee Burger consists of two parts, the bar area and the dance area, both of which are both enjoyable. The bar area is littered with rounded booths and lows tables complimented by a simple cockatil menu. The dance area has shattered black and white tiles, scattered tables and an old style bar with plenty of service.\n\n\n The best night here is Russen Disko night, where you can hear a Russian DJ bang out the best of the east. Dancing ridiculous required, and bring your super flats for some seriousuhrussian disco dancing? All in all a plus, including the dead animal heads on the walls.",
          "author": "superchristine"
        },
        {
          "reviewRating": {
            "ratingValue": 5
          },
          "datePublished": "2013-10-29",
          "description": "love it or hate it,\nthere is definitely nothing inbetween.",
          "author": "TinoB"
        }
      ],
      "amenities": [
        {
          "amenities_type": "Takes Reservations",
          "value": "No"
        },
        {
          "amenities_type": "Accepted Cards",
          "value": "None"
        },
        {
          "amenities_type": "Parking",
          "value": "Street"
        },
        {
          "amenities_type": "Good for Kids",
          "value": "No"
        },
        {
          "amenities_type": "Good for Groups",
          "value": "Yes"
        },
        {
          "amenities_type": "Ambience",
          "value": "Hipster"
        },
        {
          "amenities_type": "Noise Level",
          "value": "Loud"
        },
        {
          "amenities_type": "Alcohol",
          "value": "Beer &amp; Wine Only"
        },
        {
          "amenities_type": "Outdoor Seating",
          "value": "No"
        },
        {
          "amenities_type": "Wi-Fi",
          "value": "No"
        },
        {
          "amenities_type": "Has TV",
          "value": "No"
        }
      ],
      "map": "https://www.yelp.com/map/kaffee-burger-berlin",
      "nearby": [
        {
          "nearByposition": "1",
          "name": "Pirates Berlin",
          "SameAs": "https://www.yelp.com/biz/pirates-berlin-berlin-2?osq=Kaffee+Burger",
          "address": "Mühlenstr. 78 - 80, 10243 Berlin, Germany"
        }
      ],
      "window.yPageStart": "UTC 2020-05-22 06:04:31",
      "bst:registryURI": "https://www.yelp.com/biz/kaffee-burger-berlin?osq=kaffee+burger"
    },
    "_links": {
      "overview": {
        "method": "GET",
        "url": "https://moojvxnjvk.execute-api.eu-west-1.amazonaws.com/Prod/v1/entity-async?source=yelp.com&url=aHR0cHM6Ly93d3cueWVscC5jb20vYml6L2thZmZlZS1idXJnZXItYmVybGluP29zcT1rYWZmZWUrYnVyZ2Vy&fields=overview"
      },
      "officership": {
        "method": "GET",
        "url": "https://moojvxnjvk.execute-api.eu-west-1.amazonaws.com/Prod/v1/entity-async?source=yelp.com&url=aHR0cHM6Ly93d3cueWVscC5jb20vYml6L2thZmZlZS1idXJnZXItYmVybGluP29zcT1rYWZmZWUrYnVyZ2Vy&fields=officership"
      }
    },
    "attribute_count": 15
  }
}
const amenities = [
  {
    "amenities_type": "Health Score",
    "value": "92 out of 100"
  },
  {
    "amenities_type": "High Chairs",
    "value": "Yes"
  },
  {
    "amenities_type": "Kids Activities Nearby",
    "value": "Yes"
  },
  {
    "amenities_type": "Happy Hour Specials",
    "value": "Yes"
  },
  {
    "amenities_type": "Kids Menu",
    "value": "Yes"
  },
  {
    "amenities_type": "Takes Reservations",
    "value": "Yes"
  },
  {
    "amenities_type": "Offers Delivery",
    "value": "No"
  },
  {
    "amenities_type": "Offers Takeout",
    "value": "No"
  },
  {
    "amenities_type": "Accepts Credit Cards",
    "value": "Yes"
  },
  {
    "amenities_type": "Accepts Apple Pay",
    "value": "Yes"
  },
  {
    "amenities_type": "Accepts Google Pay",
    "value": "Yes"
  },
  {
    "amenities_type": "Accepts Cryptocurrency",
    "value": "No"
  },
  {
    "amenities_type": "Good For",
    "value": "Lunch, Dinner"
  },
  {
    "amenities_type": "Parking",
    "value": "Garage, Validated"
  },
  {
    "amenities_type": "Bike Parking",
    "value": "Yes"
  },
  {
    "amenities_type": "Wheelchair Accessible",
    "value": "Yes"
  },
  {
    "amenities_type": "Good for Kids",
    "value": "Yes"
  },
  {
    "amenities_type": "Good for Groups",
    "value": "Yes"
  },
  {
    "amenities_type": "Ambience",
    "value": "Touristy, Classy"
  },
  {
    "amenities_type": "Noise Level",
    "value": "Average"
  },
  {
    "amenities_type": "Good For Dancing",
    "value": "No"
  },
  {
    "amenities_type": "Alcohol",
    "value": "Full Bar"
  },
  {
    "amenities_type": "Good For Happy Hour",
    "value": "Yes"
  },
  {
    "amenities_type": "Best Nights",
    "value": "Fri, Sat, Sun"
  },
  {
    "amenities_type": "Coat Check",
    "value": "No"
  },
  {
    "amenities_type": "Smoking",
    "value": "No"
  },
  {
    "amenities_type": "Outdoor Seating",
    "value": "Yes"
  },
  {
    "amenities_type": "Wi-Fi",
    "value": "Free"
  },
  {
    "amenities_type": "Has TV",
    "value": "Yes"
  },
  {
    "amenities_type": "Waiter Service",
    "value": "Yes"
  },
  {
    "amenities_type": "Caters",
    "value": "No"
  },
  {
    "amenities_type": "Has Pool Table",
    "value": "No"
  },
  {
    "amenities_type": "Offers Military Discount",
    "value": "Yes"
  },
  {
    "amenities_type": "Open to All",
    "value": "Yes"
  }
]

const openingHoursSpecification = [
  "Mo 21:00-05:00",
  "Tu-We 22:00-05:00",
  "Th 21:00-05:00",
  "Fr-Sa 21:00-06:00",
  "Su 22:00-05:00"
]

const registeredAddress = {
  "streetAddress": "Torstr. 58/60",
  "city": "Berlin",
  "country": "DE",
  "zip": "10119",
  "fullAddress": "Torstr. 58/60, Berlin, 10119, DE"
}
const customerInformation = {
  "internalId": "ALL000002",
  "clientName": "Royalbeauty & Body GmbH",
  "clientSince": "2018-10-22",
  "products": [
    {
      "productName": "Building Insurance",
      "startDate": "2020-02-22",
      "expirationDate": "2021-02-22",
      "price": "100€"
    },
    {
      "productName": "Business content insurance",
      "startDate": "2020-02-22",
      "expirationDate": "2020-02-22",
      "price": "200€"
    }
  ],
  "potentialFurtherProducts": ["Legal Protection", "Financial Loss Liability", "Cyber Insurance"],
  "currentPremium": "100€",
  "additionalPremiumPotential": "3000€",
  "remainingContractTerm": "9 months",
  "recentChanges": "recently added retail sale of cosmetics and toilet atticles",
  "ownerPrivetelyInsured": "Yes",
  "numberOfClaims": "1",
  "existingSimilarCompanies":
    [
      {
        "internalId": "AL0000024",
        "companyName": "Sky Cosmetics Nails & More GmbH",
        "address": "Bernhard-Baestlein-Str. 3 10367 Berlin",
        "products":
          [
            {
              "productName": "Financial Loss Liability",
              "startDate": "2020-01-10",
              "expirationDate": "2021-01-10",
              "price": "200€"
            }
          ],
      },
      {
        "internalId": "AL000091",
        "companyName": "Beauty and Life UG(haftungsbeschränkt)",
        "address": "Carstennstr. 29 12205 Berlin",
        "products":
          [
            {
              "productName": "Building Insurance",
              "startDate": "2020-01-28",
              "expirationDate": "2021-01-28",
              "price": "450€"
            },
            {
              "productName": "Business content insurance",
              "startDate": "2020-01-28",
              "expirationDate": "2021-01-28",
              "price": "150€"
            }
          ],
      },
      {
        "internalId": "ALL000233",
        "companyName": "Sisters Beauty Care GmbH",
        "address": "Kurfuerstendamn 235 10719 Berlin",
        "products":
          [
            {
              "productName": "Building Insurance",
              "startDate": "2019-11-26",
              "expirationDate": "2020-11-26",
              "price": "320€",
            }
          ]
      },
      {
        "internalId": "ALL000235",
        "companyName": "S.C. Beauty Ventures GmbH",
        "address": "Bregenzer Str. 10 10707 Berlin",
        "products":
          [
            {
              "productName": "Building Insurance",
              "startDate": "2020-02-26",
              "expirationDate": "2021-02-26",
              "price": "450€"
            },
            {
              "productName": "Business content insurance",
              "startDate": "2020-02-26",
              "expirationDate": "2021-02-26",
              "price": "150€"
            },
            {
              "productName": "Financial Loss Liability",
              "startDate": "2020-01-26",
              "expirationDate": "2021-01-26",
              "price": "150€"
            }
          ],
      },
      {
        "internalId": "ALL008902",
        "companyName": "Beauty & Nails Doßmann KG",
        "address": "Fregestr. 36 12161 Berlin",
        "products":
          [
            {
              "productName": "Business content insurance",
              "startDate": "2019-10-26",
              "expirationDate": "2020-10-26",
              "price": "430€"
            },
            {
              "productName": "Financial Loss Liability",
              "startDate": "2019-10-26",
              "expirationDate": "2020-10-26",
              "price": "130€"
            },
          ]
      }
    ]
}

let lazyLoadingentity: any = {
  fetecherAPimade: [],
  threatrstabData: {},
  threatsTabFirsttime: true,
  leadershipTabFirsttime: true,
  financeTabFirsttime: true,
  riskTabFirsttime: true,
  newsTabFirsttime: true,
  socialMediaTabFirsttime: true,
  compliancetabFirsttime: true,
  fetcher_data: '',
  fetcherApiFirstTime: true,
  overviewTabFirsttime: true,
  mediaTabFirsttime: true,
  overviewFetchers: ['1016', '1013', '1006', '1021', '2001', '21', '1017'],
  complianceFetchers: ['1016'],
  leadershipFetchers: ['1016', '1006', '3', '1005', '26', '1021', '1009', '2001', '1004', '3001', '3002', '3003', '4001', '3008'],
  riskFetchers: ['1016', '20', '17', '9', '12', '10', '1001', '6', '14', '2003', '16', '11', '15', '1007', '2005', '2001', '1012'],
  newsTabFetchers: ['1016', '2001', '1011', '4001', '1003', '2004'],
  socialMediaFetchers: ['1016', '2001', '23', '3', '1017', '21'],
  mediaFetchers: ['1016', '1023'],
  OverviewLinkPresentOrNot: {}
};


const nearbyCompanies = [
  {
    "nearByposition": "1",
    "name": "Pirates Berlin",
    "SameAs": "https://www.yelp.com/biz/pirates-berlin-berlin-2?osq=Kaffee+Burger",
    "address": "Mühlenstr. 78 - 80, 10243 Berlin, Germany"
  }
]

const Json_path_obj = [
  { 'name': '911698039', path: 'assets/json/911698039.json' },
  { 'name': '919088290', path: 'assets/json/919088290.json' },
  { 'name': '947668308', path: 'assets/json/947668308.json' },
  { 'name': 'HRA53977B', path: 'assets/json/HRA53977B.json' },
  { 'name': 'A48125', path: 'assets/json/A48125.json' },
  { 'name': 'A53977B', path: 'assets/json/A53977B.json' },
  { 'name': 'B12238', path: 'assets/json/B12238.json' },
  { 'name': 'B24227B', path: 'assets/json/B24227B.json' },
  { 'name': 'B82334', path: 'assets/json/B82334.json' },
  { 'name': 'B104337', path: 'assets/json/B104337.json' },
  { 'name': 'B136803', path: 'assets/json/B136803.json' },
  { 'name': 'DE-151524886', path: 'assets/json/DE-151524886.json' },
  { 'name': 'DE-279554290', path: 'assets/json/DE-279554290.json' },
  { 'name': 'DE279554290', path: 'assets/json/DE279554290.json' },
  { 'name': 'DE288650344', path: 'assets/json/DE288650344.json' },
  { 'name': 'HRA48125B', path: 'assets/json/HRA48125B.json' },
  { 'name': 'HRB24227B', path: 'assets/json/HRB24227B.json' },
  { 'name': 'HRB82334', path: 'assets/json/HRB82334.json' },
  { 'name': 'HRB82334B', path: 'assets/json/HRB82334B.json' },
]
const socketData = {
  "created_at": "Wed Jun 17 13:41:38 +0000 2020",
  "id": 1273249446931902466,
  "id_str": "1273249446931902466",
  "text": "RT @pancaserola: tu segundo @ te debe esto. https://t.co/EIYmRauXTJ",
  "source": "<a href=\"http://twitter.com/download/android\" rel=\"nofollow\">Twitter for Android</a>",
  "truncated": false,
  "in_reply_to_status_id": null,
  "in_reply_to_status_id_str": null,
  "in_reply_to_user_id": null,
  "in_reply_to_user_id_str": null,
  "in_reply_to_screen_name": null,
  "user": {
    "id": 975255690,
    "id_str": "975255690",
    "name": "Arantxa18\u2661",
    "screen_name": "Arantxa243",
    "location": null,
    "url": "http://www.facebook.com/yoana.gimenes",
    "description": "Live as if you will die tomorrow. Learn as if you would always live. [Nct.Exo] #streamLongFlight",
    "translator_type": "none",
    "protected": false,
    "verified": false,
    "followers_count": 577,
    "friends_count": 2066,
    "listed_count": 2,
    "favourites_count": 12985,
    "statuses_count": 7771,
    "created_at": "Wed Nov 28 03:22:34 +0000 2012",
    "utc_offset": null,
    "time_zone": null,
    "geo_enabled": false,
    "lang": null,
    "contributors_enabled": false,
    "is_translator": false,
    "profile_background_color": "111111",
    "profile_background_image_url": "http://abs.twimg.com/images/themes/theme10/bg.gif",
    "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme10/bg.gif",
    "profile_background_tile": true,
    "profile_link_color": "111111",
    "profile_sidebar_border_color": "000000",
    "profile_sidebar_fill_color": "DDEEF6",
    "profile_text_color": "333333",
    "profile_use_background_image": true,
    "profile_image_url": "http://pbs.twimg.com/profile_images/1272610338358386691/AnsGQo_Z_normal.jpg",
    "profile_image_url_https": "https://pbs.twimg.com/profile_images/1272610338358386691/AnsGQo_Z_normal.jpg",
    "default_profile": false,
    "default_profile_image": false,
    "following": null,
    "follow_request_sent": null,
    "notifications": null
  },
  "geo": null,
  "coordinates": null,
  "place": null,
  "contributors": null,
  "retweeted_status": {
    "created_at": "Tue Jun 16 21:06:58 +0000 2020",
    "id": 1272999129178943494,
    "id_str": "1272999129178943494",
    "text": "tu segundo @ te debe esto. https://t.co/EIYmRauXTJ",
    "display_text_range": [0, 26],
    "source": "<a href=\"https://mobile.twitter.com\" rel=\"nofollow\">Twitter Web App</a>",
    "truncated": false,
    "in_reply_to_status_id": null,
    "in_reply_to_status_id_str": null,
    "in_reply_to_user_id": null,
    "in_reply_to_user_id_str": null,
    "in_reply_to_screen_name": null,
    "user": {
      "id": 855224411800121344,
      "id_str": "855224411800121344",
      "name": "ppupi",
      "screen_name": "pancaserola",
      "location": "Sunchales",
      "url": "https://www.instagram.com/agusspupii/?hl=es-la",
      "description": "trafico pan casero. TENGO 16, NO 22",
      "translator_type": "none",
      "protected": false,
      "verified": false,
      "followers_count": 21323,
      "friends_count": 1970,
      "listed_count": 2,
      "favourites_count": 13722,
      "statuses_count": 4872,
      "created_at": "Fri Apr 21 00:59:23 +0000 2017",
      "utc_offset": null,
      "time_zone": null,
      "geo_enabled": false,
      "lang": null,
      "contributors_enabled": false,
      "is_translator": false,
      "profile_background_color": "000000",
      "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
      "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
      "profile_background_tile": false,
      "profile_link_color": "E81C4F",
      "profile_sidebar_border_color": "000000",
      "profile_sidebar_fill_color": "000000",
      "profile_text_color": "000000",
      "profile_use_background_image": false,
      "profile_image_url": "http://pbs.twimg.com/profile_images/1268440993478606849/ugIIWioh_normal.jpg",
      "profile_image_url_https": "https://pbs.twimg.com/profile_images/1268440993478606849/ugIIWioh_normal.jpg",
      "profile_banner_url": "https://pbs.twimg.com/profile_banners/855224411800121344/1585704771",
      "default_profile": false,
      "default_profile_image": false,
      "following": null,
      "follow_request_sent": null,
      "notifications": null
    },
    "geo": null,
    "coordinates": null,
    "place": null,
    "contributors": null,
    "is_quote_status": false,
    "quote_count": 2257,
    "reply_count": 5936,
    "retweet_count": 779,
    "favorite_count": 17656,
    "entities": {
      "hashtags": [],
      "urls": [],
      "user_mentions": [],
      "symbols": [],
      "media": [{
        "id": 1272998849859260417,
        "id_str": "1272998849859260417",
        "indices": [27, 50],
        "media_url": "http://pbs.twimg.com/media/EaqZtZVXkAEy2pP.png",
        "media_url_https": "https://pbs.twimg.com/media/EaqZtZVXkAEy2pP.png",
        "url": "https://t.co/EIYmRauXTJ",
        "display_url": "pic.twitter.com/EIYmRauXTJ",
        "expanded_url": "https://twitter.com/pancaserola/status/1272999129178943494/photo/1",
        "type": "photo",
        "sizes": {
          "medium": {
            "w": 289,
            "h": 360,
            "resize": "fit"
          },
          "thumb": {
            "w": 150,
            "h": 150,
            "resize": "crop"
          },
          "small": {
            "w": 289,
            "h": 360,
            "resize": "fit"
          },
          "large": {
            "w": 289,
            "h": 360,
            "resize": "fit"
          }
        }
      }]
    },
    "extended_entities": {
      "media": [{
        "id": 1272998849859260417,
        "id_str": "1272998849859260417",
        "indices": [27, 50],
        "media_url": "http://pbs.twimg.com/media/EaqZtZVXkAEy2pP.png",
        "media_url_https": "https://pbs.twimg.com/media/EaqZtZVXkAEy2pP.png",
        "url": "https://t.co/EIYmRauXTJ",
        "display_url": "pic.twitter.com/EIYmRauXTJ",
        "expanded_url": "https://twitter.com/pancaserola/status/1272999129178943494/photo/1",
        "type": "photo",
        "sizes": {
          "medium": {
            "w": 289,
            "h": 360,
            "resize": "fit"
          },
          "thumb": {
            "w": 150,
            "h": 150,
            "resize": "crop"
          },
          "small": {
            "w": 289,
            "h": 360,
            "resize": "fit"
          },
          "large": {
            "w": 289,
            "h": 360,
            "resize": "fit"
          }
        }
      }, {
        "id": 1272998870973386752,
        "id_str": "1272998870973386752",
        "indices": [27, 50],
        "media_url": "http://pbs.twimg.com/media/EaqZun_XkAAonEN.png",
        "media_url_https": "https://pbs.twimg.com/media/EaqZun_XkAAonEN.png",
        "url": "https://t.co/EIYmRauXTJ",
        "display_url": "pic.twitter.com/EIYmRauXTJ",
        "expanded_url": "https://twitter.com/pancaserola/status/1272999129178943494/photo/1",
        "type": "photo",
        "sizes": {
          "large": {
            "w": 270,
            "h": 360,
            "resize": "fit"
          },
          "small": {
            "w": 270,
            "h": 360,
            "resize": "fit"
          },
          "medium": {
            "w": 270,
            "h": 360,
            "resize": "fit"
          },
          "thumb": {
            "w": 150,
            "h": 150,
            "resize": "crop"
          }
        }
      }]
    },
    "favorited": false,
    "retweeted": false,
    "possibly_sensitive": false,
    "filter_level": "low",
    "lang": "es"
  },
  "is_quote_status": false,
  "quote_count": 0,
  "reply_count": 0,
  "retweet_count": 0,
  "favorite_count": 0,
  "entities": {
    "hashtags": [],
    "urls": [],
    "user_mentions": [{
      "screen_name": "pancaserola",
      "name": "ppupi",
      "id": 855224411800121344,
      "id_str": "855224411800121344",
      "indices": [3, 15]
    }],
    "symbols": [],
    "media": [{
      "id": 1272998849859260417,
      "id_str": "1272998849859260417",
      "indices": [44, 67],
      "media_url": "http://pbs.twimg.com/media/EaqZtZVXkAEy2pP.png",
      "media_url_https": "https://pbs.twimg.com/media/EaqZtZVXkAEy2pP.png",
      "url": "https://t.co/EIYmRauXTJ",
      "display_url": "pic.twitter.com/EIYmRauXTJ",
      "expanded_url": "https://twitter.com/pancaserola/status/1272999129178943494/photo/1",
      "type": "photo",
      "sizes": {
        "medium": {
          "w": 289,
          "h": 360,
          "resize": "fit"
        },
        "thumb": {
          "w": 150,
          "h": 150,
          "resize": "crop"
        },
        "small": {
          "w": 289,
          "h": 360,
          "resize": "fit"
        },
        "large": {
          "w": 289,
          "h": 360,
          "resize": "fit"
        }
      },
      "source_status_id": 1272999129178943494,
      "source_status_id_str": "1272999129178943494",
      "source_user_id": 855224411800121344,
      "source_user_id_str": "855224411800121344"
    }]
  },
  "extended_entities": {
    "media": [{
      "id": 1272998849859260417,
      "id_str": "1272998849859260417",
      "indices": [44, 67],
      "media_url": "http://pbs.twimg.com/media/EaqZtZVXkAEy2pP.png",
      "media_url_https": "https://pbs.twimg.com/media/EaqZtZVXkAEy2pP.png",
      "url": "https://t.co/EIYmRauXTJ",
      "display_url": "pic.twitter.com/EIYmRauXTJ",
      "expanded_url": "https://twitter.com/pancaserola/status/1272999129178943494/photo/1",
      "type": "photo",
      "sizes": {
        "medium": {
          "w": 289,
          "h": 360,
          "resize": "fit"
        },
        "thumb": {
          "w": 150,
          "h": 150,
          "resize": "crop"
        },
        "small": {
          "w": 289,
          "h": 360,
          "resize": "fit"
        },
        "large": {
          "w": 289,
          "h": 360,
          "resize": "fit"
        }
      },
      "source_status_id": 1272999129178943494,
      "source_status_id_str": "1272999129178943494",
      "source_user_id": 855224411800121344,
      "source_user_id_str": "855224411800121344"
    }, {
      "id": 1272998870973386752,
      "id_str": "1272998870973386752",
      "indices": [44, 67],
      "media_url": "http://pbs.twimg.com/media/EaqZun_XkAAonEN.png",
      "media_url_https": "https://pbs.twimg.com/media/EaqZun_XkAAonEN.png",
      "url": "https://t.co/EIYmRauXTJ",
      "display_url": "pic.twitter.com/EIYmRauXTJ",
      "expanded_url": "https://twitter.com/pancaserola/status/1272999129178943494/photo/1",
      "type": "photo",
      "sizes": {
        "large": {
          "w": 270,
          "h": 360,
          "resize": "fit"
        },
        "small": {
          "w": 270,
          "h": 360,
          "resize": "fit"
        },
        "medium": {
          "w": 270,
          "h": 360,
          "resize": "fit"
        },
        "thumb": {
          "w": 150,
          "h": 150,
          "resize": "crop"
        }
      },
      "source_status_id": 1272999129178943494,
      "source_status_id_str": "1272999129178943494",
      "source_user_id": 855224411800121344,
      "source_user_id_str": "855224411800121344"
    }]
  },
  "favorited": false,
  "retweeted": false,
  "possibly_sensitive": false,
  "filter_level": "low",
  "lang": "es",
  "timestamp_ms": "1592401298636"
}
const PersonKeys = [
  'name', 'first_name', 'family_name', 'mention_id', 'source_url', 'home_location', 'address', 'job_title',
  'images', 'alternative_names', 'date_of_birth', 'place_of_birth', 'spouse', 'children', 'email', 'gender', 'nationality', 'alumni_of','works_for','recommendations','skills'
]
const personEducationKeys = [
  'entity_type',
  'name',
  'image',
  'degreeName',
  'courseName',
  'startDate',
  'endDate',
  'period',
  'sameAs',
  'address',
  'primiarySources',
  'secondarySources',
  'primarySourceLength',
  'secondarySourceLength',
  'url'
]
const personWorkKeys=[
  'entity_type',
  'name',
  'jobTitle',
  'startDate',
  'endDate',
  'image',
  'jobSummary',
  'period',
  'sameAs',
  'address',
  'primiarySources',
  'secondarySources',
  'primarySourceLength',
  'secondarySourceLength',
  'url'

]
const PersonGeneralInfoKeys = [
  // alternative_names
  // locality
  // postal_address postal_code region country
  { 'key': 'first_name', 'displayName': 'Given Name', 'subkey': 'first_name' },
  { 'key': 'alternative_names', 'displayName': 'Additional Name', 'subkey': 'alternative_names' },
  { 'key': 'street_address', 'displayName': 'Postal Address', 'subkey': 'street_address' },

  { 'key': 'family_name', 'displayName': 'Family Name', 'subkey': 'family_name' },
  { 'key': 'email', 'displayName': 'Email', 'subkey': 'email' },
  { 'key': 'locality', 'displayName': 'Address Locality', 'subkey': 'locality' },

  { 'key': 'job_title', 'displayName': 'Job Title', 'subkey': 'job_title' },
  { 'key': 'date_of_birth', 'displayName': 'Birth Date', 'subkey': 'date_of_birth' },
  { 'key': 'city', 'displayName': 'Postal City', 'subkey': 'city' },

  { 'key': 'gender', 'displayName': 'Gender', 'subkey': 'gender' },
  { 'key': 'place_of_birth', 'displayName': 'Birth Place', 'subkey': 'place_of_birth' },
  { 'key': 'country', 'displayName': 'Address Country', 'subkey': 'country' },

  { 'key': 'nationality', 'displayName': 'Nationality', 'subkey': 'nationality' },
  { 'key': 'region', 'displayName': 'Address Region', 'subkey': 'region' },
  { 'key': 'postal_code', 'displayName': 'Postal Code', 'subkey': 'postal_code' }
]
const personSearchConstant = {
  "cached": true,
  "results": {
    "16e3da6dbb03afd233406d8061829071": {
      "name": {
        "corporationwiki": [
          {
            "value": "Bill Gates",
            "credibility": 9,
            "source_url": "https://www.corporationwiki.com/Arizona/Mayer/bill-gates/49780544.aspx"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Kentucky/Upton/bill-gates/87210349.aspx"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Ohio/Elyria/bill-gates/89345173.aspx"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/California/Irvine/bill-gates/94963813.aspx"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Pennsylvania/Philadelphia/bill-gates/91009667.aspx"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Texas/Roanoke/bill-gates/38836005.aspx"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/California/Sunnyvale/bill-gates/61200456.aspx"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2i51t2/bill-gates"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Nevada/Reno/bill-gates/65138149.aspx"
          }
        ],
        "spoke": [
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c10088a9b20"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c100885903a"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c10088626a7"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c1005756285"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c1003dad377"
          }
        ],
        "ussearch": [
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          }
        ],
        "bst_tag": [
          {
            "value": "Bill gates",
            "credibility": 0,
            "source_url": ""
          }
        ],
        "wikipedia": [
          {
            "value": "Bill Gates Sr.",
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Bill_Gates_Sr."
          },
          {
            "value": "Bill Gates",
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Bill_Gates"
          }
        ]
      },
      "first_name": {
        "corporationwiki": [
          {
            "value": "Bill",
            "credibility": 9,
            "source_url": "https://www.corporationwiki.com/Arizona/Mayer/bill-gates/49780544.aspx"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Kentucky/Upton/bill-gates/87210349.aspx"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Ohio/Elyria/bill-gates/89345173.aspx"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/California/Irvine/bill-gates/94963813.aspx"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Pennsylvania/Philadelphia/bill-gates/91009667.aspx"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Texas/Roanoke/bill-gates/38836005.aspx"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/California/Sunnyvale/bill-gates/61200456.aspx"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2i51t2/bill-gates"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Nevada/Reno/bill-gates/65138149.aspx"
          }
        ],
        "spoke": [
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c10088a9b20"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c100885903a"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c10088626a7"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c1005756285"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c1003dad377"
          }
        ],
        "ussearch": [
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Bill",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          }
        ]
      },
      "family_name": {
        "corporationwiki": [
          {
            "value": "Gates",
            "credibility": 9,
            "source_url": "https://www.corporationwiki.com/Arizona/Mayer/bill-gates/49780544.aspx"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Kentucky/Upton/bill-gates/87210349.aspx"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Ohio/Elyria/bill-gates/89345173.aspx"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/California/Irvine/bill-gates/94963813.aspx"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Pennsylvania/Philadelphia/bill-gates/91009667.aspx"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Texas/Roanoke/bill-gates/38836005.aspx"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/California/Sunnyvale/bill-gates/61200456.aspx"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2i51t2/bill-gates"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Nevada/Reno/bill-gates/65138149.aspx"
          }
        ],
        "spoke": [
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c10088a9b20"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c100885903a"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c10088626a7"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c1005756285"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c1003dad377"
          }
        ],
        "ussearch": [
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Gates",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          }
        ]
      },
      "entity_type": "person",
      "mention_id": {
        "corporationwiki": [
          {
            "value": "cGVyc29uL2NvcnBvcmF0aW9ud2lraS5jb20vc2VhcmNoLXJlcy00MTMyZmM4YTY1YjRiZTJiODhjNWU0ZjFlNjhlMjVjMi5qc29uXzU=",
            "credibility": 9,
            "source_url": "https://www.corporationwiki.com/Arizona/Mayer/bill-gates/49780544.aspx"
          },
          {
            "value": "cGVyc29uL2NvcnBvcmF0aW9ud2lraS5jb20vc2VhcmNoLXJlcy00MTMyZmM4YTY1YjRiZTJiODhjNWU0ZjFlNjhlMjVjMi5qc29uXzk=",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Kentucky/Upton/bill-gates/87210349.aspx"
          },
          {
            "value": "cGVyc29uL2NvcnBvcmF0aW9ud2lraS5jb20vc2VhcmNoLXJlcy00MTMyZmM4YTY1YjRiZTJiODhjNWU0ZjFlNjhlMjVjMi5qc29uXzM=",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Ohio/Elyria/bill-gates/89345173.aspx"
          },
          {
            "value": "cGVyc29uL2NvcnBvcmF0aW9ud2lraS5jb20vc2VhcmNoLXJlcy00MTMyZmM4YTY1YjRiZTJiODhjNWU0ZjFlNjhlMjVjMi5qc29uXzc=",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/California/Irvine/bill-gates/94963813.aspx"
          },
          {
            "value": "cGVyc29uL2NvcnBvcmF0aW9ud2lraS5jb20vc2VhcmNoLXJlcy00MTMyZmM4YTY1YjRiZTJiODhjNWU0ZjFlNjhlMjVjMi5qc29uXzQ=",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Pennsylvania/Philadelphia/bill-gates/91009667.aspx"
          },
          {
            "value": "cGVyc29uL2NvcnBvcmF0aW9ud2lraS5jb20vc2VhcmNoLXJlcy00MTMyZmM4YTY1YjRiZTJiODhjNWU0ZjFlNjhlMjVjMi5qc29uXzE=",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Texas/Roanoke/bill-gates/38836005.aspx"
          },
          {
            "value": "cGVyc29uL2NvcnBvcmF0aW9ud2lraS5jb20vc2VhcmNoLXJlcy00MTMyZmM4YTY1YjRiZTJiODhjNWU0ZjFlNjhlMjVjMi5qc29uXzg=",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/California/Sunnyvale/bill-gates/61200456.aspx"
          },
          {
            "value": "cGVyc29uL2NvcnBvcmF0aW9ud2lraS5jb20vc2VhcmNoLXJlcy00MTMyZmM4YTY1YjRiZTJiODhjNWU0ZjFlNjhlMjVjMi5qc29uXzI=",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2i51t2/bill-gates"
          },
          {
            "value": "cGVyc29uL2NvcnBvcmF0aW9ud2lraS5jb20vc2VhcmNoLXJlcy00MTMyZmM4YTY1YjRiZTJiODhjNWU0ZjFlNjhlMjVjMi5qc29uXzY=",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Nevada/Reno/bill-gates/65138149.aspx"
          }
        ],
        "spoke": [
          {
            "value": "cGVyc29uL3Nwb2tlLmNvbS9zZWFyY2gtcmVzLTA0Yzg0YzdkZGUxY2U5ZTJiMmNjZmMwOGMwMTIyMTNiLmpzb25fMw==",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c10088a9b20"
          },
          {
            "value": "cGVyc29uL3Nwb2tlLmNvbS9zZWFyY2gtcmVzLTA0Yzg0YzdkZGUxY2U5ZTJiMmNjZmMwOGMwMTIyMTNiLmpzb25fMg==",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c100885903a"
          },
          {
            "value": "cGVyc29uL3Nwb2tlLmNvbS9zZWFyY2gtcmVzLTA0Yzg0YzdkZGUxY2U5ZTJiMmNjZmMwOGMwMTIyMTNiLmpzb25fNA==",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c10088626a7"
          },
          {
            "value": "cGVyc29uL3Nwb2tlLmNvbS9zZWFyY2gtcmVzLTA0Yzg0YzdkZGUxY2U5ZTJiMmNjZmMwOGMwMTIyMTNiLmpzb25fMA==",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c1005756285"
          },
          {
            "value": "cGVyc29uL3Nwb2tlLmNvbS9zZWFyY2gtcmVzLTA0Yzg0YzdkZGUxY2U5ZTJiMmNjZmMwOGMwMTIyMTNiLmpzb25fMQ==",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c1003dad377"
          }
        ],
        "ussearch": [
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTIyYWRiODdkOGU0MDU2NzZjOGY3ZTYxNjMxODBmNDM4Lmpzb25fNQ==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTIyYWRiODdkOGU0MDU2NzZjOGY3ZTYxNjMxODBmNDM4Lmpzb25fNA==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTIyYWRiODdkOGU0MDU2NzZjOGY3ZTYxNjMxODBmNDM4Lmpzb25fMw==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTIyYWRiODdkOGU0MDU2NzZjOGY3ZTYxNjMxODBmNDM4Lmpzb25fNw==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTIyYWRiODdkOGU0MDU2NzZjOGY3ZTYxNjMxODBmNDM4Lmpzb25fNg==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTIyYWRiODdkOGU0MDU2NzZjOGY3ZTYxNjMxODBmNDM4Lmpzb25fOA==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTIyYWRiODdkOGU0MDU2NzZjOGY3ZTYxNjMxODBmNDM4Lmpzb25fMg==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTIyYWRiODdkOGU0MDU2NzZjOGY3ZTYxNjMxODBmNDM4Lmpzb25fMA==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTIyYWRiODdkOGU0MDU2NzZjOGY3ZTYxNjMxODBmNDM4Lmpzb25fOQ==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTIyYWRiODdkOGU0MDU2NzZjOGY3ZTYxNjMxODBmNDM4Lmpzb25fMQ==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          }
        ],
        "bst_tag": [
          {
            "value": "2ddc8c2bb88b122fad87000d44fc202c4aee2f1b6a562a5c5cfc688e503a2ab4",
            "credibility": 0,
            "source_url": ""
          }
        ],
        "wikipedia": [
          {
            "value": "cGVyc29uL3dpa2lwZWRpYS5jb20vc2VhcmNoLXJlcy04NzkwNzVjNTZlNTgxMzQwZWQ3NjViOGViNjc2OGY1ZS5qc29uXzE=",
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Bill_Gates_Sr."
          },
          {
            "value": "cGVyc29uL3dpa2lwZWRpYS5jb20vc2VhcmNoLXJlcy04NzkwNzVjNTZlNTgxMzQwZWQ3NjViOGViNjc2OGY1ZS5qc29uXzA=",
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Bill_Gates"
          }
        ]
      },
      "source_url": {
        "corporationwiki": [
          {
            "value": "https://www.corporationwiki.com/Arizona/Mayer/bill-gates/49780544.aspx",
            "credibility": 9,
            "source_url": "https://www.corporationwiki.com/Arizona/Mayer/bill-gates/49780544.aspx"
          },
          {
            "value": "https://www.corporationwiki.com/Kentucky/Upton/bill-gates/87210349.aspx",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Kentucky/Upton/bill-gates/87210349.aspx"
          },
          {
            "value": "https://www.corporationwiki.com/Ohio/Elyria/bill-gates/89345173.aspx",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Ohio/Elyria/bill-gates/89345173.aspx"
          },
          {
            "value": "https://www.corporationwiki.com/California/Irvine/bill-gates/94963813.aspx",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/California/Irvine/bill-gates/94963813.aspx"
          },
          {
            "value": "https://www.corporationwiki.com/Pennsylvania/Philadelphia/bill-gates/91009667.aspx",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Pennsylvania/Philadelphia/bill-gates/91009667.aspx"
          },
          {
            "value": "https://www.corporationwiki.com/Texas/Roanoke/bill-gates/38836005.aspx",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Texas/Roanoke/bill-gates/38836005.aspx"
          },
          {
            "value": "https://www.corporationwiki.com/California/Sunnyvale/bill-gates/61200456.aspx",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/California/Sunnyvale/bill-gates/61200456.aspx"
          },
          {
            "value": "https://www.corporationwiki.com/p/2i51t2/bill-gates",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2i51t2/bill-gates"
          },
          {
            "value": "https://www.corporationwiki.com/Nevada/Reno/bill-gates/65138149.aspx",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Nevada/Reno/bill-gates/65138149.aspx"
          }
        ],
        "spoke": [
          {
            "value": "http://www.spoke.com/people/bill-gates-3e1429c09e597c10088a9b20",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c10088a9b20"
          },
          {
            "value": "http://www.spoke.com/people/bill-gates-3e1429c09e597c100885903a",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c100885903a"
          },
          {
            "value": "http://www.spoke.com/people/bill-gates-3e1429c09e597c10088626a7",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c10088626a7"
          },
          {
            "value": "http://www.spoke.com/people/bill-gates-3e1429c09e597c1005756285",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c1005756285"
          },
          {
            "value": "http://www.spoke.com/people/bill-gates-3e1429c09e597c1003dad377",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c1003dad377"
          }
        ],
        "ussearch": [
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          }
        ],
        "wikipedia": [
          {
            "value": "https://en.wikipedia.org/wiki/Bill_Gates_Sr.",
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Bill_Gates_Sr."
          },
          {
            "value": "https://en.wikipedia.org/wiki/Bill_Gates",
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Bill_Gates"
          }
        ]
      },
      "home_location": {
        "corporationwiki": [
          {
            "value": {
              "entity_type": "Place",
              "address": {
                "entity_type": "PostalAddress",
                "country": "USA",
                "region": "",
                "locality": ""
              }
            },
            "credibility": 9,
            "source_url": "https://www.corporationwiki.com/Arizona/Mayer/bill-gates/49780544.aspx"
          },
          {
            "value": {
              "entity_type": "Place",
              "address": {
                "entity_type": "PostalAddress",
                "country": "USA",
                "region": "KY",
                "locality": "Upton,KY"
              }
            },
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Kentucky/Upton/bill-gates/87210349.aspx"
          },
          {
            "value": {
              "entity_type": "Place",
              "address": {
                "entity_type": "PostalAddress",
                "country": "USA",
                "region": "OH",
                "locality": "Elyria,OH"
              }
            },
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Ohio/Elyria/bill-gates/89345173.aspx"
          },
          {
            "value": {
              "entity_type": "Place",
              "address": {
                "entity_type": "PostalAddress",
                "country": "USA",
                "region": "CA",
                "locality": "Irvine,CA"
              }
            },
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/California/Irvine/bill-gates/94963813.aspx"
          },
          {
            "value": {
              "entity_type": "Place",
              "address": {
                "entity_type": "PostalAddress",
                "country": "USA",
                "region": "PA",
                "locality": "Philadelphia,PA"
              }
            },
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Pennsylvania/Philadelphia/bill-gates/91009667.aspx"
          },
          {
            "value": {
              "entity_type": "Place",
              "address": {
                "entity_type": "PostalAddress",
                "country": "USA",
                "region": "TX",
                "locality": "Roanoke,TX"
              }
            },
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Texas/Roanoke/bill-gates/38836005.aspx"
          },
          {
            "value": {
              "entity_type": "Place",
              "address": {
                "entity_type": "PostalAddress",
                "country": "USA",
                "region": "CA",
                "locality": "Sunnyvale,CA"
              }
            },
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/California/Sunnyvale/bill-gates/61200456.aspx"
          },
          {
            "value": {
              "entity_type": "Place",
              "address": {
                "entity_type": "PostalAddress",
                "country": "USA",
                "region": "IA",
                "locality": "Sioux City,IA"
              }
            },
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2i51t2/bill-gates"
          },
          {
            "value": {
              "entity_type": "Place",
              "address": {
                "entity_type": "PostalAddress",
                "country": "USA",
                "region": "NV",
                "locality": "Reno,NV"
              }
            },
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Nevada/Reno/bill-gates/65138149.aspx"
          }
        ]
      },
      "address": {
        "corporationwiki": [
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "postal_code": "86333",
                "street_address": "PO Box 219",
                "locality": "Mayer",
                "city": "AZ",
                "country": "USA"
              },
              {
                "entity_type": "PostalAddress",
                "postal_code": "14411",
                "street_address": "3070 Gaines Basin Rd",
                "locality": "Albion",
                "city": "NY",
                "country": "USA"
              },
              {
                "entity_type": "PostalAddress",
                "postal_code": "86333",
                "street_address": "",
                "locality": "Mayer",
                "city": "AZ",
                "country": "USA"
              }
            ],
            "credibility": 9,
            "source_url": "https://www.corporationwiki.com/Arizona/Mayer/bill-gates/49780544.aspx"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "postal_code": "42784",
                "street_address": "1219 Upton Talley Rd",
                "locality": "Upton",
                "city": "KY",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Kentucky/Upton/bill-gates/87210349.aspx"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "postal_code": "44035",
                "street_address": "42345 Oberlin Elyria Rd",
                "locality": "Elyria",
                "city": "OH",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Ohio/Elyria/bill-gates/89345173.aspx"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "postal_code": "92612",
                "street_address": "18101 Von Karman Ave",
                "locality": "Irvine",
                "city": "CA",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/California/Irvine/bill-gates/94963813.aspx"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "postal_code": "19154",
                "street_address": "2903 Southampton Rd",
                "locality": "Philadelphia",
                "city": "PA",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Pennsylvania/Philadelphia/bill-gates/91009667.aspx"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "postal_code": "76262",
                "street_address": "1590 Windy Oaks Dr",
                "locality": "Roanoke",
                "city": "TX",
                "country": "USA"
              },
              {
                "entity_type": "PostalAddress",
                "postal_code": "76262",
                "street_address": "12005 Cleveland Gibbs Rd",
                "locality": "Roanoke",
                "city": "TX",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Texas/Roanoke/bill-gates/38836005.aspx"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "postal_code": "94085",
                "street_address": "1250 E Arques Ave",
                "locality": "Sunnyvale",
                "city": "CA",
                "country": "USA"
              },
              {
                "entity_type": "PostalAddress",
                "postal_code": "94088",
                "street_address": "PO Box 3470",
                "locality": "Sunnyvale",
                "city": "CA",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/California/Sunnyvale/bill-gates/61200456.aspx"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "postal_code": "51106",
                "street_address": "1919 Grand Ave",
                "locality": "Sioux City",
                "city": "IA",
                "country": "USA"
              },
              {
                "entity_type": "PostalAddress",
                "postal_code": "57049",
                "street_address": "200 S Derby Ln",
                "locality": "North Sioux City",
                "city": "SD",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2i51t2/bill-gates"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "postal_code": "89509",
                "street_address": "30 Strawberry Ln",
                "locality": "Reno",
                "city": "NV",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Nevada/Reno/bill-gates/65138149.aspx"
          }
        ],
        "spoke": [
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "country": "USA",
                "locality": "Bellevue",
                "city": "WA"
              }
            ],
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c10088a9b20"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "country": "USA",
                "locality": "Griffin",
                "city": "GA"
              }
            ],
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c100885903a"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "country": "USA",
                "locality": "Cody",
                "city": "WY"
              }
            ],
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c10088626a7"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "country": "USA",
                "locality": "Seattle",
                "city": "WA"
              }
            ],
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c1005756285"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "country": "USA",
                "locality": "Reston",
                "city": "VA"
              }
            ],
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c1003dad377"
          }
        ],
        "ussearch": [
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "Buhl,",
                "country": "ID"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "Black River Falls,",
                "country": "WI"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Stone Lake,",
                "country": "WI"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Woodstock,",
                "country": "IL"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "Sandy,",
                "country": "UT"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Sandy City,",
                "country": "UT"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "Fort Gibson,",
                "country": "OK"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "Poolville,",
                "country": "TX"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Mesquite,",
                "country": "TX"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Garland,",
                "country": "TX"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "Fresno,",
                "country": "CA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "Vienna,",
                "country": "GA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Jonesboro,",
                "country": "AR"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "Roanoke,",
                "country": "TX"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Keller,",
                "country": "TX"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Azle,",
                "country": "TX"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Waterford,",
                "country": "MI"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Maynard,",
                "country": "AR"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Charlotte,",
                "country": "NC"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "Tallahassee,",
                "country": "FL"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          }
        ]
      },
      "job_title": {
        "spoke": [
          {
            "value": "General Counsel",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c10088a9b20"
          },
          {
            "value": "Member",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c100885903a"
          },
          {
            "value": "Board member",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c10088626a7"
          },
          {
            "value": "Director",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c1005756285"
          },
          {
            "value": "Vice President of Recruiting",
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c1003dad377"
          }
        ],
        "corporationwiki": [
          {
            "value": "Previous Chief Executive Officer for Granite Outlet",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Kentucky/Upton/bill-gates/87210349.aspx"
          },
          {
            "value": "Principal for Salim Interiors LLC",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Ohio/Elyria/bill-gates/89345173.aspx"
          },
          {
            "value": "Previous Chief Technology Officer for Chestnut Ridge Energy Company",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/California/Irvine/bill-gates/94963813.aspx"
          },
          {
            "value": "President for I P Graphics, Inc",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Pennsylvania/Philadelphia/bill-gates/91009667.aspx"
          },
          {
            "value": "Previous Member        for Cinemation Design, LLC",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Texas/Roanoke/bill-gates/38836005.aspx"
          },
          {
            "value": "Vice-President for Fujitsu America, Inc.",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/California/Sunnyvale/bill-gates/61200456.aspx"
          },
          {
            "value": "Sales Director for Flo Kay Industries Inc",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2i51t2/bill-gates"
          },
          {
            "value": "NonDir for Gates Plumbing Incorporated",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Nevada/Reno/bill-gates/65138149.aspx"
          }
        ]
      },
      "images": {
        "spoke": [
          {
            "value": [
              "//d2av4gdkc1dvps.cloudfront.net/assets/person-square110-3b769de56ff5a6cf9b8b18db07becda6.png"
            ],
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c10088a9b20"
          },
          {
            "value": [
              "//d2av4gdkc1dvps.cloudfront.net/assets/person-square110-3b769de56ff5a6cf9b8b18db07becda6.png"
            ],
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c100885903a"
          },
          {
            "value": [
              "//d2av4gdkc1dvps.cloudfront.net/assets/person-square110-3b769de56ff5a6cf9b8b18db07becda6.png"
            ],
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c10088626a7"
          },
          {
            "value": [
              "//d2av4gdkc1dvps.cloudfront.net/assets/person-square110-3b769de56ff5a6cf9b8b18db07becda6.png"
            ],
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c1005756285"
          },
          {
            "value": [
              "//d2av4gdkc1dvps.cloudfront.net/assets/person-square110-3b769de56ff5a6cf9b8b18db07becda6.png"
            ],
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c1003dad377"
          }
        ]
      },
      "alternative_names": {
        "ussearch": [
          {
            "value": [
              "Connie Gates",
              "Jeffrey Gates",
              "Lloyd Gates",
              "Lois Gates",
              "Wendy Neuman"
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              "Brian Gates",
              "Dave Gates",
              "Jeffrey Gates",
              "Merianne Gates",
              "Nancy Gates",
              "Shelby Gates",
              "Steven Gates"
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              "Reba Gates"
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              "David Gates",
              "Nina Gates",
              "Sherry Gates"
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              "Earl Clark",
              "Milton Mcwilliams",
              "Mary Troutman"
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              "Aaron Gates",
              "Angelique Gates",
              "Betty Gates",
              "Dwayne Gates",
              "Samuel Gates"
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          }
        ],
        "spoke": [
          {
            "value": [
              "William Gates Sr",
              "William Gates"
            ],
            "credibility": 3,
            "source_url": "http://www.spoke.com/people/bill-gates-3e1429c09e597c1005756285"
          }
        ]
      },
      "date_of_birth": {
        "wikipedia": [
          {
            "value": [
              "1925-11-30"
            ],
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Bill_Gates_Sr."
          },
          {
            "value": [
              "1955-10-28"
            ],
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Bill_Gates"
          }
        ]
      },
      "place_of_birth": {
        "wikipedia": [
          {
            "value": [
              "U.S."
            ],
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Bill_Gates_Sr."
          },
          {
            "value": [
              "U.S."
            ],
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Bill_Gates"
          }
        ]
      },
      "spouse": {
        "wikipedia": [
          {
            "value": [
              {
                "entity_type": "Person",
                "first_name": "Mary",
                "last_name": "Maxwell\n"
              },
              {
                "entity_type": "Person",
                "first_name": "Mimi",
                "last_name": "Gardner\n"
              }
            ],
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Bill_Gates_Sr."
          },
          {
            "value": [
              {
                "entity_type": "Person",
                "first_name": "Melinda",
                "last_name": "Gates"
              }
            ],
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Bill_Gates"
          }
        ]
      },
      "children": {
        "wikipedia": [
          {
            "value": [
              {
                "entity_type": "Person",
                "first_name": "",
                "last_name": "including"
              }
            ],
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Bill_Gates_Sr."
          },
          {
            "value": [
              {
                "entity_type": "Person",
                "first_name": ""
              }
            ],
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Bill_Gates"
          }
        ]
      }
    },
    "f12c723e8ed6f75e2db18966f8df6aa9": {
      "name": {
        "melissa": [
          {
            "value": "Angela Merkel",
            "credibility": 9,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4053051434&fullName=Angela N Merkel"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8268386135&fullName=Angela Merkel"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4053051434&fullName=Angela Merkel"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=9663496433&fullName=Angela L Merkel"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=1825247671&fullName=Angela Merkel"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=5732353124&fullName=Angela C Merkel"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=3221858726&fullName=Angela Merkel"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4599700205&fullName=Angela R Merkel"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8223540552&fullName=Angela Merkel"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8929434823&fullName=Angela K Merkel"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8917015962&fullName=Angela K Merkel"
          }
        ],
        "ussearch": [
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          }
        ],
        "gelbeseiten": [
          {
            "value": "Merkel MdB",
            "credibility": 3,
            "source_url": "https://www.gelbeseiten.de/gsbiz/d52804f9-96a9-4e38-87f4-8f8e483d9462"
          }
        ],
        "peoplelooker": [
          {
            "value": "ANGELA MERKEL",
            "credibility": 3,
            "source_url": "https://www.peoplelooker.com"
          },
          {
            "value": "ANGELA MERKEL",
            "credibility": 3,
            "source_url": "https://www.peoplelooker.com"
          }
        ],
        "bst": [
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": "Heike Angela Merkel",
            "credibility": 3,
            "source_url": ""
          }
        ],
        "dastelefonbuch.de": [
          {
            "value": "Merkel Angela Dr. MdB",
            "credibility": 3,
            "source_url": "https://adresse.dastelefonbuch.de/Stralsund/2-Parteien-Dr-Angela-Merkel-Stralsund-Ossenreyerstr.html"
          },
          {
            "value": "Merkel Angela",
            "credibility": 3,
            "source_url": "https://kontakt-1.dastelefonbuch.de/-/L-500028076498-Merkel-Angela.html"
          }
        ],
        "corporationwiki": [
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2i631f/angela-merkel"
          },
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2lsuxf/angela-merkel"
          },
          {
            "value": "Jane Merkel",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Michigan/Owosso/jane-merkel/114137876.aspx"
          }
        ],
        "wikipedia": [
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Angela_Merkel"
          }
        ],
        "bst_tag": [
          {
            "value": "Angela Merkel",
            "credibility": 0,
            "source_url": ""
          }
        ],
        "biography.com": [
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.biography.com//political-figure/angela-merkel"
          }
        ]
      },
      "first_name": {
        "melissa": [
          {
            "value": "Angela",
            "credibility": 9,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4053051434&fullName=Angela N Merkel"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8268386135&fullName=Angela Merkel"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4053051434&fullName=Angela Merkel"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=9663496433&fullName=Angela L Merkel"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=1825247671&fullName=Angela Merkel"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=5732353124&fullName=Angela C Merkel"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=3221858726&fullName=Angela Merkel"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4599700205&fullName=Angela R Merkel"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8223540552&fullName=Angela Merkel"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8929434823&fullName=Angela K Merkel"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8917015962&fullName=Angela K Merkel"
          }
        ],
        "ussearch": [
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          }
        ],
        "gelbeseiten": [
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.gelbeseiten.de/gsbiz/d52804f9-96a9-4e38-87f4-8f8e483d9462"
          }
        ],
        "peoplelooker": [
          {
            "value": "ANGELA",
            "credibility": 3,
            "source_url": "https://www.peoplelooker.com"
          },
          {
            "value": "ANGELA",
            "credibility": 3,
            "source_url": "https://www.peoplelooker.com"
          }
        ],
        "bst": [
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": "Heike Angela",
            "credibility": 3,
            "source_url": ""
          }
        ],
        "corporationwiki": [
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2i631f/angela-merkel"
          },
          {
            "value": "Angela",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2lsuxf/angela-merkel"
          },
          {
            "value": "Jane",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Michigan/Owosso/jane-merkel/114137876.aspx"
          }
        ],
        "biography.com": [
          {
            "value": "Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.biography.com//political-figure/angela-merkel"
          }
        ]
      },
      "family_name": {
        "melissa": [
          {
            "value": "Merkel",
            "credibility": 9,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4053051434&fullName=Angela N Merkel"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8268386135&fullName=Angela Merkel"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4053051434&fullName=Angela Merkel"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=9663496433&fullName=Angela L Merkel"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=1825247671&fullName=Angela Merkel"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=5732353124&fullName=Angela C Merkel"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=3221858726&fullName=Angela Merkel"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4599700205&fullName=Angela R Merkel"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8223540552&fullName=Angela Merkel"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8929434823&fullName=Angela K Merkel"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8917015962&fullName=Angela K Merkel"
          }
        ],
        "ussearch": [
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          }
        ],
        "gelbeseiten": [
          {
            "value": "MdB",
            "credibility": 3,
            "source_url": "https://www.gelbeseiten.de/gsbiz/d52804f9-96a9-4e38-87f4-8f8e483d9462"
          }
        ],
        "peoplelooker": [
          {
            "value": "MERKEL",
            "credibility": 3,
            "source_url": "https://www.peoplelooker.com"
          },
          {
            "value": "MERKEL",
            "credibility": 3,
            "source_url": "https://www.peoplelooker.com"
          }
        ],
        "bst": [
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": ""
          }
        ],
        "corporationwiki": [
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2i631f/angela-merkel"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2lsuxf/angela-merkel"
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Michigan/Owosso/jane-merkel/114137876.aspx"
          }
        ]
      },
      "entity_type": "person",
      "mention_id": {
        "melissa": [
          {
            "value": "cGVyc29uL21lbGlzc2EuY29tL3NlYXJjaC1yZXMtZmNiZTM1NGNhNjEzMzBmMzg2Y2E0NTZmMDVmZDZlOTQuanNvbl81",
            "credibility": 9,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4053051434&fullName=Angela N Merkel"
          },
          {
            "value": "cGVyc29uL21lbGlzc2EuY29tL3NlYXJjaC1yZXMtZmNiZTM1NGNhNjEzMzBmMzg2Y2E0NTZmMDVmZDZlOTQuanNvbl8z",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8268386135&fullName=Angela Merkel"
          },
          {
            "value": "cGVyc29uL21lbGlzc2EuY29tL3NlYXJjaC1yZXMtZmNiZTM1NGNhNjEzMzBmMzg2Y2E0NTZmMDVmZDZlOTQuanNvbl8w",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4053051434&fullName=Angela Merkel"
          },
          {
            "value": "cGVyc29uL21lbGlzc2EuY29tL3NlYXJjaC1yZXMtZmNiZTM1NGNhNjEzMzBmMzg2Y2E0NTZmMDVmZDZlOTQuanNvbl85",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=9663496433&fullName=Angela L Merkel"
          },
          {
            "value": "cGVyc29uL21lbGlzc2EuY29tL3NlYXJjaC1yZXMtZmNiZTM1NGNhNjEzMzBmMzg2Y2E0NTZmMDVmZDZlOTQuanNvbl80",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=1825247671&fullName=Angela Merkel"
          },
          {
            "value": "cGVyc29uL21lbGlzc2EuY29tL3NlYXJjaC1yZXMtZmNiZTM1NGNhNjEzMzBmMzg2Y2E0NTZmMDVmZDZlOTQuanNvbl82",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=5732353124&fullName=Angela C Merkel"
          },
          {
            "value": "cGVyc29uL21lbGlzc2EuY29tL3NlYXJjaC1yZXMtZmNiZTM1NGNhNjEzMzBmMzg2Y2E0NTZmMDVmZDZlOTQuanNvbl8x",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=3221858726&fullName=Angela Merkel"
          },
          {
            "value": "cGVyc29uL21lbGlzc2EuY29tL3NlYXJjaC1yZXMtZmNiZTM1NGNhNjEzMzBmMzg2Y2E0NTZmMDVmZDZlOTQuanNvbl8xMA==",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4599700205&fullName=Angela R Merkel"
          },
          {
            "value": "cGVyc29uL21lbGlzc2EuY29tL3NlYXJjaC1yZXMtZmNiZTM1NGNhNjEzMzBmMzg2Y2E0NTZmMDVmZDZlOTQuanNvbl8y",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8223540552&fullName=Angela Merkel"
          },
          {
            "value": "cGVyc29uL21lbGlzc2EuY29tL3NlYXJjaC1yZXMtZmNiZTM1NGNhNjEzMzBmMzg2Y2E0NTZmMDVmZDZlOTQuanNvbl84",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8929434823&fullName=Angela K Merkel"
          },
          {
            "value": "cGVyc29uL21lbGlzc2EuY29tL3NlYXJjaC1yZXMtZmNiZTM1NGNhNjEzMzBmMzg2Y2E0NTZmMDVmZDZlOTQuanNvbl83",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8917015962&fullName=Angela K Merkel"
          }
        ],
        "ussearch": [
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTc5NjRlNzI2NTg1YzQ1MmUyMGQxYzYyYzdjNzBkMmNlLmpzb25fNQ==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTc5NjRlNzI2NTg1YzQ1MmUyMGQxYzYyYzdjNzBkMmNlLmpzb25fMQ==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTc5NjRlNzI2NTg1YzQ1MmUyMGQxYzYyYzdjNzBkMmNlLmpzb25fNw==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTc5NjRlNzI2NTg1YzQ1MmUyMGQxYzYyYzdjNzBkMmNlLmpzb25fMg==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTc5NjRlNzI2NTg1YzQ1MmUyMGQxYzYyYzdjNzBkMmNlLmpzb25fNg==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTc5NjRlNzI2NTg1YzQ1MmUyMGQxYzYyYzdjNzBkMmNlLmpzb25fOQ==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTc5NjRlNzI2NTg1YzQ1MmUyMGQxYzYyYzdjNzBkMmNlLmpzb25fMA==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTc5NjRlNzI2NTg1YzQ1MmUyMGQxYzYyYzdjNzBkMmNlLmpzb25fNA==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTc5NjRlNzI2NTg1YzQ1MmUyMGQxYzYyYzdjNzBkMmNlLmpzb25fMw==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "cGVyc29uL3Vzc2VhcmNoLmNvbS9zZWFyY2gtcmVzLTc5NjRlNzI2NTg1YzQ1MmUyMGQxYzYyYzdjNzBkMmNlLmpzb25fOA==",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          }
        ],
        "gelbeseiten": [
          {
            "value": "cGVyc29uL2dlbGJlc2VpdGVuLmRlL3NlYXJjaC1yZXMtYTY2OTBhOGM0M2FmMjdiYWMzZGM3YmUwMDJmNmYxZWUuanNvbl8w",
            "credibility": 3,
            "source_url": "https://www.gelbeseiten.de/gsbiz/d52804f9-96a9-4e38-87f4-8f8e483d9462"
          }
        ],
        "peoplelooker": [
          {
            "value": "cGVyc29uL3Blb3BsZWxvb2tlci5jb20vc2VhcmNoLXJlcy1lNjgwZmJjNjlkZWVmZDRhYTgzNzEzODZiMjA2ZjUzNi5qc29uXzA=",
            "credibility": 3,
            "source_url": "https://www.peoplelooker.com"
          },
          {
            "value": "cGVyc29uL3Blb3BsZWxvb2tlci5jb20vc2VhcmNoLXJlcy1lNjgwZmJjNjlkZWVmZDRhYTgzNzEzODZiMjA2ZjUzNi5qc29uXzE=",
            "credibility": 3,
            "source_url": "https://www.peoplelooker.com"
          }
        ],
        "bst": [
          {
            "value": "cGVyc29uL0JTVC1QZXJzb24vc2VhcmNoLXJlcy0xOGMzZjYyNTM4Nzk2NTNkYjk0NmU3NDdlYjllYjIyNi5qc29uXzA=",
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": "cGVyc29uL0JTVC1QZXJzb24vc2VhcmNoLXJlcy0xOGMzZjYyNTM4Nzk2NTNkYjk0NmU3NDdlYjllYjIyNi5qc29uXzI=",
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": "cGVyc29uL0JTVC1QZXJzb24vc2VhcmNoLXJlcy0xOGMzZjYyNTM4Nzk2NTNkYjk0NmU3NDdlYjllYjIyNi5qc29uXzE=",
            "credibility": 3,
            "source_url": ""
          }
        ],
        "dastelefonbuch.de": [
          {
            "value": "cGVyc29uL2Rhc3RlbGVmb25idWNoLmRlL3NlYXJjaC1yZXMtYjU2MGYwNDYxZmJiMzM3NGY0OGNkYmFlMTdmZTliZWQuanNvbl8x",
            "credibility": 3,
            "source_url": "https://adresse.dastelefonbuch.de/Stralsund/2-Parteien-Dr-Angela-Merkel-Stralsund-Ossenreyerstr.html"
          },
          {
            "value": "cGVyc29uL2Rhc3RlbGVmb25idWNoLmRlL3NlYXJjaC1yZXMtYjU2MGYwNDYxZmJiMzM3NGY0OGNkYmFlMTdmZTliZWQuanNvbl8w",
            "credibility": 3,
            "source_url": "https://kontakt-1.dastelefonbuch.de/-/L-500028076498-Merkel-Angela.html"
          }
        ],
        "corporationwiki": [
          {
            "value": "cGVyc29uL2NvcnBvcmF0aW9ud2lraS5jb20vc2VhcmNoLXJlcy0xODYwNDk5MTY3OTc1MzM3MmU4NmM3ZTZhMTNiMzY1NC5qc29uXzE=",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2i631f/angela-merkel"
          },
          {
            "value": "cGVyc29uL2NvcnBvcmF0aW9ud2lraS5jb20vc2VhcmNoLXJlcy0xODYwNDk5MTY3OTc1MzM3MmU4NmM3ZTZhMTNiMzY1NC5qc29uXzA=",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2lsuxf/angela-merkel"
          },
          {
            "value": "cGVyc29uL2NvcnBvcmF0aW9ud2lraS5jb20vc2VhcmNoLXJlcy0xODYwNDk5MTY3OTc1MzM3MmU4NmM3ZTZhMTNiMzY1NC5qc29uXzI=",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Michigan/Owosso/jane-merkel/114137876.aspx"
          }
        ],
        "wikipedia": [
          {
            "value": "cGVyc29uL3dpa2lwZWRpYS5jb20vc2VhcmNoLXJlcy04ZDEzNDY3ZmZiZmY2ZjFkNzZmNDZkNDI2NTQ2NDU4OC5qc29uXzA=",
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Angela_Merkel"
          }
        ],
        "bst_tag": [
          {
            "value": "882177ffdb81b2e87113b03e7afbf7003275ae3bc222e1e613aa6912f4698b03",
            "credibility": 0,
            "source_url": ""
          }
        ],
        "biography.com": [
          {
            "value": "cGVyc29uL2Jpb2dyYXBoeS5jb20vc2VhcmNoLXJlcy04MzQ4MDRkMDZmMDY3ZTdlNDE1ZWQ3Yjk1ZTQ4Zjk4ZC5qc29uXzA=",
            "credibility": 3,
            "source_url": "https://www.biography.com//political-figure/angela-merkel"
          }
        ]
      },
      "source_url": {
        "melissa": [
          {
            "value": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4053051434&fullName=Angela N Merkel",
            "credibility": 9,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4053051434&fullName=Angela N Merkel"
          },
          {
            "value": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8268386135&fullName=Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8268386135&fullName=Angela Merkel"
          },
          {
            "value": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4053051434&fullName=Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4053051434&fullName=Angela Merkel"
          },
          {
            "value": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=9663496433&fullName=Angela L Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=9663496433&fullName=Angela L Merkel"
          },
          {
            "value": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=1825247671&fullName=Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=1825247671&fullName=Angela Merkel"
          },
          {
            "value": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=5732353124&fullName=Angela C Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=5732353124&fullName=Angela C Merkel"
          },
          {
            "value": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=3221858726&fullName=Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=3221858726&fullName=Angela Merkel"
          },
          {
            "value": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4599700205&fullName=Angela R Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4599700205&fullName=Angela R Merkel"
          },
          {
            "value": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8223540552&fullName=Angela Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8223540552&fullName=Angela Merkel"
          },
          {
            "value": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8929434823&fullName=Angela K Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8929434823&fullName=Angela K Merkel"
          },
          {
            "value": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8917015962&fullName=Angela K Merkel",
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8917015962&fullName=Angela K Merkel"
          }
        ],
        "ussearch": [
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": "https://www.ussearch.com",
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          }
        ],
        "gelbeseiten": [
          {
            "value": "https://www.gelbeseiten.de/gsbiz/d52804f9-96a9-4e38-87f4-8f8e483d9462",
            "credibility": 3,
            "source_url": "https://www.gelbeseiten.de/gsbiz/d52804f9-96a9-4e38-87f4-8f8e483d9462"
          }
        ],
        "peoplelooker": [
          {
            "value": "https://www.peoplelooker.com",
            "credibility": 3,
            "source_url": "https://www.peoplelooker.com"
          },
          {
            "value": "https://www.peoplelooker.com",
            "credibility": 3,
            "source_url": "https://www.peoplelooker.com"
          }
        ],
        "dastelefonbuch.de": [
          {
            "value": "https://adresse.dastelefonbuch.de/Stralsund/2-Parteien-Dr-Angela-Merkel-Stralsund-Ossenreyerstr.html",
            "credibility": 3,
            "source_url": "https://adresse.dastelefonbuch.de/Stralsund/2-Parteien-Dr-Angela-Merkel-Stralsund-Ossenreyerstr.html"
          },
          {
            "value": "https://kontakt-1.dastelefonbuch.de/-/L-500028076498-Merkel-Angela.html",
            "credibility": 3,
            "source_url": "https://kontakt-1.dastelefonbuch.de/-/L-500028076498-Merkel-Angela.html"
          }
        ],
        "corporationwiki": [
          {
            "value": "https://www.corporationwiki.com/p/2i631f/angela-merkel",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2i631f/angela-merkel"
          },
          {
            "value": "https://www.corporationwiki.com/p/2lsuxf/angela-merkel",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2lsuxf/angela-merkel"
          },
          {
            "value": "https://www.corporationwiki.com/Michigan/Owosso/jane-merkel/114137876.aspx",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Michigan/Owosso/jane-merkel/114137876.aspx"
          }
        ],
        "wikipedia": [
          {
            "value": "https://en.wikipedia.org/wiki/Angela_Merkel",
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Angela_Merkel"
          }
        ],
        "biography.com": [
          {
            "value": "https://www.biography.com//political-figure/angela-merkel",
            "credibility": 3,
            "source_url": "https://www.biography.com//political-figure/angela-merkel"
          }
        ]
      },
      "address": {
        "melissa": [
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "city": "San Diego",
                "street_address": "2301 Cowley Way",
                "postal_code": "92110-1131",
                "country": "US",
                "locality": "Oakton,VA",
                "region": "VA",
              }
            ],
            "credibility": 9,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4053051434&fullName=Angela N Merkel"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "city": "Minot",
                "street_address": "3100 Beaver Creek Rd",
                "postal_code": "58701-2121",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8268386135&fullName=Angela Merkel"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "city": "San Diego",
                "street_address": "2301 Cowley Way",
                "postal_code": "92110-1131",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4053051434&fullName=Angela Merkel"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "city": "Leavenworth",
                "street_address": "1314 Pawnee St",
                "postal_code": "66048-1260",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=9663496433&fullName=Angela L Merkel"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "city": "Orange",
                "street_address": "10495 Highway 87 N",
                "postal_code": "77632-0579",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=1825247671&fullName=Angela Merkel"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "city": "Crestview",
                "street_address": "128 Palmetto Dr",
                "postal_code": "32539-3226",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=5732353124&fullName=Angela C Merkel"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "city": "Lansing",
                "street_address": "123 Ferncliff St",
                "postal_code": "66043-1458",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=3221858726&fullName=Angela Merkel"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "city": "Fairfax",
                "street_address": "37639 693rd Ave",
                "postal_code": "55332-6908",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=4599700205&fullName=Angela R Merkel"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "city": "Willowick",
                "street_address": "792 Charles St",
                "postal_code": "44095-4300",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8223540552&fullName=Angela Merkel"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "city": "Machesney Park",
                "street_address": "7655 Rogers St",
                "postal_code": "61115-2941",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8929434823&fullName=Angela K Merkel"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "city": "Des Moines",
                "street_address": "357 Greenfield Pkwy",
                "postal_code": "50320-6927",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.melissa.com/v2/lookups/personator/?melissaAddressKey=8917015962&fullName=Angela K Merkel"
          }
        ],
        "ussearch": [
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "San Diego,",
                "country": "CA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Alexandria,",
                "country": "VA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Ormond Beach,",
                "country": "FL"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Harrisonburg,",
                "country": "VA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Mancelona,",
                "country": "MI"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "Machesney Park,",
                "country": "IL"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Loves Park,",
                "country": "IL"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Rockford,",
                "country": "IL"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Mesa,",
                "country": "AZ"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Phoenix,",
                "country": "AZ"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Ozone Park,",
                "country": "NY"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "Dickinson,",
                "country": "ND"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "South Heart,",
                "country": "ND"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Minot,",
                "country": "ND"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "New Port Richey,",
                "country": "FL"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Dunedin,",
                "country": "FL"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Clearwater,",
                "country": "FL"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Palm Harbor,",
                "country": "FL"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Oldsmar,",
                "country": "FL"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Minot Afb,",
                "country": "ND"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Biloxi,",
                "country": "MS"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Wichita Falls,",
                "country": "TX"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Saint Petersburg,",
                "country": "FL"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Largo,",
                "country": "FL"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Tampa,",
                "country": "FL"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Lexington,",
                "country": "MS"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Wantagh,",
                "country": "NY"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "Leavenworth,",
                "country": "KS"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Anchorage,",
                "country": "AK"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Lansing,",
                "country": "KS"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Jber,",
                "country": "AK"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Willow,",
                "country": "AK"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Fairfield,",
                "country": "PA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "Harrisburg,",
                "country": "PA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Fairfield,",
                "country": "PA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "York,",
                "country": "PA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Lock Haven,",
                "country": "PA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Bentonville,",
                "country": "AR"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Russellville,",
                "country": "AR"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Pomona,",
                "country": "CA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Louisville,",
                "country": "KY"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Weehawken,",
                "country": "NJ"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Liverpool,",
                "country": "NY"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Riverside,",
                "country": "RI"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Jellico,",
                "country": "TN"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Chippewa Falls,",
                "country": "WI"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "Hillsboro,",
                "country": "OR"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Cornelius,",
                "country": "OR"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "Hendersonville,",
                "country": "NC"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Willoughby,",
                "country": "OH"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Arden,",
                "country": "NC"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Simi Valley,",
                "country": "CA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Willowick,",
                "country": "OH"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Eastlake,",
                "country": "OH"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "Spruce Pine,",
                "country": "NC"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Augusta,",
                "country": "GA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Loudon,",
                "country": "TN"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Grovetown,",
                "country": "GA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Atlanta,",
                "country": "GA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Union Point,",
                "country": "GA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Clarkston,",
                "country": "MI"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Martinez,",
                "country": "GA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Independence,",
                "country": "MO"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Cadiz,",
                "country": "OH"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "Allentown,",
                "country": "PA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "Orange,",
                "country": "TX"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Charlotte,",
                "country": "NC"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Fleetwood,",
                "country": "PA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Syracuse,",
                "country": "NY"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Reading,",
                "country": "PA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Boyertown,",
                "country": "PA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "Oley,",
                "country": "PA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          }
        ],
        "gelbeseiten": [
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "country": "Germany",
                "street_address": "Ossenreyerstr. 29",
                "postal_code": "18439",
                "locality": "Stralsund-Altstadt"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.gelbeseiten.de/gsbiz/d52804f9-96a9-4e38-87f4-8f8e483d9462"
          }
        ],
        "peoplelooker": [
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "ALLENTOWN",
                "city": "PA",
                "country": "USA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "LANGHORNE",
                "city": "PA",
                "country": "USA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "MALVERN",
                "city": "PA",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.peoplelooker.com"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "locality": "HARRISBURG",
                "city": "PA",
                "country": "USA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "FAIRFIELD",
                "city": "PA",
                "country": "USA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "YORK",
                "city": "PA",
                "country": "USA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "HARRISBURG",
                "city": "PA",
                "country": "USA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "HARRISBURG",
                "city": "PA",
                "country": "USA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "FAIRFIELD",
                "city": "PA",
                "country": "USA"
              },
              {
                "entity_type": "PostalAddress",
                "locality": "HOLLSOPPLE",
                "city": "PA",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.peoplelooker.com"
          }
        ],
        "dastelefonbuch.de": [
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "street_address": "Ossenreyerstr.",
                "postal_code": "18439",
                "locality": "Stralsund",
                "city": "DE",
                "country": "Germany"
              }
            ],
            "credibility": 3,
            "source_url": "https://adresse.dastelefonbuch.de/Stralsund/2-Parteien-Dr-Angela-Merkel-Stralsund-Ossenreyerstr.html"
          }
        ],
        "corporationwiki": [
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "postal_code": "22124",
                "street_address": "2705 Green Holly Springs Ct",
                "locality": "Oakton",
                "city": "VA",
                "country": "USA"
              },
              {
                "entity_type": "PostalAddress",
                "postal_code": "22124",
                "street_address": "PO Box 527",
                "locality": "Oakton",
                "city": "VA",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2i631f/angela-merkel"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "postal_code": "61103",
                "street_address": "711 N Main St",
                "locality": "Rockford",
                "city": "IL",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2lsuxf/angela-merkel"
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "postal_code": "48867",
                "street_address": "623 N Park St",
                "locality": "Owosso",
                "city": "MI",
                "country": "USA"
              }
            ],
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Michigan/Owosso/jane-merkel/114137876.aspx"
          }
        ],
        "wikipedia": [
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "street_address": "Berlin",
                "city": "Germany"
              }
            ],
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Angela_Merkel"
          }
        ],
        "bst": [
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "postal_code": "53757",
                "street_address": "Rathausallee 12",
                "city": "Nordrhein-Westfalen|Koeln|Rhein-Sieg",
                "country": "Germany"
              }
            ],
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": [
              {
                "entity_type": "PostalAddress",
                "postal_code": "98553",
                "street_address": "Schlachthofstr. 1",
                "city": "Thueringen|Hildburghausen",
                "country": "Germany"
              }
            ],
            "credibility": 3,
            "source_url": ""
          }
        ]
      },
      "alternative_names": {
        "ussearch": [
          {
            "value": [
              "Laura Adolfie",
              "Joshua Merkel",
              "William Rice"
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              "Carolyn Huffman",
              "Shana Hughes",
              "Shawn Hughes",
              "Carl Layton",
              "Darrel Layton",
              "Linda Layton",
              "Raymond Layton",
              "Korey Merkel",
              "Nakisha Merkel",
              "Angela Newkirk",
              "Jacqueline Wight",
              "Christa Wooden"
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              "Jenna Grindberg",
              "Lorne Merkel",
              "Lorrie Merkel",
              "Matthew Merkel",
              "Paul Merkel",
              "Steven Merkel"
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              "Anna Bowen",
              "Printice Bowen",
              "Karen Mccosham",
              "Richard Merkel",
              "William Merkel",
              "Dustan Myers",
              "Gale Myers",
              "Lyla Schriner"
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              "Sherri Balabin",
              "Tammy Kozlovac",
              "Paul Merkel",
              "Justin Palinkas"
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              "Brad Merkel",
              "Elizabeth Merkel",
              "Geena Merkel",
              "Oskar Merkel",
              "Sara Merkel",
              "Gina Roberts",
              "Christian Topazio",
              "Marilyn Topazio",
              "Michael Topazio",
              "Michael Topazio",
              "Michelle Topazio"
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              "Vivian Criminger",
              "Clinton Harris",
              "Curt Harris",
              "Douglas Merkel",
              "Louise Merkel",
              "Shelley Merkel",
              "Barbara Moon",
              "Barbara Moon",
              "Robert Moon",
              "Scott Moon"
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              "Michelle Brown",
              "Barbara Merkel",
              "Darrell Merkel",
              "David Merkel",
              "Diane Merkel"
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          },
          {
            "value": [
              "Bruce Dierolf",
              "Gary Dierolf",
              "Jennifer Dierolf",
              "Kathryn Dierolf",
              "Mae Dierolf",
              "Emily Guinther",
              "Kathy Guinther",
              "Mark Guinther",
              "Rachel Guinther",
              "Deborah Leisey",
              "Larry Leisey",
              "Rebecca Leisey",
              "Shirley Leisey",
              "Holly Nolan"
            ],
            "credibility": 3,
            "source_url": "https://www.ussearch.com"
          }
        ]
      },
      "url": {
        "gelbeseiten": [
          {
            "value": "http://www.angela-merkel.de",
            "credibility": 3,
            "source_url": "https://www.gelbeseiten.de/gsbiz/d52804f9-96a9-4e38-87f4-8f8e483d9462"
          }
        ]
      },
      "email": {
        "gelbeseiten": [
          {
            "value": [
              "info@cdu.de"
            ],
            "credibility": 3,
            "source_url": "https://www.gelbeseiten.de/gsbiz/d52804f9-96a9-4e38-87f4-8f8e483d9462"
          }
        ],
        "dastelefonbuch.de": [
          {
            "value": [
              "info@cdu.de"
            ],
            "credibility": 3,
            "source_url": "https://adresse.dastelefonbuch.de/Stralsund/2-Parteien-Dr-Angela-Merkel-Stralsund-Ossenreyerstr.html"
          }
        ],
        "bst": [
          {
            "value": [
              "Germany"
            ],
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": [
              "Germany"
            ],
            "credibility": 3,
            "source_url": ""
          }
        ]
      },
      "date_of_birth": {
        "peoplelooker": [
          {
            "value": [
              "1988-12-23"
            ],
            "credibility": 3,
            "source_url": "https://www.peoplelooker.com"
          },
          {
            "value": [
              "1985-06-10"
            ],
            "credibility": 3,
            "source_url": "https://www.peoplelooker.com"
          }
        ],
        "wikipedia": [
          {
            "value": [
              "1954-07-17"
            ],
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Angela_Merkel"
          }
        ],
        "bst": [
          {
            "value": [
              "1954--"
            ],
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": [
              "1963--"
            ],
            "credibility": 3,
            "source_url": ""
          }
        ],
        "biography.com": [
          {
            "value": [
              "1954-07-17"
            ],
            "credibility": 3,
            "source_url": "https://www.biography.com//political-figure/angela-merkel"
          }
        ]
      },
      "last_name": {
        "bst": [
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": "Merkel",
            "credibility": 3,
            "source_url": ""
          }
        ]
      },
      "identifiers": {
        "bst": [
          {
            "value": {
              "id": "P356082013"
            },
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": {
              "id": "P063511196"
            },
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": {
              "id": "P340306553"
            },
            "credibility": 3,
            "source_url": ""
          }
        ]
      },
      "job_title": {
        "bst": [
          {
            "value": "Federal Chancellor",
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": "Member of the Executive Board",
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": "Liquidator",
            "credibility": 3,
            "source_url": ""
          }
        ],
        "corporationwiki": [
          {
            "value": "Chief Executive Officer for New Century Foundation",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2i631f/angela-merkel"
          },
          {
            "value": "Executive Officer for Northern Public Radio",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2lsuxf/angela-merkel"
          },
          {
            "value": "Principal for Tom S Restaurant Lounge",
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Michigan/Owosso/jane-merkel/114137876.aspx"
          }
        ]
      },
      "gender": {
        "bst": [
          {
            "value": "female",
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": "female",
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": "female",
            "credibility": 3,
            "source_url": ""
          }
        ]
      },
      "works_for": {
        "bst": [
          {
            "value": [
              {
                "name": "GERMANY",
                "entity_type": "Public authorities"
              },
              {
                "name": "KONRAD-ADENAUER-STIFTUNG E.V.",
                "entity_type": "Foundation/Research Institute"
              }
            ],
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": [
              {
                "name": "KONRAD-ADENAUER-STIFTUNG E.V.",
                "entity_type": "Foundation/Research Institute"
              }
            ],
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": [
              {
                "name": "MERKEL GMBH GARTEN- UND LANDSCHAFTSBAU",
                "entity_type": "Industrial company"
              }
            ],
            "credibility": 3,
            "source_url": ""
          }
        ]
      },
      "home_location": {
        "dastelefonbuch.de": [
          {
            "value": {
              "entity_type": "PostalAddress",
              "address": {
                "entity_type": "PostalAddress",
                "country": "Germany",
                "locality": "Stralsund",
                "region": "DE",
                "postal_code": "18439"
              },
              "has_map": "https://www.google.com/maps/search/?api=1&query=54.312815,13.089580"
            },
            "credibility": 3,
            "source_url": "https://adresse.dastelefonbuch.de/Stralsund/2-Parteien-Dr-Angela-Merkel-Stralsund-Ossenreyerstr.html"
          }
        ],
        "corporationwiki": [
          {
            "value": {
              "entity_type": "Place",
              "address": {
                "entity_type": "PostalAddress",
                "country": "USA",
                "region": "VA",
                "locality": "Oakton,VA"
              }
            },
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2i631f/angela-merkel"
          },
          {
            "value": {
              "entity_type": "Place",
              "address": {
                "entity_type": "PostalAddress",
                "country": "USA",
                "region": "IL",
                "locality": "Rockford,IL"
              }
            },
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/p/2lsuxf/angela-merkel"
          },
          {
            "value": {
              "entity_type": "Place",
              "address": {
                "entity_type": "PostalAddress",
                "country": "USA",
                "region": "MI",
                "locality": "Owosso,MI"
              }
            },
            "credibility": 3,
            "source_url": "https://www.corporationwiki.com/Michigan/Owosso/jane-merkel/114137876.aspx"
          }
        ],
        "bst": [
          {
            "value": {
              "entity_type": "place",
              "address": {
                "entity_type": "PostalAddress",
                "postal_code": "53757",
                "region": "Nordrhein-Westfalen|Koeln|Rhein-Sieg",
                "country": "Germany"
              }
            },
            "credibility": 3,
            "source_url": ""
          },
          {
            "value": {
              "entity_type": "place",
              "address": {
                "entity_type": "PostalAddress",
                "postal_code": "98553",
                "region": "Thueringen|Hildburghausen",
                "country": "Germany"
              }
            },
            "credibility": 3,
            "source_url": ""
          }
        ]
      },
      "spouse": {
        "wikipedia": [
          {
            "value": [
              {
                "entity_type": "Person",
                "first_name": "Kalzeube Pahimi",
                "last_name": "Deubet"
              },
              {
                "entity_type": "Person ",
                "first_name": "Khaled Bin Fahd",
                "last_name": "Bin Abdul Aziz Al Saud"
              }
            ],
            "credibility": 3,
            "source_url": "https://en.wikipedia.org/wiki/Angela_Merkel"
          }
        ]
      },
      "place_of_birth": {
        "biography.com": [
          {
            "value": [
              "Germany"
            ],
            "credibility": 3,
            "source_url": "https://www.biography.com//political-figure/angela-merkel"
          }
        ]
      },
      "images": {
        "biography.com": [
          {
            "value": [
              "https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTE5NTU2MzE2MzE0Njk5Mjc1/angela-merkel-9406424-2-402.jpg"
            ],
            "credibility": 3,
            "source_url": "https://www.biography.com//political-figure/angela-merkel"
          }
        ]
      },
      "alumni_of": {
        "biography.com": [
          {
            "value": [
              {
                "entity_type": "CollegeOrUniversity",
                "name": "University of Leipzig"
              },
              {
                "entity_type": "CollegeOrUniversity",
                "name": "Homestead High School"
              },
              {
                "entity_type": "CollegeOrUniversity",
                "name": " Reed College"
              },
            ],
            "credibility": 3,
            "source_url": "https://www.biography.com//political-figure/angela-merkel"
          }
        ]
      }
    }
  }
}

export const EntityConstants: any = {
  EntityCompanyConst: EntityCompanyConst,
  Company_Unwanted_End_Points: Company_Unwanted_End_Points,
  chartsConst: chartsConst,
  customEntites: customEntites,
  utilityConstant: utilityConstant,
  basicSharedObject: basicSharedObject,
  complianceObject: complianceObject,
  entityChartSharedObject: entityChartSharedObject,
  countriesData: countriesData,
  fetchLink_officershipScreeningData: fetchLink_officershipScreeningData,
  dummyscreeening: dummyscreeening,
  overview: {},
  officershipInfo: {},
  queryParams: {},
  NewEntityObj: newEntityObj,
  Amenities: amenities,
  OpeningHoursSpecification: openingHoursSpecification,
  RegisteredAddress: registeredAddress,
  lazyLoadingentity: lazyLoadingentity,
  CustomerInformation: customerInformation,
  NearbyCompanies: nearbyCompanies,
  Json_path_obj: Json_path_obj,
  tabsWorldMap: tabsWorldMap,
  socketData: socketData,
  personSearchConstant: personSearchConstant,
  PersonKeys: PersonKeys,
  PersonGeneralInfoKeys: PersonGeneralInfoKeys,
  personEducationKeys: personEducationKeys,
  personWorkKeys:personWorkKeys
};
