import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as marked from 'marked';

import { doInputDisabled, doInputEnabled, changeInputFieldHint } from 'actions';

import { PROP_TYPES } from 'constants';
import DocViewer from '../docViewer';
import './styles.scss';

class Message extends PureComponent {
  getHtml = markdown => marked(markdown);

  render() {
    const {
      chatFontSize,
      clientchatTextColor,
      docViewer,
      linkTarget,
      botChatTextColor,
      clientTextBgColor,
      botTextBgColor,
      textFontFamily
    } = this.props;

    const str = this.props.message.get('text');
    const n = str.includes('TERMINATE_CHAT');
    if (n) {
      this.props.changeInputFieldHint('Chat Ended...');

      // this.props.toggleInputDisabled()
      this.props.doInputDisabled();
      // this.props.message.set('disabledInput',false)
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
            fontFamily: textFontFamily
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
  doInputEnabled: () => dispatch(doInputEnabled()),
  changeInputFieldHint: hint => dispatch(changeInputFieldHint(hint))
});

export default connect(mapStateToProps, mapDispatchToProps)(Message);
