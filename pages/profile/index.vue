<template>
  <div style="margin-top: 24px">
    <h2 style="color: aquamarine">Auth with useCookie</h2>

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
      </h3>

      <AppButtonText style="margin: 32px 32px 0 0" name="Clear" @click="clearCount"
        >Clear count</AppButtonText
      >

      <AppButtonText style="margin-top: 32px" name="Log out" @click="logout">Log out</AppButtonText>
    </template>

    <template v-else>
      <h2>Login</h2>

      <AppInput
        ref="input"
        v-model="name"
        style="max-width: 300px"
        placeholder="Enter your name..."
        @keypress.enter="login()"
      />

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

const name = ref('')
const input = useTemplateRef('input')

const login = () => {
  logins.value = (logins.value || 0) + 1
  user.value = { name: name.value }
}

const clearCount = () => {
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

<style lang="scss"></style>
