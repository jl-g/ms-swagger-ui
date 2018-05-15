export const UPDATE_SERVERS = "spec_update_servers"

export function updateServers(spec) {
  return {
    type: UPDATE_SERVERS,
    payload: spec
  }
}
