export const useNameRef = () => {
  const name = ref('No name Ref')

  const nameObject = reactive({
    objName: 'Raf',
  })

  const setName = (newName: string) => {
    name.value = newName || 'No name Ref'

    nameObject.objName = newName
  }

  return { name, setName, nameObject }
}
