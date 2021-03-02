import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import fullscreen from 'assets/fullscreen_button.svg';
import fullscreenExit from 'assets/fullscreen_exit_button.svg';
import Reset from 'assets/reset_button';
import Close from 'assets/close_button';
import { changeInputFieldHint } from 'actions';
import './style.scss';

const Header = ({
  bgColor,
  title,
  subtitle,
  fullScreenMode,
  toggleFullScreen,
  toggleChat,
  showCloseButton,
  showFullScreenButton,
  connected,
  connectingText,
  titleAvatar,
  titleColor,
  titleFontSize,
  subTitleColor,
  subTitleFontSize,
  resetCloseButtonColor,
  resetChat,
  isReset,
  titleFontFamily,
  subTitleFontFamily,
  changeInputFieldHint,
  titleBoldNeeded,
  subtitleItalicNeeded
}) => {
  const onReset = () => {
    resetChat();
    changeInputFieldHint('');
  };

  return (
    <div className="rw-header-and-loading">
      <div className={`rw-header ${subtitle ? 'rw-with-subtitle' : ''}`} style={{ backgroundColor: bgColor }}>
        {
          titleAvatar && (
            <img src={titleAvatar} className="rw-avatar" alt="chat avatar" />
          )
        }
        <div className="rw-header-buttons">
          <button disabled={!connected} className="rw-reset-button" onClick={() => onReset()} style={{ backgroundColor: bgColor }}>
            <Reset fillColor={resetCloseButtonColor} />
          </button>
          {
            showFullScreenButton &&
            <button className="rw-toggle-fullscreen-button" onClick={toggleFullScreen}>
              <img
                className={`rw-toggle-fullscreen ${fullScreenMode ? 'rw-fullScreenExitImage' : 'rw-fullScreenImage'}`}
                src={fullScreenMode ? fullscreenExit : fullscreen}
                alt="toggle fullscreen"
              />
            </button>
          }
          {
            showCloseButton &&
            <button className="rw-close-button" onClick={toggleChat} style={{ backgroundColor: bgColor }}>
              <Close fillColor={resetCloseButtonColor} size="20px" />
            </button>
          }
        </div>
        <div
          className={`rw-title ${titleAvatar && 'rw-with-avatar'}`}
          style={{
            color: titleColor,
            fontFamily: titleFontFamily,
            fontSize: titleFontSize,
            fontWeight: titleBoldNeeded ? 'bold' : ''
          }}
        >
          {title}
        </div>
        {subtitle &&
          <span
            className={titleAvatar && 'rw-with-avatar'}
            style={{
              color: subTitleColor,
              fontSize: subTitleFontSize,
              fontFamily: subTitleFontFamily,
              fontStyle: subtitleItalicNeeded ? 'italic' : ''
            }}
          >
            {subtitle}
          </span>
        }
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  changeInputFieldHint: hint => dispatch(changeInputFieldHint(hint))
});

Header.propTypes = {
  bgColor: PropTypes.color,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  fullScreenMode: PropTypes.bool,
  toggleFullScreen: PropTypes.func,
  toggleChat: PropTypes.func,
  showCloseButton: PropTypes.bool,
  showFullScreenButton: PropTypes.bool,
  connected: PropTypes.bool,
  connectingText: PropTypes.string,
  closeImage: PropTypes.string,
  titleAvatar: PropTypes.string
};

export default connect(null, mapDispatchToProps)(Header);
