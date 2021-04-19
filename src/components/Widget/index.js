import {
    addCaptureatttype,
    addCaptureloctype,
    addCarousel,
    addCarouselType1,
    addCarouselType2,
    addCollectInfoType1,
    addFAQReply,
    addImageSnippet,
    addQuickReply,
    addResponseMessage,
    addUserMessage,
    addVideoSnippet,
    changeInputFieldHint,
    changeOldUrl,
    clearMetadata,
    closeChat,
    connectServer,
    disconnectServer,
    doAttachDisabled,
    doAttachEnabled,
    doAttachLocationDisabled,
    doAttachLocationEnabled,
    doInputDisabled,
    doInputEnabled,
    emitMessageIfFirst,
    emitUserMessage,
    evalUrl,
    initialize,
    newUnreadMessage,
    openChat,
    pullSession,
    renderCustomComponent,
    setCustomCss,
    setDomHighlight,
    setLinkTarget,
    setPageChangeCallbacks,
    setUserInput,
    showChat,
    showTooltip,
    toggleChat,
    toggleFullScreen,
    triggerMessageDelayed,
    triggerTooltipSent
} from 'actions';
import { NEXT_MESSAGE, SESSION_NAME } from 'constants';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getLocalSession, storeLocalSession } from '../../store/reducers/helper';
import WidgetLayout from './layout';
import {
    isCaptureatttype,
    isCaptureloctype,
    isCarousel,
    isCarouselType1,
    isCarouselType2,
    isCollectInfoType1,
    isFAQ,
    isImage,
    isQR,
    isText,
    isVideo
} from './msgProcessor';

class Widget extends Component {
    constructor(props) {
        super(props);
        this.messages = [];
        this.delayedMessage = null;
        this.messageDelayTimeout = null;
        this.onGoingMessageDelay = false;
        this.customInputEnable = false;
        this.attachAny = false;
        // this.attachLocation = false;
        this.sendMessage = this.sendMessage.bind(this);
        this.intervalId = null;
        this.eventListenerCleaner = () => {};
        this.conversationStarted = false;
        this.conversationStartedTimeoutID = null;
        this.sendInitAgainID = null;
        this.botWindowSetTimeout = null;
    }

    componentDidMount() {
        const {
            connectOn,
            autoClearCache,
            storage,
            dispatch,
            defaultHighlightAnimation,
            botWindowOpenTime,
        } = this.props;
        storage.clear();
        localStorage.clear();
        dispatch(disconnectServer());

        // add the default highlight css to the document
        const styleNode = document.createElement('style');
        styleNode.innerHTML = defaultHighlightAnimation;
        document.body.appendChild(styleNode);

        this.intervalId = setInterval(() => dispatch(evalUrl(window.location.href)), 500);
        if (connectOn === 'mount') {
            this.initializeWidget();
            return;
        }

        const localSession = getLocalSession(storage, SESSION_NAME);
        const lastUpdate = localSession ? localSession.lastUpdate : 0;
        if (autoClearCache) {
            if (Date.now() - lastUpdate < 30 * 60 * 1000) {
                this.initializeWidget();
            } else {
                localStorage.removeItem(SESSION_NAME);
            }
        } else {
            dispatch(pullSession());
            if (lastUpdate) this.initializeWidget();
        }
        if (botWindowOpenTime !== 0) {
            const time = botWindowOpenTime * 1000;
            this.botWindowSetTimeout = setTimeout(() => {
                this.toggleConversation();
            }, time);
        }
    }

    componentDidUpdate() {
        const { isChatOpen, dispatch, embedded, initialized, liveChat } = this.props;
        if (isChatOpen) {
            if (!initialized) {
                this.initializeWidget();
                // this.props.dispatch(doInputDisabled());
                console.log(' GURTAJ  initPayload',liveChat);

                if (!this.props.liveChat){
                    // disable attachment button from GUI
                    // this.props.dispatch(doInputDisabled());
                    this.props.dispatch(doAttachDisabled());
                    this.props.dispatch(doAttachLocationDisabled());
                    // this.props.dispatch(changeInputFieldHint(''));
                } else {
                    this.props.dispatch(doInputEnabled());
                    this.props.dispatch(doAttachEnabled());
                    this.props.dispatch(doAttachLocationEnabled());
                    this.props.dispatch(changeInputFieldHint('Type a message…'));
                }

                // this.props.dispatch(doAttachDisabled());
                // this.props.dispatch(doAttachLocationDisabled());

                
            }

            this.trySendInitPayload();

            this.sendInitAgainID = setTimeout(() => {
                if (!this.conversationStarted) {
                    const msgToInit = '/greet_as_bill_assistant';
                    if (msgToInit) {
                        this.props.dispatch(emitUserMessage(msgToInit));
                        this.props.dispatch(changeInputFieldHint(''));
                        // this.props.dispatch(doInputDisabled());
                        if (!this.props.liveChat){
                            // disable attachment button from GUI
                            this.props.dispatch(doInputDisabled());
                            this.props.dispatch(doAttachDisabled());
                            this.props.dispatch(doAttachLocationDisabled());
                        } else {
                            this.props.dispatch(doInputEnabled());
                            this.props.dispatch(doAttachEnabled());
                            this.props.dispatch(doAttachLocationEnabled());
                            this.props.dispatch(changeInputFieldHint('Type a message…'));
                        }

                        // this.props.dispatch(doAttachDisabled());
                        // this.props.dispatch(doAttachLocationDisabled());
                    }
                }
            }, 2000);
        }

        if (embedded && initialized) {
            dispatch(showChat());
            dispatch(openChat());
        }
    }

