import $ from 'jquery';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { initStore } from '../src/store/store';
import Widget from './components/Widget';
import socket from './socket';


// eslint-disable-next-line import/no-mutable-exports
export let store = null;

const ConnectedWidget = forwardRef((props, ref) => {
  const [configData, setConfigData] = useState(null);
  class Socket {
    constructor(
      url,
      customData,
      path,
      protocol,
      protocolOptions,
      onSocketEvent
    ) {
      this.url = url;
      this.customData = customData;
      this.path = path;
      this.protocol = protocol;
      this.protocolOptions = protocolOptions;
      this.onSocketEvent = onSocketEvent;
      this.socket = null;
      this.onEvents = [];
      this.marker = Math.random();
    }

    isInitialized() {
      return this.socket !== null && this.socket.connected;
    }

    on(event, callback) {
      if (!this.socket) {
        this.onEvents.push({ event, callback });
      } else {
        this.socket.on(event, callback);
      }
    }

    emit(message, data) {
      if (this.socket) {
        this.socket.emit(message, data);
      }
    }

    close() {
      if (this.socket) {
        this.socket.close();
      }
    }

    createSocket() {
      this.socket = socket(
        this.url,
        this.customData,
        this.path,
        this.protocol,
        this.protocolOptions
      );
      // We set a function on session_confirm here so as to avoid any race condition
      // this will be called first and will set those parameters for everyone to use.
      this.socket.on('session_confirm', (sessionObject) => {
        this.sessionConfirmed = true;
        this.sessionId = (sessionObject && sessionObject.session_id)
          ? sessionObject.session_id
          : sessionObject;
      });
      this.onEvents.forEach((event) => {
        this.socket.on(event.event, event.callback);
      });

      this.onEvents = [];
      Object.keys(this.onSocketEvent).forEach((event) => {
        this.socket.on(event, this.onSocketEvent[event]);
      });
    }
  }

  const sock = new Socket(
    configData ? configData.socketUrl : props.socketUrl,
    props.customData,
    configData ? configData.socketPath : props.socketPath,
    props.protocol,
    props.protocolOptions,
    props.onSocketEvent
  );

  const storage =
  (configData && configData.storage === 'session') ? sessionStorage : localStorage;
  if (!store || sock.marker !== store.socketRef) {
    store = initStore(
      props.inputTextFieldHint,
      props.connectingText,
      sock,
      storage,
      props.docViewer,
      props.onWidgetEvent
    );
    store.socketRef = sock.marker;
  }

  useEffect(() => {
    $.ajax({
      url: `${props.baseUrl}/api/get_layout`,
      type: 'POST',
      processData: false,
      contentType: false,
      crossDomain: true,
      headers: {
        Authorization: 'Bearer Kailashchandra353',
        token: 'Kailashchandra353'
      },
      data: JSON.stringify({ bot_id: props.customData.bot_id })

    }).done((result) => {
      var response = JSON.parse(result);
      if (response.status == 'success') {
        console.log('++++++++++++++++++ response.data ', response.data);

        console.log(' ++++++++++++++++++ customData ', props.customData);
        console.log(' ++++++++++++++++++ roleid' ,props.customData.role_id);

        if (props.liveChat && ('role_id' in props.customData) && (props.customData.role_id ==='agent')) {
            console.log(' ++++++++++++++++++ Set embedded as true for role-id' ,props.customData.role_id);
            response.data.embedded = 'true';
            response.data.botWindowWidth = response.data.botWindowWidth_agent?response.data.botWindowWidth_agent:response.data.botWindowWidth;
            response.data.botWindowHeight = response.data.botWindowHeight_agent?response.data.botWindowHeight_agent:response.data.botWindowHeight;
        }

        console.log('++++++++++++++++++ liveChat ', props.liveChat);
        console.log('++++++++++++++++++ response.data.embedded ', response.data.embedded);
        console.log('++++++++++++++++++ response.data.botWindowWidth ', response.data.botWindowWidth);
        console.log('++++++++++++++++++ response.data.botWindowHeight ', response.data.botWindowHeight);
        console.log('++++++++++++++++++ response.data ', response.data);

        setConfigData(response.data);
      }
    }).fail(() => {
      console.log('Failed!');
    });
  }, []);

  return (
    <Provider store={store}>
      { configData && <Widget
        ref={ref}
        initPayload={configData.initPayload}
        bgColor={configData.bgColor}
        button2Launcher={{
          button2LauncherNeeded: configData.button2LauncherNeeded === 'true',
          profileImageButton2: configData.profileImageButton2,
          bgColorButton2Mousehover: configData.bgColorButton2Mousehover,
          borderColorButton2Mousehover: configData.borderColorButton2Mousehover,
          textColorButton2Mousehover: configData.textColorButton2Mousehover,
          button2SlideInterval: `${configData.button2SlideInterval}s`
        }}
        botButtonAlignment={configData.botButtonAlignment}
        botButtonBorderColor={configData.botButtonBorderColor}
        botButtonTextColor={configData.botButtonTextColor}
        botButtonBgColor={configData.botButtonBgColor}
        botButtonBorderColorHover={configData.botButtonBorderColorHover}
        botButtonTextColorHover={configData.botButtonTextColorHover}
        botButtonBgColorHover={configData.botButtonBgColorHover}
        botChatTextColor={configData.botChatTextColor}
        botTextBgColor={configData.botTextBgColor}
        botWindowHeight={`${configData.botWindowHeight}px`}
        botWindowWidth={`${configData.botWindowWidth}px`}
        botWindowScrollStickColor={configData.botWindowScrollStickColor}
        botWindowOpenTime={+configData.botWindowOpenTime}
        carouselType1Style={{
          carouselType1Text1FontFamily: configData.carouselType1Text1FontFamily,
          carouselType1Text1FontSize: configData.carouselType1Text1FontSize,
          carouselType1Text1FontColor: configData.carouselType1Text1FontColor,
          carouselType1Text2FontFamily: configData.carouselType1Text2FontFamily,
          carouselType1Text2FontSize: configData.carouselType1Text2FontSize,
          carouselType1Text2FontColor: configData.carouselType1Text2FontColor
        }}
        carouselType2Style={{
          carouselType2HeaderFontFamily: configData.carouselType2HeaderFontFamily,
          carouselType2HeaderFontSize: configData.carouselType2HeaderFontSize,
          carouselType2HeaderFontColor: configData.carouselType2HeaderFontColor,
          carouselType2HeaderAlignment: configData.carouselType2HeaderAlignment,
          carouselType2HeaderHeight: `${configData.carouselType2HeaderHeight}s`,
          carouselType2Text1FontFamily: configData.carouselType2Text1FontFamily,
          carouselType2Text1FontSize: `${configData.carouselType2Text1FontSize}px`,
          carouselType2Text1FontColor: configData.carouselType2Text1FontColor,
          carouselType2Text1Alignment: configData.carouselType2Text1Alignment,
          carouselType2Text2FontFamily: configData.carouselType2Text2FontFamily,
          carouselType2Text2FontSize: `${configData.carouselType2Text2FontSize}px`,
          carouselType2Text2FontColor: configData.carouselType2Text2FontColor,
          carouselType2Text2Alignment: configData.carouselType2Text2Alignment,
          carouselType2Text2Height: `${configData.carouselType2Text2Height}px`,
          carouselType2Text3FontFamily: configData.carouselType2Text3FontFamily,
          carouselType2Text3FontSize: `${configData.carouselType2Text3FontSize}px`,
          carouselType2Text3FontColor: configData.carouselType2Text3FontColor,
          carouselType2ButtonFontFamily: configData.carouselType2ButtonFontFamily,
          carouselType2ButtonFontSize: `${configData.carouselType2ButtonFontSize}px`,
          carouselType2ButtonBorderColor: configData.carouselType2ButtonBorderColor,
          carouselType2ButtonTextColor: configData.carouselType2ButtonTextColor,
          carouselType2ButtonBgColor: configData.carouselType2ButtonBgColor,
          carouselType2ButtonBorderColorHover: configData.carouselType2ButtonBorderColorHover,
          carouselType2ButtonTextColorHover: configData.carouselType2ButtonTextColorHover,
          carouselType2ButtonBgColorHover: configData.carouselType2ButtonBgColorHover,
          carouselType2ButtonAlignment: configData.carouselType2ButtonAlignment,
          carouselType2MinWidthOfButton: `${configData.carouselType2MinWidthOfButton}px`,
          carouselType2WidthOfButton: `${configData.carouselType2WidthOfButton}px`,
          carouselType2MinHeightOfButton: `${configData.carouselType2MinHeightOfButton}px`,
          carouselType2ArrowsColor: configData.carouselType2ArrowsColor,
          carouselType2FooterBgColor: configData.carouselType2FooterBgColor,
          carouselType2BgColor: configData.carouselType2BgColor,
          carouselType2SlideInterval: +configData.carouselType2SlideInterval
        }}
        chatFontSize={`${configData.chatFontSize}px`}
        chatbotBgColor={configData.chatbotBgColor}
        clientchatTextColor={configData.clientchatTextColor}
        clientTextBgColor={configData.clientTextBgColor}
        contactInfoStyle={{
          contactInfoBgColor: configData.contactInfoBgColor,
          contactInfoInputBorderColor: configData.contactInfoInputBorderColor,
          contactInfoInputBgColor: configData.contactInfoInputBgColor,
          contactInfoInputFontSize: `${configData.contactInfoInputFontSize}px`,
          contactInfoInputFontStyle: configData.contactInfoInputFontStyle,
          contactInfoInputFontColor: configData.contactInfoInputFontColor,
          contactInfoButtonBgColor: configData.contactInfoButtonBgColor,
          contactInfoButtonBorderColor: configData.contactInfoButtonBorderColor,
          contactInfoButtonTextColor: configData.contactInfoButtonTextColor,
          contactInfoInputPlaceholderColor: configData.contactInfoInputPlaceholderColor,
          contactInfoButtonBorderColorHover: configData.contactInfoButtonBorderColorHover,
          contactInfoButtonTextColorHover: configData.contactInfoButtonTextColorHover,
          contactInfoButtonBgColorHover: configData.contactInfoButtonBgColorHover,
          contactInfoMinWidth: `${configData.contactInfoMinWidth}px`,
          contactInfoActualWidth: `${configData.contactInfoActualWidth}px`,
          contactInfoMinHeight: `${configData.contactInfoMinHeight}px`,
          contactInfoHeaderFontSize: `${configData.contactInfoHeaderFontSize}px`,
          contactInfoHeaderFontStyle: configData.contactInfoHeaderFontStyle,
          contactInfoHeaderFontColor: configData.contactInfoHeaderFontColor
        }}
        customData={props.customData}
        liveChat={props.liveChat}
        downloadOptions={{
          show: configData.displayImageDownloadIcon,
          backgroundColor: `#${configData.displayImageDownloadIconBgColor}`,
          iconColor: `#${configData.displayImageDownloadIconColor}`
        }}
        faquiBoundaryColor={configData.faquiBoundaryColor}
        faquiHeaderBgColor={configData.faquiHeaderBgColor}
        faquiHeaderHeight={`${configData.faquiHeaderHeight}px`}
        faquiHeaderFontSize={`${configData.faquiHeaderFontSize}px`}
        faquiHeaderTextColor={configData.faquiHeaderTextColor}
        faquiBodyTextColor={configData.faquiBodyTextColor}
        faquiMouseOverBodyBgColor={configData.faquiMouseOverBodyBgColor}
        faquiMouseOverBodyTextColor={configData.faquiMouseOverBodyTextColor}
        faquiScrollStickColor={configData.faquiScrollStickColor}
        faquiRowHeight={`${configData.faquiRowHeight}px`}
        faquiBgColor={configData.faquiBgColor}
        faquiRowSeparateColor={configData.faquiRowSeparateColor}
        helperText={{
          isHelperTextNeeded: configData.isHelperTextNeeded === 'true',
          textValue: configData.helperTextValue,
          fontFamily: configData.helperFontFamily,
          fontSize: `${configData.helperFontSize}px`,
          fontColor: configData.helperFontColor,
          textBold: configData.helperTextBold === 'true',
          textItalic: configData.helperTextItalic === 'true',
          bgColor: configData.helperBgColor,
          borderColor: configData.helperBorderColor,
          shakeInterval: `${configData.helperTextShakeInterval}s`,
          helperTextInterval: `${configData.helperTextInterval}s`,
          boxArrowNeeded: configData.helperBoxArrowNeeded === 'true',
          outerBoxNeeded: configData.helperOuterBoxNeeded === 'true'
        }}
        horizontalSpaceBtwButton={`${configData.horizontalSpaceBtwButton}px`}
        inputCaretColor={configData.inputCaretColor}
        isFooterEnabled={configData.isFooterEnabled === 'true'}
        isTextAreaBoxShadowEnabled={configData.isTextAreaBoxShadowEnabled === 'true'}
        minWidthOfButton={`${configData.minWidthOfButton}px`}
        minHeightOfButton={`${configData.minHeightOfButton}px`}
        placeholderTextColor={configData.placeholderTextColor}
        poweredByImage={configData.poweredByImage}
        profileAvatar={configData.profileAvatar}
        resetCloseButtonColor={configData.resetCloseButtonColor}
        sendButtonColor={configData.sendButtonColor}
        spinnerPathColor={configData.spinnerPathColor}
        spinnerRunnerColor={configData.spinnerRunnerColor}
        subTitleColor={configData.subTitleColor}
        subTitleFontFamily={configData.subTitleFontFamily}
        subTitleFontSize={`${configData.subTitleFontSize}px`}
        subtitle={configData.subtitle}
        subtitleItalicNeeded={configData.subtitleItalicNeeded === 'true'}
        textFontFamily={configData.textFontFamily}
        timeout={configData.timeout}
        title={configData.title}
        titleAvatar={configData.titleAvatar}
        titleBoldNeeded={configData.titleBoldNeeded === 'true'}
        titleColor={configData.titleColor}
        titleFontFamily={configData.titleFontFamily}
        titleFontSize={`${configData.titleFontSize}px`}
        userTypeWindowBgColor={configData.userTypeWindowBgColor}
        verticalSpaceBtwButton={`${configData.verticalSpaceBtwButton}px`}
        widthOfButton={`${configData.widthOfButton}px`}

        showCloseButton={configData.showCloseButton === 'true'}
        fullScreenMode={configData.fullScreenMode === 'true'}

        hideWhenNotConnected={configData.hideWhenNotConnected === 'true'}
        connectOn={configData.connectOn}
        embedded={configData.embedded === 'true'}
        params={{
          storage: 'session',
          images: {
            dims: {
              width: `${configData.displayImagewidth}px`
            },
            backgroundColor: `#${configData.displayImagebgcolor}`
          }
        }}
        customMessageDelay={props.customMessageDelay}
        tooltipPayload={configData.tooltipPayload}

        handleNewUserMessage={props.handleNewUserMessage}
        showFullScreenButton={props.showFullScreenButton}
        autoClearCache={configData.autoClearCache === 'true'}
        badge={props.badge}
        storage={storage}
        openLauncherImage={props.openLauncherImage}
        closeImage={props.closeImage}
        customComponent={props.customComponent}
        displayUnreadCount={props.displayUnreadCount}
        socket={sock}
        showMessageDate={props.showMessageDate}
        tooltipDelay={props.tooltipDelay}
        disableTooltips={props.disableTooltips}
        defaultHighlightCss={props.defaultHighlightCss}
        defaultHighlightAnimation={props.defaultHighlightAnimation}
        defaultHighlightClassname={props.defaultHighlightClassname}
      /> }
    </Provider>
  );
});

