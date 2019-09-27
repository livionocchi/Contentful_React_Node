import React from 'react'

class Nav extends React.Component {
  render () {

    return (
      <nav>
        <button onClick={ this.props.history.goBack }>Back</button>
        <button onClick={ () => this.props.history.push('/') }>Home</button>
      </nav>
    )
  }
}

export default Nav;
