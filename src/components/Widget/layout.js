import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Conversation from './components/Conversation';
import Launcher from './components/Launcher';
import './style.scss';

const WidgetLayout = (props) => {
  const classes = props.embedded ? ['rw-widget-embedded'] : ['rw-widget-container'];
  if (props.fullScreenMode) {
    classes.push('rw-full-screen');
  }
  const showCloseButton =
    props.showCloseButton !== undefined ? props.showCloseButton : !props.embedded;
  const isVisible = props.isChatVisible && !(props.hideWhenNotConnected && !props.connected);
  const chatShowing = props.isChatOpen || props.embedded;

  if (chatShowing && !props.embedded) {
    classes.push('rw-chat-open');
  }

  return isVisible ? (
    <div className={classes.join(' ')}>
      {chatShowing && (
        <Conversation
          title={props.title}
          bgColor={props.bgColor}
          botWindowSIze={props.botWindowSIze}
          botWindowScrollStickColor={props.botWindowScrollStickColor}
          chatFontSize={props.chatFontSize}
          clientchatTextColor={props.clientchatTextColor}
          clientTextBgColor={props.clientTextBgColor}
          botButtonBorderColor={props.botButtonBorderColor}
          botButtonTextColor={props.botButtonTextColor}
          botButtonBgColor={props.botButtonBgColor}
          botButtonBorderColorHover={props.botButtonBorderColorHover}
          botButtonTextColorHover={props.botButtonTextColorHover}
          botButtonBgColorHover={props.botButtonBgColorHover}
          botButtonAlignment={props.botButtonAlignment}
          titleColor={props.titleColor}
          titleFontSize={props.titleFontSize}
          subTitleColor={props.subTitleColor}
          subTitleFontSize={props.subTitleFontSize}
          botChatTextColor={props.botChatTextColor}
          sendButtonColor={props.sendButtonColor}
          resetCloseButtonColor={props.resetCloseButtonColor}
          minWidthOfButton={props.minWidthOfButton}
          minHeightOfButton={props.minHeightOfButton}
          horizontalSpaceBtwButton={props.horizontalSpaceBtwButton}
          verticalSpaceBtwButton={props.verticalSpaceBtwButton}
          faquiBoundaryColor={props.faquiBoundaryColor}
          faquiHeaderBgColor={props.faquiHeaderBgColor}
          faquiHeaderHeight={props.faquiHeaderHeight}
          faquiHeaderFontSize={props.faquiHeaderFontSize}
          faquiHeaderTextColor={props.faquiHeaderTextColor}
          faquiBodyTextColor={props.faquiBodyTextColor}
          faquiMouseOverBodyBgColor={props.faquiMouseOverBodyBgColor}
          faquiMouseOverBodyTextColor={props.faquiMouseOverBodyTextColor}
          faquiScrollStickColor={props.faquiScrollStickColor}
          faquiRowHeight={props.faquiRowHeight}
          faquiBgColor={props.faquiBgColor}
          faquiRowSeparateColor={props.faquiRowSeparateColor}
          chatbotBgColor={props.chatbotBgColor}
          botTextBgColor={props.botTextBgColor}
          userTypeWindowBgColor={props.userTypeWindowBgColor}
          placeholderTextColor={props.placeholderTextColor}
          inputCaretColor={props.inputCaretColor}
          subtitle={props.subtitle}
          sendMessage={props.onSendMessage}
          profileAvatar={props.profileAvatar}
          titleAvatar={props.titleAvatar}
          toggleChat={props.toggleChat}
          isChatOpen={props.isChatOpen}
          toggleFullScreen={props.toggleFullScreen}
          fullScreenMode={props.fullScreenMode}
          disabledInput={props.disabledInput}
          params={props.params}
          showFullScreenButton={props.showFullScreenButton}
          {...{ showCloseButton }}
          connected={props.connected}
          connectingText={props.connectingText}
          closeImage={props.closeImage}
          customComponent={props.customComponent}
          showMessageDate={props.showMessageDate}
          resetChat={props.resetChat}
          isFooterEnabled={props.isFooterEnabled}
          titleFontFamily={props.titleFontFamily}
          subTitleFontFamily={props.subTitleFontFamily}
          textFontFamily={props.textFontFamily}
          spinnerPathColor={props.spinnerPathColor}
          spinnerRunnerColor={props.spinnerRunnerColor}
          titleBoldNeeded={props.titleBoldNeeded}
          subtitleItalicNeeded={props.subtitleItalicNeeded}
        />
      )}
      {!props.embedded && (
        <Launcher
          bgColor={props.bgColor}
          toggle={props.toggleChat}
          isChatOpen={props.isChatOpen}
          badge={props.badge}
          fullScreenMode={props.fullScreenMode}
          openLauncherImage={props.openLauncherImage}
          closeImage={props.closeImage}
          displayUnreadCount={props.displayUnreadCount}
          tooltipPayload={props.tooltipPayload}
          resetCloseButtonColor={props.resetCloseButtonColor}
          helperText={props.helperText}
        />
      )}
    </div>
  ) : null;
};

const mapStateToProps = state => ({
  isChatVisible: state.behavior.get('isChatVisible'),
  isChatOpen: state.behavior.get('isChatOpen'),
  disabledInput: state.behavior.get('disabledInput'),
  connected: state.behavior.get('connected'),
  connectingText: state.behavior.get('connectingText')
});

WidgetLayout.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  bgColor: PropTypes.color,
  botWindowSIze: PropTypes.string,
  chatFontSize: PropTypes.string,
  clientchatTextColor: PropTypes.color,
  botButtonBorderColor: PropTypes.color,
  botButtonTextColor: PropTypes.string,
  onSendMessage: PropTypes.func,
  toggleChat: PropTypes.func,
  toggleFullScreen: PropTypes.func,
  isChatOpen: PropTypes.bool,
  isChatVisible: PropTypes.bool,
  profileAvatar: PropTypes.string,
  showCloseButton: PropTypes.bool,
  showFullScreenButton: PropTypes.bool,
  hideWhenNotConnected: PropTypes.bool,
  disabledInput: PropTypes.bool,
  fullScreenMode: PropTypes.bool,
  badge: PropTypes.number,
  embedded: PropTypes.bool,
  params: PropTypes.object,
  connected: PropTypes.bool,
  connectingText: PropTypes.string,
  openLauncherImage: PropTypes.string,
  closeImage: PropTypes.string,
  customComponent: PropTypes.func,
  displayUnreadCount: PropTypes.bool,
  showMessageDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  tooltipPayload: PropTypes.string
};

export default connect(mapStateToProps)(WidgetLayout);
