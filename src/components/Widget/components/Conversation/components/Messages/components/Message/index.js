import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as marked from 'marked';

import { doInputDisabled, doAttachLocationDisabled, doAttachDisabled, doInputEnabled, changeInputFieldHint } from 'actions';

import { PROP_TYPES } from 'constants';
import './styles.scss';

class Message extends PureComponent {
  getHtml = markdown => marked(markdown);

  render() {
    const {
      chatFontSize,
      clientchatTextColor,
      botChatTextColor,
      clientTextBgColor,
      botTextBgColor,
      textFontFamily,
      isTextAreaBoxShadowEnabled
    } = this.props;

    const str = this.props.message.get('text');
    const n = str.includes('TERMINATE_CHAT');
    if (n) {
      this.props.changeInputFieldHint('Chat Ended...');
      this.props.doInputDisabled();
      this.props.doAttachDisabled();
      this.props.doAttachLocationDisabled();
      return ('');
    }

    const sender = this.props.message.get('sender');
    const text = this.props.message.get('text');
    const customCss = this.props.message.get('customCss') && this.props.message.get('customCss').toJS();

    if (customCss && customCss.style === 'class') {
      customCss.css = customCss.css.replace(/^\./, '');
    }

    return (
      text ?
        <div
          className={sender === 'response' && customCss && customCss.style === 'class' ?
            `rw-response ${customCss.css}` :
            `rw-${sender}`}
          style={{
            cssText: sender === 'response' && customCss && customCss.style === 'custom' ?
              customCss.css :
              undefined,
            backgroundColor: sender === 'client' ? clientTextBgColor : botTextBgColor,
            color: sender === 'client' ? clientchatTextColor : botChatTextColor,
            fontSize: chatFontSize,
            fontFamily: textFontFamily,
            'box-shadow': isTextAreaBoxShadowEnabled ? '0 0px 5px 1px #b5b5b5' : ''
          }}
        >
          <div
            className="rw-message-text"
            dangerouslySetInnerHTML={{ __html: this.getHtml(text) }}
          />
        </div>
        : null
    );
  }
}

Message.propTypes = {
  chatFontSize: PropTypes.string,
  clientchatTextColor: PropTypes.string,
  message: PROP_TYPES.MESSAGE,
  docViewer: PropTypes.bool,
  linkTarget: PropTypes.string
};

Message.defaultTypes = {
  docViewer: false,
  linkTarget: '_blank'
};

const mapStateToProps = state => ({
  linkTarget: state.metadata.get('linkTarget'),
  docViewer: state.behavior.get('docViewer')
});


const mapDispatchToProps = dispatch => ({
  doInputDisabled: () => dispatch(doInputDisabled()),
  doAttachDisabled: () => dispatch(doAttachDisabled()),
  doAttachLocationDisabled: () => dispatch(doAttachLocationDisabled()),
  doInputEnabled: () => dispatch(doInputEnabled()),
  changeInputFieldHint: hint => dispatch(changeInputFieldHint(hint))
});

export default connect(mapStateToProps, mapDispatchToProps)(Message);
