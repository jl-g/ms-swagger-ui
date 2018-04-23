import React, { Component } from "react"
import PropTypes from "prop-types"

export default class TruncatableDiv extends Component {
    static propTypes = {
        heightLimit: PropTypes.number,
        children: PropTypes.any.isRequired  
    }

    static defaultProps = {
        heightLimit: 100
    }

    constructor(props) {
        super(props)

        this.state = { 
            truncated: true,
            renderedHeight: 0
        }

        this.toggleTruncation = this.toggleTruncation.bind(this)
    }

    componentDidMount() {
        this.setState({renderedHeight: this.contents.clientHeight })
    }

    componentDidUpdate() {
        if (this.state.truncated && this.contents) this.contents.scrollTop = 0
    }

    toggleTruncation(event) {
        event.preventDefault()
        this.setState( prevState => { 
            return { truncated: !prevState.truncated } 
        })
    }

    render() {
        let { 
            heightLimit,
            children
        } = this.props
        let maxHeightLimit = 500

        // If the content of the truncatable div is less than the height limit, we
        // don't want to display the 'see more' or 'see less' links. To perform this
        // check we need to do an initial render of the content and then decide whether
        // it crosses the height threshold. Once we render the content and the 
        // component finishes mounting, we update the height of the children.
        if (this.state.renderedHeight < heightLimit) {
            return (
                <div ref={elem => this.contents = elem}>
                    <div className="truncatable">
                        { children }
                    </div>
                </div>
            )
        }
 
        let maxHeight = this.state.truncated ? `${heightLimit}px` : `${maxHeightLimit}px`
        let truncatedStyling = this.state.truncated ? "truncated" : "expanded"

        return (
            <div>
                <div className={ `truncatable ${truncatedStyling}` } ref={elem => this.contents = elem} style={{ maxHeight: maxHeight }}>
                    { children }
                </div>
                <a href onClick={this.toggleTruncation}>
                    { this.state.truncated ? "See more" : "See less" }
                </a>
            </div>
        )
    }
}