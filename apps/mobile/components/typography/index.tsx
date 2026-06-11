import React from 'react'
import { Text as RNText, StyleSheet } from 'react-native'
import type { TextProps, TextStyle } from 'react-native'
import { useAppTheme } from '@/theme'

// ─── Font weight specs ────────────────────────────────────────────────────────
// System fonts (SF Pro on iOS, Roboto on Android) support fontWeight natively,
// so we set only fontWeight — no fontFamily. This is intentional: mixing a
// custom fontFamily with fontWeight causes Android to drop the custom font and
// fall back to the system typeface.
//
// To load a custom font (e.g. Geist via expo-font), replace each entry with its
// weight-specific family name and remove fontWeight entirely, e.g.:
//   regular:  { fontFamily: 'Geist-Regular' }
//   medium:   { fontFamily: 'Geist-Medium' }
//   semibold: { fontFamily: 'Geist-SemiBold' }
//   bold:     { fontFamily: 'Geist-Bold' }
export const FONT: Record<
  'regular' | 'medium' | 'semibold' | 'bold',
  Pick<TextStyle, 'fontFamily' | 'fontWeight'>
> = {
  regular: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  semibold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
}

// ─── Shared props ─────────────────────────────────────────────────────────────
interface TypographyProps extends TextProps {
  /** Override the automatic semantic colour */
  color?: string
}

// ─── Internal helper ──────────────────────────────────────────────────────────
function makeStyle(
  size: number,
  weight: keyof typeof FONT,
  lineHeight: number,
  letterSpacing = 0,
): TextStyle {
  return { ...FONT[weight], fontSize: size, lineHeight, letterSpacing }
}

// ─── Components ───────────────────────────────────────────────────────────────

/**
 * Screen-level heading — "Tasks", "Profile", "Morning, Casey"
 * 28 px · 700 · -0.3 tracking
 */
export function Title({ style: overrides, color, ...props }: TypographyProps) {
  const { colors } = useAppTheme()
  return (
    <RNText style={[styles.title, { color: color ?? colors.onBackground }, overrides]} {...props} />
  )
}

/**
 * Section heading — "Today", "Achievements", "Up next"
 * 18 px · 700
 */
export function Heading({ style: overrides, color, ...props }: TypographyProps) {
  const { colors } = useAppTheme()
  return (
    <RNText
      style={[styles.heading, { color: color ?? colors.onBackground }, overrides]}
      {...props}
    />
  )
}

/**
 * Card / sub-section title — task title, user name
 * 16 px · 600
 */
export function Subheading({ style: overrides, color, ...props }: TypographyProps) {
  const { colors } = useAppTheme()
  return (
    <RNText
      style={[styles.subheading, { color: color ?? colors.onBackground }, overrides]}
      {...props}
    />
  )
}

/**
 * Default body copy — descriptions, list content
 * 15 px · 400
 */
export function Text({ style: overrides, color, ...props }: TypographyProps) {
  const { colors } = useAppTheme()
  return (
    <RNText style={[styles.text, { color: color ?? colors.onSurface }, overrides]} {...props} />
  )
}

/**
 * Supporting / secondary copy — timestamps, metadata
 * 13 px · 400
 */
export function Caption({ style: overrides, color, ...props }: TypographyProps) {
  const { colors } = useAppTheme()
  return (
    <RNText
      style={[styles.caption, { color: color ?? colors.onSurfaceVariant }, overrides]}
      {...props}
    />
  )
}

/**
 * Micro uppercase label — "STREAK", "CURRENT FOCUS", category tags
 * 11 px · 600 · uppercase · 0.6 tracking
 */
export function Label({ style: overrides, color, ...props }: TypographyProps) {
  const { colors } = useAppTheme()
  return (
    <RNText style={[styles.label, { color: color ?? colors.textTertiary }, overrides]} {...props} />
  )
}

/**
 * Large numeric display — stat values, timer digits
 * 22 px · 700 · -0.3 tracking
 */
export function Display({ style: overrides, color, ...props }: TypographyProps) {
  const { colors } = useAppTheme()
  return (
    <RNText
      style={[styles.display, { color: color ?? colors.onBackground }, overrides]}
      {...props}
    />
  )
}

// ─── Scale ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  title: makeStyle(28, 'bold', 34, -0.3),
  heading: makeStyle(18, 'bold', 24),
  subheading: makeStyle(16, 'semibold', 22),
  text: makeStyle(15, 'regular', 22),
  caption: makeStyle(13, 'regular', 18),
  label: { ...makeStyle(11, 'semibold', 16, 0.6), textTransform: 'uppercase' },
  display: makeStyle(22, 'bold', 28, -0.3),
})
