import type { Mock } from 'vitest'

type TestGlobals = {
  $fetch: Mock
  readBody: Mock
  getQuery: Mock
  defineEventHandler: (fn: (event: unknown) => unknown) => unknown
}
const G = globalThis as unknown as TestGlobals

describe('server/api/todos/index.put', () => {
  const mockUrl = 'http://mock/api/todos'

  beforeEach(() => {
    // make h3/nuxt helper available when importing the handler
    vi.stubGlobal('defineEventHandler', (fn: (event: unknown) => unknown) => fn)
    vi.stubGlobal('$fetch', vi.fn())
    vi.stubGlobal('readBody', vi.fn())
    vi.stubGlobal('getQuery', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('reads query and body, PUTs to remote API, returns updated item', async () => {
    const { default: handler } = await import('~/server/api/todos/index.put')
    const id = 42
    const body = { title: 'Updated Title' }
    const updated = { id, title: 'Updated Title' }

    G.getQuery.mockReturnValueOnce({
      id: String(id),
    })
    G.readBody.mockResolvedValueOnce(body)
    G.$fetch.mockResolvedValueOnce(updated)

    type TestEvent = { context: { mockApiTodos: string } }
    const event: TestEvent = { context: { mockApiTodos: mockUrl } }

    const result = await (handler as (e: unknown) => unknown)(event as unknown)

    expect(G.getQuery).toHaveBeenCalledWith(event)
    expect(G.readBody).toHaveBeenCalledWith(event)
    expect(G.$fetch).toHaveBeenCalledWith(`${mockUrl}/${id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: body.title }),
    })
    expect(result).toEqual(updated)
  })
})
