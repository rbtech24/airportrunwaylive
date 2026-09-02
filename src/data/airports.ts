import type { Airport } from './types';

export const airports: Airport[] = [
  {
    code: 'MCO',
    icao: 'KMCO',
    name: 'Orlando International',
    city: 'Orlando',
    region: 'us',
    country: 'US',
    intro:
      'Orlando International is Florida’s busiest airport. Official spotting is allowed on Terminal Top Garage L9–L10, Garage C L6, and South Park Place Economy Lot after GOAA approval. Airport Runways Live is based here.',
    ourNote:
      'We stream from MCO with Greater Orlando Aviation Authority spotting approval. Complete the GOAA form before you go: flymco.com/non-travelers/planespotting/',
    related: ['TPA', 'MIA', 'FLL'],
  },
  {
    code: 'TPA',
    icao: 'KTPA',
    name: 'Tampa International',
    city: 'Tampa',
    region: 'us',
    country: 'US',
    intro:
      'Tampa is our practice field. Local hobby streams exist. We use TPA to test gear. One main complex, water in the background, and a regular mix of domestic trunks plus the occasional heavy.',
    ourNote: 'Airport Runways Live streams Tampa when we are in town. 813 Aviation covers TPA on evenings and nights.',
    related: ['MCO', 'MIA', 'FLL'],
  },
  {
    code: 'BOG',
    icao: 'SKBO',
    name: 'El Dorado International',
    city: 'Bogotá',
    region: 'latam',
    country: 'CO',
    intro:
      'El Dorado is the unique English-language live slot. Spanish videos exist. We stream when we’re in Colombia. Avianca, cargo heavies, and high-altitude operations make it a different board from Florida.',
    ourNote: 'Airport Runways Live covers BOG as specials, not a weekly show. English and Spanish speakers are welcome in chat.',
    related: ['MIA', 'MCO'],
  },
  {
    code: 'LAX',
    icao: 'KLAX',
    name: 'Los Angeles International',
    city: 'Los Angeles',
    region: 'us',
    country: 'US',
    intro:
      'Four parallels, two complexes, and the densest hosted-livestream scene in the U.S. South-side 24/7 hotel cameras sit on 25L/25R; hosted shows rotate in from Airline Videos and L.A. Flights.',
    ourNote: 'We list official LAX YouTube lives only. We do not restream them.',
    related: ['SFO', 'LAS', 'PHX'],
  },
  {
    code: 'DFW',
    icao: 'KDFW',
    name: 'Dallas/Fort Worth International',
    city: 'Dallas',
    region: 'us',
    country: 'US',
    intro:
      'American’s fortress hub. Seven runways, wide cargo and passenger mix, and long sightlines from the perimeter. Runway DFW is the hosted channel we list.',
    ourNote: 'Status is taken from the catalog, not guessed. If it is not live, the badge says so.',
    related: ['PHX', 'DEN', 'MIA'],
  },
  {
    code: 'MIA',
    icao: 'KMIA',
    name: 'Miami International',
    city: 'Miami',
    region: 'us',
    country: 'US',
    intro:
      'The Latin American gateway and a cargo heaven: 747s, MD-11 memories, and a passenger mix you will not see at most U.S. fields. Several independent hosts cover MIA on a schedule.',
    ourNote: 'HORI’s BOX also covers MIA from a Fort Lauderdale base. PLANES & FRIENDS and Miami Plane Spotting are listed when they go live.',
    related: ['FLL', 'MCO', 'TPA'],
  },
  {
    code: 'FLL',
    icao: 'KFLL',
    name: 'Fort Lauderdale–Hollywood International',
    city: 'Fort Lauderdale',
    region: 'us',
    country: 'US',
    intro:
      'Close-in runways, beach light, and a strong low-cost mix. HORI’s BOX is based here and streams FLL three days a week, with surprise MIA shows.',
    ourNote: 'FLL is a listed South Florida field. We do not operate a 24/7 cam here.',
    related: ['MIA', 'MCO', 'TPA'],
  },
  {
    code: 'SFO',
    icao: 'KSFO',
    name: 'San Francisco International',
    city: 'San Francisco',
    region: 'us',
    country: 'US',
    intro:
      'Marine layer, bay approaches, and a Pacific widebody mix. SF FLIGHTS is the hosted channel on this board.',
    ourNote: 'Scheduled, not 24/7. SF FLIGHTS and Cali Planes are the hosted listings. Check their channels for the next show.',
    related: ['LAX', 'LAS', 'PHX'],
  },
  {
    code: 'PHX',
    icao: 'KPHX',
    name: 'Phoenix Sky Harbor',
    city: 'Phoenix',
    region: 'us',
    country: 'US',
    intro:
      'Desert light, parallel runways, and a Southwest-heavy domestic board with long-haul mixed in. ThePlaneSpotter is the hosted listing.',
    ourNote: 'We only link the official YouTube channel. No proxy player.',
    related: ['LAS', 'LAX', 'DEN'],
  },
  {
    code: 'DEN',
    icao: 'KDEN',
    name: 'Denver International',
    city: 'Denver',
    region: 'us',
    country: 'US',
    intro:
      'High, wide, and windy. United’s mountain hub with long runways and weather that actually changes the show. Captain Will is the hosted listing.',
    ourNote: 'Schedule is announced on the creator’s channel, not invented here.',
    related: ['PHX', 'LAS', 'DFW'],
  },
  {
    code: 'BOS',
    icao: 'KBOS',
    name: 'Boston Logan International',
    city: 'Boston',
    region: 'us',
    country: 'US',
    intro:
      'Harbor approaches, European heavies, and the island-hopper mix Logan is known for. Logan in Flight is the hosted channel on this board.',
    ourNote: 'Nearest 24/7 cam on the board is LaGuardia, not Logan.',
    related: ['JFK', 'LHR', 'MCO'],
  },
  {
    code: 'LAS',
    icao: 'KLAS',
    name: 'Harry Reid International',
    city: 'Las Vegas',
    region: 'us',
    country: 'US',
    intro:
      'A true 24/7 field. The Flightradar24 automated cam looks down 26L/26R with the Strip in the background — Axis PTZ, CamStreamer tracking, ADS-B overlay.',
    ourNote: 'This is an official Flightradar24 YouTube live. We link it. We do not restream it.',
    related: ['LAX', 'PHX', 'SFO'],
  },
  {
    code: 'SXM',
    icao: 'TNCM',
    name: 'Princess Juliana International',
    city: 'St. Maarten',
    region: 'caribbean',
    country: 'SX',
    intro:
      'Maho Beach, runway 10, aircraft on short final a few meters over the sand. One of the most watched airport cameras in the world, now on an automated Flightradar24 / CamStreamer feed.',
    ourNote: 'Watch on the official Flightradar24 YouTube live so the partnership that runs the camera keeps the view.',
    related: ['MIA', 'FLL', 'SFO'],
  },
  {
    code: 'MAN',
    icao: 'EGCC',
    name: 'Manchester Airport',
    city: 'Manchester',
    region: 'europe',
    country: 'GB',
    intro:
      'North of England hub with a regular holiday-charter and long-haul mix. Airliners Live hosts on Wednesday, Friday, and Sunday (UK time).',
    ourNote: 'Times are UK. Convert before you sit down with coffee.',
    related: ['LHR', 'BOS', 'JFK'],
  },
  {
    code: 'LHR',
    icao: 'EGLL',
    name: 'London Heathrow',
    city: 'London',
    region: 'europe',
    country: 'GB',
    intro:
      'The European heavy board. Big Jet TV is the hosted listing we carry for Heathrow and other UK weather days — official YouTube, not a scrape.',
    ourNote: 'No 24/7 Heathrow cam is listed on this board. Do not expect a fake LIVE badge.',
    related: ['MAN', 'BOS', 'JFK'],
  },
  {
    code: 'JFK',
    icao: 'KJFK',
    name: 'John F. Kennedy International',
    city: 'New York',
    region: 'us',
    country: 'US',
    intro:
      'New York’s international gateway. We do not currently list a JFK-specific hosted live. The nearest automated 24/7 camera on this board is LaGuardia (LGA).',
    ourNote: 'If you run a regular JFK live on YouTube, send it via Add a stream. We only list official channel URLs.',
    related: ['BOS', 'MCO', 'LAX'],
  },
  {
    code: 'AMS',
    icao: 'EHAM',
    name: 'Amsterdam Airport Schiphol',
    city: 'Amsterdam',
    region: 'europe',
    country: 'NL',
    intro:
      'Europe’s multi-runway crossroads. KLM heavies, the Polderbaan, and weather that actually changes the show. AMS LIVE is the hosted channel on this board.',
    ourNote: 'Scheduled, not 24/7. Watch on the official @AMSLIVE YouTube so they keep the view.',
    related: ['LHR', 'MAN', 'LIS'],
  },
  {
    code: 'LIS',
    icao: 'LPPT',
    name: 'Humberto Delgado Airport',
    city: 'Lisbon',
    region: 'europe',
    country: 'PT',
    intro:
      'Atlantic gateway with TAP heavies and a mix you will not see in Florida. Aviation TV is the hosted listing.',
    ourNote: 'Schedule is announced on the creator’s channel.',
    related: ['AMS', 'LHR', 'ACE'],
  },
  {
    code: 'YVR',
    icao: 'CYVR',
    name: 'Vancouver International',
    city: 'Vancouver',
    region: 'other',
    country: 'CA',
    intro:
      'Pacific gateway for Canada. Airliners Live covers Vancouver when they are there — same channel as Manchester.',
    ourNote: 'Not a 24/7 cam. Check @AirlinersLive for the next YVR show.',
    related: ['SFO', 'LAX', 'MAN'],
  },
  {
    code: 'MEL',
    icao: 'YMML',
    name: 'Melbourne Airport',
    city: 'Melbourne',
    region: 'oceania',
    country: 'AU',
    intro:
      'Tullamarine is the heavy board for south-east Australia. Melbourne Flyer hosts regular lives; Julia Flights also covers MEL on specials.',
    ourNote: 'Times are Australia/Melbourne. Convert before you sit down.',
    related: ['BNE', 'SYD', 'SFO'],
  },
  {
    code: 'BNE',
    icao: 'YBBN',
    name: 'Brisbane Airport',
    city: 'Brisbane',
    region: 'oceania',
    country: 'AU',
    intro:
      'Queensland’s international field and the home base for Julia Flights. Emirates A380s, Asian heavies, and domestic jets.',
    ourNote: 'Official channel @juliaflights. We list it. We do not restream it.',
    related: ['MEL', 'SYD', 'SFO'],
  },
  {
    code: 'SYD',
    icao: 'YSSY',
    name: 'Sydney Kingsford Smith',
    city: 'Sydney',
    region: 'oceania',
    country: 'AU',
    intro:
      'Australia’s busiest airport. Julia Flights covers Sydney as specials from a Brisbane base. No dedicated 24/7 SYD cam is listed.',
    ourNote: 'If you run a regular SYD live, send it via Add a stream.',
    related: ['MEL', 'BNE', 'LAX'],
  },
  {
    code: 'ACE',
    icao: 'GCRR',
    name: 'Lanzarote Airport',
    city: 'Lanzarote',
    region: 'europe',
    country: 'ES',
    intro:
      'Canary Islands holiday field with a Flightradar24 / CamStreamer 24/7 automated camera — one of the few always-on European tiles on this board.',
    ourNote: 'Official Flightradar24 YouTube live. Creators keep the view.',
    related: ['LIS', 'LHR', 'AMS'],
  },
  {
    code: 'NRT',
    icao: 'RJAA',
    name: 'Narita International',
    city: 'Tokyo',
    region: 'asia',
    country: 'JP',
    intro:
      'Tokyo’s long-haul gateway. Love Flight Jack hosts regular lives from Narita — JAL, ANA, and the heavies from Europe and the US.',
    ourNote: 'Scheduled hosted lives on @loveflightjack. We list the official channel. We do not restream.',
    related: ['SFO', 'LAX', 'AMS'],
  },
  {
    code: 'HND',
    icao: 'RJTT',
    name: 'Tokyo Haneda',
    city: 'Tokyo',
    region: 'asia',
    country: 'JP',
    intro:
      'Tokyo’s close-in international. Live Jet hosts from Haneda when they go out. Four-runway ops, JAL and ANA heavies.',
    ourNote: 'Scheduled on @livejet. Not a 24/7 cam.',
    related: ['NRT', 'SFO', 'LAX'],
  },
  {
    code: 'DXB',
    icao: 'OMDB',
    name: 'Dubai International',
    city: 'Dubai',
    region: 'asia',
    country: 'AE',
    intro:
      'One of the busiest international hubs on earth. There is no honest public 24/7 runway cam from DXB that we will list. Simulator streams and VODs do not belong on this board.',
    ourNote:
      'If you run a regular, real DXB live on YouTube, send it via Add a stream. We will not fake one.',
    related: ['NRT', 'LHR', 'AMS'],
  },
  {
    code: 'SIN',
    icao: 'WSSS',
    name: 'Singapore Changi',
    city: 'Singapore',
    region: 'asia',
    country: 'SG',
    intro:
      'Often called the world’s best airport. Aerowanderer is the Changi-focused channel we list — hosted spotting and rush-hour films, not a fake 24/7 cam.',
    ourNote: 'Official @aerowanderer. If you run a regular SIN live, send it via Add a stream.',
    related: ['NRT', 'MEL', 'LHR'],
  },
];

export const airportByCode = Object.fromEntries(airports.map((a) => [a.code, a])) as Record<
  string,
  Airport
>;

export function getAirport(code: string): Airport | undefined {
  return airportByCode[code.toUpperCase()];
}
