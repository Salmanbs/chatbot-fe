import React from 'react';
import PropTypes from 'prop-types';
import Style from 'style-it';

import Header from './components/Header';
import Messages from './components/Messages';
import Sender from './components/Sender';
import './style.scss';
import Footer from './components/Footer';

const Conversation = props =>
  <Style>
    {`
      .rw-conversation-container {
        width: ${props.botWindowWidth};
      }
      
      @media screen and (min-width: 801px) {
        .rw-conversation-container {
          height: ${props.botWindowHeight};
        }
      }

      @media screen and (max-width: 500px) {
        .rw-conversation-container {
          width: 100%;
        }
      }
    `}
    <div className="rw-conversation-container">
      <Header
        title={props.title}
        subtitle={props.subtitle}
        bgColor={props.bgColor}
        toggleChat={props.toggleChat}
        toggleFullScreen={props.toggleFullScreen}
        fullScreenMode={props.fullScreenMode}
        showCloseButton={props.showCloseButton}
        showFullScreenButton={props.showFullScreenButton}
        connected={props.connected}
        connectingText={props.connectingText}
        closeImage={props.closeImage}
        titleAvatar={props.titleAvatar}
        titleColor={props.titleColor}
        titleFontSize={props.titleFontSize}
        subTitleColor={props.subTitleColor}
        subTitleFontSize={props.subTitleFontSize}
        resetCloseButtonColor={props.resetCloseButtonColor}
        resetChat={props.resetChat}
        titleFontFamily={props.titleFontFamily}
        subTitleFontFamily={props.subTitleFontFamily}
        titleBoldNeeded={props.titleBoldNeeded}
        subtitleItalicNeeded={props.subtitleItalicNeeded}
        button2Launcher={props.button2Launcher}
      />
      <Messages
        connected={props.connected}
        bgColor={props.bgColor}
        chatFontSize={props.chatFontSize}
        clientchatTextColor={props.clientchatTextColor}
        clientTextBgColor={props.clientTextBgColor}
        botButtonBorderColor={props.botButtonBorderColor}
        botButtonTextColor={props.botButtonTextColor}
        profileAvatar={props.profileAvatar}
        params={props.params}
        customComponent={props.customComponent}
        showMessageDate={props.showMessageDate}
        botWindowScrollStickColor={props.botWindowScrollStickColor}
        botChatTextColor={props.botChatTextColor}
        botButtonBgColor={props.botButtonBgColor}
        botButtonBorderColorHover={props.botButtonBorderColorHover}
        botButtonTextColorHover={props.botButtonTextColorHover}
        botButtonBgColorHover={props.botButtonBgColorHover}
        botButtonAlignment={props.botButtonAlignment}
        minWidthOfButton={props.minWidthOfButton}
        widthOfButton={props.widthOfButton}
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
        textFontFamily={props.textFontFamily}
        spinnerPathColor={props.spinnerPathColor}
        spinnerRunnerColor={props.spinnerRunnerColor}
        carouselType1Style={props.carouselType1Style}
        carouselType2Style={props.carouselType2Style}
        isFooterEnabled={props.isFooterEnabled}
        botWindowHeight={props.botWindowHeight}
        contactInfoStyle={props.contactInfoStyle}
        isTextAreaBoxShadowEnabled={props.isTextAreaBoxShadowEnabled}
        downloadOptions={props.downloadOptions}
      />
      <Sender
        connected={props.connected}
        bgColor={props.bgColor}
        sendMessage={props.sendMessage}
        disabledInput={props.disabledInput}
        disabledAttach={props.disabledAttach}
        disabledAttachLocation={props.disabledAttachLocation}
        sendButtonColor={props.sendButtonColor}
        userTypeWindowBgColor={props.userTypeWindowBgColor}
        placeholderTextColor={props.placeholderTextColor}
        textFontFamily={props.textFontFamily}
        inputCaretColor={props.inputCaretColor}
        chatFontSize={props.chatFontSize}
      />
      {props.isFooterEnabled &&
      <Footer
        poweredByImage={props.poweredByImage}
      />}
    </div>
  </Style>;

Conversation.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  bgColor: PropTypes.color,
  botWindowWidth: PropTypes.string,
  botWindowHeight: PropTypes.string,
  chatFontSize: PropTypes.string,
  clientchatTextColor: PropTypes.string,
  botButtonBorderColor: PropTypes.color,
  botButtonTextColor: PropTypes.color,
  sendMessage: PropTypes.func,
  profileAvatar: PropTypes.string,
  toggleFullScreen: PropTypes.func,
  fullScreenMode: PropTypes.bool,
  toggleChat: PropTypes.func,
  showCloseButton: PropTypes.bool,
  showFullScreenButton: PropTypes.bool,
  disabledInput: PropTypes.bool,
  disabledAttach: PropTypes.bool,
  disabledAttachLocation: PropTypes.bool,
  params: PropTypes.object,
  connected: PropTypes.bool,
  connectingText: PropTypes.string,
  closeImage: PropTypes.string,
  customComponent: PropTypes.func,
  showMessageDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  downloadOptions: PropTypes.shape({})
};

export default Conversation;
