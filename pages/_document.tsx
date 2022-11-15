import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <script type='text/javascript' src='/__ENV.js' async />
      </Head>
      <title>Uber to do</title>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
