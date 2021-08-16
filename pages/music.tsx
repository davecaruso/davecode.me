import Head from 'next/head';
import BackButton from '../components/BackButton';
import { MusicPlayer } from '../components/MusicPlayer';

import c from '../style/music.module.scss';
import { connectToDatabase } from '../utils/db';

export default function Music({ music }) {
  return (
    <div className={c.root}>
      <Head>
        <title>davecode music</title>
        <meta name="description" content="davecode is a creative project by dave caruso to take computer software and it's artistic and automation capabilities to the limits." />
        <meta name="author" content="dave caruso" />
      </Head>

      <main>
        <BackButton />
        <h1>music</h1>
        <p>
          i like making music, here's some of it.
        </p>
        {
          music.map((a) => (
            <MusicPlayer key={a.id} artifact={a} />
          ))
        }
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const { db } = await connectToDatabase();
  const music = await db.collection('artifacts').find({ type: 'music' }).sort({ date: -1 }).limit(500).toArray();

  music.forEach(artifact => delete artifact._id);

  return {
    props: {
      music
    },
    revalidate: 60 * 60
  };
}