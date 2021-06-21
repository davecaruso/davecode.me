import Head from 'next/head';
import Link from 'next/link';

import c from '../style/404.module.scss';

export default function Home() {
  return (
    <div className={c.root}>
      <Head>
        <title>davecode: not found</title>
        <meta name="description" content="davecode is a creative project by dave caruso to take computer software and it's artistic and automation capabilities to the limits." />
        <meta name="author" content="dave caruso" />
      </Head>

      <main>
        <h1>
            wrong url / broken link
        </h1>
        <p>
            the thing you are trying to find either doesn't exist, is under a different filename, or has disappeared...
        </p>
        <p>
            please note that this website is under a full rewrite, see the home page for more details.
        </p>
        <ul>
            <li><Link href="/">home page</Link></li>
            {/* <li><Link href="/videos">my videos</Link></li> */}
            <li><a href="https://google.com">google</a></li>
            <li><a href="mailto:dave@davecode.me">tell me about it</a></li>
            <li><a href="https://reddit.com/r/all">browse memes</a></li>
        </ul>
      </main>
    </div>
  )
}

