export const useNameRef = () => {
  const name = ref('No name Ref')

  const setName = (newName: string) => {
    name.value = newName || 'No name Ref'
  }

  return { name, setName }
}
