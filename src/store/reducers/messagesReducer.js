import { List, fromJS } from 'immutable';
import { MESSAGE_SENDER, SESSION_NAME } from 'constants';

import {
  createQuickReply,
  createFAQReply,
  createCarouselType1,
  createCarouselType2,
  createCollectInfoType1,
  createCaptureatttype,
  createCaptureloctype,
  createNewMessage,
  createCarousel,
  createVideoSnippet,
  createImageSnippet,
  createComponentMessage,
  storeMessageTo,
  getLocalSession
} from './helper';

import * as actionTypes from '../actions/actionTypes';

export default function (storage) {
  const initialState = List([]);

  return function reducer(state = initialState, action) {
    const storeMessage = storeMessageTo(storage);
    switch (action.type) {
      // Each change to the redux store's message list gets recorded to storage
      case actionTypes.ADD_NEW_USER_MESSAGE: {
        return storeMessage(state.push(createNewMessage(action.text, MESSAGE_SENDER.CLIENT)));
      }
      case actionTypes.ADD_NEW_RESPONSE_MESSAGE: {
        return storeMessage(state.push(createNewMessage(action.text, MESSAGE_SENDER.RESPONSE)));
      }
      case actionTypes.ADD_CAROUSEL: {
        return storeMessage(state.push(createCarousel(action.carousel, MESSAGE_SENDER.RESPONSE)));
      }
      case actionTypes.ADD_NEW_VIDEO_VIDREPLY: {
        return storeMessage(state.push(createVideoSnippet(action.video, MESSAGE_SENDER.RESPONSE)));
      }
      case actionTypes.ADD_NEW_IMAGE_IMGREPLY: {
        console.log('+++++++ createImageSnippet ADD_NEW_IMAGE_IMGREPLY +++++++');
        return storeMessage(state.push(createImageSnippet(action.image, MESSAGE_SENDER.RESPONSE)));
      }
      case actionTypes.ADD_NEW_USER_IMAGE_IMGREPLY: {
        console.log('+++++++ createImageSnippet ADD_NEW_USER_IMAGE_IMGREPLY +++++++');

        return storeMessage(state.push(createImageSnippet(action.image, MESSAGE_SENDER.CLIENT)));
      }
      case actionTypes.ADD_QUICK_REPLY: {
        return storeMessage(state.push(createQuickReply(action.quickReply, MESSAGE_SENDER.RESPONSE)));
      }
      case actionTypes.ADD_FAQ_REPLY: {
        return storeMessage(state.push(createFAQReply(action.quickReply, MESSAGE_SENDER.RESPONSE)));
      }
      case actionTypes.ADD_CAROUSEL_TYPE1: {
        return storeMessage(state.push(createCarouselType1(action.quickReply, MESSAGE_SENDER.RESPONSE)));
      }
      case actionTypes.ADD_CAROUSEL_TYPE2: {
        return storeMessage(state.push(createCarouselType2(action.quickReply, MESSAGE_SENDER.RESPONSE)));
      }
      case actionTypes.ADD_COLLECTINFO_TYPE1: {
        return storeMessage(state.push(createCollectInfoType1(action.quickReply, MESSAGE_SENDER.RESPONSE)));
      }
      case actionTypes.ADD_CAPTURE_ATTYPE: {
        return storeMessage(state.push(createCaptureatttype(action.quickReply, MESSAGE_SENDER.RESPONSE)));
      }
      case actionTypes.ADD_CAPTURE_LOCTYPE: {
        return storeMessage(state.push(createCaptureloctype(action.quickReply, MESSAGE_SENDER.RESPONSE)));
      }
      case actionTypes.ADD_COMPONENT_MESSAGE: {
        return storeMessage(state.push(createComponentMessage(action.component, action.props, action.showAvatar)));
      }
      case actionTypes.SET_QUICK_REPLY: {
        return storeMessage(state.setIn([action.id, 'chosenReply'], action.title));
      }
      case actionTypes.SET_FAQ_REPLY: {
        return storeMessage(state.setIn([action.id, 'chosenReply'], action.title));
      }
      case actionTypes.SET_CAROUSEL_TYPE1: {
        return storeMessage(state.setIn([action.id, 'chosenReply'], action.title));
      }
      case actionTypes.SET_CAROUSEL_TYPE2: {
        return storeMessage(state.setIn([action.id, 'chosenReply'], action.title));
      }
      case actionTypes.SET_COLLECTINFO_TYPE1: {
        return storeMessage(state.setIn([action.id, 'chosenReply'], action.title));
      }
      case actionTypes.SET_CAPTURE_ATTYPE: {
        return storeMessage(state.setIn([action.id, 'chosenReply'], action.title));
      }
      case actionTypes.SET_CAPTURE_LOCTYPE: {
        return storeMessage(state.setIn([action.id, 'chosenReply'], action.title));
      }
      case actionTypes.INSERT_NEW_USER_MESSAGE: {
        return storeMessage(state.insert(action.index, createNewMessage(action.text, MESSAGE_SENDER.CLIENT)));
      }
      case actionTypes.DROP_MESSAGES: {
        return storeMessage(initialState);
      }
      case actionTypes.EMIT_MESSAGE_IF_FIRST: {
        if (state.size === 0) {
          if (action.text) {
            return storeMessage(state.push(createNewMessage(action.text, MESSAGE_SENDER.CLIENT)));
          }
          return state;
        }
        return state;
      }
      case actionTypes.SET_CUSTOM_CSS: {
        return storeMessage(state.update(state.size - 1, message => message.set('customCss', fromJS(action.customCss))));
      }
      // Pull conversation from storage, parsing as immutable List
      case actionTypes.PULL_SESSION: {
        const localSession = getLocalSession(storage, SESSION_NAME);
        if (localSession) {
          return fromJS(localSession.conversation);
        }
        return state;
      }
      default:
        return state;
    }
  };
}

