import OperationPopover from "./operation-popover.jsx"
import React, { Component } from "react"

var ServiceCatalogId = null

export const setData = (data) => {
  ServiceCatalogId = data;
}

export const Plugin = (system) => {
  return {
    wrapComponents: {
      OperationAddon: (Original, system) => (props) => {
        return <OperationPopover {...props} serviceCatalogId={ServiceCatalogId} />
      },
    }
  }
}



