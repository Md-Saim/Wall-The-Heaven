'use client';

import ZipTransition from './ZipTransition';

export default function ClientBody({ children }: { children: React.ReactNode }) {
  return <ZipTransition>{children}</ZipTransition>;
}
