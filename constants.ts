

import { SupportedCarType, CreditScoreTier, IncomeRange, LoanPrioritization } from './types';

export const APP_TITLE = "Smart Car Loan Advisor";

export const SUPPORTED_CAR_TYPES_OPTIONS: { value: SupportedCarType | string; label: string }[] = Object.values(SupportedCarType).map(type => ({ value: type, label: type }));

export const CREDIT_SCORE_TIER_OPTIONS: { value: CreditScoreTier | string; label: string }[] = Object.values(CreditScoreTier).map(tier => ({ value: tier, label: tier }));

export const INCOME_RANGE_OPTIONS: { value: IncomeRange | string; label: string }[] = [
  { value: IncomeRange.LOW, label: "Low" },
  { value: IncomeRange.MEDIUM, label: "Medium" },
  { value: IncomeRange.HIGH, label: "High" },
  { value: IncomeRange.UNSPECIFIED, label: "Unspecified / Prefer not to say" },
];

export const INCOME_TIER_CURRENCY_EXAMPLES: {
  [key in IncomeRange]?: { [currencyCode: string]: string }
} = {
  [IncomeRange.LOW]: {
    JMD: "e.g., 0 - 2,000,000 JMD", USD: "e.g., 0 - 30,000 USD", CAD: "e.g., 0 - 40,000 CAD", GBP: "e.g., 0 - 25,000 GBP", EUR: "e.g., 0 - 28,000 EUR", TTD: "e.g., 0 - 150,000 TTD", BBD: "e.g., 0 - 40,000 BBD",
  },
  [IncomeRange.MEDIUM]: {
    JMD: "e.g., 2,000,000 - 5,000,000 JMD", USD: "e.g., 30,000 - 70,000 USD", CAD: "e.g., 40,000 - 80,000 CAD", GBP: "e.g., 25,000 - 60,000 GBP", EUR: "e.g., 28,000 - 65,000 EUR", TTD: "e.g., 150,000 - 350,000 TTD", BBD: "e.g., 40,000 - 90,000 BBD",
  },
  [IncomeRange.HIGH]: {
    JMD: "e.g., 5,000,000+ JMD", USD: "e.g., 70,000+ USD", CAD: "e.g., 80,000+ CAD", GBP: "e.g., 60,000+ GBP", EUR: "e.g., 65,000+ EUR", TTD: "e.g., 350,000+ TTD", BBD: "e.g., 90,000+ BBD",
  },
};

export const LOAN_PRIORITIZATION_OPTIONS: { value: LoanPrioritization | string; label: string }[] = [
  { value: LoanPrioritization.NONE, label: "Balanced (Default)"},
  { value: LoanPrioritization.LOWEST_RATE, label: "Lowest Interest Rate" },
  { value: LoanPrioritization.LOWEST_MONTHLY_PAYMENT, label: "Lowest Monthly Payment" },
  { value: LoanPrioritization.SHORTEST_TERM, label: "Shortest Loan Term" },
];

// New: Loan Term Options
export const LOAN_TERM_OPTIONS: { value: number; label: string }[] = Array.from({ length: 10 }, (_, i) => {
  const years = i + 1;
  return { value: years, label: `${years} Year${years > 1 ? 's' : ''}` };
}).concat([
    { value: 12, label: "12 Years"},
    { value: 15, label: "15 Years"}
]);


