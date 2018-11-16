import { useState, useEffect } from "react"
import dotnetify from "dotnetify"

const { connect: initialize } = dotnetify.react

export default function useDotnetify(model, initialState) {
  const [state, setState] = useState(initialState)

  useEffect(
    () => {
      const component = {
        state,
        setState,
      }

      const vm = initialize(model, component)

      return () => vm.$destroy()
    },
    [model]
  )

  return state
}
