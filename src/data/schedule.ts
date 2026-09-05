export interface ScheduleRow {
  day: string;
  airport: string;
  channel: string;
  notes: string;
}

export const schedule: ScheduleRow[] = [
  {
    day: 'Several / week',
    airport: 'LAX',
    channel: 'Airline Videos',
    notes: 'Hosted LAX shows. Exact days posted on @AIRLINEVIDEOS.',
  },
  {
    day: '24/7',
    airport: 'LAX',
    channel: 'Airline Videos Live+',
    notes: 'H Hotel south 25L/25R and north 24L/24R cams.',
  },
  {
    day: 'Mon / Wed / Sat',
    airport: 'LAX',
    channel: 'L.A. Flights',
    notes: 'Regular LAX hosted live. SAN specials posted on the channel.',
  },
  {
    day: 'Posted on channel',
    airport: 'ORD',
    channel: 'The Curious Spotter',
    notes: 'Chicago O’Hare hosted lives.',
  },
  {
    day: 'Posted on channel',
    airport: 'ATL',
    channel: 'ThePlaneSpotter',
    notes: 'Hartsfield-Jackson hosted lives. Same channel as PHX.',
  },
  {
    day: 'Tue 4pm ET / Sun 3pm ET',
    airport: 'SDF',
    channel: 'SDF Plane Spotting',
    notes: 'UPS Worldport cargo hub.',
  },
  {
    day: 'Dawn to dusk',
    airport: 'LHR',
    channel: 'Flight Focus 365',
    notes: 'Dedicated Heathrow camera. Official YouTube.',
  },
  {
    day: 'Tue / Thu / Sun',
    airport: 'FLL',
    channel: "HORI's BOX",
    notes: 'Based at FLL. Surprise MIA shows some weeks.',
  },
  {
    day: 'Wed / Fri / Sun',
    airport: 'MAN',
    channel: 'Airliners Live',
    notes: 'Manchester, UK time.',
  },
  {
    day: 'Wed 4–7pm ET (target)',
    airport: 'MCO',
    channel: 'Airport Runways Live — Desk',
    notes: 'Aviation Live Desk: who’s live, weather, heavies due at MCO. Posted on the channel until weekly.',
  },
  {
    day: 'Posted on channel',
    airport: 'MCO · TPA',
    channel: 'Airport Runways Live',
    notes: 'Hosted lives from Orlando International and Tampa International.',
  },
  {
    day: 'Posted on channel',
    airport: 'AMS',
    channel: 'AMS LIVE',
    notes: 'Amsterdam Schiphol hosted lives.',
  },
  {
    day: 'Weekly',
    airport: 'MEL',
    channel: 'Melbourne Flyer',
    notes: 'Tullamarine, Australia time.',
  },
  {
    day: 'Posted on channel',
    airport: 'BNE',
    channel: 'Julia Flights',
    notes: 'Brisbane home. MEL / SYD specials.',
  },
  {
    day: '24/7',
    airport: 'LAS · SXM · LGA · MSY · RNO · ACE',
    channel: 'Flightradar24',
    notes: 'Automated CamStreamer PTZ cameras.',
  },
];
