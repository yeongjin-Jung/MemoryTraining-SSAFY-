import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

const MyCarousel = () => {
  return (
    // <Carousel className="my-carousel">
    //   <Carousel.Item interval={1000}>
    //     <img className="d-block w-100" src="holder.js/800x400?text=First slide&bg=373940" alt="First slide" />
    //     <Carousel.Caption>
    //       <h3>First slide label</h3>
    //       <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
    //     </Carousel.Caption>
    //   </Carousel.Item>
    //   <Carousel.Item interval={500}>
    //     <img className="d-block w-100" src="holder.js/800x400?text=Second slide&bg=282c34" alt="Third slide" />
    //     <Carousel.Caption>
    //       <h3>Second slide label</h3>
    //       <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    //     </Carousel.Caption>
    //   </Carousel.Item>
    //   <Carousel.Item>
    //     <img className="d-block w-100" src="holder.js/800x400?text=Third slide&bg=20232a" alt="Third slide" />
    //     <Carousel.Caption>
    //       <h3>Third slide label</h3>
    //       <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
    //     </Carousel.Caption>
    //   </Carousel.Item>
    // </Carousel>

    // <div className="my-carousel" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
    //   <h2>mycarousel</h2>
    // </div>

    <div className="my-carousel" style={{ position: 'relative' }}>
      <h2>Carousel</h2>
    </div>
  );
};

export default MyCarousel;
