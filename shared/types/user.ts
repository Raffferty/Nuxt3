export interface User {
  id: number
  name: string
  address: { street: string }
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}
