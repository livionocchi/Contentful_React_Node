import React from 'react'
import data from '../json/custom.json'

//import {FormattedMessage} from 'react-intl'

import Title from '../components/Title'
import Slider from '../components/Slider'
import Description from '../components/Description'
import Fields from '../components/Fields'
import Parent from '../components/Parent'

class ContentModel extends React.Component {
  state = {
    info: []
  }

  componentDidMount = () => {
    const info = data.find(el => {
      return el.id === this.props.match.params.cm
    });
    this.setState({
      info
    })
  }

  render () {
    const { info } = this.state;
    if(info !== []) {
      return (
        <div>
          <Title title={ info.name }/>
          <Slider images={ info.images } />
          <Description description={ info.description } />
          <Fields fields={ info.fields } info={ info }/>
          <Parent parents={ info.parents }/>
        </div>
      )
    }
    return <div>Loading...</div>
  }
}

export default ContentModel;
