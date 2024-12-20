import { Roboto, Playfair_Display, Dancing_Script } from 'next/font/google'

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
})

export const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
}) 