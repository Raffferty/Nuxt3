<template>
  <div class="todos">
    <div class="todos__title--container">
      <h3 class="todos__title">CRUD Example</h3>

      <Icon
        v-if="todoStore.loading"
        name="app-icon:spinner-wind-toy"
        class="todos__icon--spinner spinner-color-animation"
      />

      <p v-else-if="todoStore.error" class="todos__error">Error: {{ todoStore.error }}</p>
    </div>

    <div class="todos__add-input--block">
      <AppInput
        ref="addInput"
        v-model.trim="newTitle"
        :disabled="todoStore.loading"
        icon="material-symbols:add"
        class="todos__add-input"
        placeholder="New todo..."
        @enter="add"
      />
      <AppButtonText class="todos__button" :disabled="todoStore.loading || !newTitle" @click="add"
        >Add</AppButtonText
      >
    </div>

    <ul>
      <li v-for="todo in todoStore.todos" :key="todo.id">
        <div v-if="editId === todo.id" class="todos__todo--block">
          <AppInput
            :ref="(el) => (editInputRefs[todo.id] = el as InstanceType<typeof AppInput>)"
            v-model="editTitle"
            :disabled="todoStore.loading"
            class="todos__todo--edit-input"
            @enter="saveEdit(todo)"
          />
          <AppButtonText
            class="todos__button"
            :disabled="todoStore.loading || todo.title === editTitle.trim()"
            @click="saveEdit(todo)"
            >💾 Save</AppButtonText
          >
          <AppButtonText class="todos__button" :disabled="todoStore.loading" @click="cacelEdit"
            >❌ Cancel</AppButtonText
          >
        </div>
        <div v-else class="todos__todo--block">
          <span class="todos__todo--title">{{ todo.title }}</span>

          <AppButtonText
            class="todos__button"
            :disabled="todoStore.loading"
            @click="startEdit(todo)"
            >✏️ Edit</AppButtonText
          >
          <AppButtonText
            class="todos__button"
            :disabled="todoStore.loading"
            @click="remove(todo.id)"
            >🗑 Delete</AppButtonText
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useTodoStore } from '@/stores/todo'
import AppButtonText from '~/components/AppButtonText.vue'
import AppInput from '~/components/AppInput.vue'

const todoStore = useTodoStore()

const addInput = useTemplateRef('addInput')

const newTitle = ref('')
const editTitle = ref('')
const editId = ref<number | null>(null)

onMounted(async () => {
  addInput.value?.focus()

  await todoStore.fetchTodos()

  addInput.value?.focus()
})

const add = async () => {
  if (!newTitle.value.trim()) return
  await todoStore.addTodo(newTitle.value)
  newTitle.value = ''
  addInput.value?.focus()
}

const editInputRefs = ref<Record<number, InstanceType<typeof AppInput> | null>>({})

const startEdit = async (todo: { id: number; title: string }) => {
  editId.value = todo.id
  editTitle.value = todo.title

  await nextTick()

  console.log('editInputRefs.value', editInputRefs.value)

  editInputRefs.value[todo.id]?.focus()
}

const saveEdit = async (todo: { id: number; title: string }) => {
  if (!editId.value || !editTitle.value.trim() || todo.title === editTitle.value.trim()) return
  await todoStore.updateTodo(editId.value, editTitle.value)
  editId.value = null
  editTitle.value = ''
  addInput.value?.focus()
}

const cacelEdit = () => {
  editTitle.value = ''
  editId.value = null
  addInput.value?.focus()
}

const remove = async (id: number) => {
  await todoStore.deleteTodo(id)
  addInput.value?.focus()
}
</script>

<style lang="scss">
.todos {
  &__title--container {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-top: 24px;

    .todos__title,
    .todos__error {
      margin: 0;
    }

    .todos__title {
      font-style: italic;
      color: greenyellow;
    }

    .todos__error {
      padding-top: 4px;
      color: red;
    }
  }

  &__icon--spinner {
    font-size: 32px;
  }

  &__button {
    width: 140px;
  }

  &__add-input {
    max-width: 415px;

    &--block {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-top: 24px;
    }
  }

  &__todo {
    &--block {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-top: 24px;
    }

    &--title {
      width: 250px;
    }

    &--edit-input {
      width: 250px;
    }
  }
}
/* input {
  margin: 4px;
}
button {
  margin-left: 4px;
} */
</style>
