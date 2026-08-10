import type { ViewerHandle } from './milkdown'

export async function mountCrepe(
  root: HTMLElement,
  markdown: string,
): Promise<ViewerHandle> {
  const { mountCrepe: mount } = await import('./milkdown')
  return mount(root, markdown)
}

export type { ViewerHandle }
