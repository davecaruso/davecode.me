import Head from 'next/head';
import BackButton from '../components/BackButton';

import c from '../style/videos.module.scss';

export default function Music() {
  return (
    <div className={c.root}>
      <Head>
        <title>davecode videos</title>
        <meta
          name='description'
          content="davecode is a creative project by dave caruso to take computer software and it's artistic and automation capabilities to the limits."
        />
        <meta name='author' content='dave caruso' />
      </Head>

      <main>
        <BackButton inverted />
        <h1>videos</h1>
        <p>videos</p>
      </main>
    </div>
  );
}
