export const useNameState = () => {
  const name = useState('name', () => 'No name State')

  const setName = (newName: string) => {
    // using another composable in current composable
    const { name: nameRef, setName: setNameRef } = useNameRef()
    setNameRef(newName)
    console.log('nameRef.value', nameRef.value)
    // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

    name.value = newName || 'No name State'
  }

  return { name, setName }
}
