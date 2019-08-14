import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
} from "react"
import useForceUpdate from "use-force-update"
import dotnetify from "dotnetify"

const DotNetifyContext = createContext({})

function useDotNetifyConnect(model, initialState) {
  const state = useRef(initialState)
  const vm = useRef()
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    const component = {
      state: state.current,
      setState: newState => {
        state.current = newState
        forceUpdate()
      },
    }

    vm.current = dotnetify.react.connect(model, component, {
      getState: () => state.current,
    })

    return () => vm.current && vm.current.$destroy()
  }, [model, forceUpdate])

  return [state.current, vm.current]
}

export const DotNetifyProvider = props => {
  const [state, vm] = useDotNetifyConnect(props.model, props.initialState)
  return (
    <DotNetifyContext.Provider value={{ state, vm }}>
      {props.children}
    </DotNetifyContext.Provider>
  )
}

export function useDotNetifyProperty(property) {
  const { vm, state } = useContext(DotNetifyContext)
  const [value, setProperty] = useState(state[property])
  const didChange = useRef(false)

  const setValue = value => {
    setProperty(value)
    didChange.current = true
  }

  const dispatch = value => {
    vm.$dispatch({ [property]: value })
    didChange.current = true
  }

  useEffect(() => {
    if (value !== state[property] && !didChange.current) {
      setProperty(state[property])
      didChange.current = false
    }
  }, [property, value, state])

  return [value, setValue, dispatch]
}

export function useDotNetify() {
  return useContext(DotNetifyContext)
}
