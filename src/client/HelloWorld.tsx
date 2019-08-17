import React from "react"
import { DotNetifyProvider, useProperty, useDotNetify } from "./use-dotnetify"

const SaveOnBlur = ({ model, property }: { model: string; property: string }) => {
  const [value, setValue, dispatch] = useProperty(model, property)

  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={e => dispatch(e.target.value)}
    />
  )
}

const HelloWorld = () => {
  const initialState = {
    FirstName: "",
    LastName: "",
    FullName: "",
  }

  const [state] = useDotNetify("HelloWorldVm", initialState)

  return (
    <div>
      <SaveOnBlur model="HelloWorldVm" property="FirstName" />
      <SaveOnBlur model="HelloWorldVm" property="LastName" />
      <br />

      <strong>{state.FullName}</strong>
    </div>
  )
}

const Wrapper = () => {
  return (
    <DotNetifyProvider>
      <HelloWorld />
    </DotNetifyProvider>
  )
}

export default Wrapper
