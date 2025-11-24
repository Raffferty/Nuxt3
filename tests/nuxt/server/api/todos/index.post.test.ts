import type { Mock } from 'vitest'

type TestGlobals = {
  $fetch: Mock
  readBody: Mock
  defineEventHandler: (fn: (event: unknown) => unknown) => unknown
}
const G = globalThis as unknown as TestGlobals

describe('server/api/todos/index.post', () => {
  const mockUrl = 'http://mock/api/todos'

  beforeEach(() => {
    // make h3/nuxt helper available when importing the handler
    vi.stubGlobal('defineEventHandler', (fn: (event: unknown) => unknown) => fn)
    vi.stubGlobal('$fetch', vi.fn())
    vi.stubGlobal('readBody', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('reads body, posts to remote API, returns new item', async () => {
    const { default: handler } = await import('~/server/api/todos/index.post')
    const body = { title: 'New Title' }
    const created = { id: 123, title: 'New Title' }

    G.readBody.mockResolvedValueOnce(body)
    G.$fetch.mockResolvedValueOnce(created)

    type TestEvent = { context: { mockApiTodos: string } }
    const event: TestEvent = { context: { mockApiTodos: mockUrl } }

    const result = await (handler as (e: unknown) => unknown)(event as unknown)

    expect(G.readBody).toHaveBeenCalledWith(event)
    expect(G.$fetch).toHaveBeenCalledWith(
      mockUrl,
      expect.objectContaining({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: expect.stringMatching(/"id":\d+.*"title":"New Title"|"title":"New Title".*"id":\d+/),
      }),
    )
    expect(result).toEqual(created)
  })
})
