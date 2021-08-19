import React from 'react';
import { Question, QuestionParagraph } from '../utils/artifact';
import c from './QuestionRender.module.scss';
import { Parser } from 'html-to-react';
import LinkSVG from './Link.svg';

export interface QuestionRenderProps {
  q: Question;
}
export interface QuestionParagraphRenderProps {
  p: QuestionParagraph;
}

const htmlToReactParser = new Parser();

export function QuestionRender({ q }: QuestionRenderProps) {
  const [copy, setCopy] = React.useState(null);
  const conversation = (
    'c' in q
      ? q.c
      : [
          ['q', q.q],
          ['a', q.a],
        ]
  ).flatMap((x) => x[1].split('\n').map((y) => [x[0], y])) as QuestionParagraph[];

  async function $copy() {
    const date = new Date(q.d);
    const dateStr = [
      date.getFullYear().toString().slice(2),
      (date.getMonth() + 1).toString(),
      date.getDate().toString(),
      date.getHours().toString(),
      date.getMinutes().toString(),
      date.getSeconds().toString(),
    ]
      .map((x) => x.padStart(2, '0'))
      .join('');
    const url = `${window.location.origin}/q+a/${dateStr}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopy(true);
    } catch (error) {
      setCopy(false);
    }
    setTimeout(() => {
      setCopy(null);
    }, 1000);
  }

  const date = new Date(q.d);
  const dateEst = new Date(date.getTime() + date.getTimezoneOffset() * 60000 - 4 * 60 * 60 * 1000);
  const dateString = [
    dateEst.getFullYear().toString(),
    '-',
    (dateEst.getMonth() + 1).toString(),
    '-',
    dateEst.getDate().toString(),
    ' ',
    dateEst.getHours().toString(),
    ':',
    dateEst.getMinutes().toString(),
  ]
    .map((x) => (x.match(/[0-9]/) ? x.padStart(2, '0') : x))
    .join('');

  return (
    <div className={c.root}>
      <div className={c.date} onClick={$copy}>
        {copy === true ? (
          <>
            Copied Link <LinkSVG />
          </>
        ) : copy === false ? (
          <>
            Failed to copy... <LinkSVG />
          </>
        ) : (
          <>
            {dateString} <LinkSVG />
          </>
        )}
      </div>
      {conversation.map((p, i) => {
        return <QuestionParagraphRender key={i} p={p} />;
      })}
    </div>
  );
}

export function QuestionParagraphRender({ p: [who, what] }: QuestionParagraphRenderProps) {
  let RootElement = 'p';
  let props = {};

  if (what.startsWith('RootElement=')) {
    RootElement = /RootElement=(.*?)\{/.exec(what)[1];
    let depth = 1;
    let jsonString;
    for (let i = 13 + RootElement.length; i < what.length; i++) {
      if (what[i] === '}') {
        depth--;
        if (depth === 0) {
          jsonString = what.slice(12 + RootElement.length, i + 1);
          what = what.slice(12 + RootElement.length + jsonString.length);
          break;
        }
      }
      if (what[i] === '{') {
        depth++;
      }
    }
    if (!jsonString) {
      throw new Error('Could not find JSON string');
    }
    props = JSON.parse(jsonString);
  }

  const content = htmlToReactParser.parse(`<div>${what}</div>`);

  return React.createElement(RootElement, { ...props, className: c[who] }, content.props.children);
}
