import { MusicArtifact } from "../utils/artifact";
import c from './MusicPlayer.module.scss';
import Play from './Play.svg';
import { useRef } from "react";
import Link from "next/link";

import LinkSVG from './Link.svg';
import DownloadSVG from './Download.svg';

export interface MusicPlayerProps {
  artifact: MusicArtifact;
}

export function MusicPlayer({ artifact }: MusicPlayerProps) {
  const audio = useRef<HTMLAudioElement>(null);

  return <div className={c.root}>
    <div className={c.date}>
      {artifact.date} <LinkSVG />
    </div>
    <div className={c.header}>
      <button className={c.button}>
        <Play className={c.icon}/>
        <div className={c.title}>{artifact.title}</div>
      </button>
      <Link href={artifact.file}>
        <a>
          <DownloadSVG className={c.icon}/>
        </a>
      </Link>
      {/* {
        artifact.tags && <div className={c.tags}>{artifact.tags.map(tag => <span className={c.tag}>{tag}</span>)}</div>
      } */}
    </div>
    <div className={c.bar}>
      <div className={c.progress}></div>
      <div className={c.dot}></div>
    </div>
    <audio ref={audio} src={artifact.file} controls preload="none"></audio>
  </div>
}