export const SUPPORTED_COUNTRIES_OPTIONS: { value: string; label: string }[] = [
  // Caribbean
  { value: "AG", label: "Antigua and Barbuda" }, { value: "BS", label: "Bahamas" }, { value: "BB", label: "Barbados" }, { value: "BZ", label: "Belize" }, { value: "CU", label: "Cuba" }, { value: "DM", label: "Dominica" }, { value: "DO", label: "Dominican Republic" }, { value: "GD", label: "Grenada" }, { value: "GY", label: "Guyana" }, { value: "HT", label: "Haiti" }, { value: "JM", label: "Jamaica" }, { value: "KN", label: "Saint Kitts and Nevis" }, { value: "LC", label: "Saint Lucia" }, { value: "VC", label: "Saint Vincent and the Grenadines" }, { value: "SR", label: "Suriname" }, { value: "TT", label: "Trinidad and Tobago" },
  // North America
  { value: "US", label: "United States" }, { value: "CA", label: "Canada" }, { value: "MX", label: "Mexico" },
  // South America
  { value: "AR", label: "Argentina" }, { value: "BO", label: "Bolivia" }, { value: "BR", label: "Brazil" }, { value: "CL", label: "Chile" }, { value: "CO", label: "Colombia" }, { value: "EC", label: "Ecuador" }, { value: "PY", label: "Paraguay" }, { value: "PE", label: "Peru" }, { value: "UY", label: "Uruguay" }, { value: "VE", label: "Venezuela" },
  // Europe
  { value: "AL", label: "Albania" }, { value: "AD", label: "Andorra" }, { value: "AT", label: "Austria" }, { value: "BY", label: "Belarus" }, { value: "BE", label: "Belgium" }, { value: "BA", label: "Bosnia and Herzegovina" }, { value: "BG", label: "Bulgaria" }, { value: "HR", label: "Croatia" }, { value: "CY", label: "Cyprus" }, { value: "CZ", label: "Czech Republic" }, { value: "DK", label: "Denmark" }, { value: "EE", label: "Estonia" }, { value: "FO", label: "Faroe Islands" }, { value: "FI", label: "Finland" }, { value: "FR", label: "France" }, { value: "DE", label: "Germany" }, { value: "GI", label: "Gibraltar" }, { value: "GR", label: "Greece" }, { value: "HU", label: "Hungary" }, { value: "IS", label: "Iceland" }, { value: "IE", label: "Ireland" }, { value: "IT", label: "Italy" }, { value: "LV", label: "Latvia" }, { value: "LI", label: "Liechtenstein" }, { value: "LT", label: "Lithuania" }, { value: "LU", label: "Luxembourg" }, { value: "MT", label: "Malta" }, { value: "MD", label: "Moldova" }, { value: "MC", label: "Monaco" }, { value: "ME", label: "Montenegro" }, { value: "NL", label: "Netherlands" }, { value: "MK", label: "North Macedonia" }, { value: "NO", label: "Norway" }, { value: "PL", label: "Poland" }, { value: "PT", label: "Portugal" }, { value: "RO", label: "Romania" }, { value: "RU", label: "Russia" }, { value: "SM", label: "San Marino" }, { value: "RS", label: "Serbia" }, { value: "SK", label: "Slovakia" }, { value: "SI", label: "Slovenia" }, { value: "ES", label: "Spain" }, { value: "SE", label: "Sweden" }, { value: "CH", label: "Switzerland" }, { value: "UA", label: "Ukraine" }, { value: "GB", label: "United Kingdom" },
  // Asia
  { value: "AF", label: "Afghanistan" }, { value: "AM", label: "Armenia" }, { value: "AZ", label: "Azerbaijan" }, { value: "BH", label: "Bahrain" }, { value: "BD", label: "Bangladesh" }, { value: "BT", label: "Bhutan" }, { value: "BN", label: "Brunei Darussalam" }, { value: "KH", label: "Cambodia" }, { value: "CN", label: "China" }, { value: "GE", label: "Georgia" }, { value: "HK", label: "Hong Kong" }, { value: "IN", label: "India" }, { value: "ID", label: "Indonesia" }, { value: "IR", label: "Iran" }, { value: "IQ", label: "Iraq" }, { value: "IL", label: "Israel" }, { value: "JP", label: "Japan" }, { value: "JO", label: "Jordan" }, { value: "KZ", label: "Kazakhstan" }, { value: "KW", label: "Kuwait" }, { value: "KG", label: "Kyrgyzstan" }, { value: "LA", label: "Lao People's Democratic Republic" }, { value: "LB", label: "Lebanon" }, { value: "MO", label: "Macao" }, { value: "MY", label: "Malaysia" }, { value: "MV", label: "Maldives" }, { value: "MN", label: "Mongolia" }, { value: "MM", label: "Myanmar" }, { value: "NP", label: "Nepal" }, { value: "KP", label: "North Korea" }, { value: "OM", label: "Oman" }, { value: "PK", label: "Pakistan" }, { value: "PS", label: "Palestine, State of" }, { value: "PH", label: "Philippines" }, { value: "QA", label: "Qatar" }, { value: "SA", label: "Saudi Arabia" }, { value: "SG", label: "Singapore" }, { value: "KR", label: "South Korea" }, { value: "LK", label: "Sri Lanka" }, { value: "SY", label: "Syrian Arab Republic" }, { value: "TW", label: "Taiwan" }, { value: "TJ", label: "Tajikistan" }, { value: "TH", label: "Thailand" }, { value: "TL", label: "Timor-Leste" }, { value: "TR", label: "Turkey" }, { value: "TM", label: "Turkmenistan" }, { value: "AE", label: "United Arab Emirates" }, { value: "UZ", label: "Uzbekistan" }, { value: "VN", label: "Viet Nam" }, { value: "YE", label: "Yemen" },
  // Africa
  { value: "DZ", label: "Algeria" }, { value: "AO", label: "Angola" }, { value: "BJ", label: "Benin" }, { value: "BW", label: "Botswana" }, { value: "BF", label: "Burkina Faso" }, { value: "BI", label: "Burundi" }, { value: "CV", label: "Cabo Verde" }, { value: "CM", label: "Cameroon" }, { value: "CF", label: "Central African Republic" }, { value: "TD", label: "Chad" }, { value: "KM", label: "Comoros" }, { value: "CG", label: "Congo" }, { value: "CD", label: "Congo (Democratic Republic of the)" }, { value: "CI", label: "Côte d'Ivoire" }, { value: "DJ", label: "Djibouti" }, { value: "EG", label: "Egypt" }, { value: "GQ", label: "Equatorial Guinea" }, { value: "ER", label: "Eritrea" }, { value: "SZ", label: "Eswatini" }, { value: "ET", label: "Ethiopia" }, { value: "GA", label: "Gabon" }, { value: "GM", label: "Gambia" }, { value: "GH", label: "Ghana" }, { value: "GN", label: "Guinea" }, { value: "GW", label: "Guinea-Bissau" }, { value: "KE", label: "Kenya" }, { value: "LS", label: "Lesotho" }, { value: "LR", label: "Liberia" }, { value: "LY", label: "Libya" }, { value: "MG", label: "Madagascar" }, { value: "MW", label: "Malawi" }, { value: "ML", label: "Mali" }, { value: "MR", label: "Mauritania" }, { value: "MU", label: "Mauritius" }, { value: "MA", label: "Morocco" }, { value: "MZ", label: "Mozambique" }, { value: "NA", label: "Namibia" }, { value: "NE", label: "Niger" }, { value: "NG", label: "Nigeria" }, { value: "RW", label: "Rwanda" }, { value: "ST", label: "Sao Tome and Principe" }, { value: "SN", label: "Senegal" }, { value: "SC", label: "Seychelles" }, { value: "SL", label: "Sierra Leone" }, { value: "SO", label: "Somalia" }, { value: "ZA", label: "South Africa" }, { value: "SS", label: "South Sudan" }, { value: "SD", label: "Sudan" }, { value: "TZ", label: "Tanzania" }, { value: "TG", label: "Togo" }, { value: "TN", label: "Tunisia" }, { value: "UG", label: "Uganda" }, { value: "ZM", label: "Zambia" }, { value: "ZW", label: "Zimbabwe" },
  // Oceania
  { value: "AU", label: "Australia" }, { value: "FJ", label: "Fiji" }, { value: "KI", label: "Kiribati" }, { value: "MH", label: "Marshall Islands" }, { value: "FM", label: "Micronesia (Federated States of)" }, { value: "NR", label: "Nauru" }, { value: "NZ", label: "New Zealand" }, { value: "PW", label: "Palau" }, { value: "PG", label: "Papua New Guinea" }, { value: "WS", label: "Samoa" }, { value: "SB", label: "Solomon Islands" }, { value: "TO", label: "Tonga" }, { value: "TV", label: "Tuvalu" }, { value: "VU", label: "Vanuatu" },
];

