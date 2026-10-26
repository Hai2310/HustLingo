export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 36 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 20, xxl: 26, pill: 999 } as const;
export const maxContentWidth = 1120;
export const shadow = {
  card: {
    shadowColor: '#6B291B',
    shadowOpacity: 0.075,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  float: {
    shadowColor: '#8B2436',
    shadowOpacity: 0.14,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 15 },
    elevation: 7,
  },
} as const;
