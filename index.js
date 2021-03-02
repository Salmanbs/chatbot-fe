import React from 'react';
import ReactDOM from 'react-dom';
import { Widget, toggleChat, openChat, closeChat, showChat, hideChat, isOpen, isVisible, send, toggleInputDisabled } from './index_for_react_app';
// import args from './chatHeader';

const plugin = {
  init: (args) => {
    ReactDOM.render(
      <Widget
        protocol={args.protocol}
        socketUrl={args.socketUrl}
        socketPath={args.socketPath}
        protocolOptions={args.protocolOptions}
        initPayload={args.initPayload}
        title={args.title}
        bgColor={args.bgColor}
        botButtonBorderColor={args.botButtonBorderColor}
        botButtonTextColor={args.botButtonTextColor}
        botButtonBgColor={args.botButtonBgColor}
        botButtonBorderColorHover={args.botButtonBorderColorHover}
        botButtonTextColorHover={args.botButtonTextColorHover}
        botButtonBgColorHover={args.botButtonBgColorHover}
        botButtonAlignment={args.botButtonAlignment}
        botWindowSIze={args.botWindowSIze}
        botWindowScrollStickColor={args.botWindowScrollStickColor}
        chatFontSize={args.chatFontSize}
        clientchatTextColor={args.clientchatTextColor}
        clientTextBgColor={args.clientTextBgColor}
        titleColor={args.titleColor}
        titleFontSize={args.titleFontSize}
        subTitleColor={args.subTitleColor}
        subTitleFontSize={args.subTitleFontSize}
        botChatTextColor={args.botChatTextColor}
        sendButtonColor={args.sendButtonColor}
        botWindowOpenTime={args.botWindowOpenTime}
        resetCloseButtonColor={args.resetCloseButtonColor}
        minWidthOfButton={args.minWidthOfButton}
        minHeightOfButton={args.minHeightOfButton}
        horizontalSpaceBtwButton={args.horizontalSpaceBtwButton}
        verticalSpaceBtwButton={args.verticalSpaceBtwButton}
        faquiBoundaryColor={args.faquiBoundaryColor}
        faquiHeaderBgColor={args.faquiHeaderBgColor}
        faquiHeaderHeight={args.faquiHeaderHeight}
        faquiHeaderFontSize={args.faquiHeaderFontSize}
        faquiHeaderTextColor={args.faquiHeaderTextColor}
        faquiBodyTextColor={args.faquiBodyTextColor}
        faquiMouseOverBodyBgColor={args.faquiMouseOverBodyBgColor}
        faquiMouseOverBodyTextColor={args.faquiMouseOverBodyTextColor}
        faquiScrollStickColor={args.faquiScrollStickColor}
        faquiRowHeight={args.faquiRowHeight}
        faquiBgColor={args.faquiBgColor}
        faquiRowSeparateColor={args.faquiRowSeparateColor}
        chatbotBgColor={args.chatbotBgColor}
        botTextBgColor={args.botTextBgColor}
        userTypeWindowBgColor={args.userTypeWindowBgColor}
        placeholderTextColor={args.placeholderTextColor}
        inputCaretColor={args.inputCaretColor}
        isFooterEnabled={args.isFooterEnabled}
        titleFontFamily={args.titleFontFamily}
        subTitleFontFamily={args.subTitleFontFamily}
        textFontFamily={args.textFontFamily}
        spinnerPathColor={args.spinnerPathColor}
        spinnerRunnerColor={args.spinnerRunnerColor}
        subtitle={args.subtitle}
        customData={args.customData}
        inputTextFieldHint={args.inputTextFieldHint}
        connectingText={args.connectingText}
        profileAvatar={args.profileAvatar}
        titleAvatar={args.titleAvatar}
        showCloseButton={args.showCloseButton}
        showFullScreenButton={args.showFullScreenButton}
        hideWhenNotConnected={args.hideWhenNotConnected}
        autoClearCache={args.autoClearCache}
        connectOn={args.connectOn}
        onSocketEvent={args.onSocketEvent}
        fullScreenMode={args.fullScreenMode}
        badge={args.badge}
        params={args.params}
        embedded={args.embedded}
        openLauncherImage={args.openLauncherImage}
        closeImage={args.closeImage}
        docViewer={args.docViewer}
        displayUnreadCount={args.displayUnreadCount}
        showMessageDate={args.showMessageDate}
        customMessageDelay={args.customMessageDelay}
        tooltipPayload={args.tooltipPayload}
        tooltipDelay={args.tooltipDelay}
        onWidgetEvent={args.onWidgetEvent}
        disableTooltips={args.disableTooltips}
        defaultHighlightCss={args.defaultHighlightCss}
        defaultHighlightAnimation={args.defaultHighlightAnimation}
        defaultHighlightClassname={args.defaultHighlightClassname}
        titleBoldNeeded={args.titleBoldNeeded}
        subtitleItalicNeeded={args.subtitleItalicNeeded}
        helperText={args.helperText}
      />, document.querySelector(args.selector)
    );
  }
};

export {
  plugin as default,
  Widget,
  toggleChat as toggle,
  openChat as open,
  closeChat as close,
  showChat as show,
  hideChat as hide,
  isOpen,
  isVisible,
  send,
  toggleInputDisabled
};

