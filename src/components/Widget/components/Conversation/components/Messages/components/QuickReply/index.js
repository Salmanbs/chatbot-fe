import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { addUserMessage, emitUserMessage, setQuickReply, doInputDisabled, doInputEnabled, changeInputFieldHint } from 'actions';
import Message from '../Message/index';

import './styles.scss';

class QuickReply extends PureComponent {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    const {
      message,
      getChosenReply,
      inputState,
      id
    } = this.props;

    const hint = message.get('hint');
    const chosenReply = getChosenReply(id);
    if (!chosenReply && !inputState) {
      this.props.doInputDisabled();
      this.props.changeInputFieldHint(hint);
    }
  }

  handleClick(reply) {
    const {
      chooseReply,
      id
    } = this.props;
    console.log(' ++++++++++++++++  QR handleClick ---> ')
    const payload = reply.get('payload');
    const title = reply.get('title');
    chooseReply(payload, title, id);
    this.props.doInputDisabled();
    this.props.changeInputFieldHint('');
  }

  handleMouseEnter(e) {
    const el = e.target;
    el.style.backgroundColor = this.props.botButtonBgColorHover;
    el.style.color = this.props.botButtonTextColorHover;
    el.style.borderColor = this.props.botButtonBorderColorHover;
  }

  handleMouseLeave(e) {
    const el = e.target;
    el.style.backgroundColor = this.props.botButtonBgColor;
    el.style.color = this.props.botButtonTextColor;
    el.style.borderColor = this.props.botButtonBorderColor;
  }

  render() {
    const {
      message,
      getChosenReply,
      isLast,
      id,
      linkTarget,
      botChatTextColor,
      chatFontSize,
      botButtonBorderColor,
      botButtonTextColor,
      botButtonBgColor,
      botButtonAlignment,
      minWidthOfButton,
      minHeightOfButton,
      horizontalSpaceBtwButton,
      verticalSpaceBtwButton,
      botTextBgColor,
      textFontFamily
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

        />);
    }
    return (
      <div>
        <Message
          message={message}
          chatFontSize={chatFontSize}
          botChatTextColor={botChatTextColor}
          botTextBgColor={botTextBgColor}
          textFontFamily={textFontFamily}
        />
        {isLast && (
          <div
            className="rw-replies"
            style={{
              justifyContent: botButtonAlignment
            }}
          >
            {message.get('quick_replies').map((reply, index) => {
              if (reply.get('type') === 'web_url') {
                return (
                  <a
                    key={index}
                    href={reply.get('url')}
                    target={linkTarget || '_blank'}
                    rel="noopener noreferrer"
                    className={'rw-reply'}
                    style={{
                      borderColor: botButtonBorderColor,
                      color: botButtonTextColor,
                      backgroundColor: botButtonBgColor,
                      fontSize: chatFontSize,
                      minHeight: minHeightOfButton,
                      minWidth: minWidthOfButton,
                      marginTop: verticalSpaceBtwButton,
                      marginRight: horizontalSpaceBtwButton

                    }}
                    onMouseEnter={e => this.handleMouseEnter(e)}
                    onMouseLeave={e => this.handleMouseLeave(e)}
                  >
                    {reply.get('title')}
                  </a>
                );
              }
              return (
                <div
                  key={index}
                  className={'rw-reply'}
                  style={{
                    borderColor: botButtonBorderColor,
                    color: botButtonTextColor,
                    backgroundColor: botButtonBgColor,
                    fontSize: chatFontSize,
                    fontFamily: textFontFamily,
                    minHeight: minHeightOfButton,
                    minWidth: minWidthOfButton,
                    marginTop: verticalSpaceBtwButton,
                    marginRight: horizontalSpaceBtwButton
                  }}
                  onClick={(e) => { e.stopPropagation(); this.handleClick(reply); }}
                  onMouseEnter={e => this.handleMouseEnter(e)}
                  onMouseLeave={e => this.handleMouseLeave(e)}
                >
                  {reply.get('title')}
                </div>
              );
            })}
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
    dispatch(addUserMessage(title));
    dispatch(emitUserMessage(payload));
    // Uncomment below to enable text once the use click on reply
    // dispatch(toggleInputDisabled());
    dispatch(doInputEnabled());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(QuickReply);
