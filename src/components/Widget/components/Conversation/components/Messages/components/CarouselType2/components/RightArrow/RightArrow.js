import React from 'react';
import RightArrowButton from 'assets/rightArrow_button';

import './RightArrow.scss';

const RightArrow = (props) => {
  const {
    carouselType2Style,
    goToNextSlide
  } = props;

  return (
    <div className="rw-rightArrow-box" onClick={goToNextSlide}>
      <RightArrowButton carouselType2ArrowsColor={carouselType2Style.carouselType2ArrowsColor} />
    </div>
  );
};

export default RightArrow;
