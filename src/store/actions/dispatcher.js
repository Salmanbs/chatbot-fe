import { store } from '../../index';
import * as actions from './index';

export function isOpen() {
  return store.dispatch(actions.getOpenState());
}

export function isVisible() {
  return store.dispatch(actions.getVisibleState());
}

export function initialize() {
  store.dispatch(actions.initialize());
}

export function connect() {
  store.dispatch(actions.connect());
}

export function disconnect() {
  store.dispatch(actions.disconnect());
}

export function addUserMessage(text) {
  store.dispatch(actions.addUserMessage(text));
}

export function emitUserMessage(text) {
  store.dispatch(actions.emitUserMessage(text));
}

export function addResponseMessage(text) {
  store.dispatch(actions.addResponseMessage(text));
}

export function addCarousel(carousel) {
  store.dispatch(actions.addCarousel(carousel));
}

export function addVideoSnippet(video) {
  store.dispatch(actions.addVideoSnippet(video));
}

export function addImageSnippet(image) {
  store.dispatch(actions.addImageSnippet(image));
}

export function addQuickReply(quickReply) {
  store.dispatch(actions.addQuickReply(quickReply));
}

export function addFAQReply(quickReply) {
  store.dispatch(actions.addFAQReply(quickReply));
}

export function addCarouselType1(quickReply) {
  store.dispatch(actions.addCarouselType1(quickReply));
}

export function addCarouselType2(quickReply) {
  store.dispatch(actions.addCarouselType2(quickReply));
}

export function addCollectInfoType1(quickReply) {
  store.dispatch(actions.addCollectInfoType1(quickReply));
}

export function addCaptureatttype(quickReply) {
  store.dispatch(actions.addCaptureatttype(quickReply));
}

export function addCaptureloctype(quickReply) {
  store.dispatch(actions.addCaptureloctype(quickReply));
}

export function setQuickReply(id, title) {
  store.dispatch(actions.setQuickReply(id, title));
}

export function insertUserMessage(id, text) {
  store.dispatch(actions.insertUserMessage(id, text));
}

export function renderCustomComponent(component, props, showAvatar = false) {
  store.dispatch(actions.renderCustomComponent(component, props, showAvatar));
}

export function openChat() {
  store.dispatch(actions.openChat());
}

export function closeChat() {
  store.dispatch(actions.closeChat());
}

export function toggleChat() {
  store.dispatch(actions.toggleChat());
}

export function showChat() {
  store.dispatch(actions.showChat());
}

export function hideChat() {
  store.dispatch(actions.hideChat());
}

export function toggleFullScreen() {
  store.dispatch(actions.toggleFullScreen());
}

export function doInputDisabled() {
  store.dispatch(actions.doInputDisabled());
}

export function doAttachDisabled() {
  store.dispatch(actions.doAttachDisabled());
}

export function doAttachLocationDisabled() {
  store.dispatch(actions.doAttachLocationDisabled());
}

export function doInputEnabled() {
  store.dispatch(actions.doInputEnabled());
}

export function doAttachEnabled() {
  store.dispatch(actions.doAttachEnabled());
}

export function doAttachLocationEnabled() {
  store.dispatch(actions.doAttachLocationEnabled());
}

export function changeInputFieldHint(hint) {
  store.dispatch(actions.changeInputFieldHint(hint));
}

export function dropMessages() {
  store.dispatch(actions.dropMessages());
}

export function pullSession() {
  store.dispatch(actions.pullSession());
}

export function newUnreadMessage() {
  store.dispatch(actions.newUnreadMessage());
}

export function send(playload, text = '', customStore) {
  if (customStore) {
    customStore.dispatch(actions.emitUserMessage(playload));
    if (text !== '') customStore.dispatch(actions.addUserMessage(text));
    return;
  }
  store.dispatch(actions.emitUserMessage(playload));
  if (text !== '') store.dispatch(actions.addUserMessage(text));
}
