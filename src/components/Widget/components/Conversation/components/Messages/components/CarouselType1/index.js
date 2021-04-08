/* eslint-disable jsx-a11y/no-static-element-interactions */
import { addUserMessage, changeInputFieldHint, doAttachDisabled, doAttachLocationDisabled, doInputDisabled, doInputEnabled, emitUserMessage, setCarouselType1, setQuickReply } from 'actions';
import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import Style from 'style-it';
import Message from '../Message/index';
import './styles.scss';


class CarouselType1 extends PureComponent {
  constructor(props) {
    super(props);
    const { message, getChosenReply, inputState, id } = this.props;
    const hint = message.get('hint');
    const chosenReply = getChosenReply(id);
    this.handleClick = this.handleClick.bind(this);
    this.newObj = {};

    if (!chosenReply && !inputState) {
      this.props.doInputDisabled();
      this.props.doAttachDisabled();
      this.props.doAttachLocationDisabled();
      this.props.changeInputFieldHint(hint);
    }
  }

  state = {
    imageLink: false
  }

  componentDidMount() {
    const img = new Image();
    img.src = this.newObj.link;

    img.onload = () => {
      this.setState({ imageLink: true });
    };
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
      carouselType1Style,
      isTextAreaBoxShadowEnabled
    } = this.props;

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

    const carouselEl = message.get('quick_replies').map((reply, index) => {
      const values = reply.get('title').split('" ');
      const newValues = values.map(v => v.replace(/"/gi, ''));
      const placeObj = {};

      for (let i = 0; i < newValues.length; i++) {
        this.newObj[newValues[i].substr(0, newValues[i].indexOf('=')).trim()] = newValues[i].substr(newValues[i].indexOf('=') + 1).trim();
        placeObj[newValues[i].substr(0, newValues[i].indexOf('=')).trim()] = newValues[i].substr(newValues[i].indexOf('=') + 1).trim();
      }

      return (
        <Style>
          {`
          .rw-carousel-body {
            font-family: ${carouselType1Style.carouselType1Text1FontFamily};
            font-size: ${carouselType1Style.carouselType1Text1FontSize};
            color: ${carouselType1Style.carouselType1Text1FontColor};
          }

          .rw-carousel-footer {
            font-family: ${carouselType1Style.carouselType1Text2FontFamily};
            font-size: ${carouselType1Style.carouselType1Text2FontSize};
            color: ${carouselType1Style.carouselType1Text2FontColor};
          }
        `}
          <div
            key={index}
            className="rw-carousel"
            onClick={e => this.handleClick(e, reply, placeObj.text1)}
          >
            <div className="rw-carousel-body">
              <ReactMarkdown
                className={'rw-markdown'}
                source={placeObj.text1}
              />
              {this.state.imageLink && <img className="rw-carousal-image" src={placeObj.link} alt="" />}
            </div>
            <div className="rw-carousel-footer">
              <ReactMarkdown
                className={'rw-markdown'}
                source={placeObj.text2}
              />
            </div>
          </div>
        </Style>
      );
    });

    return (
      <div style={{ width: '100%' }}>
        <Message
          message={message}
          chatFontSize={chatFontSize}
          botChatTextColor={botChatTextColor}
          botTextBgColor={botTextBgColor}
          textFontFamily={textFontFamily}
          isTextAreaBoxShadowEnabled={isTextAreaBoxShadowEnabled}
        />
        {isLast && (
          <div className="rw-carousel-box">
            {carouselEl}
          </div>
        )}
      </div>
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
    dispatch(setCarouselType1(id, title));
    dispatch(addUserMessage(title));
    dispatch(emitUserMessage(payload));
    dispatch(doInputEnabled());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CarouselType1);