    componentWillUnmount() {
        const { socket } = this.props;

        if (socket) {
            socket.close();
        }
        clearTimeout(this.tooltipTimeout);
        clearInterval(this.intervalId);
    }

    getSessionId() {
        const { storage } = this.props;
        // Get the local session, check if there is an existing session_id
        const localSession = getLocalSession(storage, SESSION_NAME);
        const localId = localSession ? localSession.session_id : null;
        return localId;
    }

    sendMessage(payload, text = '', when = 'always') {
        const { dispatch, initialized } = this.props;
        const emit = () => {
            if (when === 'always') {
                dispatch(emitUserMessage(payload));
                if (text !== '') dispatch(addUserMessage(text));
            } else if (when === 'init') {
                dispatch(emitMessageIfFirst(payload, text));
            }
        };
        if (!initialized) {
            this.initializeWidget(false);
            dispatch(initialize());
            emit();
        } else {
            emit();
        }
    }

    handleMessageReceived(messageWithMetadata) {
        const { dispatch, isChatOpen, disableTooltips, socket, liveChat } = this.props;
        // we extract metadata so we are sure it does not interfer with type checking of the message
        const { metadata, ...message } = messageWithMetadata;
        // dispatch(changeInputFieldHint(''));
        // dispatch(doInputDisabled());
        console.log('+++++++ GS handleMessageReceived this.props.liveChat +++++++', this.props.liveChat);
        if (!this.props.liveChat){
            // disable attachment button from GUI
            dispatch(changeInputFieldHint(''));
            dispatch(doInputDisabled());
            dispatch(doAttachDisabled());
            dispatch(doAttachLocationDisabled());
        } else {
            dispatch(doInputEnabled());
            dispatch(doAttachEnabled());
            dispatch(doAttachLocationEnabled());
            dispatch(changeInputFieldHint('Type a message…'));
        }

        // this.props.dispatch(doAttachDisabled());
        // this.props.dispatch(doAttachLocationDisabled());
        const str = message.text;
        const n = str.includes('TERMINATE_CHAT');
        if (!isChatOpen) {
            this.dispatchMessage(message);
            dispatch(newUnreadMessage());
            if (!disableTooltips) {
                dispatch(showTooltip(true));
                this.applyCustomStyle();
            }
        } else if (!this.onGoingMessageDelay) {
            // var msg_hint = message.get('hint');
            let msg_hint = '';
            if (!n) {
                console.log('+++++++ GS  normal exit delay +++++++');

                // var msg_hint = message.get('hint');
                this.customInputEnable = false;
                this.attachAny = false;
                // this.attachLocation = false;
                if (isText(message)) {
                    console.log('+++++++ GS handleMessageReceived MSG text +++++++', str);
                    // all last text message should enable text input with no hint, except the TERMINATE_CHAT
                    if (!n) {
                        msg_hint = 'Type a message…';
                        this.customInputEnable = true;
                        this.attachAny = true;
                        // this.attachLocation = false;
                        // dispatch(changeInputFieldHint('Type a message…'));
                        // dispatch(doInputEnabled());
                    }
                } else if (
                    isFAQ(message) ||
                    isQR(message) ||
                    isCarouselType1(message) ||
                    isCarouselType2(message)
                ) {
                    console.log(
                        '+++++++ GS handleMessageReceived Last MSG FAQ || QR || CAROUSELTYPE1 +++++++',
                        str
                    );
                    // dispatch(changeInputFieldHint('Select an option...'));
                    msg_hint = 'Select an option...';
                } else if (isCollectInfoType1(message)) {
                    msg_hint = '';
                } else if (isCaptureatttype(message)) {
                    msg_hint = 'Select file to attach...';
                    this.attachAny = true;
                }
                //  else if (isCaptureloctype(message)) {
                //     msg_hint = 'Select location...';
                //     this.attachLocation = true;
                // }

                this.onGoingMessageDelay = true;
                dispatch(triggerMessageDelayed(true));
                this.newMessageTimeout(message, msg_hint);
            } else {
                this.onGoingMessageDelay = false;
                msg_hint = 'Chat Ended...';
                this.customInputEnable = false;
                this.attachAny = false;
                // this.attachLocation = false;
                this.newMessageTimeout(message, msg_hint);
            }
        } else {
            console.log('+++++++ handleMessageReceived messages push +++++++');            
            this.messages.push(message);


            if (!this.props.liveChat){
                // disable attachment button from GUI
                dispatch(changeInputFieldHint(''));
                dispatch(doInputDisabled());                
                dispatch(doAttachDisabled());
                dispatch(doAttachLocationDisabled());
            } else {
                dispatch(doInputEnabled());
                dispatch(doAttachEnabled());
                dispatch(doAttachLocationEnabled());
                dispatch(changeInputFieldHint('Type a message…'));
            }

            // this.props.dispatch(doAttachDisabled());
            // this.props.dispatch(doAttachLocationDisabled());
        }

        if (this.msgTimeout) {
            clearTimeout(this.msgTimeout);
            this.msgTimeout = null;
        }

        if (!n) {
            if (this.props.timeout == 0 ) {
                console.log('+++++++ handleMessageReceived Infinite timeout +++++++',
                    this.props.timeout);
            } else {
                this.msgTimeout = setTimeout(() => {
                    dispatch(changeInputFieldHint('Chat ended due to inactivity...'));
                    dispatch(doInputDisabled());
                    dispatch(doAttachDisabled());
                    dispatch(doAttachLocationDisabled());
                    if (socket) {
                        socket.close();
                    }
                    clearTimeout(this.tooltipTimeout);
                    clearInterval(this.intervalId);
                }, this.props.timeout * 1000);
            }
        } else {
            // dispatch(doInputDisabled());

            if (!this.props.liveChat){
                dispatch(changeInputFieldHint(''));
                dispatch(doInputDisabled());                
                // disable attachment button from GUI
                dispatch(doAttachDisabled());
                dispatch(doAttachLocationDisabled());
            } else {
                dispatch(changeInputFieldHint('Type a message…'));
                dispatch(doInputEnabled());                
                dispatch(doAttachEnabled());
                dispatch(doAttachLocationEnabled());
            }

            // this.props.dispatch(doAttachDisabled());
            // this.props.dispatch(doAttachLocationDisabled());
            if (socket) {
                socket.close();
            }
            clearTimeout(this.tooltipTimeout);
            clearInterval(this.intervalId);
        }
    }

