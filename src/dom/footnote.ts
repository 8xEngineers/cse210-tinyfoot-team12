import type { Footnote } from '../use-cases'
import { addClass, hasClass, removeClass } from './element'
import {
  type Position,
  getLeftInPixels,
  getMaxHeight,
  repositionPopover,
  repositionTooltip,
} from './layout'

const CLASS_ACTIVE = 'is-active'
const CLASS_CHANGING = 'is-changing'
const CLASS_SCROLLABLE = 'is-scrollable'

export type FootnoteElements = Readonly<{
  id: string
  host: HTMLElement
  button: HTMLElement
  popover: HTMLElement
  content: HTMLElement
  wrapper: HTMLElement
}>

export function footnoteActions({
  id,
  button,
  content,
  host,
  popover,
  wrapper,
}: FootnoteElements): Footnote<HTMLElement> {
  let maxHeight = 0
  let position: Position = 'above'
  let copyButton: HTMLButtonElement | null = null;

  const isMounted = () => document.body.contains(popover)

  // copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log("Footnote copied to clipboard!");
    }).catch(err => {
      console.error("Could not copy text: ", err);
    });
  };

  // Create the copy button element
  const createCopyButton = (): HTMLButtonElement => {
    const button = document.createElement('button');
    button.textContent = 'Copy';
    button.className = 'copy-button';
    button.onclick = () => copyToClipboard(content.textContent || '');
    popover.appendChild(button); // Append the button to the popover
    return button; // Return the button reference
  };

  return {
    id,

    activate: (onActivate) => {
      button.setAttribute('aria-expanded', 'true')
      addClass(button, CLASS_CHANGING)
      addClass(button, CLASS_ACTIVE)
      button.insertAdjacentElement('afterend', popover)
      popover.style.maxWidth = document.body.clientWidth + 'px'
      maxHeight = getMaxHeight(content)
      copyButton = createCopyButton(); // Create the copy button when activating
      onActivate?.(popover, button)
    },

    dismiss: (onDismiss) => {
      button.setAttribute('aria-expanded', 'false')
      addClass(button, CLASS_CHANGING)
      removeClass(button, CLASS_ACTIVE)
      removeClass(popover, CLASS_ACTIVE)
      if (copyButton) {
        copyButton.remove(); // Remove the copy button from the popover
        copyButton = null; // Clear the reference
      }
      onDismiss?.(popover, button)
    },

    isActive: () => hasClass(button, CLASS_ACTIVE),

    isReady: () => !hasClass(button, CLASS_CHANGING),

    ready: () => {
      addClass(popover, CLASS_ACTIVE)
      removeClass(button, CLASS_CHANGING)
    },

    remove: () => {
      popover.remove()
      removeClass(button, CLASS_CHANGING)
    },

    reposition: () => {
      if (isMounted()) {
        const [next, height] = repositionPopover(popover, button, position)
        position = next
        content.style.maxHeight = Math.min(maxHeight, height) + 'px'

        if (popover.offsetHeight < content.scrollHeight) {
          addClass(popover, CLASS_SCROLLABLE)
          content.setAttribute('tabindex', '0')
        } else {
          removeClass(popover, CLASS_SCROLLABLE)
          content.removeAttribute('tabindex')
        }
      }
    },

    resize: () => {
      if (isMounted()) {
        popover.style.left = getLeftInPixels(content, button) + 'px'
        wrapper.style.maxWidth = content.offsetWidth + 'px'
        repositionTooltip(popover, button)
      }
    },

    destroy: () => host.remove(),
  }
}
