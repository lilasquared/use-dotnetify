import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
  MutableRefObject,
} from "react"
import useForceUpdate from "use-force-update"
import { default as dotnetify, dotnetifyVM, ITemplate } from "dotnetify"

interface ModelHash {
  [index: string]: {
    vm: dotnetifyVM
    state: any
  }
}

interface DotNetifyProviderProps {
  children: React.ReactElement
}

interface DotNetifyContext {
  models: MutableRefObject<ModelHash>
  cacheModel: (model: string, vm: dotnetifyVM, state: any) => void
}

const DotNetifyContext = createContext<DotNetifyContext>({
  models: { current: {} },
  cacheModel: () => {
    throw new Error("not initialized")
  },
})

export const DotNetifyProvider = (
  props: DotNetifyProviderProps
): React.ReactElement => {
  const models = useRef<ModelHash>({})
  const forceUpdate = useForceUpdate()

  const cacheModel = useRef((model: string, vm: dotnetifyVM, state: any) => {
    models.current = {
      ...models.current,
      [model]: {
        vm,
        state,
      },
    }
    forceUpdate()
  })

  return (
    <DotNetifyContext.Provider
      value={{ models, cacheModel: cacheModel.current }}
    >
      {props.children}
    </DotNetifyContext.Provider>
  )
}

function useDotNetifyConnect<T>(
  model: string,
  initialState: T
): [any, dotnetifyVM] {
  const { models, cacheModel } = useContext(DotNetifyContext)
  const state = useRef<T>(initialState)
  const vm = useRef<dotnetifyVM>({
    $dispatch: (value: any) => {},
    $destroy: () => {},
    onRouteEnter: (path: string, template: ITemplate): string => path,
  })
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    if (models.current[model] === undefined) {
      const component = {
        state: state.current,
        setState: (newState: T) => {
          state.current = newState
          forceUpdate()
        },
        render: () => <></>,
        context: {},
        forceUpdate: () => {},
        props: {},
        refs: {},
      }

      vm.current = dotnetify.react.connect(model, component, {
        getState: () => state.current,
        setState: (newState: T) => {
          state.current = newState
          forceUpdate()
        },
      })
    }

    return () => {
      debugger
      vm.current && vm.current.$destroy()
    }
  }, [model, forceUpdate, cacheModel, models])

  useEffect(() => {
    cacheModel(model, vm.current, state.current)
  }, [model, cacheModel])

  return [state.current as any, vm.current as dotnetifyVM]
}

type SetValue<T> = (value: T) => void

export function useProperty<T>(
  model: string,
  property: string,
  initialState: T
): [T, SetValue<T>, SetValue<T>] {
  const context = useContext(DotNetifyContext)
  const models = context.models.current
  const [value, setProperty] = useState<T>(initialState)
  const didChange = useRef(false)

  const setValue = (value: T) => {
    setProperty(value)
    didChange.current = true
  }

  const dispatch = (value: T) => {
    if (models[model] === undefined) {
      throw new Error("Unable to dispatch, vm has not been initialized.")
    }

    models[model].vm.$dispatch({ [property]: value })
    didChange.current = true
  }

  useEffect(() => {
    if (models[model] === undefined) {
      return
    }

    const state = models[model].state
    if (value !== state[property] && !didChange.current) {
      setProperty(state[property])
      didChange.current = false
    }
  }, [model, property, value, models])

  return [value, setValue, dispatch]
}

export function useDotNetify<T>(model: string, initialState: T) {
  return useDotNetifyConnect(model, initialState)
}