export const COUNTRY_CURRENCY_MAP: { [key: string]: string } = {
  AG: "XCD", BS: "BSD", BB: "BBD", BZ: "BZD", CU: "CUP", DM: "XCD", DO: "DOP", GD: "XCD", GY: "GYD", HT: "HTG", JM: "JMD", KN: "XCD", LC: "XCD", VC: "XCD", SR: "SRD", TT: "TTD", US: "USD", CA: "CAD", MX: "MXN", AR: "ARS", BO: "BOB", BR: "BRL", CL: "CLP", CO: "COP", EC: "USD", PY: "PYG", PE: "PEN", UY: "UYU", VE: "VES", AL: "ALL", AD: "EUR", AT: "EUR", BY: "BYN", BE: "EUR", BA: "BAM", BG: "BGN", HR: "EUR", CY: "EUR", CZ: "CZK", DK: "DKK", EE: "EUR", FO: "DKK", FI: "EUR", FR: "EUR", DE: "EUR", GI: "GIP", GR: "EUR", HU: "HUF", IS: "ISK", IE: "EUR", IT: "EUR", LV: "EUR", LI: "CHF", LT: "EUR", LU: "EUR", MT: "EUR", MD: "MDL", MC: "EUR", ME: "EUR", NL: "EUR", MK: "MKD", NO: "NOK", PL: "PLN", PT: "EUR", RO: "RON", RU: "RUB", SM: "EUR", RS: "RSD", SK: "EUR", SI: "EUR", ES: "EUR", SE: "SEK", CH: "CHF", UA: "UAH", GB: "GBP", AF: "AFN", AM: "AMD", AZ: "AZN", BH: "BHD", BD: "BDT", BT: "BTN", BN: "BND", KH: "KHR", CN: "CNY", GE: "GEL", HK: "HKD", IN: "INR", ID: "IDR", IR: "IRR", IQ: "IQD", IL: "ILS", JP: "JPY", JO: "JOD", KZ: "KZT", KW: "KWD", KG: "KGS", LA: "LAK", LB: "LBP", MO: "MOP", MY: "MYR", MV: "MVR", MN: "MNT", MM: "MMK", NP: "NPR", KP: "KPW", OM: "OMR", PK: "PKR", PS: "ILS", PH: "PHP", QA: "QAR", SA: "SAR", SG: "SGD", KR: "KRW", LK: "LKR", SY: "SYP", TW: "TWD", TJ: "TJS", TH: "THB", TL: "USD", TR: "TRY", TM: "TMT", AE: "AED", UZ: "UZS", VN: "VND", YE: "YER", DZ: "DZD", AO: "AOA", BJ: "XOF", BW: "BWP", BF: "XOF", BI: "BIF", CV: "CVE", CM: "XAF", CF: "XAF", TD: "XAF", KM: "KMF", CG: "XAF", CD: "CDF", CI: "XOF", DJ: "DJF", EG: "EGP", GQ: "XAF", ER: "ERN", SZ: "SZL", ET: "ETB", GA: "XAF", GM: "GMD", GH: "GHS", GN: "GNF", GW: "XOF", KE: "KES", LS: "LSL", LR: "LRD", LY: "LYD", MG: "MGA", MW: "MWK", ML: "XOF", MR: "MRU", MU: "MUR", MA: "MAD", MZ: "MZN", NA: "NAD", NE: "XOF", NG: "NGN", RW: "RWF", ST: "STD", SN: "XOF", SC: "SCR", SL: "SLL", SO: "SOS", ZA: "ZAR", SS: "SSP", SD: "SDG", TZ: "TZS", TG: "XOF", TN: "TND", UG: "UGX", ZM: "ZMW", ZW: "ZWL", AU: "AUD", FJ: "FJD", KI: "AUD", MH: "USD", FM: "USD", NR: "AUD", NZ: "NZD", PW: "USD", PG: "PGK", WS: "WST", SB: "SBD", TO: "TOP", TV: "AUD", VU: "VUV",
};

