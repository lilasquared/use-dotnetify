# use-dotnetify

`use-dotnetify` is a react library that provides hook access for [`dotnetify`](http://dotnetify.net/core/overview) models.

## Install

You must be using [`dotnetify`](http://dotnetify.net/core/overview).

- `npm install use-dotnetify` or
- `yarn add use-dotnetify`

## Use

Using this library requires two parts. First is the Provider which uses react context to share the state and vm through the component hierarchy. This is where you specify the model you would like to connect to, and initial model state. Behind the scenes this is using `dotnetify.react.connect()`.

```js
import React from "react"
import { DotNetifyProvider } from "use-dotnetify"
import HelloWorld from "./HelloWorld"

const HelloWorldVm = () => (
  const initialState = {
    FirstName: "",
    LastName: "",
    FullName: "",
  }

  return (
    <DotnetifyProvider model="HelloWorldVm" initialState={initialState}>
      <HelloWorld />
    </DotnetifyProvider>
  )
)
```

Now our HelloWorld component will have access to the ViewModel provided by the server through the `useDotNetify()` hook. This will give us read only access to state.

```jsx
import React from "react"
import { useDotnetify } from "use-dotnetify"

const HelloWorld = () => {
  const { state } = useDotNetify()

  return (
    <div>
      <strong>{state.FullName}</strong>
    </div>
  )
}
```

We can also dispatch state updates using the `useDotNetifyProperty()` hook. This hook requires the property name, and provides us with the current state, a client side update method, and a dispatch method to dispatch state updates to the server.

```jsx
import React from "react"
import { useDotnetify } from "use-dotnetify"

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
```

The `useDotNetify()` hook returns `{ state, vm }` so any vm action you need is available through that hook as well.
