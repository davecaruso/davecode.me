import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Head>
        <title>warning</title>
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

