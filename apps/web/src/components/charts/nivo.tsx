'use client';

import dynamic from 'next/dynamic';

export const ResponsiveLine = dynamic(() => import('@nivo/line').then((mod) => mod.ResponsiveLine), {
  ssr: false,
});
