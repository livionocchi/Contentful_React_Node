import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Container, Card, Row, Col } from 'react-bootstrap'
import SearchField from "react-search-field"
import data from '../json/custom.json'
import { FormattedMessage } from 'react-intl'

class ContentModelsList extends React.Component {
  state = {
    contentModels: data,
    term: ''
  }

  handleChange = (value) => {
    this.setState({
      term: value
    })
  }

  display = (category) => {
    return this.state.contentModels
    .filter(el => {
      return el.name.toLowerCase().includes(this.state.term.toLowerCase());
    })
    .filter(el => {
      return el.hierarchy === category
    })
    .map((el, index) => {
      const url = el.images.length !== 0 ? require(`../${el.images[0]}`) : 'https://bit.ly/2nccIAU';
      return (
        <Col md={ 6 } lg={ 4 } key={ index }>
          <Link to={`/${el.id}`}>
            <Card>
              <div className='card__img' style={{ backgroundImage:`url(${url})` }}></div>
              <Card.Title>{ el.name }</Card.Title>
            </Card>
          </Link>
        </Col>
      )
    })
  }

  render () {
    return (
      <Container>
        <Row className="justify-content-center">
          <SearchField
            placeholder=''
            onChange={ this.handleChange }
          />
        </Row>

        <h2><FormattedMessage id="utils.parent"/></h2>
        <Row className="justify-content-between">
          { this.display('parent').length !== 0 ?  this.display('parent') : <FormattedMessage id="utils.no_match"/> }
        </Row>

        <h2><FormattedMessage id="utils.component"/></h2>
        <Row className="justify-content-between">
          { this.display('component').length !== 0 ?  this.display('component') : <FormattedMessage id="utils.no_match"/> }
        </Row>

        <h2><FormattedMessage id="utils.element"/></h2>
        <Row className="justify-content-between">
          { this.display('element').length !== 0 ?  this.display('element') : <FormattedMessage id="utils.no_match"/> }
        </Row>
      </Container>
    )
  }
}

export default withRouter(ContentModelsList);
