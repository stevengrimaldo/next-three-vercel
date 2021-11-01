// The base value that every setting is calculated from
const baseValue = 8

// grid settings
const columns = 17
const columnWidth = baseValue * 10 // 80
const gridWidth = columnWidth * columns // 1360

// default breakpoints, based off of common devices sizes
const breakPoints = [320, 375, 480, 667, 768, 960, 1024, 1440, 1600, 1950]

// 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72
const fontSizes = Array.from(
  { length: 9 * 2 },
  (x, i) => (i + 1) * (baseValue / 2)
)

// 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 128, 132, 140
const spacing = Array.from({ length: 9 * 2 }, (x, i) => (i + 1) * baseValue)

// setting up our size shorthands
const sizing = Array.from({ length: 9 * 2 }, (x, i) => ({
  bp: breakPoints[i],
  fs: fontSizes[i],
  lh: fontSizes[i] * 1.5,
  sp: spacing[i],
}))

const baseColors = {
  black: '#000000', // black
  transparent: 'transparent', // transparent
  white: '#FFFFFF', // white
}

const primaryColors = {}

const secondaryColors = {}

export const color = {
  ...baseColors,
  ...primaryColors,
  ...secondaryColors,
}

export const fontFamily = {}

export const fontSize = {
  inherit: 'inherit',
  initial: 'initial',
}

export const fontStyle = {
  inherit: 'inherit',
  initial: 'initial',
  italic: 'italic',
  normal: 'normal',
  oblique: 'oblique',
}

export const fontWeight = {
  black: '900',
  bold: '700',
  extraBold: '800',
  extraLight: '200',
  inherit: 'inherit',
  initial: 'initial',
  light: '300',
  medium: '500',
  normal: '400',
  thin: '100',
}

export const grid = {
  columnWidth: columnWidth, // 80
  gutterWidth: columnWidth, // 80
  maxWidth: gridWidth, // 1360
  outerSpacing: baseValue * 3, // 24
  sectionSpacing: baseValue * 10, // 80
  totalColumns: columns, // 17
}

export const size = {
  lg: sizing[5],
  md: sizing[4],
  sm: sizing[3],
  xl: sizing[6],
  xs: sizing[2],
  xxl: sizing[7],
  xxs: sizing[1],
  xxxl: sizing[8],
  xxxs: sizing[0],
}

export default {
  color,
  fontFamily,
  fontSize,
  fontStyle,
  fontWeight,
  grid,
  size,
}
