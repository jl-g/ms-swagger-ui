import { UPDATE_SERVERS } from "./actions"
import { List, OrderedMap } from "immutable"

export default {
  [UPDATE_SERVERS]: (state, action) => {    
        let currentServers = state.getIn(["json", "servers"])
        let addedServer = new OrderedMap( {"url": action.payload} )
        let updatedServers = currentServers.insert( 0, addedServer )
    
        if (typeof action.payload === "string") {
          return state.setIn(["json", "servers"], updatedServers )
        }
    
        return state
    },
}
