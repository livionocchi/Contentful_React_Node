import React from 'react'
import { Carousel } from 'react-responsive-carousel';

class Slider extends React.Component {

  displayImages = () => {
    if(this.props.images) {
      return(
        <Carousel
          className='slider'
          dynamicHeight={ true }
          width='100%'
          >
          { this.props.images.map((img, index) => {
            return (
              <div key={ index }>
                <img src={ require(`../${img}`) } alt=''/>
              </div>
            )
          }) }
        </Carousel>
      )
    }

    return ''
  }

  render () {

    return (
      <React.Fragment>
        { this.displayImages() }
      </React.Fragment>
    )
  }
}

export default Slider;
