import React from 'react'
import { withRouter, Link } from 'react-router-dom'

class Parent extends React.Component {

  displayParents = () => {
    if(this.props.parents !== undefined && this.props.parents.length !== 0) {
      return(
      <div>
        <h2>{ this.props.parents.length === 1 ? 'Parent' : 'Parents' }:</h2>
        <ul>
          { this.props.parents.map((el, index) => {
            return (
              <li key={ index }><Link to={`/${el.id}`}>{ el.name }</Link></li>
            )
          }) }
        </ul>
      </div>
      )
    }

    return ''
  }

  render () {

    return (
      <React.Fragment>
        { this.displayParents() }
      </React.Fragment>
    )
  }
}

export default withRouter(Parent);
