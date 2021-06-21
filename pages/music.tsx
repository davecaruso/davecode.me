import Head from 'next/head';
import BackButton from '../components/BackButton';
// import { createGSP } from '../../utils/data';

import c from '../style/music.module.scss';

export default function Music() {
  return (
    <div className={c.root}>
      <Head>
        <title>davecode: computer art to the limit</title>
        <meta name="description" content="davecode is a creative project by dave caruso to take computer software and it's artistic and automation capabilities to the limits." />
        <meta name="author" content="dave caruso" />
      </Head>

      <main>
        <BackButton />
        <h1>
          music
        </h1>
        <p>
            i am still learning how to produce real music. coming soon
        </p>
      </main>
    </div>
  )
}

// export const getStaticProps = createGSP(
//   [
//     // 'misc/bio',
//   ],
//   ({ }) => {
//     return {
//     };
//   }
// )
