import React, { useRef } from 'react'
import type { Meta, StoryObj, } from '@storybook/react'
import { fn } from '@storybook/test'
import { DIALOG_DIRECTIONS, DIALOG_MODE } from './const'
import { Popover, PopoverProps } from './index'

const meta = {
  title: 'Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<PopoverProps>

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
        <Popover
          {...args}
          anchorRef={divRef}
        >
          123
        </Popover>
        <div ref={divRef}>click me </div>
      </>
    )
  },
}
