import { hot } from 'react-hot-loader/root'
import React from 'react'
import { withRouter, Route } from 'react-router-dom'

import Nav from '../components/Nav'
import ContentModelsList from './ContentModelsList'
import ContentModel from './ContentModel'


class App extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Nav history={ this.props.history }/>
        <Route
          exact path="/"
          component={(routeProps) => (
            <ContentModelsList {...routeProps} />
        )} />
        <Route
          exact path="/:cm"
          component={(routeProps) => (
            <ContentModel {...routeProps} />
        )} />
      </React.Fragment>
    )
  }
}

export default withRouter(hot(App));
