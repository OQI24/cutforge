import { Crepe } from '@milkdown/crepe'
import '@milkdown/crepe/theme/common/style.css'
import '@milkdown/crepe/theme/frame.css'

export type ViewerHandle = {
  getMarkdown: () => string
  destroy: () => Promise<void>
}

/** Editable by default — read and tweak in one place. */
export async function mountCrepe(
  root: HTMLElement,
  markdown: string,
): Promise<ViewerHandle> {
  root.className = ''
  root.replaceChildren()

  const crepe = new Crepe({
    root,
    defaultValue: markdown,
    features: {
      [Crepe.Feature.Latex]: false,
    },
  })

  await crepe.create()
  crepe.setReadonly(false)

  return {
    getMarkdown: () => crepe.getMarkdown(),
    destroy: async () => {
      await crepe.destroy()
    },
  }
}
