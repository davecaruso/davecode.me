import Head from 'next/head';
import Link from 'next/link';

function disableSelf(ev: React.MouseEvent<HTMLButtonElement>) {
  ev.currentTarget.disabled = true;
}

export default function ButtonPage() {
  return (
    <div>
      <Head>
        <title>button</title>
      </Head>

      {Array(100).fill(0).map((_, i) => (
        <section key={i}>
          {Array(100).fill(0).map((_, i) => (
            <button onClick={disableSelf} key={i}>button</button>
          ))}
        </section>
      ))}

      <style>{`
        section {
          white-space: nowrap;
        }
        button {
          -webkit-writing-mode: horizontal-tb !important;
          text-rendering: auto;
          color: black;
          letter-spacing: normal;
          word-spacing: normal;
          text-transform: none;
          text-indent: 0px;
          text-shadow: none;
          display: inline-block;
          text-align: center;
          align-items: flex-start;
          cursor: default;
          background-color: rgb(200, 200, 200);
          box-sizing: border-box;
          margin: 5px;
          font: 400 13.3333px Arial;
          padding: 1px 6px;
          border-width: 2px;
          border-style: outset;
          border-color: rgb(118, 118, 118);
          border-image: initial;
          border-radius: 2px;
        }
        button:not(:disabled):hover {
          background-color: rgb(180, 180, 180);
        }
        button:not(:disabled):active {
          background-color: rgb(150, 150, 150);
        }
        button:disabled {
          opacity: 0.5;
          filter: blur(0.5px);
        }
        button:focus {
          outline: none;
        }
        `}
      </style>
    </div>
  )
}

