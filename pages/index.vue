<template>
  <div class="home-page">
    <AppSpinner v-if="is_loading" />

    <h2>Site Config:</h2>
    <pre style="font-size: 20px">{{ siteConfig }}</pre>

    <div class="divider" />

    <NuxtLink to="/errr"
      ><AppButtonText style="background: #8800ff">to Error page</AppButtonText></NuxtLink
    >

    <div class="divider" />

    <NuxtLink to="/old-albums"
      ><AppButtonText style="background: coral"
        >Redirect /old-albums -> /albums</AppButtonText
      ></NuxtLink
    >

    <div class="divider" />

    <AppButtonText class="home-page__counter-button" @click="handleClick">Counter++</AppButtonText>

    <h3 class="home-page__counter">count is: {{ counterStore.count }}</h3>
    <h3 class="home-page__double-counter">doubleCount is: {{ counterStore.doubleCount }}</h3>

    <AppButtonText class="home-page__counter-button" @click="resetCounter"
      >Reset Counter</AppButtonText
    >

    <div class="divider" />

    <div v-if="dog_img_src">
      <h3>Secret Dog Image</h3>

      <NuxtImg :src="dog_img_src" width="200" height="200" alt="Dog image" loading="lazy" />
    </div>

    <h3>Nuxt useState vs ref demo</h3>

    <NameWithState />
    <NameWithState />

    <NameWithRef />
    <NameWithRef />

    <div class="divider" />
    <!-- Dynamic Components -->
    <h3>* Dynamic Components</h3>

    <!-- component :is -->
    <h3>component :is</h3>

    <h3>import { AppButtonText } from '#components'</h3>
    <component :is="AppButtonText">Component :is="AppButtonText"</component>

    <h3>const MyButton = {{ `resolveComponent('AppButtonText')` }}</h3>
    <component :is="MyButton">Component :is="MyButton"</component>

    <div class="divider" />
    <!-- Dynamic Imports -->
    <h3>* Dynamic Imports</h3>

    <!-- Lazy loaded component -->
    <h3>Lazy loaded component: {{ `<LazyAppButtonText />` }}</h3>
    <LazyAppButtonText>LazyAppButtonText</LazyAppButtonText>

    <!-- Delayed (or Lazy) Hydration -->
    <div class="divider" />
    <h3>* Delayed (or Lazy) Hydration</h3>

    <!-- Hydration Strategies -->
    <h3>Hydration Strategies</h3>

    <p>hydrate-on-visible: Hydrates the component when it becomes visible in the viewport.</p>
    <p>
      hydrate-on-idle: Hydrates the component when the browser is idle. This is suitable if you need
      the component to load as soon as possible, but not block the critical rendering path.
    </p>
    <p>
      hydrate-on-interaction: Hydrates the component after a specified interaction (e.g., click,
      mouseover) => hydrate-on-interaction="mouseover"
    </p>
    <p>
      hydrate-on-media-query: Hydrates the component when the window matches a media query =>
      hydrate-on-media-query="(max-width: 768px)"
    </p>
    <p>
      hydrate-after: Hydrates the component after a specified delay (in milliseconds) =>
      :hydrate-after="2000"
    </p>
    <p>
      hydrate-when: Hydrates the component based on a boolean condition => :hydrate-when="isReady" )
    </p>
    <p>hydrate-never: Never hydrates the component.</p>

    <h3>All delayed hydration components emit a @hydrated event when they are hydrated.</h3>

    <LazyAppButtonText
      hydrate-on-visible
      @click="handleClick"
      @hydrated="onHydrate('hydrate-on-visible')"
      >{{ `<LazyAppButtonText hydrate-on-visible />` }}</LazyAppButtonText
    >

    <p />

    <LazyAppButtonText hydrate-on-media-query="(max-width: 768px)" @click="handleClick"
      >{{ `<LazyAppButtonText hydrate-on-media-query="(max-width: 768px)" />` }}</LazyAppButtonText
    >
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
// AppButtonText is explicitly imported to use in '<component :is="AppButtonText" />'
// We can explicitly import components from #components if you want or need to bypass Nuxt's auto-importing functionality.
import { AppButtonText, AppSpinner } from '#components'

definePageMeta({
  title: 'Home',
})

const siteConfig = useSiteConfig()
console.log('siteConfig', siteConfig)

// For using in '<component :is="..." />'
const MyButton = resolveComponent('AppButtonText')

// import AppButtonText from '@/components/app-button-text.vue' // explicitly import the component from @/components
// import { computed } from 'vue' // explicitly import Vue API from vue
// import { computed } from '#imports' // explicitly import Vue API from Nuxt's #imports - better way
// import { useCounterStore } from '@/stores/counter' // explicitly import the store

/* 
  in nuxt.config.ts we can disable auto-importing:

  // disable auto-importing composables and utilities
  // This will disable auto-imports completely but it's still possible to use explicit imports from #imports.
  imports: {
    autoImport: false,
  },

  // disable auto-importing components from your own ~/components directory
  components: {
    dirs: [],
  },

  But it is OK if we explicitly import even if auto-importing is enabled
*/

