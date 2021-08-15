import clsx from 'clsx';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import BackButton from '../../components/BackButton';
import { QuestionRender } from '../../components/QuestionRender';

import c from '../../style/qa.module.scss';
import { connectToDatabase } from '../../utils/db';
import Link from 'next/link';
import { GetStaticPropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import { FadeLoader } from 'react-spinners';

export default function QA({ question }) {
  const router = useRouter();
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
          <Link href='/q+a'>see all questions</Link>
        </p>
        <div className={c.questions}>
          {
            router.isFallback ? 
              <div>
                <FadeLoader
                  margin={-5}
                  height='7px'
                  radius='50%'
                  width='7px'
                  color={'white'}
                  css={`
                    display: inline-block;
                    width: 25px;
                    height: 10px;
                    transform: translate(10px, 15px);
                  `}
                />
              </div>
             : question ? <QuestionRender q={question} /> : <>
            404 Question Not Found
          </> }
        </div>
      </main>
    </div>
  )
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  
  const date = params.date as string;
  const [year, month, day, hour, minute, second] = date.match(/../g).map(x => parseInt(x));
  const time = new Date(2000 + year, month - 1, day, hour, minute, second).getTime();

  const { db } = await connectToDatabase();
  const question = await db.collection('questions').findOne({ d: time })

  if (question) {
    delete question._id;
    question.d = question.d instanceof Date ? question.d.getTime() : new Date(question.d).getTime(); 
  }

  return {
    props: {
      question
    },
    revalidate: 60 * 60
  };
}

export async function getStaticPaths() {
  return {
    fallback: true,
    paths: []
  };
}