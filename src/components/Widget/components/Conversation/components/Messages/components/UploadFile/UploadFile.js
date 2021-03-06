import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ImageUploader from 'react-images-upload';
import { addUserMessage, emitUserMessage, setQuickReply, doInputDisabled, doInputEnabled, changeInputFieldHint } from 'actions';
import Message from '../Message/index';

import './styles.scss';

class UploadFile extends PureComponent {
  constructor(props) {
    super(props);
    const { message, getChosenReply, inputState, id } = this.props;

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      pictures: []
    };

    const hint = message.get('hint');
    const chosenReply = getChosenReply(id);
    if (!chosenReply && !inputState) {
      this.props.doInputDisabled();
      this.props.changeInputFieldHint(hint);
    }
  }

  handleClick(picture) {
    const { chooseReply, id } = this.props;

    this.setState({
      pictures: this.state.pictures.concat(picture)
    });

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
      botTextBgColor,
      textFontFamily,
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

    return (
      <React.Fragment>
        <Message
          message={message}
          chatFontSize={chatFontSize}
          botChatTextColor={botChatTextColor}
          botTextBgColor={botTextBgColor}
          textFontFamily={textFontFamily}
          isTextAreaBoxShadowEnabled={isTextAreaBoxShadowEnabled}
        />
        {isLast && (
          <div style={{ width: '100%' }}>
            <ImageUploader
              withIcon={false}
              withPreview
              buttonText="Choose images"
              onChange={this.handleClick}
              imgExtension={['.jpg', '.gif', '.png', '.gif']}
              maxFileSize={5242880}
            />
          </div>
        )}
      </React.Fragment>
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
    dispatch(doInputEnabled());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile);
