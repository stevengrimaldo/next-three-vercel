import React from 'react'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from 'styled-components'
import { GlobalStyles, theme } from '@global'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Component {...pageProps} />
      <Analytics />
    </ThemeProvider>
  )
}

export default App
