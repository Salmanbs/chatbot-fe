import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { addUserMessage, emitUserMessage, setQuickReply, setFAQReply, doInputDisabled, doInputEnabled, changeInputFieldHint } from 'actions';
import Style from 'style-it';
import Message from '../Message/index';

import './styles.scss';

class FrequentQuestions extends PureComponent {
  constructor(props) {
    super(props);
    const { message, getChosenReply, inputState, id } = this.props;
    const hint = message.get('hint');
    const chosenReply = getChosenReply(id);
    this.handleClick = this.handleClick.bind(this);

    if (!chosenReply && !inputState) {
      this.props.doInputDisabled();
      this.props.changeInputFieldHint(hint);
    }
  }

  handleClick(reply) {
    const { chooseReply, id } = this.props;

    const payload = reply.get('payload');
    const title = reply.get('title');
    chooseReply(payload, title, id);
    this.props.doInputDisabled();
    this.props.changeInputFieldHint('');
  }

  render() {
    const {
      message,
      getChosenReply,
      isLast,
      id,
      botChatTextColor,
      chatFontSize,
      faquiBoundaryColor,
      faquiHeaderBgColor,
      faquiHeaderHeight,
      faquiHeaderFontSize,
      faquiHeaderTextColor,
      faquiBodyTextColor,
      faquiMouseOverBodyBgColor,
      faquiMouseOverBodyTextColor,
      faquiScrollStickColor,
      faquiRowHeight,
      faquiBgColor,
      faquiRowSeparateColor,
      botTextBgColor,
      textFontFamily,
      isTextAreaBoxShadowEnabled
    } = this.props;

    const text = message.get('text');
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

    return (
      <div className="rw-faqs-wrap" style={{ border: `1px solid ${faquiBoundaryColor}` }}>
        {isLast && (
          <div className="rw-faqs">
            <div
              className="rw-faqs-heading"
              style={{
                backgroundColor: faquiHeaderBgColor,
                height: faquiHeaderHeight,
                fontSize: faquiHeaderFontSize,
                fontFamily: textFontFamily,
                color: faquiHeaderTextColor,
                borderBottom: `1px solid ${faquiBoundaryColor}`
              }}
            >
              <ReactMarkdown
                className={'rw-markdown'}
                source={text}
              />
            </div>
            <Style>
              {`
                .rw-faqs-body {
                  overflow: auto;
                  height: 85%;
                  scrollbar-width: thin;
                }
                .rw-faqs-body::-webkit-scrollbar-thumb {
                  border-radius: 10px;
                  background: ${faquiScrollStickColor};
                }
              `}
              <div
                className="rw-faqs-body"
                style={{
                  height: `calc(100% - ${faquiHeaderHeight})`
                }}
              >
                {message.get('quick_replies').map((reply, index) => (
                  <Style>
                    {`
                    .rw-faq {
                      position: relative;
                      z-index : 1;
                      display: -webkit-box;
                      display: -webkit-flex;
                      display: -moz-box;
                      display: -ms-flexbox;
                      display: flex;
                      -webkit-flex-align: center;
                      -ms-flex-align: center;
                      -webkit-align-items: center;
                      align-items: center;
                      color: ${faquiBodyTextColor};
                      padding: 4px 8px;
                      min-height: ${faquiRowHeight};
                      font-family: ${textFontFamily};
                      cursor: pointer;
                      font-size: ${chatFontSize};
                      border-collapse: collapse;
                      margin-top: -1px;
                      background-color: ${faquiBgColor};
                    }
                    .rw-faq:not(:last-child):before {
                      content: "";
                      position: absolute;
                      left: 2%;
                      bottom: 1px;
                      height: 5px;
                      width: 96%;
                      border-bottom: 1px solid ${faquiRowSeparateColor};
                    }
                    .rw-faq:hover {
                      background-color: ${faquiMouseOverBodyBgColor};
                      color: ${faquiMouseOverBodyTextColor};
                      margin-top: -2px;
                    }
                    .rw-faq:hover:before {
                      content: "";
                      position: absolute;
                      left: 2%;
                      bottom: 0;
                      height: 5px;
                      width: 96%;
                      border-top: 1px solid ${faquiMouseOverBodyBgColor};
                      border-bottom: 1px solid ${faquiMouseOverBodyBgColor};
                    }
                  `}
                    <div
                      key={index}
                      className="rw-faq"
                      onClick={(e) => { e.stopPropagation(); this.handleClick(reply); }}
                    >
                      <ReactMarkdown
                        className={'rw-markdown'}
                        source={reply.get('title')}
                      />
                    </div>
                  </Style>
                ))}
              </div>
            </Style>
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
  doInputEnabled: () => dispatch(doInputEnabled()),
  changeInputFieldHint: hint => dispatch(changeInputFieldHint(hint)),
  chooseReply: (payload, title, id) => {
    dispatch(setQuickReply(id, title));
    dispatch(setFAQReply(id, title));
    dispatch(addUserMessage(title));
    dispatch(emitUserMessage(payload));
    dispatch(doInputEnabled());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FrequentQuestions);
