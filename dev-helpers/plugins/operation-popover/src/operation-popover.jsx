import React, { Component } from 'react'
import './styles.less'
import observedLatencyHelper from './observed-latency-helper.js'
import OperationPopoverHover from './operation-popover-hover.jsx'

export default class OperationPopover extends Component {
  constructor(props) {
    super(props)

    this.state = {
      show: false,
      observedLatencies: []
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleMouseIn = this.handleMouseIn.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
  }

  // Shows the hover tooltip.
  handleMouseIn(event) {
    this.setState({ show: true })
  }

  // Hides the hover tooltip.
  handleMouseOut(event) {
    this.setState({ show: false })
  }

  handleClick(event) {
    // Prevent the swagger ui from opening the operation on click.
    event.stopPropagation()

    this.setState(prevState => {
      return { show: !prevState.show }
    })
  }

  ComponentDidMount() {
    observedLatencyHelper.getObservedLatenciesAsync(
      (data) => {
        this.setState({ observedLatencies: data })
      })
  }

  render() {
    if (!this.props.isDevelopmentEnvironment) {
      return;
    }

    // Render the UI for the popover.
    return (
      <div className="latency-popover-wrapper">
        <span onClick={this.handleClick} onMouseOver={this.handleMouseIn} onMouseOut={this.handleMouseOut} className="glyphicon glyphicon-time">
        </span>

        {this.state.show &&
          <OperationPopoverHover {...this.props}
            observedLatencies={this.observedLatencies}
            popoverOnClick={this.handleClick}
            popoverMouseOver={this.handleMouseIn}
            popoverMouseOut={this.handleMouseOut} />
        }
      </div>
    )
  }
}
