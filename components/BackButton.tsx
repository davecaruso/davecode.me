import clsx from 'clsx';
import Link from 'next/link';

import c from './BackButton.module.scss';

interface BackButtonProps {
  inverted?: boolean;
}

export function BackButton({ inverted }: BackButtonProps) {
  return (
    <nav className={clsx(c.root, inverted && c.inverted)}>
      <Link href='/'>go home</Link>
    </nav>
  );
}
