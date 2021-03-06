/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { addUserMessage, emitUserMessage, setQuickReply, setCarouselType2, doInputDisabled, doAttachLocationDisabled, doAttachDisabled, doInputEnabled, changeInputFieldHint } from 'actions';
import Message from '../Message/index';
import CarousalSlider from './components/CarousalSlider/CarousalSlider';

import './styles.scss';

class CarouselType2 extends PureComponent {
  constructor(props) {
    super(props);
    const { message, getChosenReply, inputState, id } = this.props;
    const hint = message.get('hint');
    const chosenReply = getChosenReply(id);
    this.handleClick = this.handleClick.bind(this);
    this.dataArray = [];
    this.setIntervalRef = null;

    if (!chosenReply && !inputState) {
      this.props.doInputDisabled();
      this.props.doAttachDisabled();
      this.props.doAttachLocationDisabled();
      this.props.changeInputFieldHint(hint);
    }
  }

  state = {
    imageLink: false,
    activeIndex: 0,
    dataArray: []
  }

  componentDidMount() {
    if (this.props.carouselType2Style.carouselType2SlideInterval != 0) {
      clearTimeout(this.setIntervalRef);
      this.setIntervalRef = setTimeout(() => {
        this.goToNextSlide();
      }, +this.props.carouselType2Style.carouselType2SlideInterval * 1000);
    }

    this.setState({
      dataArray: this.dataArray
    });
  }

  handleClick(e, reply, title) {
    e.stopPropagation();
    const { chooseReply, id } = this.props;

    const payload = reply.get('payload');
    chooseReply(payload, title, id);
    this.props.doInputDisabled();
    this.props.doAttachDisabled();
    this.props.doAttachLocationDisabled();
    this.props.changeInputFieldHint('');
  }

  goToPrevSlide() {
    let index = this.state.activeIndex;
    const length = this.state.dataArray.length;

    if (index < 1) {
      index = length - 1;
    } else {
      index--;
    }

    this.setState({
      activeIndex: index
    });

    if (this.props.carouselType2Style.carouselType2SlideInterval != 0) {
      clearTimeout(this.setIntervalRef);
      this.setIntervalRef = setTimeout(() => {
        this.goToNextSlide();
      }, +this.props.carouselType2Style.carouselType2SlideInterval * 1000);
    }
  }

  goToNextSlide() {
    let index = this.state.activeIndex;
    const length = this.state.dataArray.length;

    if (index === length - 1) {
      index = 0;
    } else {
      index++;
    }

    this.setState({
      activeIndex: index
    });

    if (this.props.carouselType2Style.carouselType2SlideInterval != 0) {
      clearTimeout(this.setIntervalRef);
      this.setIntervalRef = setTimeout(() => {
        this.goToNextSlide();
      }, +this.props.carouselType2Style.carouselType2SlideInterval * 1000);
    }
  }

  render() {
    const {
      message,
      getChosenReply,
      isLast,
      id,
      chatFontSize,
      botChatTextColor,
      botTextBgColor,
      textFontFamily,
      carouselType2Style,
      botButtonBorderColor,
      botButtonTextColor,
      botButtonBgColor,
      botButtonBorderColorHover,
      botButtonTextColorHover,
      botButtonBgColorHover,
      faquiScrollStickColor,
      botWindowScrollStickColor,
      isTextAreaBoxShadowEnabled
    } = this.props;

    this.dataArray = [];
    const chosenReply = getChosenReply(id);

    if (chosenReply) {
      return (
        <Message
          message={message}
          chatFontSize={chatFontSize}
          botChatTextColor={botChatTextColor}
          botTextBgColor={botTextBgColor}
          textFontFamily={textFontFamily}
          isTextAreaBoxShadowEnabled={isTextAreaBoxShadowEnabled}
        />);
    }

    message.get('quick_replies').map((reply) => {
      const values = reply.get('title').split(',');
      const newValues = values.map(v => v.replace(/"/gi, ''));
      let imgSrc = newValues[1];
      if (!newValues[1].includes('.jpg')) {
        imgSrc = newValues[1].replace('watch?v=', 'embed/').concat('?controls=0&autoplay=1&loop=1');
      }
      const carousalObj = {};

      carousalObj.header = newValues[0];
      carousalObj.imageSrc = imgSrc;
      carousalObj.text1 = newValues[2];
      carousalObj.text2 = newValues[3];
      carousalObj.buttonText = newValues[4];
      carousalObj.reply = reply;

      this.dataArray.push(carousalObj);
      return carousalObj;
    });

    const carouselElement = this.dataArray.map((data, index) => (
      <CarousalSlider
        index={index}
        activeIndex={this.state.activeIndex}
        carousalData={data}
        carousalDataLength={this.dataArray.length}
        goToPrevSlide={() => this.goToPrevSlide()}
        goToNextSlide={() => this.goToNextSlide()}
        buttonClickHandler={e => this.handleClick(e, data.reply, data.buttonText)}
        carouselType2Style={carouselType2Style}
        botButtonBorderColor={botButtonBorderColor}
        botButtonTextColor={botButtonTextColor}
        botButtonBgColor={botButtonBgColor}
        botButtonBorderColorHover={botButtonBorderColorHover}
        botButtonTextColorHover={botButtonTextColorHover}
        botButtonBgColorHover={botButtonBgColorHover}
        faquiScrollStickColor={faquiScrollStickColor}
        botWindowScrollStickColor={botWindowScrollStickColor}
        isTextAreaBoxShadowEnabled={isTextAreaBoxShadowEnabled}
      />)
    );

    return (
      <Fragment>
        {isLast && carouselElement}
      </Fragment>
    );
  }
}


const mapStateToProps = state => ({
  getChosenReply: id => state.messages.get(id).get('chosenReply'),
  inputState: state.behavior.get('disabledInput'),
  linkTarget: state.metadata.get('linkTarget')
});

const mapDispatchToProps = dispatch => ({
  doInputDisabled: () => dispatch(doInputDisabled()),
  doAttachDisabled: () => dispatch(doAttachDisabled()),
  doAttachLocationDisabled: () => dispatch(doAttachLocationDisabled()),
  doInputEnabled: () => dispatch(doInputEnabled()),
  changeInputFieldHint: hint => dispatch(changeInputFieldHint(hint)),
  chooseReply: (payload, title, id) => {
    dispatch(setQuickReply(id, title));
    dispatch(setCarouselType2(id, title));
    dispatch(addUserMessage(title));
    dispatch(emitUserMessage(payload));
    dispatch(doInputEnabled());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CarouselType2);
