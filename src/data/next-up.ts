export interface NextSlot {
  days: number[];
  airport: string;
  channel: string;
  href: string;
  note: string;
  always?: boolean;
}

/** 0 = Sunday. Known hosted days only — not guessed LIVE. */
export const nextSlots: NextSlot[] = [
  {
    days: [1, 3, 6],
    airport: 'LAX',
    channel: 'L.A. Flights',
    href: '/watch?id=la-flights-lax',
    note: 'Mon / Wed / Sat',
  },
  {
    days: [2, 4, 0],
    airport: 'FLL',
    channel: "HORI's BOX",
    href: '/watch?id=horis-box-fll',
    note: 'Tue / Thu / Sun',
  },
  {
    days: [3, 5, 0],
    airport: 'MAN',
    channel: 'Airliners Live',
    href: '/watch?id=airliners-live-man',
    note: 'Wed / Fri / Sun · UK',
  },
  {
    days: [3],
    airport: 'MCO',
    channel: 'Aviation Live Desk',
    href: '/desk',
    note: 'Wed 4–7pm ET (target)',
  },
  {
    days: [2, 0],
    airport: 'SDF',
    channel: 'SDF Plane Spotting',
    href: '/watch?id=sdf-plane-spotting',
    note: 'Tue 4pm / Sun 3pm ET',
  },
  {
    days: [0, 1, 2, 3, 4, 5, 6],
    airport: 'LAS',
    channel: 'FR24 24/7',
    href: '/watch?id=fr24-las',
    note: 'Always on',
    always: true,
  },
  {
    days: [0, 1, 2, 3, 4, 5, 6],
    airport: 'SXM',
    channel: 'FR24 Maho',
    href: '/watch?id=fr24-sxm',
    note: 'Always on',
    always: true,
  },
];

export function slotsForDay(day: number): NextSlot[] {
  const hosted = nextSlots.filter((s) => !s.always && s.days.includes(day));
  const cams = nextSlots.filter((s) => s.always);
  return [...hosted, ...cams];
}