ConnectedWidget.propTypes = {
  initPayload: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  protocol: PropTypes.string,
  socketUrl: PropTypes.string.isRequired,
  socketPath: PropTypes.string,
  protocolOptions: PropTypes.shape({}),
  customData: PropTypes.shape({}),
  handleNewUserMessage: PropTypes.func,
  profileAvatar: PropTypes.string,
  inputTextFieldHint: PropTypes.string,
  connectingText: PropTypes.string,
  showCloseButton: PropTypes.bool,
  showFullScreenButton: PropTypes.bool,
  hideWhenNotConnected: PropTypes.bool,
  connectOn: PropTypes.oneOf(['mount', 'open']),
  autoClearCache: PropTypes.bool,
  onSocketEvent: PropTypes.objectOf(PropTypes.func),
  fullScreenMode: PropTypes.bool,
  badge: PropTypes.number,
  embedded: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  params: PropTypes.object,
  openLauncherImage: PropTypes.string,
  closeImage: PropTypes.string,
  docViewer: PropTypes.bool,
  liveChat: PropTypes.bool,
  customComponent: PropTypes.func,
  displayUnreadCount: PropTypes.bool,
  showMessageDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  customMessageDelay: PropTypes.func,
  tooltipPayload: PropTypes.string,
  tooltipDelay: PropTypes.number,
  onWidgetEvent: PropTypes.shape({
    onChatOpen: PropTypes.func,
    onChatClose: PropTypes.func,
    onChatVisible: PropTypes.func,
    onChatHidden: PropTypes.func
  }),
  disableTooltips: PropTypes.bool,
  defaultHighlightCss: PropTypes.string,
  defaultHighlightAnimation: PropTypes.string
};

ConnectedWidget.defaultProps = {
  title: 'Welcome',
  customData: {},
  inputTextFieldHint: '',
  connectingText: 'Connecting...',
  fullScreenMode: false,
  hideWhenNotConnected: true,
  autoClearCache: false,
  connectOn: 'mount',
  onSocketEvent: {},
  protocol: 'socketio',
  socketUrl: 'http://localhost',
  protocolOptions: {},
  badge: 0,
  embedded: false,
  liveChat: false,
  params: {
    storage: 'session',
    images: {
      dims: {
        width: 0
      },
      backgroundColor: '#000'
    }
  },
  docViewer: false,
  showCloseButton: true,
  showFullScreenButton: false,
  displayUnreadCount: false,
  showMessageDate: false,
  customMessageDelay: (message) => {
    let delay = message.length * 30;
    if (delay > 3 * 1000) delay = 3 * 1000;
    if (delay < 800) delay = 800;
    return delay;
  },
  tooltipPayload: null,
  tooltipDelay: 500,
  onWidgetEvent: {
    onChatOpen: () => {},
    onChatClose: () => {},
    onChatVisible: () => {},
    onChatHidden: () => {}
  },
  disableTooltips: false
};

export default ConnectedWidget;
