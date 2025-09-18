<script setup lang="ts">
const { name, setName, nameObject } = useNameRef()

/* const { objName } = nameObject // on destructuring loosing reactivity

console.log('1 objName', objName) // not reactive = 'Raf'
console.log('11 nameObject.objName', nameObject.objName) // reactive = 'Raf'

setName('check new name') // changes nameObject.objName to 'check new name'

console.log('2 objName', objName) // not reactive = 'Raf'
console.log('22 nameObject.objName', nameObject.objName) // reactive = 'check new name' */

const { objName } = toRefs(nameObject) // make reactive objName

console.log('1 objName', objName.value) // reactive = 'Raf'

setName('check new name') // changes nameObject.objName to 'check new name'

console.log('2 objName', objName.value) // reactive = 'check new name'
</script>

<template>
  <div style="border: 1px solid blue; padding: 10px; margin: 10px">
    <h3>ref Example</h3>
    <p>not shared Value: {{ name }}</p>
    <input v-model="name" placeholder="Change name" style="padding: 4px 8px" />
    <button
      style="padding: 2px 8px; margin-left: 16px; background-color: darkgrey"
      @click="setName('John Ref')"
    >
      Set to John Ref
    </button>
  </div>
</template>
