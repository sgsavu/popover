import type { Meta, StoryObj, } from '@storybook/react';
import { Dialog } from './index';
import React, { useRef } from 'react';
import { DIALOG_DIRECTIONS, DIALOG_MODE } from './const';
import { fn } from '@storybook/test';

const meta = {
  title: 'Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    afterHide: fn(),
    afterShow: fn(),
    allowClick: [],
    anchorEdge: DIALOG_DIRECTIONS.TOP_MIDDLE,
    closeOnWindowBlur: true,
    closeOnWindowResize: true,
    delay: undefined,
    disabled: false,
    mode: DIALOG_MODE.CLICK,
    offset: undefined
  },
  render: (args) => {
    const divRef = useRef(null)
    return (
      <>
        <Dialog
          {...args}
          anchorRef={divRef}
        >
          123
        </Dialog>
        <div ref={divRef}>click me </div>
      </>
    )
  },
};
