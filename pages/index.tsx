import Head from 'next/head';
// import { createGSP } from '../../utils/data';

import c from '../style/home.module.scss';

export default function Home() {
  return (
    <div className={c.root}>
      <Head>
        <title>davecode: computer art to the limit</title>
        <meta name="description" content="davecode is a creative project by dave caruso to take computer software and it's artistic and automation capabilities to the limits." />
        <meta name="author" content="dave caruso" />
      </Head>

      <main>
        <h1>
          davecode.me is <br/>
          under reconstruction
        </h1>
        <p>
          davecode is a creative project by dave caruso to take computer software and it's artistic and automation
          capabilities to the limits. 
        </p>
        <p>
          as of june 2021, i have switched from Linux to Windows 11, and with that I am rebuilding nearly everything
          about my workflow from the ground up. i will update this website as soon as it exists.
        </p>
        <p style={{ color: 'rgba(0,0,0,0.5)' }}>
          (don't worry, i will be bringing everything from the old site, just not immediatly)
        </p>
        <p>
          here's what you can do right now:
        </p>
        <ul>
          <li><a href="mailto:dave@davecode.me">email me</a></li>
          <li><a href="https://youtube.com/davecode">videos on youtube</a></li>
          <li><a href="https://github.com/davecaruso">my github</a></li>
          <li><a href="https://discord.gg/4AbvSXV">discord server</a></li>
          <br />
          <br />
          <br />
          <li>donate: <a href="https://patreon.com/davecaruso">patreon</a> or <a href="http://paypal.me/davecode">paypal</a></li>
        </ul>
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
