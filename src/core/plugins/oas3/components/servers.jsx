import React from "react"
import { OrderedMap } from "immutable"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class Servers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      enteredServer: "",
      enteredServers: [],
      selectedServer: ""
    }
  }
 
  static propTypes = {
    servers: ImPropTypes.list.isRequired,
    currentServer: PropTypes.string.isRequired,
    setSelectedServer: PropTypes.func.isRequired,
    setServerVariableValue: PropTypes.func.isRequired,
    getServerVariable: PropTypes.func.isRequired,
    getEffectiveServerValue: PropTypes.func.isRequired
  }

  componentDidMount() {
    let { servers, currentServer } = this.props

    if(currentServer) {
      return
    }

    //fire 'change' event to set default 'value' of select
    this.setServer(servers.first().get("url"))
  }

  componentWillReceiveProps(nextProps) {
    let {
      servers,
      setServerVariableValue,
      getServerVariable,
      updateServers
    } = this.props

    if(this.props.currentServer !== nextProps.currentServer) {
      // Server has changed, we may need to set default values
      let currentServerDefinition = servers
        .find(v => v.get("url") === nextProps.currentServer)

      if(!currentServerDefinition) {
        // Update the dropdown UI to reflect the server the user chose.
        this.setState( { selectedServer: nextProps.currentServer } )

        this.props.updateServers( nextProps.currentServer )
        return this.setServer( nextProps.currentServer )
      }

      this.setState({ selectedServer : currentServerDefinition.get("url") })
      let currentServerVariableDefs = currentServerDefinition.get("variables") || OrderedMap()

      currentServerVariableDefs.map((val, key) => {
        let currentValue = getServerVariable(nextProps.currentServer, key)
        // only set the default value if the user hasn't set one yet
        if(!currentValue) {
          setServerVariableValue({
            server: nextProps.currentServer,
            key,
            val: val.get("default") || ""
          })
        }
      })
    }
  }

  onServerChange =( e ) => {
    this.setServer( e.target.value )

    // set default variable values
  }

  onServerVariableValueChange = ( e ) => {
    let {
      setServerVariableValue,
      currentServer
    } = this.props

    let variableName = e.target.getAttribute("data-variable")
    let newVariableValue = e.target.value

    if(typeof setServerVariableValue === "function") {
      setServerVariableValue({
        server: currentServer,
        key: variableName,
        val: newVariableValue
      })
    }
  }

  setServer = ( value ) => {
    let { setSelectedServer } = this.props

    setSelectedServer(value)
  }

  onServerKeyPress = ( event ) => {
    if (event.key == 'Enter') {
      this.addEnteredServer()
    }
  }

  onEnteredServerChange = ( event ) => {
    this.setState({
      enteredServer: event.target.value
    })
  }

  addEnteredServer = () => {
    this.setServer( this.state.enteredServer )
    this.setState({ enteredServer: "" })
  }

  render() {
    let { servers,
      currentServer,
      getServerVariable,
      getEffectiveServerValue
    } = this.props


    let currentServerDefinition = servers.find(v => v.get("url") === currentServer) || OrderedMap()

    let currentServerVariableDefs = currentServerDefinition.get("variables") || OrderedMap()

    let shouldShowVariableUI = currentServerVariableDefs.size !== 0

    return (
      <div className="servers">
        <label htmlFor="servers">
          <select onChange={ this.onServerChange } value={this.state.selectedServer}>
            { servers.valueSeq().map(
              ( server ) =>
              <option
                value={ server.get("url") }
                key={ server.get("url") }>
                { server.get("url") }
              </option>
            ).toArray()}
          </select>
          <div className="add-server">
            <input type="text" placeholder="Add another server" value={ this.state.enteredServer } onChange={ this.onEnteredServerChange } onKeyPress={this.onServerKeyPress}/>
            <button className="btn" onClick={ this.addEnteredServer }>+</button>
          </div>
        </label>
        { shouldShowVariableUI ?
          <div>

            <div className={"computed-url"}>
              Computed URL:
              <code>
                {getEffectiveServerValue(currentServer)}
              </code>
            </div>
            <h4>Server variables</h4>
            <table>
              <tbody>
                {
                  currentServerVariableDefs.map((val, name) => {
                    return <tr key={name}>
                      <td>{name}</td>
                      <td>
                        { val.get("enum") ?
                          <select data-variable={name} onChange={this.onServerVariableValueChange}>
                            {val.get("enum").map(enumValue => {
                              return <option
                                selected={enumValue === getServerVariable(currentServer, name)}
                                key={enumValue}
                                value={enumValue}>
                                {enumValue}
                              </option>
                            })}
                          </select> :
                          <input
                            type={"text"}
                            value={getServerVariable(currentServer, name) || ""}
                            onChange={this.onServerVariableValueChange}
                            data-variable={name}
                            ></input>
                        }
                      </td>
                    </tr>
                  })
                }
              </tbody>
            </table>
          </div>: null
        }
      </div>
    )
  }
}
