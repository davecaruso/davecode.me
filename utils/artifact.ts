export type AQuestion = AQuestionSimple | AQuestionComplex;

export interface AQuestionSimple {
  d: Date;
  q: string;
  a: string;
}

export interface AQuestionComplex {
  d: Date;
  c: AQuestionParagraph[];
}

export type AQuestionParagraph = ['q' | 'a', string];
