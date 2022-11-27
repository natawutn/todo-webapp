import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html>
      <Head>
        <Script src='/__ENV.js' strategy='beforeInteractive' type='text/javascript' />
      </Head>
      <title>Uber to do</title>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
