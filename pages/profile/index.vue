<template>
  <div style="margin-top: 24px" class="app-profile">
    <div class="app-profile__title-container">
      <h2 style="color: aquamarine">Auth with useCookie</h2>
      <Icon
        v-if="isWaiting && !user"
        name="app-icon:spinner-wind-toy"
        class="app-profile__icon icon--spinner spinner-color-animation"
      />
    </div>

    <template v-if="!user">
      <Icon name="app-icon:home" class="app-profile__icon icon--home" mode="svg" />
      <Icon name="app-icon:clock" class="app-profile__icon" mode="css" />
      <Icon name="uil:apple-alt" class="app-profile__icon" />
      <Icon name="app-icon:eye" class="app-profile__icon icon--eye" />
      <Icon name="app-icon:eye-off" class="app-profile__icon icon--eye" />

      <!-- Collection material-symbols is not found locally -->
      <!-- We suggest to install it to provide the best end-user experience. -->
      <!-- npm i -D @iconify-json/material-symbols -->
      <!-- https://icones.js.org/collection/material-symbols?category=Maps&icon=material-symbols:add-location-outline-rounded -->
      <Icon name="material-symbols:add-location-outline-rounded" class="app-profile__icon" />
    </template>

    <template v-if="user">
      <h2>Welcome, {{ user.name }}! 👋</h2>

      <h3>
        You have logged in
        <b
          style="
            display: inline-flex;
            width: 40px;
            height: 40px;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            border: 4px double red;
            color: red;
            background-color: white;
          "
          >{{ logins }}</b
        >
        times!

        <Icon v-if="isWaiting" name="app-icon:spinner-wind-toy" class="spinner-color-animation" />
      </h3>

      <AppButtonText
        style="margin: 32px 32px 0 0"
        name="Clear"
        :disabled="logins == 1"
        @click="clearCount"
        >Clear count</AppButtonText
      >

      <AppButtonText style="margin-top: 32px" name="Log out" @click="logout">Log out</AppButtonText>
    </template>

    <template v-else>
      <h2>Login</h2>

      <AppInput
        ref="input"
        v-model="name"
        :type="input_type"
        class="app-profile__input"
        icon="app-icon:avatar"
        notes="*** input notes"
        placeholder="Enter your name..."
        @keypress.enter="login()"
      >
        <template #field-after>
          <Icon
            :name="input_type == 'password' ? 'app-icon:eye' : 'app-icon:eye-off'"
            class="app-profile__input--icon"
            @click="input_type == 'password' ? (input_type = 'text') : (input_type = 'password')"
          />
        </template>
      </AppInput>

      <AppButtonText
        style="margin-top: 32px; display: block"
        :disabled="!name"
        name="Log in"
        @click="login"
      >
        Log in
      </AppButtonText>
    </template>

    <div class="divider" />
  </div>
</template>

<script setup lang="ts">
const user = useCookie<{ name: string } | null>('user')
const logins = useCookie<number>('logins')

const isWaiting = ref(false)

const name = ref('')
const input = useTemplateRef('input')

const input_type = ref('password')

const login = async () => {
  isWaiting.value = true

  // auto-imported from shared/utils/sleep.ts
  await sleep(1000)

  isWaiting.value = false

  logins.value = (logins.value || 0) + 1
  user.value = { name: name.value }
}

const clearCount = async () => {
  isWaiting.value = true

  // auto-imported from shared/utils/sleep.ts
  await sleep(1000)

  isWaiting.value = false

  logins.value = 1
  name.value = ''
}

const logout = () => {
  user.value = null
  name.value = ''

  nextTick(() => {
    input.value?.focus()
  })
}

onMounted(() => {
  input.value?.focus()
})
</script>

<style lang="scss">
.app-profile {
  &__title-container {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  h3 {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__icon {
    font-size: 50px;
    margin: 0 24px 24px 0;

    &.icon--home {
      color: red;
    }
    &.icon--eye {
      color: yellow;
    }

    &.icon--spinner {
      font-size: 60px;
    }
  }

  &__input {
    max-width: 300px;

    &--icon {
      font-size: 24px;

      @include hover-supported {
        cursor: pointer;
      }
    }
  }
}
</style>
