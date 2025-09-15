## Question #1

Consider this code snippet that uses Vue 3 and Pinia for state management:

```js
import { useUserStore } from '@/stores/user'

export default {
  setup() {
    const userStore = useUserStore()
    const { username, email, isAdmin } = userStore

    function updateUsername() {
      userStore.setUsername('newUsername')
      console.log(username) // What will this log?
    }

    return {
      username,
      email,
      isAdmin,
      updateUsername,
    }
  },
}
```

- What issue exists in this code?
  - What will be logged to the console when updateUsername() is called, and why?
  - Provide at least two different ways to fix this issue while maintaining the destructuring pattern.
- Most importantly: how would you explain this concept to a junior developer who is new to Vue 3 and Pinia?

<div style="page-break-after: always;"></div>

## Answer #1:

#### Link to the visual example:

#### https://stackblitz.com/edit/vitejs-vite-tjedykb6

- The issue in the code:

```js
const { username, email, isAdmin } = userStore
```

- The issue is in the way we destructure the Pinia store props.
  this breaks the props reactivity as we start using plain values instead of using reactive properties.
  - So when updateUsername() is called the old (default) value will be logged and `{ username }` will never be changed.

_**fix #1:**_ In order to extract properties from the store while keeping its reactivity, we need to use `storeToRefs()`
**_Pinia docs_**: https://pinia.vuejs.org/core-concepts/#Destructuring-from-a-Store

```js
import { useUserStore } from '@/stores/user.js'
import { storeToRefs } from 'pinia'

export default {
  setup() {
    const userStore = useUserStore()

    const { username, email, isAdmin } = storeToRefs(userStore)

    function updateUsername(newUsername) {
      userStore.setUsername(newUsername)

      console.log(username.value) // We have to use username.value
    }

    return {
      username,
      email,
      isAdmin,
      updateUsername,
    }
  },
}
```

_**fix #2:**_ We can make Store props computed to give them reactivity and return them to use in the `<template>`:

```js
import { useUserStore } from '@/stores/user.js'
import { computed } from 'vue'

export default {
  setup() {
    const userStore = useUserStore()

    const username = computed(() => userStore.username)
    const email = computed(() => userStore.email)
    const isAdmin = computed(() => userStore.isAdmin)

    function updateUsername(newUsername) {
      userStore.setUsername(newUsername)

      console.log(username.value) // We have to use username.value
    }

    return {
      username,
      email,
      isAdmin,
      updateUsername,
    }
  },
}
```

_**Explanation:**_

- when we destructure reactive properties, we get their values, and they are no longer reactive.
  It's like a snapshot of the property, not the property itself.

<div style="page-break-after: always;"></div>

## Question #2

We’ve built a financial application that displays stock information to users.
Let’s focus on the ability to create a **_dashboard_** — similar to tools like Tableau—where users can place multiple charts and/or tables on a single page.

- Users can add one or more **_widgets_**, which act as containers for these charts or tables.
- Each widget can have one or more views, which represent specific states of the chart or table (e.g., a selected date range).
  These states are stored within the view object.

In summary:
An application contains dashboards → dashboards contain widgets → widgets contain multiple saved views.

We want to track changes made to a dashboard or widget, so we can visually indicate to users when something needs to be saved
— and specifically what needs to be saved.

**_How would you implement this in terms of code structure?_** For example, would you pass a saving prop around to different components?

Please describe your strategy for managing application state in a large-scale Vue 3 application with multiple interconnected components and views.

_Answer_ this question with either code snippets or with a functional MVP.

## Answer #2:

#### Link to clone the functional MVP from my Github:

#### https://github.com/Raffferty/widgets-dashboard.git