    popLastMessage() {
        const { dispatch } = this.props;
        if (this.messages.length) {
            // this.onGoingMessageDelay = true;
            // dispatch(triggerMessageDelayed(true));
            this.onGoingMessageDelay = false;

            const message = this.messages.shift();
            const str = message.text;
            console.log('+++++++ GS popLastMessage case +++++++', str);

            const n = str.includes('TERMINATE_CHAT');
            let msg_hint = '';
            // message.get('hint');
            // var msg_hint = '';

            if (!n) {
                this.onGoingMessageDelay = true;
                dispatch(triggerMessageDelayed(true));
            } else {
                this.customInputEnable = false;
                this.attachAny = false;
                // this.attachLocation = false;
                msg_hint = 'Chat Ended...';
            }

            if (!this.messages.length) {
                console.log('+++++++ GS popLastMessage Last MSG +++++++', str);
                if (isText(message)) {
                    console.log('+++++++ GS popLastMessage Last MSG text +++++++', str);
                    // all last text message should enable text input with no hint, except the TERMINATE_CHAT
                    if (!n) {
                        // dispatch(changeInputFieldHint(''));
                        // dispatch(doInputEnabled());
                        msg_hint = 'Type a message…';
                        this.customInputEnable = true;
                        this.attachAny = true;
                        // this.attachLocation = false;
                    }
                } else if (
                    isFAQ(message) ||
                    isQR(message || isCarouselType1(message) || isCarouselType2(message))
                ) {
                    console.log('+++++++ GS popLastMessage Last MSG FAQ || QR +++++++', str);
                    // dispatch(changeInputFieldHint('Select an option...'));
                    msg_hint = 'Select an option...';
                    this.customInputEnable = false;
                    this.attachAny = false;
                    // this.attachLocation = false;
                } else if (isCollectInfoType1(message)) {
                    msg_hint = '';
                } else if (isCaptureatttype(message)) {
                    msg_hint = 'Select file to attach...';
                    this.attachAny = true;
                }
                // else if (isCaptureloctype(message)) {
                //     msg_hint = 'Select location...';
                //     this.attachLocation = true;
                // }
            } else if (isText(message)) {
                console.log('+++++++ GS popLastMessage Not Last MSG text +++++++', str);
                // dispatch(changeInputFieldHint(''));
                // dispatch(doInputDisabled());
                msg_hint = '';
                this.customInputEnable = false;
                this.attachAny = false;
                // this.attachLocation = false;
            } else if (
                isFAQ(message) ||
                isQR(message || isCarouselType1(message) || isCarouselType2(message))
            ) {
                console.log('+++++++ GS popLastMessage Not Last MSG FAQ || QR +++++++', str);
                // dispatch(changeInputFieldHint('Select an option...'));
                msg_hint = 'Select an option...';
                this.customInputEnable = false;
                this.attachAny = false;
                // this.attachLocation = false;
            } else if (isCollectInfoType1(message)) {
                msg_hint = '';
                this.customInputEnable = false;
                this.attachAny = false;
                // this.attachLocation = false;
            } else if (isCaptureatttype(message)) {
                msg_hint = 'Select file to attach...';
                this.attachAny = true;
                this.customInputEnable = false;
            }
            // else if (isCaptureloctype(message)) {
            //     msg_hint = 'Select location...';
            //     this.customInputEnable = false;
            //     this.attachLocation = true;
            // }
            this.newMessageTimeout(message, msg_hint);
        }
    }

