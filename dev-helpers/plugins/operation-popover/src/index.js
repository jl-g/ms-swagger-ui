import OperationPopover from "./operation-popover.jsx"
import React, { Component } from "react"
import "./styles.less"

var ServiceCatalogId = null
var IsDevelopmentEnvironment = null

export const init = (data) => {
  ServiceCatalogId = data["serviceCatalogId"]
  IsDevelopmentEnvironment = data["isDevelopmentEnvironment"]
}

// Creates the plugin for use with the swagger ui. This will override
// the placeholder component "OperationAddon" that is part of the Swagger UI.
export const Plugin = (system) => {
  return {
    wrapComponents: {
      OperationAddon: (Original, system) => (props) => {
        return <OperationPopover {...props} serviceCatalogId={ServiceCatalogId} isDevelopmentEnvironment={IsDevelopmentEnvironment} />
      },
    }
  }
}



