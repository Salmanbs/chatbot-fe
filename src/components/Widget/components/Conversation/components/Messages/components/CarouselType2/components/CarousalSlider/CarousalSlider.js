import React from 'react';
import Style from 'style-it';
import ReactMarkdown from 'react-markdown';
import LeftArrow from '../LeftArrow/LeftArrow';
import RightArrow from '../RightArrow/RightArrow';

import './CarousalSlider.scss';

const CarousalSlider = (props) => {
  const {
    index,
    activeIndex,
    carousalData,
    carousalDataLength,
    goToPrevSlide,
    goToNextSlide,
    buttonClickHandler,
    carouselType2Style,
    botWindowScrollStickColor,
    isTextAreaBoxShadowEnabled
  } = props;

  const isBoxShadowEnabled = isTextAreaBoxShadowEnabled ? '0 0px 5px 1px #b5b5b5' : '';

  return (
    <Style>
      {`
        .rw-carousalSlider {
          background-color: ${carouselType2Style.carouselType2BgColor};
          box-shadow: ${isBoxShadowEnabled}; 
        }

        .rw-carousalHeader-text {
          font-family: ${carouselType2Style.carouselType2HeaderFontFamily};
          font-size: ${carouselType2Style.carouselType2HeaderFontSize};
          color: ${carouselType2Style.carouselType2HeaderFontColor};
          text-align: ${carouselType2Style.carouselType2HeaderAlignment};
          min-height: ${carouselType2Style.carouselType2HeaderHeight};
          max-height: ${carouselType2Style.carouselType2HeaderHeight};
        }

        .rw-carousalHeader-text::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background: ${botWindowScrollStickColor};
        }

        .rw-carousal-text1 {
          font-family: ${carouselType2Style.carouselType2Text1FontFamily};
          font-size: ${carouselType2Style.carouselType2Text1FontSize};
          color: ${carouselType2Style.carouselType2Text1FontColor};
          text-align: ${carouselType2Style.carouselType2Text1Alignment};
        }

        .rw-carousal-text2 {
          font-family: ${carouselType2Style.carouselType2Text2FontFamily};
          font-size: ${carouselType2Style.carouselType2Text2FontSize};
          color: ${carouselType2Style.carouselType2Text2FontColor};
          text-align: ${carouselType2Style.carouselType2Text2Alignment};
          min-height: ${carouselType2Style.carouselType2Text2Height};
          max-height: ${carouselType2Style.carouselType2Text2Height};
        }

        .rw-carousal-text2::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background: ${botWindowScrollStickColor};
        }

        .rw-carousal-button {
          border: 1px solid ${carouselType2Style.carouselType2ButtonBorderColor};
          color: ${carouselType2Style.carouselType2ButtonTextColor};
          background-color: ${carouselType2Style.carouselType2ButtonBgColor};
          font-family: ${carouselType2Style.carouselType2ButtonFontFamily};
          font-size: ${carouselType2Style.carouselType2ButtonFontSize};
          min-width: ${carouselType2Style.carouselType2MinWidthOfButton};
          width: ${carouselType2Style.carouselType2WidthOfButton};
          min-height: ${carouselType2Style.carouselType2MinHeightOfButton};
        }

        .rw-carousal-button:hover {
          border: 1px solid ${carouselType2Style.carouselType2ButtonBorderColorHover};
          color: ${carouselType2Style.carouselType2ButtonTextColorHover};
          background-color: ${carouselType2Style.carouselType2ButtonBgColorHover};
        }

        .rw-carousal-pagination {
          font-family: ${carouselType2Style.carouselType2Text3FontFamily};
          font-size: ${carouselType2Style.carouselType2Text3FontSize};
          color: ${carouselType2Style.carouselType2Text3FontColor};
        }

        .rw-carousal-footer {
          background-color: ${carouselType2Style.carouselType2FooterBgColor}
        }
      `}
      <div className={index === activeIndex ? 'rw-active' : 'rw-slide'}>
        <div className="rw-carousalSlider">
          <div className="rw-carousalHeader-text">
            <ReactMarkdown
              className={'rw-markdown'}
              source={carousalData.header}
            />
          </div>
          <div className="rw-carousalSlider-items">
            <div className="rw-carousalImage-box">
              <div className="rw-carousalImage-InsideBox">
                {
                  carousalData.imageSrc.includes('.jpg' || '.jpeg' || '.png') ?
                    <img className="rw-carousalImage" src={carousalData.imageSrc} alt="" /> :
                    <video className="rw-carousalImage" allowFullScreen="allow" width="100%" height="100%" controls>
                      <source src={carousalData.imageSrc} type="video/mp4" />
                      <source src={carousalData.imageSrc} type="video/ogg" />
                      <source src={carousalData.imageSrc} type="video/webm" />
                      Your browser does not support the video tag.
                    </video>
                }
              </div>
              <div className="rw-carousal-footer">
                <LeftArrow
                  goToPrevSlide={goToPrevSlide}
                  carouselType2Style={carouselType2Style}
                />
                <p className="rw-carousal-pagination">{`${activeIndex + 1}/${carousalDataLength}`}</p>
                <RightArrow
                  goToNextSlide={goToNextSlide}
                  carouselType2Style={carouselType2Style}
                />
              </div>
            </div>
            <div className="rw-carousal-text1Box">
              <p className="rw-carousal-text1">{carousalData.text1}</p>
            </div>
            <div className="rw-carousal-text2Box">
              <p className="rw-carousal-text2">{carousalData.text2}</p>
            </div>
            <button
              className="rw-carousal-button"
              onClick={e => buttonClickHandler(e)}
            >
              {carousalData.buttonText}
            </button>
          </div>
        </div>
      </div>
    </Style>
  );
};

export default CarousalSlider;
