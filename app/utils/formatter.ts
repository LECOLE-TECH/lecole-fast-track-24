import { Todo } from "~/types/interface"

export const interceptorLoadingElement = (calling: boolean) => {
  const elements = document.querySelectorAll<HTMLElement>(
    ".interceptor-loading"
  )
  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      elements[i].style.opacity = "0.7"
      elements[i].style.pointerEvents = "none"
    } else {
      elements[i].style.opacity = "initial"
      elements[i].style.pointerEvents = "initial"
    }
  }
}

export const generatePlaceHolderCard = () => {
  return {
    id: Math.floor(Math.random() * 100000),
    title: "",
    status: "backlog",
    synced: false,
    created_at: new Date().toISOString()
  } as Todo
}
