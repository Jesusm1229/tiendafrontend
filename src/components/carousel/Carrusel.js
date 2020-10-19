/*import React, { useState } from 'react';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css';
// Redireccionamientos.
import { withRouter } from 'react-router-dom';


const items = [
  {
    src : require('../../images/bg_1.jpg'),
    altText: 'Img 1',
    
  },
  {
    src : require('../../images/bg_2.jpg'),
    altText: 'Img 2',
    
  },
  {
    src : require('../../images/bg_3.jpg'),
    altText: 'Img 3',
    
  }
];

const Carrusel = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(true);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }

    
  const slides = items.map((item) => {
      return (     
      
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <img src={item.src} alt={item.altText} width="100%" height ="700px" />
        <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
      </CarouselItem>
    );
  });

  return (
    <Carousel
      activeIndex={activeIndex}
      next={next}
      previous={previous}
    >
      <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
      {slides}
      <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
      <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
    </Carousel>
  );
}

export default withRouter(Carrusel);*/

//Uncontrolled Carrusel. Mejor

import React from 'react';
import { UncontrolledCarousel } from 'reactstrap';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css'
// Redireccionamientos.
import { withRouter } from 'react-router-dom';

const items = [
  {
    src: require('../../images/bg_1.jpg'),
    altText: 'Slide 1',
     key: '1'
  },
  {
    src: require('../../images/bg_2.jpg'),
    altText: 'Slide 2',
    key: '2'
  },
  {
    src: require('../../images/bg_3.jpg'),
    altText: 'Slide 3',
    key: '3'
  }
];

const Carrusel = () => <UncontrolledCarousel items={items} />;

export default Carrusel;