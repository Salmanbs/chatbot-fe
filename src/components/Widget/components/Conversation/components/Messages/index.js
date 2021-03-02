import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import Style from 'style-it';

import { MESSAGES_TYPES } from 'constants';
import { Video, Image, Message, Carousel, QuickReply, FrequentQuestions } from 'messagesComponents';

import './styles.scss';

const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

const formatDate = (date) => {
  const dateToFormat = new Date(date);
  const showDate = isToday(dateToFormat) ? '' : `${dateToFormat.toLocaleDateString()} `;
  return `${showDate}${dateToFormat.toLocaleTimeString('en-US', { timeStyle: 'short' })}`;
};

const scrollToBottom = () => {
  const messagesDiv = document.getElementById('rw-messages');
  if (messagesDiv) {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
};

class Messages extends Component {
  componentDidMount() {
    scrollToBottom();
  }

  componentDidUpdate() {
    scrollToBottom();
  }

  getComponentToRender = (message, index, isLast) => {
    const {
      bgColor,
      botButtonBorderColor,
      botButtonTextColor,
      chatFontSize,
      clientchatTextColor,
      params,
      botChatTextColor,
      clientTextBgColor,
      botButtonBgColor,
      botButtonBorderColorHover,
      botButtonTextColorHover,
      botButtonBgColorHover,
      botButtonAlignment,
      minWidthOfButton,
      minHeightOfButton,
      horizontalSpaceBtwButton,
      verticalSpaceBtwButton,
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
      spinnerPathColor,
      spinnerRunnerColor
    } = this.props;
    const ComponentToRender = (() => {
      switch (message.get('type')) {
        case MESSAGES_TYPES.TEXT: {
          return Message;
        }
        case MESSAGES_TYPES.CAROUSEL: {
          return Carousel;
        }
        case MESSAGES_TYPES.VIDREPLY.VIDEO: {
          return Video;
        }
        case MESSAGES_TYPES.IMGREPLY.IMAGE: {
          return Image;
        }
        case MESSAGES_TYPES.QUICK_REPLY: {
          return QuickReply;
        }
        case MESSAGES_TYPES.FAQ_REPLY: {
          return FrequentQuestions;
        }
        case MESSAGES_TYPES.CUSTOM_COMPONENT:
          return connect(
            store => ({ store }),
            dispatch => ({ dispatch })
          )(this.props.customComponent);
        default:
          return null;
      }
    })();
    if (message.get('type') === 'component') {
      return (
        <ComponentToRender
          id={index} {...message.get('props')}
          isLast={isLast}
          bgColor={bgColor}
          chatFontSize={chatFontSize}
          clientchatTextColor={clientchatTextColor}
          clientTextBgColor={clientTextBgColor}
          botButtonBorderColor={botButtonBorderColor}
          botButtonTextColor={botButtonTextColor}
          botChatTextColor={botChatTextColor}
          botButtonBgColor={botButtonBgColor}
          botButtonBorderColorHover={botButtonBorderColorHover}
          botButtonTextColorHover={botButtonTextColorHover}
          botButtonBgColorHover={botButtonBgColorHover}
          botButtonAlignment={botButtonAlignment}
          minWidthOfButton={minWidthOfButton}
          minHeightOfButton={minHeightOfButton}
          horizontalSpaceBtwButton={horizontalSpaceBtwButton}
          verticalSpaceBtwButton={verticalSpaceBtwButton}
          faquiBoundaryColor={faquiBoundaryColor}
          faquiHeaderBgColor={faquiHeaderBgColor}
          faquiHeaderHeight={faquiHeaderHeight}
          faquiHeaderFontSize={faquiHeaderFontSize}
          faquiHeaderTextColor={faquiHeaderTextColor}
          faquiBodyTextColor={faquiBodyTextColor}
          faquiMouseOverBodyBgColor={faquiMouseOverBodyBgColor}
          faquiMouseOverBodyTextColor={faquiMouseOverBodyTextColor}
          faquiScrollStickColor={faquiScrollStickColor}
          faquiRowHeight={faquiRowHeight}
          faquiBgColor={faquiBgColor}
          faquiRowSeparateColor={faquiRowSeparateColor}
          botTextBgColor={botTextBgColor}
          textFontFamily={textFontFamily}
        />);
    }
    return (
      <ComponentToRender
        id={index}
        params={params}
        message={message}
        isLast={isLast}
        bgColor={bgColor}
        chatFontSize={chatFontSize}
        clientchatTextColor={clientchatTextColor}
        clientTextBgColor={clientTextBgColor}
        botButtonBorderColor={botButtonBorderColor}
        botButtonTextColor={botButtonTextColor}
        botChatTextColor={botChatTextColor}
        botButtonBgColor={botButtonBgColor}
        botButtonBorderColorHover={botButtonBorderColorHover}
        botButtonTextColorHover={botButtonTextColorHover}
        botButtonBgColorHover={botButtonBgColorHover}
        botButtonAlignment={botButtonAlignment}
        minWidthOfButton={minWidthOfButton}
        minHeightOfButton={minHeightOfButton}
        horizontalSpaceBtwButton={horizontalSpaceBtwButton}
        verticalSpaceBtwButton={verticalSpaceBtwButton}
        faquiBoundaryColor={faquiBoundaryColor}
        faquiHeaderBgColor={faquiHeaderBgColor}
        faquiHeaderHeight={faquiHeaderHeight}
        faquiHeaderFontSize={faquiHeaderFontSize}
        faquiHeaderTextColor={faquiHeaderTextColor}
        faquiBodyTextColor={faquiBodyTextColor}
        faquiMouseOverBodyBgColor={faquiMouseOverBodyBgColor}
        faquiMouseOverBodyTextColor={faquiMouseOverBodyTextColor}
        faquiScrollStickColor={faquiScrollStickColor}
        faquiRowHeight={faquiRowHeight}
        faquiBgColor={faquiBgColor}
        faquiRowSeparateColor={faquiRowSeparateColor}
        botTextBgColor={botTextBgColor}
        textFontFamily={textFontFamily}
      />);
  }

  render() {
    const {
      connected,
      chatFontSize,
      displayTypingIndication,
      profileAvatar,
      botWindowScrollStickColor,
      chatbotBgColor,
      botTextBgColor,
      botChatTextColor,
      bgColor,
      spinnerPathColor,
      spinnerRunnerColor
    } = this.props;

    const renderMessages = () => {
      const {
        messages,
        showMessageDate,
        inputTextFieldHint
      } = this.props;

      if (messages.isEmpty()) return null;

      const groups = [];
      let group = null;

      const dateRenderer = typeof showMessageDate === 'function' ? showMessageDate :
        showMessageDate === true ? formatDate : null;

      const renderMessageDate = (message) => {
        const timestamp = message.get('timestamp');

        if (!dateRenderer || !timestamp) return null;
        const dateToRender = dateRenderer(message.get('timestamp', message));
        return dateToRender
          ? <span className="rw-message-date">{dateRenderer(message.get('timestamp'), message)}</span>
          : null;
      };

      const renderMessage = (message, index) => (
        <div className={`rw-message ${profileAvatar && 'rw-with-avatar'}`} key={index}>
          {
            profileAvatar &&
            message.get('showAvatar') &&
            <img src={profileAvatar} className="rw-avatar" alt="profile" />
          }
          {this.getComponentToRender(message, index, index === messages.size - 1)}
          {renderMessageDate(message)}
        </div>
      );

      messages.forEach((msg, index) => {
        if (group === null || group.from !== msg.get('sender')) {
          if (group !== null) groups.push(group);

          group = {
            from: msg.get('sender'),
            messages: []
          };
        }

        group.messages.push(renderMessage(msg, index));
      });

      groups.push(group); // finally push last group of messages.

      return groups.map((g, index) =>
        // here put logic to decide placeholder
        (
          <div className={`rw-group-message rw-from-${g.from}`} key={`group_${index}`} style={{ fontSize: chatFontSize }}>
            {g.messages}
          </div>
        )
      );
    };

    return (
      <Style>
        {`
          .rw-messages-container::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background: ${botWindowScrollStickColor};
          }
          .loader:empty {
            position: absolute;
            top: calc(50% - 3em);
            left: calc(50% - 1em);
            width: 30px;
            height: 30px;
            border: 4px solid ${spinnerPathColor};
            border-left: 4px solid ${spinnerRunnerColor};
            border-radius: 50%;
            animation: load8 6.1s infinite linear;
          }
        `}
        <div
          id="rw-messages"
          className="rw-messages-container"
          style={{
            fontSize: chatFontSize,
            backgroundColor: chatbotBgColor
          }}
        >
          { !connected ?
            <div className="loader" /> :
            <Fragment>
              {renderMessages()}
              {displayTypingIndication && (
                <div className={`rw-message rw-typing-indication ${profileAvatar && 'rw-with-avatar'}`}>
                  {
                    profileAvatar &&
                    <img src={profileAvatar} className="rw-avatar" alt="profile" />
                  }
                  <div
                    className="rw-response"
                    style={{
                      color: botChatTextColor,
                      backgroundColor: botTextBgColor
                    }}
                  >
                    <div id="wave">
                      <span className="rw-dot" style={{ background: botChatTextColor }} />
                      <span className="rw-dot" style={{ background: botChatTextColor }} />
                      <span className="rw-dot" style={{ background: botChatTextColor }} />
                    </div>
                  </div>
                </div>
              )}
            </Fragment>
          }
        </div>
      </Style>
    );
  }
}

Messages.propTypes = {
  bgColor: PropTypes.color,
  chatFontSize: PropTypes.string,
  clientchatTextColor: PropTypes.string,
  botButtonBorderColor: PropTypes.color,
  botButtonTextColor: PropTypes.color,
  messages: ImmutablePropTypes.listOf(ImmutablePropTypes.map),
  profileAvatar: PropTypes.string,
  customComponent: PropTypes.func,
  showMessageDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  displayTypingIndication: PropTypes.bool
};

Message.defaultTypes = {
  displayTypingIndication: false
};

export default connect(store => ({
  messages: store.messages,
  displayTypingIndication: store.behavior.get('messageDelayed'),
  inputTextFieldHint: store.inputTextFieldHint
}))(Messages);
