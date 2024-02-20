import colors from "../constants/colors"
import { StyleSheet } from 'react-native'

export const titleStyles = StyleSheet.create({
  onboardingTitle: {
    color: colors.LIGHTNING_YELLOW,
    fontSize: 32,
    fontWeight: '600'
  },
  title: {
    color: colors.LIGHTNING_YELLOW,
    fontSize: 32,
  }
})

export const textStyles = StyleSheet.create({
  inputInfo: {
    fontSize: 14,
    paddingTop: 6,
    color: colors.SCORPION
  },
  inputError: {
    fontSize: 14,
    paddingTop: 6,
    color: colors.SUNSET_ORANGE
  },
  inputLabel: {
    textTransform: 'capitalize',
    fontWeight: 'bold',
    fontSize: 10,
    color: colors.WHITE
  },
  required: {
    textTransform: 'capitalize',
    fontSize: 10,
    color: colors.WHITE
  },
  link: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.WHITE
  },
  underline: {
    textDecorationLine: 'underline'
  }
})