import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
} from "react"
import useForceUpdate from "use-force-update"
import dotnetify from "dotnetify"

const DotNetifyContext = createContext({
  states: {},
  models: {},
  cacheModel: () => {
    throw new Error("not initialized")
  },
})

export const DotNetifyProvider = props => {
  const models = useRef()
  const states = useRef({})
  const forceUpdate = useForceUpdate()

  models.current = dotnetify.react
    .getViewModels()
    .reduce((prev, curr) => ({ ...prev, [curr.$vmId]: curr }), {})

  const update = useRef((model, newState) => {
    states.current = {
      ...states.current,
      [model]: newState,
    }
    forceUpdate()
  })

  return (
    <DotNetifyContext.Provider value={{ models, states, update }}>
      {props.children}
    </DotNetifyContext.Provider>
  )
}

function useDotNetifyConnect(model, initialState) {
  const { models, states, update } = useContext(DotNetifyContext)

  if (!states.current[model]) {
    update.current(model, initialState)
  }

  const vm = useRef()
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    if (models.current[model] === undefined) {
      const component = {
        state: states.current[model],
        setState: newState => {
          update(model, newState)
        },
      }

      vm.current = dotnetify.react.connect(model, component, {
        getState: () => states.current[model],
        setState: newState => {
          update.current(model, newState)
          forceUpdate()
        },
      })
    }

    return () => {
      vm.current && vm.current.$destroy()
    }
  }, [model, forceUpdate])

  return [states.current[model], models.current[model]]
}

export function useProperty(model, property) {
  const { models, states } = useContext(DotNetifyContext)
  const [value, setValue] = useState(states.current[model][property])
  const didChange = useRef(false)

  const update = value => {
    setValue(value)
    didChange.current = true
  }

  const dispatch = value => {
    debugger
    if (models.current[model] === undefined) {
      throw new Error("Unable to dispatch, vm has not been initialized.")
    }

    models.current[model].$dispatch({ [property]: value })
    didChange.current = true
  }

  const state = states.current[model]

  useEffect(() => {
    debugger
    if (models.current[model] === undefined) {
      return
    }

    if (value !== state[property] && !didChange.current) {
      setValue(state[property])
      didChange.current = false
    }
  }, [model, property, value, state])

  return [value, update, dispatch]
}

export function useDotNetify(model, initialState) {
  return useDotNetifyConnect(model, initialState)
}
