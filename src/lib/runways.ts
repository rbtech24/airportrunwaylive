export interface RunwayEnd {
  id: string;
  hdg: number;
}

/** Magnetic headings, rounded. Spotting aid only — not ATIS. */
export const RUNWAYS: Record<string, RunwayEnd[]> = {
  MCO: [
    { id: '18L', hdg: 180 }, { id: '36R', hdg: 360 },
    { id: '18R', hdg: 180 }, { id: '36L', hdg: 360 },
    { id: '17L', hdg: 179 }, { id: '35R', hdg: 359 },
    { id: '17R', hdg: 179 }, { id: '35L', hdg: 359 },
  ],
  TPA: [
    { id: '1L', hdg: 10 }, { id: '19R', hdg: 190 },
    { id: '1R', hdg: 10 }, { id: '19L', hdg: 190 },
    { id: '10', hdg: 100 }, { id: '28', hdg: 280 },
  ],
  LAX: [
    { id: '6L', hdg: 69 }, { id: '24R', hdg: 249 },
    { id: '6R', hdg: 69 }, { id: '24L', hdg: 249 },
    { id: '7L', hdg: 70 }, { id: '25R', hdg: 250 },
    { id: '7R', hdg: 70 }, { id: '25L', hdg: 250 },
  ],
  SFO: [
    { id: '28L', hdg: 284 }, { id: '10R', hdg: 104 },
    { id: '28R', hdg: 284 }, { id: '10L', hdg: 104 },
    { id: '1L', hdg: 14 }, { id: '19R', hdg: 194 },
    { id: '1R', hdg: 14 }, { id: '19L', hdg: 194 },
  ],
  LAS: [
    { id: '26L', hdg: 259 }, { id: '8R', hdg: 79 },
    { id: '26R', hdg: 259 }, { id: '8L', hdg: 79 },
    { id: '1L', hdg: 14 }, { id: '19R', hdg: 194 },
    { id: '1R', hdg: 14 }, { id: '19L', hdg: 194 },
  ],
  DFW: [
    { id: '17C', hdg: 176 }, { id: '35C', hdg: 356 },
    { id: '17L', hdg: 176 }, { id: '35R', hdg: 356 },
    { id: '17R', hdg: 176 }, { id: '35L', hdg: 356 },
    { id: '18L', hdg: 176 }, { id: '36R', hdg: 356 },
    { id: '18R', hdg: 176 }, { id: '36L', hdg: 356 },
    { id: '13L', hdg: 135 }, { id: '31R', hdg: 315 },
    { id: '13R', hdg: 135 }, { id: '31L', hdg: 315 },
  ],
  MIA: [
    { id: '8L', hdg: 87 }, { id: '26R', hdg: 267 },
    { id: '8R', hdg: 87 }, { id: '26L', hdg: 267 },
    { id: '9', hdg: 87 }, { id: '27', hdg: 267 },
    { id: '12', hdg: 122 }, { id: '30', hdg: 302 },
  ],
  FLL: [
    { id: '10L', hdg: 96 }, { id: '28R', hdg: 276 },
    { id: '10R', hdg: 96 }, { id: '28L', hdg: 276 },
  ],
  BOS: [
    { id: '4L', hdg: 36 }, { id: '22R', hdg: 216 },
    { id: '4R', hdg: 36 }, { id: '22L', hdg: 216 },
    { id: '9', hdg: 93 }, { id: '27', hdg: 273 },
    { id: '15L', hdg: 148 }, { id: '33R', hdg: 328 },
    { id: '15R', hdg: 148 }, { id: '33L', hdg: 328 },
  ],
  JFK: [
    { id: '4L', hdg: 44 }, { id: '22R', hdg: 224 },
    { id: '4R', hdg: 44 }, { id: '22L', hdg: 224 },
    { id: '13L', hdg: 134 }, { id: '31R', hdg: 314 },
    { id: '13R', hdg: 134 }, { id: '31L', hdg: 314 },
  ],
  LHR: [
    { id: '09L', hdg: 90 }, { id: '27R', hdg: 270 },
    { id: '09R', hdg: 90 }, { id: '27L', hdg: 270 },
  ],
};

export function expectRunways(code: string, wdir: number, wspd: number): string | null {
  const list = RUNWAYS[code];
  if (!list?.length) return null;
  if (wspd < 4) return `wind light → either direction`;
  const scored = list.map((r) => {
    const diff = ((wdir - r.hdg + 540) % 360) - 180;
    const hw = Math.cos((diff * Math.PI) / 180) * wspd;
    return { ...r, hw };
  });
  const best = Math.max(...scored.map((s) => s.hw));
  const chosen = scored.filter((s) => s.hw >= best - 1.5).map((s) => s.id);
  if (!chosen.length) return null;
  return `wind ${wdir}°/${wspd}kt → expect ${chosen.join(' / ')}`;
}

export function liveAtcUrl(icao: string): string {
  return `https://www.liveatc.net/search/?icao=${encodeURIComponent(icao.toLowerCase())}`;
}
