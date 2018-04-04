import React, { Component } from 'react'
import './styles.less'
import observedLatencyHelper from './observed-latency-helper.js'

export default class OperationPopoverHover extends Component {
  constructor(props) {
    super(props)

    this.state = {
      daysSince: 0,
      currentObservedLatency: null,
      timeoutLatencyDefault: null
    }

    this.defaultLatencies = this.defaultLatencies.bind(this);
    this.populateObservedLatencies = this.populateObservedLatencies.bind(this);
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {

    // Set fake values for testing the ui
    this.setState({ daysSince: 2 })
    //this.setState({
    //  currentObservedLatency: {
    //    percentile98: { default: 10 },
    //    percentile95: { default: 8 },
    //    percentile75: { default: 2 },
    //    percentile50: { default: 1 }
    //  }
    //})

    this.setState({
      timeoutLatencyDefault: 20
    })

    // end test values

  }

  handleClick(event) {
    event.stopPropagation()
  }

  componentDidUpdate() {
    // May be cleaner to move these to helper (except for the set state logic)
    this.defaultLatencies()
    this.populateObservedLatencies()

  }

  defaultLatencies() {
    var latenciesAllHosts = this.props.spec.paths[this.props.path][this.props.method]['x-latencies']
    if (latenciesAllHosts) {
      latenciesAllHosts = convertKeysToLowercase(latenciesAllHosts)
      var latencies = latenciesAllHosts[this.props.host]

      if (latencies) {
        var timeoutLatency = latencies['timeout']

        if (timeoutLatency) {
          this.setState({ timeoutLatencyDefault: timeoutLatency['default'] })
        }
      }
    }
  }

  populateObservedLatencies() {
    if (!this.props.observedLatencies) {
      return
    }

    var observedLatenciesForService = this.props.observedLatencies.services[this.props.serviceCatalogId]

    if (!observedLatenciesForService) {
      return
    }

    var observedLatenciesAllHosts = observedLatencyHelper.convertKeysToLowercase(observedLatenciesForService.hosts)
    var observedLatenciesForHost = observedLatenciesAllHosts[this.props.host] ? observedLatenciesAllHosts[this.props.host] : observedLatenciesAllHosts['default'];

    if (!observedLatenciesForHost) {
      return
    }

    var observedLatencyForCurrentPath = observedLatenciesForHost.operationPaths[this.props.path]
    if (!observedLatencyForCurrentPath) {
      return
    }

    observedLatencyForCurrentPath = observedLatencyHelper.convertKeysToLowercase(observedLatencyForCurrentPath.operationMethods)

    var observedLatencyForCurrentMethod = observedLatencyForCurrentPath[this.props.method]

    if (!observedLatencyForCurrentMethod) {
      return
    }

    var currentObservedLatency = observedLatencyForCurrentMethod.observedLatency
    var currentObservedLatencyTime = observedLatencyForCurrentMethod.observationTimestamp

    if (!currentObservedLatency) {
      return
    }

    this.setState({
      currentObservedLatency: currentObservedLatency
    })
    this.setState({
      daysSince: currentObservedLatencyTime ?
        observedLatencyHelper.getDaySinceObservationTime(observationTimestamp) : 1
    })
  }

  render() {

    // Empty element for creating the "arrow" part of the popover
    var arrow = <div className="arrow bottom right"></div>

    // Default timeout UI
    var defaultTimeout = (
      <div className="observed-latency-content-header">
        <div className="declared-latency-title">
          Declared timeout of the operation <br />
          <div className="declared-latency-title-value">
            {this.state.timeoutLatencyDefault} ms
           </div>
        </div>
      </div>
    )

    // UI when there is no observed latency
    var defaultObservedLatencyContent = this.state.timeoutLatencyDefault ? (
      <div className="observed-latency-content short-latency-content" onClick={this.handleClick} onMouseOver={this.props.popoverMouseOver} onMouseOut={this.props.popoverMouseOut}>
          {defaultTimeout}
          <div className="observed-latency-content-title">Latency observed 1 day(s) ago:</div>
          <div className="no-observed-latency">
            No observed latency.
          </div>
        {arrow}
      </div>
    ) : null

    // Observed latency UI
    var latencyContent = this.state.daysSince && this.state.currentObservedLatency ? (
      <div className="observed-latency-content tall-latency-content" onClick={this.handleClick} onMouseOver={this.props.popoverMouseOver} onMouseOut={this.props.popoverMouseOut}>
        {defaultTimeout}
        <div className="observed-latency-content-title">Latency observed {this.state.daysSince} day(s) ago: </div>
        <table className="observed-latency-popover-table">
          <tbody>
            <tr>
              <td className="observed-latency-popover-table-percentile"> 98th Percentile </td>
              <td className="observed-latency-popover-table-value"> {this.state.currentObservedLatency['percentile98']['default']} ms</td>
            </tr>
            <tr>
              <td className="observed-latency-popover-table-percentile"> 95th Percentile </td>
              <td className="observed-latency-popover-table-value"> {this.state.currentObservedLatency['percentile95']['default']} ms</td>
            </tr>
            <tr>
              <td className="observed-latency-popover-table-percentile"> 75th Percentile </td>
              <td className="observed-latency-popover-table-value"> {this.state.currentObservedLatency['percentile75']['default']} ms</td>
            </tr>
            <tr>
              <td className="observed-latency-popover-table-percentile"> 50th Percentile </td>
              <td className="observed-latency-popover-table-value"> {this.state.currentObservedLatency['percentile50']['default']} ms</td>
            </tr>
            </tbody>
          </table>
        {arrow}
      </div>
    ) : null

    return latencyContent || defaultObservedLatencyContent
  }
}
