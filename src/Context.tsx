import React from 'react'
import { store } from './Store'

export const StoreContext = React.createContext(store)

export const StoreProvider: React.SFC<any> = ({ children }) => {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  const store = React.useContext(StoreContext)
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useStore must be used within a StoreProvider.')
  }
  return store
}