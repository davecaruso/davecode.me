import Head from 'next/head';
import { BackButton } from '../components/BackButton';

import c from '../style/404.module.scss';

export default function Music() {
  return (
    <div className={c.root}>
      <Head>
        <title>davecode fragments</title>
        <meta
          name='description'
          content="davecode is a creative project by dave caruso to take computer software and it's artistic and automation capabilities to the limits."
        />
        <meta name='author' content='dave caruso' />
      </Head>

      <main>
        <BackButton />
      </main>
    </div>
  );
}
