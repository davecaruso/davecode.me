import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Head>
        <title>warning</title>
        <meta name="description" content="davecode is a creative project by dave caruso to take computer software and it's artistic and automation capabilities to the limits." />
        <meta name="author" content="dave caruso" />
      </Head>

      <main style={{ fontFamily: 'initial', padding: '8px' }}>
        <style>{`
            a {
                color: rgb(0, 0, 238);
                text-decoration: underline
            }
            a:active {
                color: rgb(255, 0, 0);
            }
        `}</style>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;no it's not <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;your website is far superior, timmy <br /> <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;options: <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://timb.ee">back to his masterpiece</a> <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Link href="/">to davecode.me</Link>
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