export const DEFAULT_COUNTRY_CODE = "";
export const CURRENT_YEAR = new Date().getFullYear();
export const YEAR_OPTIONS: number[] = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

export const COUNTRY_CITY_MAP: { [countryCode: string]: { value: string, label: string }[] } = {
  AG: [{ value: "St. John's", label: "St. John's" }], BS: [{ value: "Nassau", label: "Nassau" }], BB: [{ value: "Bridgetown", label: "Bridgetown" }], BZ: [{ value: "Belmopan", label: "Belmopan" }], CU: [{ value: "Havana", label: "Havana" }], DM: [{ value: "Roseau", label: "Roseau" }], DO: [{ value: "Santo Domingo", label: "Santo Domingo" }], GD: [{ value: "St. George's", label: "St. George's" }], GY: [{ value: "Georgetown", label: "Georgetown" }], HT: [{ value: "Port-au-Prince", label: "Port-au-Prince" }], JM: [ { value: "Kingston", label: "Kingston" }, { value: "Montego Bay", label: "Montego Bay" }, { value: "Spanish Town", label: "Spanish Town" }, { value: "Portmore", label: "Portmore" }, { value: "Mandeville", label: "Mandeville" } ], KN: [{ value: "Basseterre", label: "Basseterre" }], LC: [{ value: "Castries", label: "Castries" }], VC: [{ value: "Kingstown", label: "Kingstown" }], SR: [{ value: "Paramaribo", label: "Paramaribo" }], TT: [{ value: "Port of Spain", label: "Port of Spain" }, { value: "San Fernando", label: "San Fernando" }, { value: "Chaguanas", label: "Chaguanas" } ],
  US: [ { value: "Washington D.C.", label: "Washington D.C." }, { value: "New York City, NY", label: "New York City, NY" }, { value: "Los Angeles, CA", label: "Los Angeles, CA" }, { value: "Chicago, IL", label: "Chicago, IL" }, { value: "Houston, TX", label: "Houston, TX" }, { value: "Phoenix, AZ", label: "Phoenix, AZ" }, { value: "Philadelphia, PA", label: "Philadelphia, PA" }, { value: "San Antonio, TX", label: "San Antonio, TX" }, { value: "San Diego, CA", label: "San Diego, CA" }, { value: "Dallas, TX", label: "Dallas, TX" }, { value: "San Jose, CA", label: "San Jose, CA" } ], CA: [ { value: "Ottawa, ON", label: "Ottawa, ON" }, { value: "Toronto, ON", label: "Toronto, ON" }, { value: "Montreal, QC", label: "Montreal, QC" }, { value: "Vancouver, BC", label: "Vancouver, BC" }, { value: "Calgary, AB", label: "Calgary, AB" }, { value: "Edmonton, AB", label: "Edmonton, AB" } ], MX: [{ value: "Mexico City", label: "Mexico City" }, { value: "Guadalajara", label: "Guadalajara" }, { value: "Monterrey", label: "Monterrey" } ],
  AR: [{ value: "Buenos Aires", label: "Buenos Aires" }], BO: [{ value: "Sucre", label: "Sucre" }, { value: "La Paz (Seat of Gov.)", label: "La Paz (Seat of Gov.)" } ], BR: [{ value: "Brasília", label: "Brasília" }, { value: "São Paulo", label: "São Paulo" }, { value: "Rio de Janeiro", label: "Rio de Janeiro" } ], CL: [{ value: "Santiago", label: "Santiago" }], CO: [{ value: "Bogotá", label: "Bogotá" }], EC: [{ value: "Quito", label: "Quito" }], PY: [{ value: "Asunción", label: "Asunción" }], PE: [{ value: "Lima", label: "Lima" }], UY: [{ value: "Montevideo", label: "Montevideo" }], VE: [{ value: "Caracas", label: "Caracas" }],
  AL: [{ value: "Tirana", label: "Tirana" }], AD: [{ value: "Andorra la Vella", label: "Andorra la Vella" }], AT: [{ value: "Vienna", label: "Vienna" }], BY: [{ value: "Minsk", label: "Minsk" }], BE: [{ value: "Brussels", label: "Brussels" }], BA: [{ value: "Sarajevo", label: "Sarajevo" }], BG: [{ value: "Sofia", label: "Sofia" }], HR: [{ value: "Zagreb", label: "Zagreb" }], CY: [{ value: "Nicosia", label: "Nicosia" }], CZ: [{ value: "Prague", label: "Prague" }], DK: [{ value: "Copenhagen", label: "Copenhagen" }], EE: [{ value: "Tallinn", label: "Tallinn" }], FO: [{ value: "Tórshavn", label: "Tórshavn" }], FI: [{ value: "Helsinki", label: "Helsinki" }], FR: [{ value: "Paris", label: "Paris" }, {value: "Marseille", label: "Marseille"}, {value: "Lyon", label: "Lyon"}], DE: [{ value: "Berlin", label: "Berlin" }, {value: "Hamburg", label: "Hamburg"}, {value: "Munich", label: "Munich"}], GI: [{ value: "Gibraltar", label: "Gibraltar" }], GR: [{ value: "Athens", label: "Athens" }], HU: [{ value: "Budapest", label: "Budapest" }], IS: [{ value: "Reykjavik", label: "Reykjavik" }], IE: [{ value: "Dublin", label: "Dublin" }], IT: [{ value: "Rome", label: "Rome" }, {value: "Milan", label: "Milan"}, {value: "Naples", label: "Naples"}], LV: [{ value: "Riga", label: "Riga" }], LI: [{ value: "Vaduz", label: "Vaduz" }], LT: [{ value: "Vilnius", label: "Vilnius" }], LU: [{ value: "Luxembourg City", label: "Luxembourg City" }], MT: [{ value: "Valletta", label: "Valletta" }], MD: [{ value: "Chișinău", label: "Chișinău" }], MC: [{ value: "Monaco", label: "Monaco" }], ME: [{ value: "Podgorica", label: "Podgorica" }], NL: [{ value: "Amsterdam", label: "Amsterdam" }], MK: [{ value: "Skopje", label: "Skopje" }], NO: [{ value: "Oslo", label: "Oslo" }], PL: [{ value: "Warsaw", label: "Warsaw" }], PT: [{ value: "Lisbon", label: "Lisbon" }], RO: [{ value: "Bucharest", label: "Bucharest" }], RU: [{ value: "Moscow", label: "Moscow" }, {value: "Saint Petersburg", label: "Saint Petersburg"} ], SM: [{ value: "San Marino", label: "San Marino" }], RS: [{ value: "Belgrade", label: "Belgrade" }], SK: [{ value: "Bratislava", label: "Bratislava" }], SI: [{ value: "Ljubljana", label: "Ljubljana" }], ES: [{ value: "Madrid", label: "Madrid" }, {value: "Barcelona", label: "Barcelona"}], SE: [{ value: "Stockholm", label: "Stockholm" }], CH: [{ value: "Bern", label: "Bern" }, {value: "Zürich", label: "Zürich"}], UA: [{ value: "Kyiv", label: "Kyiv" }], GB: [ { value: "London", label: "London" }, { value: "Birmingham", label: "Birmingham" }, { value: "Manchester", label: "Manchester" }, { value: "Glasgow (Scotland)", label: "Glasgow (Scotland)" }, { value: "Cardiff (Wales)", label: "Cardiff (Wales)" }, { value: "Edinburgh (Scotland)", label: "Edinburgh (Scotland)" }, { value: "Belfast (Northern Ireland)", label: "Belfast (Northern Ireland)" }, { value: "Liverpool", label: "Liverpool"} ],
  AF: [{ value: "Kabul", label: "Kabul" }], AM: [{ value: "Yerevan", label: "Yerevan" }], AZ: [{ value: "Baku", label: "Baku" }], BH: [{ value: "Manama", label: "Manama" }], BD: [{ value: "Dhaka", label: "Dhaka" }], BT: [{ value: "Thimphu", label: "Thimphu" }], BN: [{ value: "Bandar Seri Begawan", label: "Bandar Seri Begawan" }], KH: [{ value: "Phnom Penh", label: "Phnom Penh" }], CN: [{ value: "Beijing", label: "Beijing" }, {value: "Shanghai", label: "Shanghai"}], GE: [{ value: "Tbilisi", label: "Tbilisi" }], HK: [{ value: "Hong Kong", label: "Hong Kong" }], IN: [{ value: "New Delhi", label: "New Delhi" }, {value: "Mumbai", label: "Mumbai"}, {value: "Bangalore", label: "Bangalore"}], ID: [{ value: "Jakarta", label: "Jakarta" }], IR: [{ value: "Tehran", label: "Tehran" }], IQ: [{ value: "Baghdad", label: "Baghdad" }], IL: [{ value: "Jerusalem", label: "Jerusalem" }], JP: [{ value: "Tokyo", label: "Tokyo" }, {value: "Osaka", label: "Osaka"}], JO: [{ value: "Amman", label: "Amman" }], KZ: [{ value: "Nur-Sultan (Astana)", label: "Nur-Sultan (Astana)" }], KW: [{ value: "Kuwait City", label: "Kuwait City" }], KG: [{ value: "Bishkek", label: "Bishkek" }], LA: [{ value: "Vientiane", label: "Vientiane" }], LB: [{ value: "Beirut", label: "Beirut" }], MO: [{ value: "Macao", label: "Macao" }], MY: [{ value: "Kuala Lumpur", label: "Kuala Lumpur" }], MV: [{ value: "Malé", label: "Malé" }], MN: [{ value: "Ulaanbaatar", label: "Ulaanbaatar" }], MM: [{ value: "Naypyidaw", label: "Naypyidaw" }], NP: [{ value: "Kathmandu", label: "Kathmandu" }], KP: [{ value: "Pyongyang", label: "Pyongyang" }], OM: [{ value: "Muscat", label: "Muscat" }], PK: [{ value: "Islamabad", label: "Islamabad" }, {value: "Karachi", label: "Karachi"}], PS: [{ value: "Ramallah (Administrative)", label: "Ramallah (Administrative)" }, { value: "East Jerusalem (Declared)", label: "East Jerusalem (Declared)" }], PH: [{ value: "Manila", label: "Manila" }], QA: [{ value: "Doha", label: "Doha" }], SA: [{ value: "Riyadh", label: "Riyadh" }], SG: [{ value: "Singapore", label: "Singapore" }], KR: [{ value: "Seoul", label: "Seoul" }], LK: [{ value: "Sri Jayawardenepura Kotte", label: "Sri Jayawardenepura Kotte" }, { value: "Colombo (Commercial Capital)", label: "Colombo (Commercial Capital)"}], SY: [{ value: "Damascus", label: "Damascus" }], TW: [{ value: "Taipei", label: "Taipei" }], TJ: [{ value: "Dushanbe", label: "Dushanbe" }], TH: [{ value: "Bangkok", label: "Bangkok" }], TL: [{ value: "Dili", label: "Dili" }], TR: [{ value: "Ankara", label: "Ankara" }, {value: "Istanbul", label: "Istanbul"}], TM: [{ value: "Ashgabat", label: "Ashgabat" }], AE: [{ value: "Abu Dhabi", label: "Abu Dhabi" }, {value: "Dubai", label: "Dubai"}], UZ: [{ value: "Tashkent", label: "Tashkent" }], VN: [{ value: "Hanoi", label: "Hanoi" }, {value: "Ho Chi Minh City", label: "Ho Chi Minh City"}], YE: [{ value: "Sana'a", label: "Sana'a" }],
  DZ: [{ value: "Algiers", label: "Algiers" }], AO: [{ value: "Luanda", label: "Luanda" }], BJ: [{ value: "Porto-Novo", label: "Porto-Novo" }], BW: [{ value: "Gaborone", label: "Gaborone" }], BF: [{ value: "Ouagadougou", label: "Ouagadougou" }], BI: [{ value: "Gitega", label: "Gitega" }], CV: [{ value: "Praia", label: "Praia" }], CM: [{ value: "Yaoundé", label: "Yaoundé" }], CF: [{ value: "Bangui", label: "Bangui" }], TD: [{ value: "N'Djamena", label: "N'Djamena" }], KM: [{ value: "Moroni", label: "Moroni" }], CG: [{ value: "Brazzaville", label: "Brazzaville" }], CD: [{ value: "Kinshasa", label: "Kinshasa" }], CI: [{ value: "Yamoussoukro", label: "Yamoussoukro" }], DJ: [{ value: "Djibouti (city)", label: "Djibouti (city)" }], EG: [{ value: "Cairo", label: "Cairo" }], GQ: [{ value: "Malabo", label: "Malabo" }], ER: [{ value: "Asmara", label: "Asmara" }], SZ: [{ value: "Mbabane (Administrative)", label: "Mbabane (Administrative)" }, { value: "Lobamba (Royal/Legislative)", label: "Lobamba (Royal/Legislative)" }], ET: [{ value: "Addis Ababa", label: "Addis Ababa" }], GA: [{ value: "Libreville", label: "Libreville" }], GM: [{ value: "Banjul", label: "Banjul" }], GH: [{ value: "Accra", label: "Accra" }], GN: [{ value: "Conakry", label: "Conakry" }], GW: [{ value: "Bissau", label: "Bissau" }], KE: [{ value: "Nairobi", label: "Nairobi" }], LS: [{ value: "Maseru", label: "Maseru" }], LR: [{ value: "Monrovia", label: "Monrovia" }], LY: [{ value: "Tripoli", label: "Tripoli" }], MG: [{ value: "Antananarivo", label: "Antananarivo" }], MW: [{ value: "Lilongwe", label: "Lilongwe" }], ML: [{ value: "Bamako", label: "Bamako" }], MR: [{ value: "Nouakchott", label: "Nouakchott" }], MU: [{ value: "Port Louis", label: "Port Louis" }], MA: [{ value: "Rabat", label: "Rabat" }], MZ: [{ value: "Maputo", label: "Maputo" }], NA: [{ value: "Windhoek", label: "Windhoek" }], NE: [{ value: "Niamey", label: "Niamey" }], NG: [{ value: "Abuja", label: "Abuja" }, {value: "Lagos", label: "Lagos"}], RW: [{ value: "Kigali", label: "Kigali" }], ST: [{ value: "São Tomé", label: "São Tomé" }], SN: [{ value: "Dakar", label: "Dakar" }], SC: [{ value: "Victoria", label: "Victoria" }], SL: [{ value: "Freetown", label: "Freetown" }], SO: [{ value: "Mogadishu", label: "Mogadishu" }], ZA: [{ value: "Pretoria (Administrative)", label: "Pretoria (Administrative)" }, { value: "Cape Town (Legislative)", label: "Cape Town (Legislative)" }, { value: "Bloemfontein (Judicial)", label: "Bloemfontein (Judicial)" }, {value: "Johannesburg", label: "Johannesburg"}], SS: [{ value: "Juba", label: "Juba" }], SD: [{ value: "Khartoum", label: "Khartoum" }], TZ: [{ value: "Dodoma", label: "Dodoma" }], TG: [{ value: "Lomé", label: "Lomé" }], TN: [{ value: "Tunis", label: "Tunis" }], UG: [{ value: "Kampala", label: "Kampala" }], ZM: [{ value: "Lusaka", label: "Lusaka" }], ZW: [{ value: "Harare", label: "Harare" }],
  AU: [{ value: "Canberra", label: "Canberra" }, { value: "Sydney", label: "Sydney" }, { value: "Melbourne", label: "Melbourne" }, { value: "Brisbane", label: "Brisbane" }, { value: "Perth", label: "Perth" } ], FJ: [{ value: "Suva", label: "Suva" }], KI: [{ value: "South Tarawa", label: "South Tarawa" }], MH: [{ value: "Majuro", label: "Majuro" }], FM: [{ value: "Palikir", label: "Palikir" }], NR: [{ value: "Yaren (de facto)", label: "Yaren (de facto)" }], NZ: [{ value: "Wellington", label: "Wellington" }, { value: "Auckland", label: "Auckland" }, { value: "Christchurch", label: "Christchurch" } ], PW: [{ value: "Ngerulmud", label: "Ngerulmud" }], PG: [{ value: "Port Moresby", label: "Port Moresby" }], WS: [{ value: "Apia", label: "Apia" }], SB: [{ value: "Honiara", label: "Honiara" }], TO: [{ value: "Nuku'alofa", label: "Nuku'alofa" }], TV: [{ value: "Funafuti", label: "Funafuti" }], VU: [{ value: "Port Vila", label: "Port Vila" }],
  // Note: This list is illustrative and focuses on capitals and major cities.
  // A production application would use a comprehensive, dynamic data source for cities.
};

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

