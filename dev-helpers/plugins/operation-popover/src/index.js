import OperationPopover from "./operation-popover.jsx"
import { createSelector } from "reselect"
import React, { Component } from "react"

export var ServiceCatalogId = null

export const Plugin = (system) => {
  return {
    wrapComponents: {
      OperationAddon: (Original, system) => (props) => { return <OperationPopover/> },
    },
    statePlugins: {
      spec: {
        selectors: {
          document: createSelector(state => state.get(spec))
        }
      }
    }
  }
}



