export type LoginForm = {
  credential: string
  password: string
}

export const LOGIN_FIELDS = [
  {
    name: "credential" as const,
    label: "Telefon raqam",
    placeholder: "998901234567",
    type: "tel" as const,
  },
  {
    name: "password" as const,
    label: "Parol",
    placeholder: "Parol kiriting",
    type: "password" as const,
  },
]