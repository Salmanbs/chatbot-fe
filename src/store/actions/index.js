import * as actions from './actionTypes';

export function initialize() {
  return {
    type: actions.INITIALIZE
  };
}

export function connectServer() {
  return {
    type: actions.CONNECT
  };
}

export function disconnectServer() {
  return {
    type: actions.DISCONNECT
  };
}

export function getOpenState() {
  return {
    type: actions.GET_OPEN_STATE
  };
}

export function getVisibleState() {
  return {
    type: actions.GET_VISIBLE_STATE
  };
}

export function showChat() {
  return {
    type: actions.SHOW_CHAT
  };
}

export function hideChat() {
  return {
    type: actions.HIDE_CHAT
  };
}

export function toggleChat() {
  return {
    type: actions.TOGGLE_CHAT
  };
}

export function openChat() {
  return {
    type: actions.OPEN_CHAT
  };
}

export function closeChat() {
  return {
    type: actions.CLOSE_CHAT
  };
}

export function toggleFullScreen() {
  return {
    type: actions.TOGGLE_FULLSCREEN
  };
}

export function doInputDisabled() {
  return {
    type: actions.TOGGLE_INPUT_DISABLED
  };
}

export function doAttachDisabled() {
  return {
    type: actions.TOGGLE_ATTACH_DISABLED
  };
}

export function doAttachLocationDisabled() {
  return {
    type: actions.TOGGLE_ATTACH_LOCATION_DISABLED
  };
}

export function doInputEnabled() {
  return {
    type: actions.TOGGLE_INPUT_ENABLED
  };
}

export function doAttachEnabled() {
  return {
    type: actions.TOGGLE_ATTACH_ENABLED
  };
}

export function doAttachLocationEnabled() {
  return {
    type: actions.TOGGLE_ATTACH_LOCATION_ENABLED
  };
}

export function changeInputFieldHint(hint) {
  return {
    type: actions.CHANGE_INPUT_FIELD_HINT,
    hint
  };
}

export function addUserMessage(text) {
  return {
    type: actions.ADD_NEW_USER_MESSAGE,
    text
  };
}

export function emitUserMessage(text) {
  return {
    type: actions.EMIT_NEW_USER_MESSAGE,
    text
  };
}

export function emitMessageIfFirst(payload, text = null) {
  return {
    type: actions.EMIT_MESSAGE_IF_FIRST,
    payload,
    text
  };
}

export function addResponseMessage(text) {
  return {
    type: actions.ADD_NEW_RESPONSE_MESSAGE,
    text
  };
}

export function addCarousel(carousel) {
  return {
    type: actions.ADD_CAROUSEL,
    carousel
  };
}

export function addVideoSnippet(video) {
  return {
    type: actions.ADD_NEW_VIDEO_VIDREPLY,
    video
  };
}

export function addImageSnippet(image) {
  return {
    type: actions.ADD_NEW_IMAGE_IMGREPLY,
    image
  };
}

export function addImageSnippetUser(image) {
  return {
    type: actions.ADD_NEW_USER_IMAGE_IMGREPLY,
    image
  };
}


export function addQuickReply(quickReply) {
  return {
    type: actions.ADD_QUICK_REPLY,
    quickReply
  };
}

export function addFAQReply(quickReply) {
  return {
    type: actions.ADD_FAQ_REPLY,
    quickReply
  };
}

export function addCarouselType1(quickReply) {
  return {
    type: actions.ADD_CAROUSEL_TYPE1,
    quickReply
  };
}

export function addCarouselType2(quickReply) {
  return {
    type: actions.ADD_CAROUSEL_TYPE2,
    quickReply
  };
}

export function addCollectInfoType1(quickReply) {
  return {
    type: actions.ADD_COLLECTINFO_TYPE1,
    quickReply
  };
}

export function addCaptureatttype(quickReply) {
  return {
    type: actions.ADD_CAPTURE_ATTYPE,
    quickReply
  };
}

export function addCaptureloctype(quickReply) {
  return {
    type: actions.ADD_CAPTURE_LOCTYPE,
    quickReply
  };
}

export function setQuickReply(id, title) {
  return {
    type: actions.SET_QUICK_REPLY,
    id,
    title
  };
}

export function setFAQReply(id, title) {
  return {
    type: actions.SET_FAQ_REPLY,
    id,
    title
  };
}

export function setCarouselType1(id, title) {
  return {
    type: actions.SET_CAROUSEL_TYPE1,
    id,
    title
  };
}

export function setCarouselType2(id, title) {
  return {
    type: actions.SET_CAROUSEL_TYPE2,
    id,
    title
  };
}

export function setCollectInfoType1(id, title) {
  return {
    type: actions.SET_COLLECTINFO_TYPE1,
    id,
    title
  };
}

export function setCaptureatttype(id, title) {
  return {
    type: actions.SET_CAPTURE_ATTYPE,
    id,
    title
  };
}

export function setCaptureloctype(id, title) {
  return {
    type: actions.SET_CAPTURE_LOCTYPE,
    id,
    title
  };
}

export function insertUserMessage(index, text) {
  return {
    type: actions.INSERT_NEW_USER_MESSAGE,
    index,
    text
  };
}

export function renderCustomComponent(component, props, showAvatar) {
  return {
    type: actions.ADD_COMPONENT_MESSAGE,
    component,
    props,
    showAvatar
  };
}

export function dropMessages() {
  return {
    type: actions.DROP_MESSAGES
  };
}

export function pullSession() {
  return {
    type: actions.PULL_SESSION
  };
}

export function newUnreadMessage() {
  return {
    type: actions.NEW_UNREAD_MESSAGE
  };
}

export function triggerMessageDelayed(messageDelayed) {
  return {
    type: actions.TRIGGER_MESSAGE_DELAY,
    messageDelayed
  };
}

export function showTooltip(visible) {
  return {
    type: actions.SHOW_TOOLTIP,
    visible
  };
}


export function triggerTooltipSent(payloadSent) {
  return {
    type: actions.TRIGGER_TOOLTIP_SENT,
    payloadSent
  };
}

export function clearMetadata() {
  return {
    type: actions.CLEAR_METADATA
  };
}

export function setLinkTarget(target) {
  return {
    type: actions.SET_LINK_TARGET,
    target
  };
}

export function setUserInput(userInputState) {
  return {
    type: actions.SET_USER_INPUT,
    userInputState
  };
}

export function setPageChangeCallbacks(pageChangeCallbacks) {
  return {
    type: actions.SET_PAGECHANGE_CALLBACKS,
    pageChangeCallbacks
  };
}


export function setDomHighlight(domHighlight) {
  return {
    type: actions.SET_DOM_HIGHLIGHT,
    domHighlight
  };
}

export function hintText(hint) {
  return {
    type: actions.SET_HINT_TEXT,
    hint
  };
}


export function changeOldUrl(url) {
  return {
    type: actions.SET_OLD_URL,
    url
  };
}

export function evalUrl(url) {
  return {
    type: actions.EVAL_URL,
    url
  };
}

export function setCustomCss(customCss) {
  return {
    type: actions.SET_CUSTOM_CSS,
    customCss
  };
}

