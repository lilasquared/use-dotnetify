import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  createContext,
  MutableRefObject,
  FC,
  Component,
} from "react"
import useForceUpdate from "use-force-update"
import dotnetify, { dotnetifyVM } from "dotnetify"

type DotNetifyContextProps = {
  states: MutableRefObject<{ [key: string]: { [key: string]: any } }>
  vms: MutableRefObject<{ [key: string]: dotnetifyVM }>
  update: (model: string, newState: any) => void
}

const DotNetifyContext = createContext<DotNetifyContextProps>({
  states: { current: {} },
  vms: { current: {} },
  update: (model: string, newState: any) => {
    throw new Error(`${model} not initialized: ${newState}`)
  },
})

export const DotNetifyProvider: FC = props => {
  const vms = useRef({})
  const states = useRef({})
  const forceUpdate = useForceUpdate()

  vms.current = dotnetify.react
    .getViewModels()
    // @ts-ignore
    .reduce((prev, curr) => ({ ...prev, [curr.$vmId]: curr }), {})

  const update = useCallback(
    (model, newState) => {
      states.current = {
        ...states.current,
        [model]: newState,
      }
      forceUpdate()
    },
    [forceUpdate]
  )

  return (
    <DotNetifyContext.Provider value={{ vms, states, update }}>
      {props.children}
    </DotNetifyContext.Provider>
  )
}

export function useDotNetify<T>(model: string, initialState: T) {
  const { vms, states, update } = useContext(DotNetifyContext)

  if (!states.current[model]) {
    update(model, initialState)
  }

  useEffect(() => {
    let vm = vms.current[model]

    if (vm === undefined) {
      const component = {
        state: states.current[model],
        setState: (newState: T) => {
          update(model, newState)
        },
      }

      vm = dotnetify.react.connect(model, component as Component, {
        getState: () => states.current[model],
        setState: newState => {
          update(model, newState)
        },
      })
    }

    return () => vm && vm.$destroy()
  }, [model, vms, states, update])

  return [states.current[model], vms.current[model]]
}

export function useProperty(model: string, property: string) {
  const { vms, states } = useContext(DotNetifyContext)
  const [value, setValue] = useState(states.current[model][property])
  const didChange = useRef(false)

  const update = (value: any) => {
    setValue(value)
    didChange.current = true
  }

  const dispatch = (value: any) => {
    debugger
    if (vms.current[model] === undefined) {
      throw new Error("Unable to dispatch, vm has not been initialized.")
    }

    vms.current[model].$dispatch({ [property]: value })
    didChange.current = true
  }

  const state = states.current[model]

  useEffect(() => {
    if (value !== state[property] && !didChange.current) {
      setValue(state[property])
      didChange.current = false
    }
  }, [model, property, state, value])

  return [value, update, dispatch]
}
