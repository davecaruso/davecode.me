export type Question = SimpleQuestion | ComplexQuesiton;

export interface SimpleQuestion {
  d: Date;
  q: string;
  a: string;
}

export interface ComplexQuesiton {
  d: Date;
  c: QuestionParagraph[];
}

export type QuestionParagraph = ['q' | 'a', string];

export interface Artifact {
  id: string;
  title: string;
  date: string;
  type: string;
  tags?: string[];
}

export interface MusicArtifact extends Artifact {
  type: 'music';
  file: string;
  /* legacy: for the two songs with the sheet music png */
  sheetmusic_image?: string;
}
