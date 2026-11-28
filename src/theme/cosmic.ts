export const cosmic = {
  canvas: '#080a17',
  panel: '#11162b',
  glass: '#151b32e8',
  raised: '#202842',
  text: '#f4f5ff',
  muted: '#b0bedb',
  border: '#3a4868',
  focus: '#a3eeff',
  action: '#5233ba',
  actionEdge: '#a58aff',
  violetSurface: '#231a44',
  violet: '#d2baff',
  roseControl: '#672a56',
  roseSurface: '#321b37',
  roseEdge: '#d479b1',
  rose: '#ffb3df',
  iceSurface: '#132c43',
  iceEdge: '#4c8da9',
  ice: '#88e9fc',
  mintSurface: '#102e33',
  mintEdge: '#4a917e',
  mintTrack: '#254a4e',
  mint: '#80ebc4',
  orangeSurface: '#392333',
  orangeEdge: '#c67e6a',
  orange: '#ffbf9c',
  danger: '#ffacb4',
  dangerSurface: '#431f33',
  dangerEdge: '#bd6375',
  gold: '#fbd791',
  goldSurface: '#34283a',
  neutralWhite: '#fff',
  clear: '#080a1700',
  gloss: '#ffffff12',
  shadow: '#030411',
} as const;

export const cosmicType = { bold: '700' } as const;

export const gameButton = {
  borderWidth: 1,
  borderBottomWidth: 2,
  borderRadius: 13,
} as const;

export const glassCard = {
  backgroundColor: cosmic.glass,
  borderWidth: 1,
  borderBottomWidth: 2,
  borderColor: cosmic.border,
  borderRadius: 21,
} as const;

export const actionGradient = ['#6944cf', '#4926a4', '#1f428d'] as const;

export const pricingSpectrum = {
  sheet: ['#22183c', '#191c38', '#102438'],
  sheetEdge: '#66568b',
  pro: ['#463058', '#2b1c43', '#1e2150'],
} as const;

export const moduleSpectra = {
  vocabulary: { main: cosmic.mint, edge: cosmic.mintEdge, surface: cosmic.mintSurface, gradient: ['#19514e', '#16383e', '#14263b'] },
  grammar: { main: cosmic.violet, edge: cosmic.actionEdge, surface: cosmic.violetSurface, gradient: ['#392b68', '#23204b', '#182942'] },
  listening: { main: '#c6b1ff', edge: '#987ced', surface: '#281d58', gradient: ['#532e88', '#2e2459', '#171d39'] },
  speaking: { main: cosmic.rose, edge: cosmic.roseEdge, surface: cosmic.roseSurface, gradient: ['#59245d', '#321b43', '#1b213f'] },
  reading: { main: cosmic.ice, edge: cosmic.iceEdge, surface: cosmic.iceSurface, gradient: ['#194966', '#152c49', '#171d39'] },
  writing: { main: cosmic.orange, edge: cosmic.orangeEdge, surface: cosmic.orangeSurface, gradient: ['#663840', '#452a40', '#2a2244'] },
} as const;
