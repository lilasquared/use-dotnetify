import React from "react"
import {
  DotNetifyProvider,
  useDotNetifyProperty,
  useDotNetify,
} from "./use-dotnetify"

const HelloWorld = () => {
  const { state } = useDotNetify()
  const [firstName, setFirstName, dispatchFirstName] = useDotNetifyProperty(
    "FirstName"
  )
  const [lastName, setLastName, dispatchLastName] = useDotNetifyProperty(
    "LastName"
  )

  return (
    <div>
      <input
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        onBlur={e => dispatchFirstName(e.target.value)}
      />
      <br />
      <input
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        onBlur={e => dispatchLastName(e.target.value)}
      />

      <strong>{state.FullName}</strong>
    </div>
  )
}

const Wrapper = () => {
  const initialState = {
    FirstName: "",
    LastName: "",
    FullName: "",
  }

  return (
    <DotNetifyProvider model="HelloWorldVm" initialState={initialState}>
      <HelloWorld />
    </DotNetifyProvider>
  )
}

export default Wrapper
