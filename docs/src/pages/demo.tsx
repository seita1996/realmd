import React from 'react';
import Layout from '@theme/Layout';
import { Editor, Sample } from '../../../src/index';

export default function Demo() {
  const sample = `
# h1

- [ ] check1
- [x] check2

## h2

- bullet1
- bullet2
- code \`conlole.log('test')\` ok?

### h3

\`\`\`javascript
const hoge = 100;
\`\`\`

## h2

1. first
2. second
3. [google](https://google.com)

![](https://www.nikon-image.com/products/mirrorless/lineup/z_50/img/sample/pic_01_l.jpg)
  `

  return (
    <Layout>
      <h1>Demo</h1>
      <p>This is a Demo page</p>
      {/* <Editor text={sample} /> */}
      <Sample />
    </Layout>
  );
}