export const AI_SYSTEM_PROMPT_TEMPLATE = `
You are an AI Car Loan Recommendation Engine.
Goal: Act as a Smart Car Loan Recommendation Engine to analyze user inputs and recommend suitable car loans, including ownership cost breakdown and insurance suggestions. Use plausible local bank/insurer names for the user's country.

User Input will be provided as a JSON object with 'vehicle', 'userContext' (country, location, profile), and optional 'preferences'.

Your Recommendation Logic:
1.  Geo-Filter: Use 'userContext.country' and 'userContext.location.city_region' for relevant local banks/products.
2.  Eligibility: Use 'profile.annualIncome' (number) if provided, else 'profile.annualIncomeRange' (tier), considering 'userContext.country'.
3.  Scoring & Ranking: Consider 'profile.desiredLoanTermYears'. Choose closest available term if exact match is not possible, note in rationale.
4.  Result Generation:
    *   Provide 3-6 top loan recommendations.
    *   **Crucially, ensure your recommendations include AT LEAST 3 options from different traditional banks AND AT LEAST 3 options from different credit unions, provided such institutions are commonly found and plausible for the user's 'userContext.country' and 'userContext.location.city_region'. The total number of recommendations should be between 3 and 6.**
    *   **If, after a thorough search, you cannot identify at least 3 distinct banks AND 3 distinct credit unions that offer suitable products, provide as many of each type as are realistically available (aiming for the 3-6 total recommendations range), and clearly state this limitation (e.g., "Fewer than 3 credit unions offering car loans were identified for your specific region.") in the 'messages' array.**
    *   All recommendations should still be ranked overall based on their suitability for the user, regardless of institution type.
    *   For each loan:
        *   'loanDetails':
            *   'loanAmount': 'vehicle.cost' - down payment. Adjust if LTV rules differ, explain in rationale.
            *   'currency': Local currency (ISO 4217) of 'userContext.country'.
            *   'interestRate', 'loanTerm': From simulated bank product. 'loanTerm' near 'profile.desiredLoanTermYears'.
            *   'estimatedMonthlyPayment': Standard loan formula. Round to 2 decimals.
        *   'vehicleInfo': 'fuelEfficiency'.
        *   'requiredDocuments': List.
        *   'rationale': Financial advisor tone.
        *   'ownershipBreakdown':
            *   'vehicleFullCost': Echo 'vehicle.cost'.
            *   'estimatedDownPaymentAmount': 'vehicle.cost' - 'loanDetails.loanAmount'. Align with 'desiredDownPaymentPercent', explain deviations.
            *   'totalLoanPrincipal': Equals 'loanDetails.loanAmount'.
            *   'totalEstimatedInterestPaid': Sum of 'interestPaid' from 'yearlyBreakdown'. Round to 2 decimals.
            *   'totalEstimatedLoanCost': 'totalLoanPrincipal' + 'totalEstimatedInterestPaid'. Round to 2 decimals.
            *   'totalOutOfPocketForVehicle': 'estimatedDownPaymentAmount' + 'totalEstimatedLoanCost'.
            *   'currency': Loan currency.
            *   'yearlyBreakdown': Array of objects for each year of 'loanTerm'. Each object:
                { "year": number, "principalPaid": number, "interestPaid": number, "remainingBalance": number }
                Perform standard loan amortization. Ensure sum of 'principalPaid' matches 'totalLoanPrincipal' (within rounding). Ensure 'remainingBalance' is 0 at end of final year.
            *   'estimatedAnnualRecurringFeesTotal': Sum of estimated annual running costs (e.g., licensing, registration, basic maintenance) plausible for 'userContext.country'. EXCLUDE loan payments & primary insurance.
            *   'recurringFeeDetails': Array: { "name": "string", "estimatedAnnualAmount": number, "currency": "string", "notes"?: "string" } detailing these fees.
        *   'insuranceRecommendation':
            *   Based on 'profile.driversLicenseAgeYears', vehicle details, 'userContext.country'.
            *   'providerName': Plausible for 'userContext.country'.
            *   'policyType', 'estimatedAnnualPremium' (local currency), 'rationale'.
            *   'currency': Loan currency.
    *   Overall 'messages': Helpful info. Remind user about 'ownershipBreakdown.recurringFeeDetails'.

Output (JSON format ONLY - NO markdown fences):
{
  "recommendations": [
    {
      "rank": 1, "bankName": "string", "productName": "string",
      "loanDetails": { "loanAmount": number, "currency": "string", "interestRate": number, "loanTerm": number, "estimatedMonthlyPayment": number },
      "vehicleInfo": { "fuelEfficiency": "string" },
      "requiredDocuments": ["string"], "rationale": "string", "applyLink": "string",
      "ownershipBreakdown": {
        "vehicleFullCost": number, "estimatedDownPaymentAmount": number, "totalLoanPrincipal": number,
        "totalEstimatedInterestPaid": number, "totalEstimatedLoanCost": number, "totalOutOfPocketForVehicle": number, "currency": "string",
        "yearlyBreakdown": [ { "year": 1, "principalPaid": number, "interestPaid": number, "remainingBalance": number } /* ...for each year */ ],
        "estimatedAnnualRecurringFeesTotal": number,
        "recurringFeeDetails": [ { "name": "string", "estimatedAnnualAmount": number, "currency": "string", "notes": "string (optional)" } ]
      },
      "insuranceRecommendation": { "providerName": "string", "policyType": "string", "estimatedAnnualPremium": number, "currency": "string", "rationale": "string" }
    }
  ],
  "messages": ["string"]
}

Current User Input:
\`;
// User input JSON will be injected here by the application
// Ensure response is ONLY the JSON object. No extra text. No markdown.
// If crucial info missing (e.g. cost, location), state in messages.
// Follow the recommendation diversity rules (banks/credit unions) mentioned above.
`;