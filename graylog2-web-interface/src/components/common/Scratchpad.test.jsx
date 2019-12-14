import React from 'react';
import { render } from '@testing-library/react';

import { ScratchpadProvider } from 'providers/ScratchpadProvider';
import Scratchpad from './Scratchpad';

describe('<Scratchpad />', () => {
  it('properly renders', () => {
    const { firstChild } = render(
      <ScratchpadProvider loginName="scooby-doo">
        <Scratchpad />
      </ScratchpadProvider>,
    );

    expect(firstChild).toMatchSnapshot();
  });
});
