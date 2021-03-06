import React from 'react';
import LeftArrowButton from 'assets/leftArrow_button';

import './LeftArrow.scss';

const LeftArrow = (props) => {
  const {
    carouselType2Style,
    goToPrevSlide
  } = props;

  return (
    <div className="rw-leftArrow-box" onClick={goToPrevSlide}>
      <LeftArrowButton carouselType2ArrowsColor={carouselType2Style.carouselType2ArrowsColor} />
    </div>
  );
};

export default LeftArrow;
