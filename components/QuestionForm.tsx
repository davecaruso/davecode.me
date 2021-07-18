import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import CloseSVG from './CloseThick.svg'
import c from './QuestionForm.module.scss';

function YesNoScript({ yes, no }: any) {
  return yes;
  return <>
    {!process.browser && <noscript>
      {no}
    </noscript>}
    {!process.browser && <noscript dangerouslySetInnerHTML={{ __html: '<!--' }} />}
    {yes}
    {!process.browser && <noscript dangerouslySetInnerHTML={{ __html: '-->' }} />}
  </>
}

export default function QuestionForm() {
  const bottomContainerRef = useRef<HTMLDivElement>(null);
  const [expanded, setFormOpen] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [height, setHeight] = useState(0);

  const [enablePushNotif, setEnablePushNotif] = useState(false);
  const [pushNotifIsBlocked, setPushNotifIsBlocked] = useState(false);
  const [waitingForPushNotif, setWaitingForPushNotif] = useState(false);
  const [enableMailNotif, setEnableMailNotif] = useState<null | string>(null);
  
  function $focus() {
    setFormOpen(true);
    setExpanding(true);
    setHeight(bottomContainerRef.current?.scrollHeight || 0);
    setTimeout(() => {
      setExpanding(false);
    }, 200);
  }

  function $close() {
    setFormOpen(false);
    setExpanding(true);
    setHeight(0);
    setTimeout(() => {
      setExpanding(false);
    }, 200);
  }

  function $unfocus() {

  }

  function $clickPushNotify(ev: React.ChangeEvent<HTMLInputElement>) {
    setPushNotifIsBlocked(false);

    if (ev.target.checked) {
      setWaitingForPushNotif(true);
      Notification.requestPermission()
        .then(x => {
          setEnablePushNotif(x === 'granted');
          setPushNotifIsBlocked(x !== 'granted');
        })
        .catch(() => {
          setEnablePushNotif(false);
          setPushNotifIsBlocked(true);
        })
        .finally(() => setWaitingForPushNotif(false))
    } else {
      setEnablePushNotif(false);
    }
  }

  useEffect(() => {
    if (waitingForPushNotif) {
      const main = document.querySelector('main')!;
      main.classList.add(c.waitingForPushNotifBlur);

      const overlay = document.createElement('div');
      overlay.classList.add(c.waitingForPushNotif);
      document.body.appendChild(overlay);
      return () => {
        overlay.remove();
        main.classList.remove(c.waitingForPushNotifBlur)
      }
    }
  }, [waitingForPushNotif])

  return <form className={c.root}>
    <div
      className={clsx({
        [c.closeBtn]: true,
        [c.expanded]: expanded,
      })}
      onClick={$close}
    >
      <CloseSVG />
    </div>
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
              [c.expanding]: expanding
            })}
            onFocus={$focus}
            placeholder='ask a question...'
            required
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
        height: `${height}px`
      }}
    >
      <div className={c.notifyHeader}>notify me:</div>
      <label className={c.notifyMethod}>
        <input type="checkbox" disabled={!expanded} />
        {/* <input type="email" disabled={!expanded} placeholder="by email" /> */}
        by email
      </label>
      <label className={clsx(c.notifyMethod, c.notifyMethodSecond)}>
        <input
          type="checkbox"
          disabled={!expanded || waitingForPushNotif}
          checked={enablePushNotif}
          onChange={$clickPushNotify}
        /> {
          (!pushNotifIsBlocked)
            ? "by push notification"
            : <>
              <del>by push notification</del>&nbsp;&nbsp;<span className={c.permissionDenied}>(permissions denied)</span>
            </>
        }
      </label>
      <div className={c.sendContainer}>
        <button type='submit' disabled={!expanded}>SEND</button>
      </div>
    </div>
  </form>
}