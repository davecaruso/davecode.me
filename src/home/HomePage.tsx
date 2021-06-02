import React from 'react';
import { createGSP } from '../../utils/data';

export default function HomePage(data) {
  return <div>
    <h1>website rewrite 174272</h1>
    { JSON.stringify(data) }
  </div>
}

export const getStaticProps = createGSP(
  [
    // 'misc/bio',
    'misc/featured',
    'misc/contact',
  ],
  ({ featured, contact }) => {
    return {
      featured,
      contact
    };
  }
)