- We dont need to pass a saving prop around to different components.
  We can use **_`Pinia`_** store to centralize the application state and track it's changes.
  The code structure can be implemented as follows:
  - `src/stores/dashboard.ts` - the centralized store to interact with.

  ```js
  import { defineStore } from 'pinia'
  import { ref, reactive, computed } from 'vue'
  import type { Dashboard, Widget, ViewState } from '@/types/index'

  export const useDashboardStore = defineStore('dashboard', () => {
    const dashboard = reactive<Dashboard>({
      id: 'dashboard',
      name: 'Dashboard',
      widgets: [],
      isChanged: false,
      unsavedCanges: [],
    })

    function addWidget(type: string) {
      const widget: Widget = {
        id: crypto.randomUUID(),
        type,
        views: [],
        isChanged: false,
      }

      dashboard.widgets.push(widget)
      dashboard.isChanged = true
      dashboard.unsavedCanges.push(`${type.charAt(0).toUpperCase() + type.slice(1)} widget with id: ${widget.id.slice(0,8)} added`)
    }

    function addView(widgetId: string) {
      const widget = dashboard.widgets.find((widget) => widget.id === widgetId)

      if (!widget) return

      const view = {
        id: crypto.randomUUID(),
        state: { dateRange: 'last7days' },
        isChanged: true,
      }

      widget.views.push(view)

      widget.isChanged = true
      dashboard.isChanged = true
      dashboard.unsavedCanges.push(`View with id: ${view.id.slice(0, 8)} added`)
    }

    function updateView(widgetId: string, viewId: string, newState: ViewState) {
      const widget = dashboard.widgets.find((widget) => widget.id === widgetId)

      if (!widget) return

      const view = widget.views.find((view) => view.id === viewId)

      if (!view) return

      view.state = { ...view.state, ...newState }
      view.isChanged = true
      widget.isChanged = true
      dashboard.isChanged = true
      dashboard.unsavedCanges.push(`View with id: ${viewId.slice(0, 8)} updated`)
    }

    const hasUnsavedChanges = computed(() => dashboard.isChanged)

    const isSaving = ref(false)

    async function saveDashboard() {
      isSaving.value = true

      await new Promise((resolve) => setTimeout(resolve, 1200)) // save to BE

      isSaving.value = false

      dashboard.isChanged = false
      dashboard.widgets.forEach((widget) => {
        widget.isChanged = false
        widget.views.forEach((view) => (view.isChanged = false))
      })
      dashboard.unsavedCanges = []
    }

    return {
      dashboard,
      addWidget,
      addView,
      updateView,
      hasUnsavedChanges,
      isSaving,
      saveDashboard,
    }
  })
  ```

  - `src/components/AppWidget.vue` - the Widget component to add, update and show Views

  ```js
  <template>
    <div class="widget" :class="{'is-changed': widget.isChanged}">
      <h3>{{ widget.type.toUpperCase() }}</h3>

      <button @click="addView" :disabled="dashboardStore.isSaving">Add View</button>

      <div v-for="view in widget.views" :key="view.id" class="view">
        <p>{{ view.state }}</p>

        <button @click="changeDate(view.id)" :disabled="dashboardStore.isSaving">Change Date</button>
        <span v-if="view.isChanged" class="unsaved">Unsaved</span>
      </div>
    </div>
  </template>

  <script setup lang="ts">
    import { useDashboardStore } from '@/stores/dashboard'
    import type { Widget } from '@/types'

    const { widget } = defineProps<{ widget: Widget }>()

    const dashboardStore = useDashboardStore()

    function addView() {
      dashboardStore.addView(widget.id)
    }

    function changeDate(viewId: string) {
      dashboardStore.updateView(widget.id, viewId, { dateRange: 'last30days' })
    }
  </script>
  ```

  - `src/App.vue` - where the Dashboard logic is implemented

  ```js
  <template>
    <div>
      <h1>Dashboard</h1>

      <button
        @click="dashboardStore.addWidget('chart')"
        style="width: 130px; margin-right: 24px"
        :disabled="isSaving"
      >
        Add Widget
      </button>

      <button
        v-if="hasUnsavedChanges"
        @click="dashboardStore.saveDashboard"
        style="width: 130px; background-color:coral;"
        :disabled="isSaving"
      >
        Save
      </button>

      <div v-if="hasUnsavedChanges" class="unsaved-banner">
        <p>Unsaved Changes:</p>
        <p v-for="unsavedCange in dashboard.unsavedCanges" :key="unsavedCange">{{ unsavedCange }}</p>
      </div>

      <div class="widgets">
        <AppWidget v-for="widget in dashboard.widgets" :key="widget.id" :widget />
      </div>
    </div>
  </template>

  <script setup lang="ts">
    import {storeToRefs} from 'pinia'
    import { useDashboardStore } from '@/stores/dashboard'
    import AppWidget from '@/components/AppWidget.vue'

    const dashboardStore = useDashboardStore()

    const { dashboard, hasUnsavedChanges, isSaving } = storeToRefs(dashboardStore)
  </script>
  ```

<div style="page-break-after: always;"></div>

## Question #3

In the application described above, imagine you want to allow users to see each other’s changes in real time
— similar to the “multiplayer” functionality in tools like Google Docs or Figma, where users can view edits as they happen.

How would you implement this feature? You may suggest any third-party libraries or state management tools as needed,
but assume Supabase (PostgreSQL) is used as the backend database.

## Answer #3:

- Having `Supbase` on the Client side we could subscribe to a `supbase.channel('dashboard')` and update dashboard data on changes.
  **_Supbase docs_**: https://supabase.com/docs/guides/realtime/concepts#postgres-changes
