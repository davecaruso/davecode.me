import Head from 'next/head';
import { BackButton } from '../components/BackButton';
// import { createGSP } from '../../utils/data';

import c from '../style/software.module.scss';

export default function Music() {
  return (
    <div className={c.root}>
      <Head>
        <title>davecode software</title>
        <meta
          name='description'
          content="davecode is a creative project by dave caruso to take computer software and it's artistic and automation capabilities to the limits."
        />
        <meta name='author' content='dave caruso' />
      </Head>

      <main>
        <BackButton />
        <h1>software</h1>
        <p>software</p>
      </main>
    </div>
  );
}
