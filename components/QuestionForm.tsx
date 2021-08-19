// Yes, this is a giant file, and this should be split up into separate components for the fields in the form.
// but it works for now.

// TODO: plugin to transform $ functions to useCallback.

import clsx from 'clsx';
import React, { ReactChild, useEffect, useRef, useState } from 'react';
import CloseSVG from './CloseThick.svg';
import c from './QuestionForm.module.scss';
import { FadeLoader } from 'react-spinners';
import Link from 'next/link';

export interface YesNoScriptProps {
  yes: ReactChild;
  no: ReactChild;
}

export function YesNoScript({ yes, no }: YesNoScriptProps) {
  return (
    <>
      {!process.browser && <noscript>{no}</noscript>}
      {!process.browser && <noscript dangerouslySetInnerHTML={{ __html: '<!--' }} />}
      {yes}
      {!process.browser && <noscript dangerouslySetInnerHTML={{ __html: '-->' }} />}
    </>
  );
}

let nextClickCheckboxIgnore = false;

export function QuestionForm() {
  const bottomContainerRef = useRef<HTMLDivElement>(null);
  const [expanded, setFormOpen] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [height, setHeight] = useState(0);
  const [question, setQuestion] = useState('');

  const [enablePushNotif, setEnablePushNotif] = useState(false);
  const [pushNotifIsBlocked, setPushNotifIsBlocked] = useState(false);
  const [waitingForPushNotif, setWaitingForPushNotif] = useState(false);
  const [enableMailNotif, setEnableMailNotif] = useState<null | string>(null);
  const [emailNotifIsFocused, setEmailNotifIsFocused] = useState(false);

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState<false | { date: string; id: string }>(
    false
  );
  const [isSubmitFailure, setIsSubmitFailure] = useState<false | string>(false);

  function $focus() {
    setFormOpen(true);
    setExpanding(true);
    setHeight(bottomContainerRef.current?.scrollHeight || 0);
    setTimeout(() => {
      setExpanding(false);
    }, 200);
  }

  function $close() {
    if (isSubmitLoading) return;

    if (question.length > 0 && !isSubmitSuccess) {
      const confirm = window.confirm('Discard Question?');
      if (!confirm) return;
    }

    setQuestion('');
    setFormOpen(false);
    setExpanding(true);
    setHeight(0);
    setIsSubmitLoading(false);
    setIsSubmitSuccess(false);
    setIsSubmitFailure(false);
    setTimeout(() => {
      setExpanding(false);
    }, 200);
  }

  function $handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setIsSubmitFailure(false);
    setQuestion(event.target.value);
  }

  function $clickEmailNotify(ev: React.ChangeEvent<HTMLInputElement>) {
    if (nextClickCheckboxIgnore) return;
    setIsSubmitFailure(false);
    if (ev.target.checked) {
      setEnableMailNotif('');
    } else {
      (document.querySelector('#email-input') as HTMLInputElement)?.select();
    }
  }

  function $changeEmailNotify(ev: React.ChangeEvent<HTMLInputElement>) {
    setIsSubmitFailure(false);
    setEnableMailNotif(ev.target.value);
  }

  function $keyDownEmailNotify(ev: React.KeyboardEvent<HTMLInputElement>) {
    if (ev.key === 'Escape') {
      setEnableMailNotif(null);
      (document.querySelector('#email-input') as HTMLInputElement)?.blur();
    }
  }

  function $clickPushNotify(ev: React.ChangeEvent<HTMLInputElement>) {
    setIsSubmitFailure(false);
    setPushNotifIsBlocked(false);

    if (ev.target.checked) {
      setWaitingForPushNotif(true);
      Notification.requestPermission()
        .then((x) => {
          setEnablePushNotif(x === 'granted');
          setPushNotifIsBlocked(x !== 'granted');
        })
        .catch(() => {
          setEnablePushNotif(false);
          setPushNotifIsBlocked(true);
        })
        .finally(() => setWaitingForPushNotif(false));
    } else {
      setEnablePushNotif(false);
    }
  }

  function $focusEmailNotify(ev: React.ChangeEvent<HTMLInputElement>) {
    setEmailNotifIsFocused(true);
  }

  function $blurEmailNotify(ev: React.ChangeEvent<HTMLInputElement>) {
    setEmailNotifIsFocused(false);
    if (ev.target.value === '') {
      setEnableMailNotif(null);
    }
  }

  function $mouseDownEmailNotify(ev: React.MouseEvent<HTMLLabelElement>) {
    if (emailNotifIsFocused) {
      nextClickCheckboxIgnore = true;
      window.addEventListener('mouseup', function f() {
        window.removeEventListener('mouseup', f);
        setTimeout(() => {
          nextClickCheckboxIgnore = false;
        }, 100);
      });
    }
  }

  useEffect(() => {
    if (waitingForPushNotif) {
      const main = document.querySelector('main')!;
      const overlay = document.createElement('div');
      document.body.appendChild(overlay);

      const timer = setTimeout(() => {
        main.classList.add(c.waitingForPushNotifBlur);
        overlay.classList.add(c.waitingForPushNotif);
      }, 100);

      return () => {
        clearTimeout(timer);
        overlay.remove();
        main.classList.remove(c.waitingForPushNotifBlur);
      };
    }
  }, [waitingForPushNotif]);

  async function $submit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data = {
      question,
      email: enableMailNotif || null,
    };

    setIsSubmitLoading(true);
    setIsSubmitSuccess(false);
    setIsSubmitFailure(false);

    try {
      const response = await fetch('/api/q+a/submit-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        const { id, date } = await response.json();
        setIsSubmitSuccess({ date, id });
      } else {
        const { message } = await response.json();
        console.error(message);
        setIsSubmitFailure(message);
      }

      setIsSubmitLoading(false);
    } catch (error) {
      setIsSubmitFailure('Network Error');
    }
  }

  function $reset(ev: React.MouseEvent<HTMLAnchorElement>) {
    ev.preventDefault();
    setIsSubmitFailure(false);
    setIsSubmitSuccess(false);
    setIsSubmitLoading(false);
    setQuestion('');
  }

  const successUrl = isSubmitSuccess
    ? (() => {
        const date = new Date(isSubmitSuccess.date);
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
        return `${window.location.origin}/q+a/${dateStr}`;
      })()
    : null;

  return (
    <form
      className={clsx({
        [c.root]: true,
        [c.isSubmitLoading]: isSubmitLoading,
      })}
      onSubmit={$submit}
    >
      <div
        className={clsx({
          [c.closeBtn]: true,
          [c.expanded]: expanded && !isSubmitLoading,
        })}
        onClick={$close}
      >
        <CloseSVG />
      </div>
      {isSubmitSuccess ? (
        <div
          ref={bottomContainerRef}
          className={clsx({
            [c.successContainer]: true,
          })}
          style={{
            height: `${height}px`,
          }}
        >
          <h2 className={c.sentTitle}>sent!</h2>
          <p style={{ userSelect: 'text' }}>
            once answered, it will be available at{' '}
            <Link href={successUrl}>
              <a className={c.link}>{successUrl}</a>
            </Link>
            .{' '}
            {enableMailNotif ? (
              enablePushNotif ? (
                <>
                  you will also be notified via{' '}
                  <code className={c.emailCode}>{enableMailNotif}</code> and device push
                  notification
                </>
              ) : (
                <>
                  you will also be notified via{' '}
                  <code className={c.emailCode}>{enableMailNotif}</code>
                </>
              )
            ) : enablePushNotif ? (
              <>you will also be notified via device push notification</>
            ) : null}
            .
          </p>
          <br />
          <br />
          <p>
            <a href='#' onClick={$reset}>
              do it again?
            </a>
          </p>
        </div>
      ) : (
        <>
          <div className={c.questionContainer}>
            <YesNoScript
              no={
                <textarea
                  className={c.questionInput}
                  placeholder='[enable javascript to ask a question]'
                  disabled
                />
              }
              yes={
                <textarea
                  id='question'
                  name='question'
                  className={clsx({
                    [c.questionInput]: true,
                    [c.expanded]: expanded,
                    [c.expanding]: expanding,
                  })}
                  disabled={isSubmitLoading}
                  onFocus={$focus}
                  placeholder='ask a question...'
                  required
                  value={question}
                  onChange={$handleChange}
                />
              }
            />
          </div>
          <div
            ref={bottomContainerRef}
            className={clsx({
              [c.bottomContainer]: true,
              [c.expanded]: expanded,
            })}
            style={{
              height: `${height}px`,
            }}
          >
            <div className={c.notifyHeader}>notify me:</div>
            <label className={c.notifyMethod} onMouseDown={$mouseDownEmailNotify}>
              <input
                type='checkbox'
                className={clsx({
                  [c.noCheckboxFocus]: enableMailNotif !== null,
                })}
                disabled={!expanded || isSubmitLoading}
                onChange={$clickEmailNotify}
                checked={enableMailNotif !== null}
              />
              <div
                className={clsx({
                  [c.emailForm]: true,
                  [c.selected]: enableMailNotif !== null,
                  [c.focused]: emailNotifIsFocused,
                })}
              >
                <div className={c.content}>
                  {enableMailNotif !== null ? 'at' : 'by'}&nbsp;
                  {enableMailNotif !== null ? (
                    <input
                      id='email-input'
                      type='email'
                      disabled={!expanded}
                      placeholder='email'
                      autoFocus
                      value={enableMailNotif}
                      onChange={$changeEmailNotify}
                      onFocus={$focusEmailNotify}
                      onBlur={$blurEmailNotify}
                      onKeyDown={$keyDownEmailNotify}
                    />
                  ) : (
                    <span>email</span>
                  )}
                </div>
              </div>
            </label>
            {/* <label className={clsx(c.notifyMethod, c.notifyMethodSecond)}>
        <input
          type="checkbox"
          disabled={!expanded || waitingForPushNotif || isSubmitLoading}
          checked={enablePushNotif}
          onChange={$clickPushNotify}
        /> {
          (!pushNotifIsBlocked)
            ? "by push notification"
            : <>
              <del>by push notification</del>&nbsp;&nbsp;<span className={c.permissionDenied}>(permissions denied)</span>
            </>
        }
      </label> */}
            <div className={c.sendContainer}>
              {isSubmitFailure ? (
                <span className={c.sendFailure}>{isSubmitFailure}</span>
              ) : (
                <button type='submit' disabled={!expanded || isSubmitLoading}>
                  {isSubmitLoading ? (
                    <>
                      <FadeLoader
                        margin={-9}
                        height='5px'
                        radius='50%'
                        width='5px'
                        color={'white'}
                        css={`
                          display: inline-block;
                          width: 25px;
                          height: 10px;
                          transform: translate(6px, 1px);
                        `}
                      />
                      sending question...
                    </>
                  ) : (
                    'send'
                  )}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </form>
  );
}