    newMessageTimeout(message, msg_hint) {
        const { dispatch, customMessageDelay } = this.props;
        this.delayedMessage = message;
        this.messageDelayTimeout = setTimeout(() => {
            this.dispatchMessage(message);
            this.delayedMessage = null;
            this.applyCustomStyle();
            dispatch(triggerMessageDelayed(false));
            this.onGoingMessageDelay = false;
            dispatch(changeInputFieldHint(msg_hint));

            console.log('+++++++ GS newMessageTimeout +++++++',this.props.liveChat );            
            if (!this.props.liveChat){
                // disable attachment button from GUI
                this.props.dispatch(doInputDisabled());
                this.props.dispatch(doAttachDisabled());
                this.props.dispatch(doAttachLocationDisabled());
            } else {
                this.props.dispatch(doInputEnabled());
                this.props.dispatch(doAttachEnabled());
                this.props.dispatch(doAttachLocationEnabled());
                this.props.dispatch(changeInputFieldHint('Type a message…'));
                this.customInputEnable = true
                this.attachAny = true
            }
            
            if (this.customInputEnable) {
                dispatch(doInputEnabled());
                dispatch(doAttachDisabled());
                dispatch(doAttachLocationDisabled());
            } else {
                dispatch(doInputDisabled());
            }
            if (this.attachAny) {
                dispatch(doAttachEnabled());
                dispatch(doAttachLocationEnabled());
                dispatch(doInputEnabled());
            } else {
                dispatch(doAttachDisabled());
            }

            // if (this.attachLocation) {
            //     dispatch(doAttachLocationEnabled());
            //     dispatch(doAttachDisabled());
            //     dispatch(doInputDisabled());
            // } else {
            //     dispatch(doAttachLocationDisabled());
            // }
            this.popLastMessage();
        }, customMessageDelay(message.text || ''));
    }

    propagateMetadata(metadata) {
        const { dispatch } = this.props;
        const {
            linkTarget,
            userInput,
            pageChangeCallbacks,
            domHighlight,
            forceOpen,
            forceClose,
            pageEventCallbacks,
        } = metadata;
        if (linkTarget) {
            dispatch(setLinkTarget(linkTarget));
        }
        if (userInput) {
            dispatch(setUserInput(userInput));
        }
        if (pageChangeCallbacks) {
            dispatch(changeOldUrl(window.location.href));
            dispatch(setPageChangeCallbacks(pageChangeCallbacks));
        }
        if (domHighlight) {
            dispatch(setDomHighlight(domHighlight));
        }
        if (forceOpen) {
            dispatch(openChat());
        }
        if (forceClose) {
            dispatch(closeChat());
        }
        if (pageEventCallbacks) {
            this.eventListenerCleaner = this.addCustomsEventListeners(
                pageEventCallbacks.pageEvents
            );
        }
    }

    handleBotUtterance(botUtterance) {
        if (!this.conversationStarted) {
            this.conversationStarted = true;
            if (this.sendInitAgainID) {
                clearTimeout(this.sendInitAgainID);
                this.sendInitAgainID - null;
            }
            if (this.conversationStartedTimeoutID) {
                clearTimeout(this.conversationStartedTimeoutID);
                this.conversationStartedTimeoutID = null;
            }
        }

        const { dispatch } = this.props;
        this.clearCustomStyle();
        this.eventListenerCleaner();
        dispatch(clearMetadata());
        if (botUtterance.metadata) this.propagateMetadata(botUtterance.metadata);
        const newMessage = { ...botUtterance, text: String(botUtterance.text) };
        if (botUtterance.metadata && botUtterance.metadata.customCss) {
            newMessage.customCss = botUtterance.metadata.customCss;
        }
        this.handleMessageReceived(newMessage);
    }

    addCustomsEventListeners(pageEventCallbacks) {
        const eventsListeners = [];

        pageEventCallbacks.forEach(pageEvent => {
            const { event, payload, selector } = pageEvent;
            console.log('selector: $$', selector);
            const sendPayload = () => {
                this.sendMessage(payload);
            };

            if (event && payload && selector) {
                const elemList = document.querySelectorAll(selector);
                if (elemList.length > 0) {
                    elemList.forEach(elem => {
                        eventsListeners.push({ elem, event, sendPayload });
                        elem.addEventListener(event, sendPayload);
                    });
                }
            }
        });

        const cleaner = () => {
            eventsListeners.forEach(eventsListener => {
                eventsListener.elem.removeEventListener(
                    eventsListener.event,
                    eventsListener.sendPayload
                );
            });
        };

        return cleaner;
    }

    clearCustomStyle() {
        const { domHighlight, defaultHighlightClassname } = this.props;
        const domHighlightJS = domHighlight.toJS() || {};
        if (domHighlightJS.selector) {
            const elements = document.querySelectorAll(domHighlightJS.selector);
            elements.forEach(element => {
                switch (domHighlightJS.style) {
                    case 'custom':
                        element.setAttribute('style', '');
                        break;
                    case 'class':
                        element.classList.remove(domHighlightJS.css);
                        break;
                    default:
                        if (defaultHighlightClassname !== '') {
                            element.classList.remove(defaultHighlightClassname);
                        } else {
                            element.setAttribute('style', '');
                        }
                }
            });
        }
    }

