import clsx from 'clsx';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import BackButton from '../../components/BackButton';
import QuestionForm from '../../components/QuestionForm';

import c from '../../style/qa.module.scss';

export default function QA() {
  const [invertTitle, setInvertTitle] = useState(false);

  return (
    <div className={c.root}>
      <Head>
        <title>davecode q&a</title>
        <meta name="description" content="davecode is a creative project by dave caruso to take computer software and it's artistic and automation capabilities to the limits." />
        <meta name="author" content="dave caruso" />
      </Head>

      <main>
        <BackButton inverted />
        <h1
          className={clsx(invertTitle && c.invertTitle)}
          onClick={useCallback(() => setInvertTitle(x => !x), [])}
        >
          <span className={c.textAnswers}>answers</span>
          <span className={c.textAnd}>&</span>
          <span className={c.textQuestions}>questions</span>
        </h1>
        <p>
          i answer anonymous questions you ask, because it's fun.
        </p>
        <QuestionForm />
        <p>
          and the answers:
        </p>
      </main>
    </div>
  )
}
