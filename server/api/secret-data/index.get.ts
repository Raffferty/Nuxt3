export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const cookies = parseCookies(event) // Record<string, string> -> { 'my-cookie': '111', logins: '5', user: '{"name":"ttt"}' }
  console.log('cookies:', cookies) // -> { user: 123 }

  // Access the injected auth object
  const auth = event.context.auth
  console.log('Auth from middleware:', auth) // -> { user: 123 }

  //! with $fetch('https://webhook.site/64403421-62c0-4723-81a9-e2d78b6a7c29', {...}) we DON'T send cookies and context from server side!
  // accept-encoding	br, gzip, deflate
  // user-agent	node
  // sec-fetch-mode	cors
  // accept-language	*
  // accept	*/*
  // x-user-id	123 //! this is send because we have set in in 'headers'
  // authorization	Bearer api-secret-local //! this is send because we have set in in 'headers'
  // host	webhook.site

  //? with event.$fetch('https://webhook.site/64403421-62c0-4723-81a9-e2d78b6a7c29', {...}) we SEND cookies and context from server side!
  // accept-encoding	br, gzip, deflate
  // accept	*/*
  // x-user-id	123
  // authorization	Bearer api-secret-local
  // cookie	my-cookie=111; logins=5; user=%7B%22name%22%3A%22ttt%22%7D
  // accept-language	en,ru;q=0.9,uk;q=0.8,en-US;q=0.7,de;q=0.6,ru-RU;q=0.5
  // referer	http://localhost:3000/
  // sec-fetch-dest	empty
  // sec-fetch-mode	cors
  // sec-fetch-site	same-origin
  // sec-ch-ua-mobile	?0
  // sec-ch-ua	"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"
  // user-agent	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36
  // sec-ch-ua-platform	"macOS"
  // cache-control	no-cache
  // pragma	no-cache
  // host	webhook.site

  const data = await event.$fetch('https://http.dog/200.json', {
    headers: {
      Authorization: `Bearer ${config.apiSecret}`,
      'X-User-Id': auth?.user?.toString() ?? '',
    },
  })

  // to unstringify cookies we do JSON.parse(value) of all props of cookies
  // Record<string, string> -> Record<string, unknown>
  const JSONParsedCookies: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(cookies)) {
    try {
      // Try to parse each value as JSON
      JSONParsedCookies[key] = JSON.parse(value)
    } catch {
      // If it’s not valid JSON, keep the raw string
      JSONParsedCookies[key] = value
    }
  }

  /* 
  JSONParsedCookies = {
    'my-cookie': 111,
    logins: 5,
    user: {
      name: 'ttt',
    },
  } 
  */

  //! in a real app DON'T return to client side any apiSecret!
  return { data, apiSecret: config.apiSecret, cookies: JSONParsedCookies, auth_user: auth }
})
