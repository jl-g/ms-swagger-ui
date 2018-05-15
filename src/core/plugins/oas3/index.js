// import reducers from "./reducers"
// import * as actions from "./actions"
import * as specWrapSelectors from "./spec-extensions/wrap-selectors"
import * as authWrapSelectors from "./auth-extensions/wrap-selectors"
import * as specSelectors from "./spec-extensions/selectors"
import oas3SpecReducers from "./spec-extensions/reducers"
import * as oas3SpecActions from "./spec-extensions/actions"
import components from "./components"
import wrapComponents from "./wrap-components"
import * as oas3Actions from "./actions"
import * as oas3Selectors from "./selectors"
import oas3Reducers from "./reducers"

export default function() {
  return {
    components,
    wrapComponents,
    statePlugins: {
      spec: {
        reducers: oas3SpecReducers,
        actions: oas3SpecActions,
        wrapSelectors: specWrapSelectors,
        selectors: specSelectors
      },
      auth: {
        wrapSelectors: authWrapSelectors
      },
      oas3: {
        actions: oas3Actions,
        reducers: oas3Reducers,
        selectors: oas3Selectors,
      }
    }
  }
}
