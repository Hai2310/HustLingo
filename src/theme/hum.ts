// Hum paper and ink shared by Expo web and native screens.
export const hum = {
  paper: '#F8F4E8',
  card: '#FFFCF3',
  paperDeep: '#EDE6D2',
  ink: '#161820',
  muted: '#565548',
  rule: '#D9D0B9',
  pear: '#F3D642',
  pearEdge: '#B3952E',
  pearSoft: '#FFF0BD',
  pearInk: '#78500E',
  coral: '#F89180',
  coralEdge: '#AD584B',
  coralSoft: '#FCE4DC',
  sky: '#D7E7F3',
  skyEdge: '#9BB3CA',
  blue: '#24548C',
  mint: '#DFEFDB',
  mintRule: '#AFCBAD',
  mintTrack: '#B7D2AE',
  greenInk: '#24573C',
} as const;

export const humType = { bold: '700' } as const;

export const paperButton = {
  borderWidth: 1,
  borderBottomWidth: 4,
  borderRadius: 15,
} as const;

export const paperCard = {
  backgroundColor: hum.card,
  borderWidth: 1,
  borderBottomWidth: 3,
  borderColor: hum.rule,
  borderRadius: 19,
} as const;

export const pricingPaper = {
  sheet: ['#FFF0C9', '#FFF9E9'],
  sheetEdge: '#DEC27F',
  plus: ['#F8FCFF', '#E5F1FB'],
  pro: ['#FFF7D9', '#FFE08B'],
  proEdge: '#D3A74C',
  proInk: hum.pearInk,
} as const;