    applyCustomStyle() {
        const { domHighlight, defaultHighlightCss, defaultHighlightClassname } = this.props;
        const domHighlightJS = domHighlight.toJS() || {};
        if (domHighlightJS.selector) {
            const elements = document.querySelectorAll(domHighlightJS.selector);
            elements.forEach(element => {
                switch (domHighlightJS.style) {
                    case 'custom':
                        element.setAttribute('style', domHighlightJS.css);
                        break;
                    case 'class':
                        element.classList.add(domHighlightJS.css);
                        break;
                    default:
                        if (defaultHighlightClassname !== '') {
                            element.classList.add(defaultHighlightClassname);
                        } else {
                            element.setAttribute('style', defaultHighlightCss);
                        }
                }
            });
            // We check that the method is here to prevent crashes on unsupported browsers.
            if (elements[0] && elements[0].scrollIntoView) {
                // If I don't use a timeout, the scrollToBottom in messages.jsx
                // seems to override that scrolling
                setTimeout(() => {
                    if (/Mobi/.test(navigator.userAgent)) {
                        elements[0].scrollIntoView({
                            block: 'center',
                            inline: 'nearest',
                            behavior: 'smooth',
                        });
                    } else {
                        const rectangle = elements[0].getBoundingClientRect();

                        const ElemIsInViewPort =
                            rectangle.top >= 0 &&
                            rectangle.left >= 0 &&
                            rectangle.bottom <=
                                (window.innerHeight || document.documentElement.clientHeight) &&
                            rectangle.right <=
                                (window.innerWidth || document.documentElement.clientWidth);
                        if (!ElemIsInViewPort) {
                            elements[0].scrollIntoView({
                                block: 'center',
                                inline: 'nearest',
                                behavior: 'smooth',
                            });
                        }
                    }
                }, 50);
            }
        }
    }

    initializeWidget(sendInitPayload = true) {
        const {
            storage,
            socket,
            dispatch,
            embedded,
            initialized,
            connectOn,
            tooltipPayload,
            tooltipDelay,
        } = this.props;

        if (!socket.isInitialized()) {
            socket.createSocket();

            socket.on('bot_uttered', botUttered => {
                this.handleBotUtterance(botUttered);
            });

            dispatch(pullSession());

            // Request a session from server
            const localId = this.getSessionId();
            socket.on('connect', () => {
                socket.emit('session_request', { session_id: localId });
            });

            // When session_confirm is received from the server:
            socket.on('session_confirm', sessionObject => {
                const remoteId =
                    sessionObject && sessionObject.session_id
                        ? sessionObject.session_id
                        : sessionObject;

                // eslint-disable-next-line no-console
                console.log(`session_confirm:${socket.socket.id} session_id:${remoteId}`);
                // Store the initial state to both the redux store and the storage, set connected to true
                dispatch(connectServer());
                /*
        Check if the session_id is consistent with the server
        If the localId is null or different from the remote_id,
        start a new session.
        */
                if (localId !== remoteId) {
                    // storage.clear();
                    // Store the received session_id to storage

                    storeLocalSession(storage, SESSION_NAME, remoteId);
                    dispatch(pullSession());
                    if (sendInitPayload) {
                        console.log(' GURTAJ Sending Initial Payload initPayload');
                        // dispatch(changeInputFieldHint(''));
                        // dispatch(doInputDisabled());

                        if (!this.props.liveChat){
                            // disable attachment button from GUI
                            dispatch(doAttachDisabled());
                            dispatch(doAttachLocationDisabled());
                            dispatch(doInputDisabled());
                            dispatch(changeInputFieldHint(''));
                        } else {
                            dispatch(doInputEnabled());
                            dispatch(changeInputFieldHint('Type a message...'));
                            dispatch(doAttachEnabled());
                            dispatch(doAttachLocationEnabled());
                        }

                        // this.props.dispatch(doAttachDisabled());
                        // this.props.dispatch(doAttachLocationDisabled());
                        this.trySendInitPayload();
                    }
                } else {
                    // If this is an existing session, it's possible we changed pages and want to send a
                    // user message when we land.
                    const nextMessage = window.localStorage.getItem(NEXT_MESSAGE);

                    if (nextMessage !== null) {
                        const { message, expiry } = JSON.parse(nextMessage);
                        window.localStorage.removeItem(NEXT_MESSAGE);

                        if (expiry === 0 || expiry > Date.now()) {
                            dispatch(addUserMessage(message));
                            dispatch(emitUserMessage(message));
                        }
                    }
                }
                if (connectOn === 'mount' && tooltipPayload) {
                    this.tooltipTimeout = setTimeout(() => {
                        this.trySendTooltipPayload();
                    }, parseInt(tooltipDelay, 10));
                }
            });

            socket.on('disconnect', reason => {
                // eslint-disable-next-line no-console
                console.log(reason);
                storage.clear();
                localStorage.clear();

                console.log('Widget Clear his re-connect');
                if (reason !== 'io client disconnect') {
                    dispatch(disconnectServer());
                }
            });
        }

        if (embedded && initialized) {
            dispatch(showChat());
            dispatch(openChat());
        }
    }

