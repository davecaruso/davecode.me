import React from 'react';
import { readData } from '../../utils/data-provider';

export default function HomePage(data) {
  return <div>
    <h1>website rewrite 17472</h1>
    { JSON.stringify(data) }
  </div>
}

export async function getStaticProps() {
  return {
    props: {
      bio: await readData('misc/bio.mdx'),
      featured: await readData('misc/featured.yaml'),
      contact: await readData('misc/contact.yaml'),
    }
  }
}
