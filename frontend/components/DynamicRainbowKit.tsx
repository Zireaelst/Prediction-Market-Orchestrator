'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const DynamicRainbowKitProvider = dynamic(
  () => import('@rainbow-me/rainbowkit').then((mod) => mod.RainbowKitProvider),
  {
    ssr: false,
  }
);

const DynamicConnectButton = dynamic(
  () => import('@rainbow-me/rainbowkit').then((mod) => mod.ConnectButton),
  {
    ssr: false,
  }
);

export { DynamicRainbowKitProvider as RainbowKitProvider, DynamicConnectButton as ConnectButton };
