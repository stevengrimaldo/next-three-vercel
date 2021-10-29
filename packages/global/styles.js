import { createGlobalStyle } from 'styled-components'
import resetCSS from './reset'

export default createGlobalStyle`
  ${resetCSS}

  html, body, #__next {
    height: 100%;
  }
`