console.log('import.meta.env.MODE', import.meta.env.MODE) // development / production
console.log('import.meta.env.DEV', import.meta.env.DEV) // false / true
console.log('import.meta.env.PROD', import.meta.env.PROD) // false / true

console.log('meta.client', import.meta.client) // false / true
console.log('meta.server', import.meta.server) // false / true
console.log('meta.dev', import.meta.dev) // false / true
console.log('meta.url', import.meta.url) // ssr: file:///Users/rafaelkrbashian/Tutorials/Nuxt3-Tutorial/pages/index.vue; client: http://localhost:3000/_nuxt/pages/index.vue
console.log('meta.dirname', import.meta.dirname) // ssr: /Users/rafaelkrbashian/Tutorials/Nuxt3-Tutorial/pages
console.log('meta.filename', import.meta.filename) // ssr: /Users/rafaelkrbashian/Tutorials/Nuxt3-Tutorial/pages/index.vue

// console.log('meta.baseURL', import.meta.baseURL) // undefined
// console.log('meta.glob', import.meta.glob) // undefined
// console.log('meta.main', import.meta.main) // undefined
// console.log('meta.versions', import.meta.versions) // undefined

console.log('process.env.NUXT_API_SECRET', process.env.NUXT_API_SECRET) // undefined on client side
console.log('process.env.NUXT_PUBLIC_API_BASE', process.env.NUXT_PUBLIC_API_BASE) // undefined on client side

const config = useRuntimeConfig()

const apiSecret = config.apiSecret // undefined on client side

console.log('apiSecret', apiSecret)

const theme = config.public.theme // gets default value from nuxt.config.ts file from runtimeConfig.public.theme as there is no NUXT_PUBLIC_THEME in .env file
const apiBase = config.public.apiBase // gets the NUXT_PUBLIC_API_BASE value from .env file and overrides default value in nuxt.config.ts file in runtimeConfig.public.apiBase
const baseUrl = config.public.baseUrl // gets the runtimeConfig.public.baseUrl value from nuxt.config.ts file as it is = process.env.NUXT_PUBLIC_BASE_URL

console.log('theme', theme)
console.log('apiBase', apiBase)
console.log('baseUrl', baseUrl)

const counterStore = useCounterStore()

// the destructured property from Pinia to be reactive we have to wrap counterStore in storeToRefs
// othewise const { count } is only the value and is not reactive
const { count } = storeToRefs(counterStore)

// or we have to make them as computed
const count2 = computed(() => counterStore.count)

console.log('1 count', count.value)
console.log('1 count2', count2.value)

const color = computed(() => {
  return counterStore.count % 2 == 0
    ? { counter: 'green', double_counter: 'red' }
    : { counter: 'red', double_counter: 'green' }
})

const counter_color = computed(() => color.value.counter)
const double_counter_color = computed(() => color.value.double_counter)

const dog_img_src = ref('')
const is_loading = ref(false)

const handleClick = async () => {
  // counterStore.increment('a') // for type checking

  counterStore.increment(1)

  console.log('2 count', count.value)
  console.log('3 counterStore.count', counterStore.count)
  console.log('4 count2', count2.value)

  if (dog_img_src.value) {
    return
  }

  console.log("$fetch('/api/secret-data') on @/server/api/secret-data.get")

  is_loading.value = true

  interface SecretData {
    data?: { image: { jpg: string } }
    apiSecret?: string
    cookies?: Record<string, unknown>
    auth_user?: { user: number }
  }

  const data: SecretData | null = await $fetch('/api/secret-data').catch(() => null)

  console.log('data', {
    image: data?.data?.image?.jpg,
    apiSecret_on_server: data?.apiSecret,
    cookies: data?.cookies,
    auth_user: data?.auth_user,
  })

  is_loading.value = false

  if (data?.data?.image?.jpg) {
    dog_img_src.value = data.data.image.jpg
  }
}

const resetCounter = () => {
  counterStore.count = 0
  dog_img_src.value = ''
}

const onHydrate = (hydrated_on: string) => {
  console.log(hydrated_on)
}
</script>

<style lang="scss">
.home-page {
  min-width: 350px;
  text-align: center;

  &__counter-button {
    min-width: 180px;
    margin: 32px 0;
  }

  &__counter {
    width: fit-content;
    min-width: 400px;
    min-height: 60px;
    margin: 0 auto;
    margin-bottom: 2px;
    padding: 8px;
    border-radius: 4px;
    transition: background-color 0.2s;
    background-color: v-bind(counter_color);
  }

  &__double-counter {
    width: fit-content;
    min-width: 400px;
    min-height: 60px;
    margin: 0 auto;
    padding: 8px;
    border-radius: 4px;
    transition: background-color 0.2s;
    background-color: v-bind(double_counter_color);
  }

  h3 {
    margin-top: 24px;
  }

  p {
    text-align: left;
  }
}
</style>
