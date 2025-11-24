import type { Mock } from 'vitest'

type TestGlobals = {
  $fetch: Mock
  getQuery: Mock
  defineEventHandler: (fn: (event: unknown) => unknown) => unknown
}
const G = globalThis as unknown as TestGlobals

describe('server/api/todos/index.delete', () => {
  const mockUrl = 'http://mock/api/todos'

  beforeEach(() => {
    // make h3/nuxt helper available when importing the handler
    vi.stubGlobal('defineEventHandler', (fn: (event: unknown) => unknown) => fn)
    vi.stubGlobal('$fetch', vi.fn())
    vi.stubGlobal('getQuery', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('reads query id and DELETEs remote API', async () => {
    const { default: handler } = await import('~/server/api/todos/index.delete')
    const id = 7
    const deleted = { id, title: 'x' }

    G.getQuery.mockReturnValueOnce({
      id: String(id),
    })
    G.$fetch.mockResolvedValueOnce(deleted)

    type TestEvent = { context: { mockApiTodos: string } }
    const event: TestEvent = { context: { mockApiTodos: mockUrl } }

    const result = await (handler as (e: unknown) => unknown)(event as unknown)

    expect(G.getQuery).toHaveBeenCalledWith(event)
    expect(G.$fetch).toHaveBeenCalledWith(`${mockUrl}/${id}`, {
      method: 'DELETE',
    })
    expect(result).toEqual(deleted)
  })
})
