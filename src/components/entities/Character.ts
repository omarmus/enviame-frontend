export interface Character {
  id?: number
  name: string,
  description: string,
  modified: Date
  thumbnail: {
    path: string
    extension?: string
  },
}
