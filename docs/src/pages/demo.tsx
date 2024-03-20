import React from 'react';
import Layout from '@theme/Layout';
import { realmd } from '../../../src/index';

export default function Demo() {
  realmd();
  return (
    <Layout>
      <h1>Demo</h1>
      <p>This is a Demo page</p>
    </Layout>
  );
}
