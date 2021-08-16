import { useSession } from 'next-auth/client';
import { Component, useState } from 'react';
import useSWR from 'swr';
import { QuestionRender } from '../../components/QuestionRender';

import c from '../../style/qa-respond.module.scss';
import { Question, ComplexQuesiton } from '../../utils/artifact';
import { fetcher } from '../../utils/fetcher';
import { QAGetRequestsResponse, QuestionRequest } from '../api/q+a/get-requests';

interface QuestionFormProps {
  q: QuestionRequest;
  onPop: () => void;
}

function trimResponse(r: ComplexQuesiton): Question {
  if (r.c.length === 2 && r.c[0][0] === 'q' && r.c[1][0] === 'a') {
    return { d: r.d, q: r.c[0][1], a: r.c[1][1] };
  }
  return r;
}

export function QuestionForm({ q, onPop }: QuestionFormProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ComplexQuesiton>(() => ({ d: new Date(q.d), c: [ ['q', q.q], ['a', '' ] ] }));
  const [i, setI] = useState(0);

  function $resetEditor() {
    setResponse({ d: new Date(q.d), c: [ ['q', q.q], ['a', '' ] ] });
  }
  async function $answer() {
    setLoading(true);
    const res = await fetch(`/api/q+a/answer-request`, { method: 'POST', body: JSON.stringify({ id: q._id, response: trimResponse(response) }), headers: { 'Content-Type': 'application/json'} }).then(x => x.json());
    setLoading(false);
    onPop();
  }
  async function $deny() {
    setLoading(true);
    const res = await fetch(`/api/q+a/deny-request`, { method: 'POST', body: JSON.stringify({ id: q._id }), headers: { 'Content-Type': 'application/json'} }).then(x => x.json());
    setLoading(false);
    onPop();
  }

  return <>
    <div className={c.trifold}>
      <div className={c.prompt}>
        <p>{q.q}</p>
      </div>
      <div className={c.editor}>
        <p>request id: {q._id}</p>
        <p>question date: {new Date(q.d).toUTCString()}</p>
        <p>mail: {q.mail}</p>
        <button onClick={$resetEditor}>reset</button>
        <button onClick={$answer}>answer</button>
        <button onClick={$deny}>deny</button>
        {
          response.c.map(([k, v], i) => {
            function $change(ev: React.ChangeEvent<HTMLTextAreaElement>) {
              setResponse(r => ({ ...r, c: [ ...r.c.slice(0, i), [k, ev.target.value], ...r.c.slice(i + 1) ] }));
              setI(i => i + 1);
            }

            function $moveUp() {
              setResponse(r => ({ ...r, c: [ ...r.c.slice(0, i - 1), [k, v], ...r.c.slice(i - 1, i), ...r.c.slice(i + 1) ] }));
              setI(i => i + 1);
            }

            function $moveDown() {
              setResponse(r => ({ ...r, c: [ ...r.c.slice(0, i), ...r.c.slice(i + 1, i + 2), [k, v], ...r.c.slice(i + 2) ] }));
              setI(i => i + 1);
            }

            function $swap() {
              setResponse(r => ({ ...r, c: [ ...r.c.slice(0, i), [k === 'q' ? 'a' : 'q', v], ...r.c.slice(i + 1) ] }));
              setI(i => i + 1);
            }

            function $delete() {
              setResponse(r => ({ ...r, c: [ ...r.c.slice(0, i), ...r.c.slice(i + 1) ] }));
              setI(i => i - 1);
            }

            function $focus(ev: React.FocusEvent<HTMLTextAreaElement>) {
              ev.target.rows = 6;

              ev.target.addEventListener('blur', function f() {
                ev.target.rows = 1;
                ev.target.removeEventListener('blur', f);
              });
            }

            function $keyDown(ev: React.KeyboardEvent<HTMLTextAreaElement>) {
              if (ev.key === 'F1') {
                ev.preventDefault();
                const cursor = ev.currentTarget.selectionStart;
                const before = ev.currentTarget.value.slice(0, cursor);
                const after = ev.currentTarget.value.slice(cursor);
  
                setResponse(r => ({ ...r, c: [ ...r.c.slice(0, i), [k, before], ...r.c.slice(i + 1, i + 2), ['q', after], ['a', ''], ...r.c.slice(i + 2) ]   }));
              }
            }
            
            return <div key={i} style={{ display: 'flex' }}>
              <div><button onClick={$moveUp}>u</button> <button onClick={$moveDown}>d</button> <button onClick={$delete}>-</button> <button onClick={$swap}>{k}</button>
              </div>: <textarea onKeyDown={$keyDown} style={{ flex: 1 }} value={v} onChange={$change} onFocus={$focus} rows={1} />
            </div> 
          })
        }
        <div>
          <button onClick={() => setResponse(r => ({ ...r, c: [ ...r.c.slice(0, i), [ 'a', '' ], ...r.c.slice(i + 1) ] }))}>+q</button>
          <button onClick={() => setResponse(r => ({ ...r, c: [ ...r.c.slice(0, i), [ 'a', '' ], ...r.c.slice(i + 1) ] }))}>+a</button>
        </div>
      </div>
      <div className={c.preview}>
        <ErrorBoundary key={i}>
          <QuestionRender q={response} />

        </ErrorBoundary>
      </div>
    </div>
  </>
}

export default function QARespond() {
  const [session, loading] = useSession();

  if (session.user.email !== 'dave@davecode.me') {
    return <div className={c.root}>
      <p>no access :(</p>
    </div>
  }

  // get questions from api using useSWR
  const { data, revalidate } = useSWR<QAGetRequestsResponse>(session && '/api/q+a/get-requests', fetcher);

  return (
    <div className={c.root}>
      <h1>qa respond</h1>
      {
        data ? <>
          <p>
            number of questions {data.questions.length}
          </p>
          {
            data.questions.length > 0 &&
          <QuestionForm q={data.questions[0]} onPop={() => {data.questions.shift(); revalidate(); }} /> }
        </> : <p>Loading...</p>
}
    </div>
  )
}

class ErrorBoundary extends Component<{}, { hasError: boolean, error: any }> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <div>
        <h1>err</h1>
        <pre>
          <code>
            {this.state.error.stack}
          </code>
        </pre>
      </div>;
    }

    return this.props.children; 
  }
}

QARespond.auth = true