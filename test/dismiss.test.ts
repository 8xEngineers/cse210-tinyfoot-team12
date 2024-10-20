import { fireEvent, screen } from '@testing-library/dom'
import { beforeEach, expect, test } from 'vitest'
import tinyfoot from '../src/tinyfoot'
import {
  getButton,
  getPopover,
  getPopoverByText,
  setDocumentBody,
  waitToStopChanging,
} from './helper'

const TEST_SETTINGS = { activateDelay: 0, dismissDelay: 0 }

beforeEach(() => {
  setDocumentBody('single.html')
})

test('dismiss footnote when clicking the button again', async () => {
  tinyfoot(TEST_SETTINGS)
  const button = getButton('1')
  fireEvent.click(button)
  await waitToStopChanging(button)

  fireEvent.click(button)

  expect(button).toHaveClass('is-changing')
  await waitToStopChanging(button)
  expect(
    screen.queryByText(/This is the document's only footnote./, {
      selector: '.tinyfoot__popover *',
    }),
  ).not.toBeInTheDocument()
  expect(button).not.toHaveClass('is-active')
})

test('deactivate popover when dismissing a footnote', async () => {
  tinyfoot(TEST_SETTINGS)
  const button = getButton('1')
  fireEvent.click(button)
  await waitToStopChanging(button)
  const popover = getPopover('1')

  fireEvent.click(button)

  expect(popover).not.toHaveClass('is-active')
})

test('dismiss footnote when clicking the document body', async () => {
  tinyfoot(TEST_SETTINGS)

  const button = getButton('1')
  fireEvent.click(button)
  await waitToStopChanging(button)

  fireEvent.click(document.body)

  expect(button).toHaveClass('is-changing')
  await waitToStopChanging(button)
  expect(button).not.toHaveClass('is-active')
})

test('do not dismiss footnote when clicking the popover', async () => {
  tinyfoot(TEST_SETTINGS)

  const button = getButton('1')
  fireEvent.click(button)
  await waitToStopChanging(button)
  const popover = getPopoverByText(/This is the document's only footnote./)

  fireEvent.click(popover)

  expect(popover).toBeInTheDocument()
  expect(button).toHaveClass('is-active')
})

test('dismiss a single footnote by ID when calling .dismiss()', async () => {
  const instance = tinyfoot(TEST_SETTINGS)

  const button = getButton('1')
  instance.activate('1')
  await waitToStopChanging(button)

  instance.dismiss('1')

  expect(button).toHaveClass('is-changing')
  await waitToStopChanging(button)
  expect(button).not.toHaveClass('is-active')
})

test('dismiss all footnotes when calling .dismiss()', async () => {
  const instance = tinyfoot(TEST_SETTINGS)

  const button = getButton('1')
  instance.activate('1')
  await waitToStopChanging(button)

  instance.dismiss()

  expect(button).toHaveClass('is-changing')
  await waitToStopChanging(button)
  expect(button).not.toHaveClass('is-active')
})

test.each([[{ keyCode: 27 }, { key: 'Escape' }, { key: 'Esc' }]])(
  'dismiss footnote when pressing the Escape key',
  async (options) => {
    tinyfoot(TEST_SETTINGS)
    const button = getButton('1')
    fireEvent.click(button)
    await waitToStopChanging(button)

    fireEvent.keyUp(document.body, options)
    await waitToStopChanging(button)

    expect(button).not.toHaveClass('is-active')
  },
)

test('does not dismiss footnote when pressing any other key', async () => {
  tinyfoot(TEST_SETTINGS)
  const button = getButton('1')
  fireEvent.click(button)
  await waitToStopChanging(button)

  fireEvent.keyUp(document.body, { keyCode: 26 })

  expect(button).toHaveClass('is-active')
})

test('set ARIA expanded state to false', async () => {
  tinyfoot(TEST_SETTINGS)

  const button = getButton('1')

  fireEvent.click(button)
  await waitToStopChanging(button)
  fireEvent.click(button)
  await waitToStopChanging(button)

  expect(button).toHaveAttribute('aria-expanded', 'false')
})