    // TODO: Need to erase redux store on load if localStorage
    // is erased. Then behavior on reload can be consistent with
    // behavior on first load

    trySendInitPayload() {
        const {
            initPayload,
            customData,
            socket,
            initialized,
            isChatOpen,
            isChatVisible,
            embedded,
            connected,
            dispatch,
        } = this.props;
        // Send initial payload when chat is opened or widget is shown
        if (!initialized && connected && ((isChatOpen && isChatVisible) || embedded)) {
            // Only send initial payload if the widget is connected to the server but not yet initialized

            const sessionId = this.getSessionId();

            // check that session_id is confirmed
            if (!sessionId) return;

            // eslint-disable-next-line no-console
            console.log('sending init payload', sessionId);
            console.log('socket:', socket);
            socket.emit('user_uttered', {
                message: initPayload,
                customData,
                session_id: sessionId,
            });
            dispatch(initialize());
        }
    }

    trySendTooltipPayload() {
        const {
            tooltipPayload,
            socket,
            customData,
            connected,
            isChatOpen,
            dispatch,
            tooltipSent,
        } = this.props;

        if (connected && !isChatOpen && !tooltipSent.get(tooltipPayload)) {
            const sessionId = this.getSessionId();

            if (!sessionId) return;

            socket.emit('user_uttered', {
                message: tooltipPayload,
                customData,
                session_id: sessionId,
            });

            dispatch(triggerTooltipSent(tooltipPayload));
            dispatch(initialize());
        }
    }

    toggleConversation() {
        clearTimeout(this.botWindowSetTimeout);
        const { isChatOpen, dispatch, disableTooltips } = this.props;
        if (isChatOpen && this.delayedMessage) {
            if (!disableTooltips) dispatch(showTooltip(true));
            clearTimeout(this.messageDelayTimeout);
            this.dispatchMessage(this.delayedMessage);
            dispatch(newUnreadMessage());
            this.onGoingMessageDelay = false;
            dispatch(triggerMessageDelayed(false));
            this.messages.forEach(message => {
                this.dispatchMessage(message);
                dispatch(newUnreadMessage());
            });
            this.applyCustomStyle();

            this.messages = [];
            this.delayedMessage = null;
        } else {
            this.props.dispatch(showTooltip(false));
        }
        clearTimeout(this.tooltipTimeout);
        dispatch(toggleChat());
    }

    toggleFullScreen() {
        this.props.dispatch(toggleFullScreen());
    }

    dispatchMessage(message) {
        if (Object.keys(message).length === 0) {
            return;
        }
        const { customCss, ...messageClean } = message;
        console.log('+++++++ GS dispatchMessage +++++++', messageClean);
        console.log('+++++++ GS dispatchMessage222 +++++++', messageClean.text);
        console.log('+++++++ GS dispatchMessage333 +++++++', Object.keys(messageClean));

        if (!this.props.liveChat){
            // disable attachment button from GUI
            // this.props.dispatch(doInputDisabled());
            this.props.dispatch(doAttachDisabled());
            this.props.dispatch(doAttachLocationDisabled());
        } else {
            this.props.dispatch(doInputEnabled());
            this.props.dispatch(doAttachEnabled());
            this.props.dispatch(doAttachLocationEnabled());
            this.props.dispatch(changeInputFieldHint('Type a message…'));
        }

        if (isText(messageClean)) {
            const str = messageClean.text;
            const n = str.includes('TERMINATE_CHAT');
            if (!n) {
                this.props.dispatch(addResponseMessage(messageClean.text));
            }
        } else if (isFAQ(messageClean)) {
            this.props.dispatch(addFAQReply(messageClean));
            this.props.dispatch(doInputDisabled());
            this.props.dispatch(doAttachDisabled());
            this.props.dispatch(doAttachLocationDisabled());
        } else if (isCarouselType1(messageClean)) {
            this.props.dispatch(addCarouselType1(messageClean));
            this.props.dispatch(doInputDisabled());
            this.props.dispatch(doAttachDisabled());
            this.props.dispatch(doAttachLocationDisabled());
        } else if (isCarouselType2(messageClean)) {
            this.props.dispatch(addCarouselType2(messageClean));
            this.props.dispatch(doInputDisabled());
            this.props.dispatch(doAttachDisabled());
            this.props.dispatch(doAttachLocationDisabled());
        } else if (isCollectInfoType1(messageClean)) {
            this.props.dispatch(addCollectInfoType1(messageClean));
            this.props.dispatch(doInputDisabled());
            this.props.dispatch(doAttachDisabled());
            this.props.dispatch(doAttachLocationDisabled());
        } else if (isCaptureatttype(messageClean)) {
            this.props.dispatch(addCaptureatttype(messageClean));
            this.props.dispatch(doInputDisabled());
            this.props.dispatch(doAttachLocationEnabled());
        }
        // else if (isCaptureloctype(messageClean)) {
        //     this.props.dispatch(addCaptureloctype(messageClean));
        //     this.props.dispatch(doInputDisabled());
        //     this.props.dispatch(doAttachDisabled());
        // }
        else if (isQR(messageClean)) {
            this.props.dispatch(addQuickReply(messageClean));
            this.props.dispatch(doInputDisabled());
            this.props.dispatch(doAttachDisabled());
            this.props.dispatch(doAttachLocationDisabled());
        } else if (isCarousel(messageClean)) {
            this.props.dispatch(addCarousel(messageClean));
        } else if (isVideo(messageClean)) {
            const element = messageClean.attachment.payload;
            this.props.dispatch(
                addVideoSnippet({
                    title: element.title,
                    video: element.src,
                })
            );
        } else if (isImage(messageClean)) {
            const element = messageClean.attachment.payload;
            this.props.dispatch(
                addImageSnippet({
                    title: element.title,
                    image: element.src,
                })
            );
        } else {
            // some custom message
            const props = messageClean;
            if (this.props.customComponent) {
                this.props.dispatch(renderCustomComponent(this.props.customComponent, props, true));
            }
        }
        if (customCss) {
            this.props.dispatch(setCustomCss(message.customCss));
        }
    }

