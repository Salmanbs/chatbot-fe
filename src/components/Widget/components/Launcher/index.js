import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { MESSAGES_TYPES } from 'constants';
import { Image, Message, QuickReply, FrequentQuestions } from 'messagesComponents';
import { showTooltip as showTooltipAction } from 'actions';
import closeIcon from 'assets/clear-button-grey.svg';
import Close from 'assets/close_button';
import Style from 'style-it';
import Lancher from 'assets/launcher_button';
import Badge from './components/Badge';

import './style.scss';

const Launcher = ({
  bgColor,
  toggle,
  isChatOpen,
  badge,
  fullScreenMode,
  unreadCount,
  displayUnreadCount,
  showTooltip,
  lastMessage,
  closeTooltip,
  resetCloseButtonColor,
  helperText
}) => {
  const className = ['rw-launcher'];
  if (isChatOpen) className.push('rw-hide-sm');
  if (fullScreenMode) className.push(`rw-full-screen${isChatOpen ? '  rw-hide' : ''}`);


  const getComponentToRender = (message) => {
    const ComponentToRender = (() => {
      switch (message.get('type')) {
        case MESSAGES_TYPES.TEXT: {
          return Message;
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
        default:
          return null;
      }
    })();
    return <ComponentToRender id={-1} params={{}} message={message} isLast />;
  };


  const renderToolTip = () => (
    <div className="rw-tooltip-body">
      <div className="rw-tooltip-close" >
        <button onClick={(e) => { e.stopPropagation(); closeTooltip(); }}>
          <img
            src={closeIcon}
            alt="close"
          />
        </button>
      </div>
      <div className="rw-tooltip-response">
        {getComponentToRender(lastMessage)}
      </div>
      <div className="rw-tooltip-decoration" />
    </div>
  );

  const renderOpenLauncherImage = () => (
    <div className="rw-open-launcher__container">
      {unreadCount > 0 && displayUnreadCount && (
        <div className="rw-unread-count-pastille">{unreadCount}</div>
      )}
      <Lancher fillColor={resetCloseButtonColor} size="34px" />
      {showTooltip && lastMessage.get('sender') === 'response' && renderToolTip()}
      {!isChatOpen && helperText.isHelperTextNeeded ? (
        helperText.outerBoxNeeded ?
          <Style>
            {`
            .rw-helperBox {
              display: flex;
              position: fixed;
              width: max-content;
              opacity: 0;
              right: 72px;
              padding: 8px;
              margin-bottom: -8px;
              border-radius: 5px;
              z-index: 9999;
              box-shadow: 0 0px 10px 1px #b5b5b5;
              background-color: ${helperText.bgColor};
              border: 1px solid ${helperText.borderColor};
              -webkit-animation-delay: ${helperText.helperTextInterval};
              -moz-animation-delay: ${helperText.helperTextInterval};
              animation-delay: ${helperText.helperTextInterval};
            }

            .rw-helperBox:before {
              content: " ";
              display: ${helperText.boxArrowNeeded ? 'flex' : 'none'};
              height: 0px;
              position: absolute;
              width: 8px;
              height: 8px;
              right: -20px;
              background-color: ${helperText.bgColor};
              border-right: 1px solid ${helperText.borderColor};
              border-bottom: 1px solid ${helperText.borderColor};
              transform: rotate(-45deg) translate(-12px,-9px);
            }

            .rw-helperText {
              -webkit-animation-duration: ${helperText.shakeInterval};
              -moz-animation-duration: ${helperText.shakeInterval};
              animation-duration: ${helperText.shakeInterval};
              animation-timing-function: ease;
              animation-iteration-count: infinite;
              transform-origin: 50% 50%;
              margin: 0px;
              padding: 0 10px;
              font-family: ${helperText.fontFamily};
              font-size: ${helperText.fontSize};
              color: ${helperText.fontColor};
              font-weight: ${helperText.textBold ? 'bold' : ''};
              font-style: ${helperText.textItalic ? 'italic' : ''};
            }
          `}
            <div className="rw-helperBox">
              <span className="rw-helperText">
                {helperText.textValue}
              </span>
            </div>
          </Style> :
          <Style>
            {`
            .rw-helperNoBox {
              display: flex;
              position: fixed;
              right: 70px;
              opacity: 0;
              width: max-content;
              -webkit-animation-delay: ${helperText.helperTextInterval};
              -moz-animation-delay: ${helperText.helperTextInterval};
              animation-delay: ${helperText.helperTextInterval};
            }
            .rw-helperTextOnly {
              -webkit-animation-duration: ${helperText.shakeInterval};
              -moz-animation-duration: ${helperText.shakeInterval};
              animation-duration: ${helperText.shakeInterval};
              animation-timing-function: ease;
              animation-iteration-count: infinite;
              transform-origin: 50% 50%;
              font-family: ${helperText.fontFamily};
              font-size: ${helperText.fontSize};
              color: ${helperText.fontColor};
              font-weight: ${helperText.textBold ? 'bold' : ''};
              font-style: ${helperText.textItalic ? 'italic' : ''};
            }
          `}
            <div className="rw-helperNoBox">
              <span className="rw-helperTextOnly">
                {helperText.textValue}
              </span>
            </div>
          </Style>
      ) : (
        null
      )}
    </div>
  );

  return (
    <Fragment>
      <button type="button" className={className.join(' ')} onClick={toggle} style={{ backgroundColor: bgColor }}>
        <Badge badge={badge} />
        {isChatOpen ? (
          <Close classes="rw-close-launcher rw-default" fillColor={resetCloseButtonColor} size="20px" />
        ) : (
          renderOpenLauncherImage()
        )}
      </button>
    </Fragment>
  );
};

Launcher.propTypes = {
  bgColor: PropTypes.color,
  toggle: PropTypes.func,
  isChatOpen: PropTypes.bool,
  badge: PropTypes.number,
  fullScreenMode: PropTypes.bool,
  unreadCount: PropTypes.number,
  displayUnreadCount: PropTypes.bool,
  showTooltip: PropTypes.bool,
  lastMessage: ImmutablePropTypes.map
};

const mapStateToProps = state => ({
  lastMessage: (state.messages && state.messages.get(-1)) || new Map(),
  unreadCount: state.behavior.get('unreadCount') || 0,
  showTooltip: state.metadata.get('showTooltip'),
  linkTarget: state.metadata.get('linkTarget')
});

const mapDispatchToProps = dispatch => ({
  closeTooltip: () => dispatch(showTooltipAction(false))
});

export default connect(mapStateToProps, mapDispatchToProps)(Launcher);
