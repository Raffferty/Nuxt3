import type { Mock } from 'vitest'

type TestGlobals = {
  $fetch: Mock
  defineEventHandler: (fn: (event: unknown) => unknown) => unknown
}
const G = globalThis as unknown as TestGlobals

describe('server/api/todos/index.get', () => {
  const mockUrl = 'http://mock/api/todos'

  beforeEach(() => {
    // make h3/nuxt helper available when importing the handler
    vi.stubGlobal('defineEventHandler', (fn: (event: unknown) => unknown) => fn)
    vi.stubGlobal('$fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('calls $fetch with correct URL and headers and returns todos', async () => {
    const { default: handler } = await import('~/server/api/todos/index.get')
    const mockTodos = [
      { id: 1, title: 'A' },
      { id: 2, title: 'B' },
    ]

    G.$fetch.mockResolvedValueOnce(mockTodos)

    type TestEvent = { context: { mockApiTodos: string } }
    const event: TestEvent = { context: { mockApiTodos: mockUrl } }

    const result = await (handler as (e: unknown) => unknown)(event as unknown)

    expect(G.$fetch).toHaveBeenCalledWith(mockUrl, {
      headers: { 'content-type': 'application/json' },
    })
    expect(result).toEqual(mockTodos)
  })
})