    handleMessageSubmit(event) {
        console.log(
            ' ++++++++++++++++  Widget handleMessageSubmit ---> User typed somethings',
            event.target.message.value
        );

        if (!this.props.liveChat){
            // disable attachment button from GUI
            this.props.dispatch(doInputDisabled());
            this.props.dispatch(doAttachDisabled());
            this.props.dispatch(doAttachLocationDisabled());
        } else {
            this.props.dispatch(doInputEnabled());
            this.props.dispatch(doAttachEnabled());
            this.props.dispatch(doAttachLocationEnabled());
            this.props.dispatch(changeInputFieldHint('Type a message…'));
        }

        // this.props.dispatch(doInputDisabled());
        // this.props.dispatch(doAttachDisabled());
        //this.props.dispatch(changeInputFieldHint(''));
        event.preventDefault();
        const userUttered = event.target.message.value;
        if (userUttered) {
            this.props.dispatch(addUserMessage(userUttered));
            this.props.dispatch(emitUserMessage(userUttered));
        }
        event.target.message.value = '';
    }

    resetChatConversation() {
        const { storage, socket, dispatch } = this.props;

        storage.clear();
        localStorage.clear();
        dispatch(disconnectServer());

        const localSession = getLocalSession(storage, SESSION_NAME);
        const lastUpdate = localSession ? localSession.lastUpdate : 0;
        socket.close();
        this.conversationStarted = false;
        if (Date.now() - lastUpdate < 30 * 60 * 1000) {
            this.initializeWidget();
        } else {
            localStorage.removeItem(SESSION_NAME);
        }
    }

    render() {
        return (
            <WidgetLayout
                toggleChat={() => this.toggleConversation()}
                toggleFullScreen={() => this.toggleFullScreen()}
                onSendMessage={event => this.handleMessageSubmit(event)}
                resetChat={event => this.resetChatConversation(event)}
                title={this.props.title}
                bgColor={this.props.bgColor}
                botWindowWidth={this.props.botWindowWidth}
                botWindowHeight={this.props.botWindowHeight}
                botWindowScrollStickColor={this.props.botWindowScrollStickColor}
                chatFontSize={this.props.chatFontSize}
                clientchatTextColor={this.props.clientchatTextColor}
                clientTextBgColor={this.props.clientTextBgColor}
                botButtonBorderColor={this.props.botButtonBorderColor}
                botButtonTextColor={this.props.botButtonTextColor}
                botButtonBgColor={this.props.botButtonBgColor}
                botButtonBorderColorHover={this.props.botButtonBorderColorHover}
                botButtonTextColorHover={this.props.botButtonTextColorHover}
                botButtonBgColorHover={this.props.botButtonBgColorHover}
                botButtonAlignment={this.props.botButtonAlignment}
                titleColor={this.props.titleColor}
                titleFontSize={this.props.titleFontSize}
                subTitleColor={this.props.subTitleColor}
                subTitleFontSize={this.props.subTitleFontSize}
                botChatTextColor={this.props.botChatTextColor}
                sendButtonColor={this.props.sendButtonColor}
                resetCloseButtonColor={this.props.resetCloseButtonColor}
                minWidthOfButton={this.props.minWidthOfButton}
                widthOfButton={this.props.widthOfButton}
                minHeightOfButton={this.props.minHeightOfButton}
                horizontalSpaceBtwButton={this.props.horizontalSpaceBtwButton}
                verticalSpaceBtwButton={this.props.verticalSpaceBtwButton}
                faquiBoundaryColor={this.props.faquiBoundaryColor}
                faquiHeaderBgColor={this.props.faquiHeaderBgColor}
                faquiHeaderHeight={this.props.faquiHeaderHeight}
                faquiHeaderFontSize={this.props.faquiHeaderFontSize}
                faquiHeaderTextColor={this.props.faquiHeaderTextColor}
                faquiBodyTextColor={this.props.faquiBodyTextColor}
                faquiMouseOverBodyBgColor={this.props.faquiMouseOverBodyBgColor}
                faquiMouseOverBodyTextColor={this.props.faquiMouseOverBodyTextColor}
                faquiScrollStickColor={this.props.faquiScrollStickColor}
                faquiRowHeight={this.props.faquiRowHeight}
                faquiBgColor={this.props.faquiBgColor}
                faquiRowSeparateColor={this.props.faquiRowSeparateColor}
                chatbotBgColor={this.props.chatbotBgColor}
                botTextBgColor={this.props.botTextBgColor}
                userTypeWindowBgColor={this.props.userTypeWindowBgColor}
                placeholderTextColor={this.props.placeholderTextColor}
                inputCaretColor={this.props.inputCaretColor}
                isFooterEnabled={this.props.isFooterEnabled}
                poweredByImage={this.props.poweredByImage}
                titleFontFamily={this.props.titleFontFamily}
                subTitleFontFamily={this.props.subTitleFontFamily}
                textFontFamily={this.props.textFontFamily}
                spinnerPathColor={this.props.spinnerPathColor}
                spinnerRunnerColor={this.props.spinnerRunnerColor}
                subtitle={this.props.subtitle}
                customData={this.props.customData}
                profileAvatar={this.props.profileAvatar}
                titleAvatar={this.props.titleAvatar}
                showCloseButton={this.props.showCloseButton}
                showFullScreenButton={this.props.showFullScreenButton}
                hideWhenNotConnected={this.props.hideWhenNotConnected}
                fullScreenMode={this.props.fullScreenMode}
                isChatOpen={this.props.isChatOpen}
                isChatVisible={this.props.isChatVisible}
                badge={this.props.badge}
                embedded={this.props.embedded}
                params={this.props.params}
                openLauncherImage={this.props.openLauncherImage}
                closeImage={this.props.closeImage}
                customComponent={this.props.customComponent}
                displayUnreadCount={this.props.displayUnreadCount}
                showMessageDate={this.props.showMessageDate}
                tooltipPayload={this.props.tooltipPayload}
                titleBoldNeeded={this.props.titleBoldNeeded}
                subtitleItalicNeeded={this.props.subtitleItalicNeeded}
                helperText={this.props.helperText}
                button2Launcher={this.props.button2Launcher}
                carouselType1Style={this.props.carouselType1Style}
                carouselType2Style={this.props.carouselType2Style}
                contactInfoStyle={this.props.contactInfoStyle}
                isTextAreaBoxShadowEnabled={this.props.isTextAreaBoxShadowEnabled}
                downloadOptions={this.props.downloadOptions}
            />
        );
    }
}

