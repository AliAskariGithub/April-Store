'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity.config';

export const dynamic = 'force-static';

export default function StudioPage() {
  return (
    <div style={{ height: '100vh', width: '100vw', margin: 0, padding: 0, overflow: 'hidden' }}>
      <NextStudio config={config} />
    </div>
  );
}
