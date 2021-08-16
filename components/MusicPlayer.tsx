import { MusicArtifact } from "../utils/artifact";
import c from './MusicPlayer.module.scss';
import Play from './Play.svg';
import LinkSVG from './Link.svg';

export interface MusicPlayerProps {
  artifact: MusicArtifact;
}

export function MusicPlayer({ artifact }: MusicPlayerProps) {
  return <div className={c.root}>
    <div className={c.date}>
      {artifact.date} <LinkSVG />
    </div>
    <div className={c.header}>
      <button className={c.button}>
        <Play className={c.icon}/>
        <div className={c.title}>{artifact.title}</div>
      </button>
      {
        artifact.tags && <div className={c.tags}>{artifact.tags.map(tag => <span className={c.tag}>{tag}</span>)}</div>
      }
    </div>
    {/* <audio src={artifact.file} controls preload="none"></audio> */}
  </div>
}