const mapStateToProps = state => ({
    initialized: state.behavior.get('initialized'),
    connected: state.behavior.get('connected'),
    isChatOpen: state.behavior.get('isChatOpen'),
    isChatVisible: state.behavior.get('isChatVisible'),
    fullScreenMode: state.behavior.get('fullScreenMode'),
    tooltipSent: state.metadata.get('tooltipSent'),
    oldUrl: state.behavior.get('oldUrl'),
    pageChangeCallbacks: state.behavior.get('pageChangeCallbacks'),
    domHighlight: state.metadata.get('domHighlight'),
});

Widget.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    customData: PropTypes.shape({}),
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    initPayload: PropTypes.string,
    profileAvatar: PropTypes.string,
    showCloseButton: PropTypes.bool,
    showFullScreenButton: PropTypes.bool,
    hideWhenNotConnected: PropTypes.bool,
    connectOn: PropTypes.oneOf(['mount', 'open']),
    autoClearCache: PropTypes.bool,
    fullScreenMode: PropTypes.bool,
    isChatVisible: PropTypes.bool,
    isChatOpen: PropTypes.bool,
    badge: PropTypes.number,
    socket: PropTypes.shape({}),
    embedded: PropTypes.bool,
    params: PropTypes.shape({}),
    connected: PropTypes.bool,
    initialized: PropTypes.bool,
    openLauncherImage: PropTypes.string,
    closeImage: PropTypes.string,
    customComponent: PropTypes.func,
    displayUnreadCount: PropTypes.bool,
    showMessageDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    customMessageDelay: PropTypes.func.isRequired,
    tooltipPayload: PropTypes.string,
    tooltipSent: PropTypes.shape({}),
    tooltipDelay: PropTypes.number.isRequired,
    domHighlight: PropTypes.shape({}),
    storage: PropTypes.shape({}),
    disableTooltips: PropTypes.bool,
    defaultHighlightAnimation: PropTypes.string,
    defaultHighlightCss: PropTypes.string,
    defaultHighlightClassname: PropTypes.string,
    downloadOptions: PropTypes.shape({}),
};

Widget.defaultProps = {
    isChatOpen: false,
    isChatVisible: true,
    fullScreenMode: false,
    connectOn: 'mount',
    autoClearCache: false,
    displayUnreadCount: false,
    tooltipPayload: null,
    oldUrl: '',
    disableTooltips: false,
    defaultHighlightClassname: '',
    defaultHighlightCss:
        'animation: 0.5s linear infinite alternate default-botfront-blinker-animation; outline-style: solid;',
    // unfortunately it looks like outline-style is not an animatable property on Safari
    defaultHighlightAnimation: `@keyframes default-botfront-blinker-animation {
    0% {
      outline-color: rgba(0,255,0,0);
    }
    49% {
      outline-color: rgba(0,255,0,0);
    }
    50% {
      outline-color:green;
    }
    100% {
      outline-color: green;
    }
  }`,
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(Widget);
