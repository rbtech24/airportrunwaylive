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
    day: 'Mon / Wed / Sat',
    airport: 'LAX',
    channel: 'L.A. Flights',
    notes: 'Regular LAX hosted live.',
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
  {
    day: '24/7',
    airport: 'LAX',
    channel: 'Airline Videos Live+',
    notes: 'Hotel cams on the north and south complexes.',
  },
];
