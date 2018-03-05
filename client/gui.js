import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import DevTools from 'mobx-react-devtools'
import { ThemeProvider } from 'styled-components'
import { AppContainer } from 'react-hot-loader'

import { Overlay } from './components'
import { LoadingScreen, HotelView, Renderer } from './containers'

const defaultTheme = {
  color: 'blue'
}

export default ({ assetsUrl, theme, dev, container }, store) => {
  const dest = document.createElement('div')
  dest.style.cssText = `
    height: 100%;
    width: 100%;
    position: absolute;
    overflow: hidden;
  `

  container.appendChild(dest)

  ReactDOM.render(
    <AppContainer>
      <Provider {...store}>
        <ThemeProvider theme={theme || defaultTheme}>
          <Renderer>
            <Helmet>
              <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Ubuntu+Condensed" />
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.40/css/uikit.css" />
            </Helmet>
            <LoadingScreen />
            <Overlay />
          </Renderer>
        </ThemeProvider>
      </Provider>
    </AppContainer>,
    dest
  )

  if (dev) {
    const devToolsDest = document.createElement('div')
    window.document.body.insertBefore(devToolsDest, null)

    ReactDOM.render(<DevTools />, devToolsDest)
  }
}
