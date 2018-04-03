import React, { Component } from "react"

export default class OperationPopover extends Component {
  constructor(props) {
    super(props)

    this.state = {
      popoverShown: false,
    }

    this.togglePopover = this.togglePopover.bind(this)
  }

  togglePopover(event) {
    event.preventDefault()
    this.setState(prevState => {
      return { popoverShown: !prevState.popoverShown }
    })
  }

  render() {
    console.log("props:");
    console.log(this.props)

    return (
      <div className="operationPopoverTrigger" onClick={this.togglePopover} >
        operation popover trigger
        {this.state.popoverShown &&
          <div className="operationPopover">Popover</div>
        }
      </div>
    )
  }
}
