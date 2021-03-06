import { Map, fromJS } from 'immutable';
import { MESSAGES_TYPES, MESSAGE_SENDER, SESSION_NAME } from 'constants';

import { Video, Image, Message, Carousel, QuickReply, FrequentQuestions, CarouselType1, CarouselType2, CollectInfoType1, Captureloctype, Captureatttype } from 'messagesComponents';

export function createNewMessage(text, sender) {
  return Map({
    type: MESSAGES_TYPES.TEXT,
    component: Message,
    text,
    sender,
    showAvatar: sender === MESSAGE_SENDER.RESPONSE,
    timestamp: new Date().getTime()
  });
}

export function createCarousel(carousel, sender) {
  return Map({
    type: MESSAGES_TYPES.CAROUSEL,
    component: Carousel,
    sender,
    elements: fromJS(carousel.attachment.payload.elements),
    timestamp: new Date().getTime()
  });
}

export function createVideoSnippet(video, sender) {
  return Map({
    type: MESSAGES_TYPES.VIDREPLY.VIDEO,
    component: Video,
    title: video.title,
    video: video.video,
    sender,
    showAvatar: true,
    timestamp: new Date().getTime()
  });
}

export function createImageSnippet(image, sender) {
  console.log('+++++++ createImageSnippet +++++++', image);
  return Map({
    type: MESSAGES_TYPES.IMGREPLY.IMAGE,
    component: Image,
    title: image.title,
    image: image.image,
    sender: MESSAGE_SENDER.CLIENT,
    showAvatar: sender === MESSAGE_SENDER.RESPONSE,
    timestamp: new Date().getTime()
  });
}

export function createQuickReply(quickReply, sender) {
  return Map({
    type: MESSAGES_TYPES.QUICK_REPLY,
    component: QuickReply,
    text: quickReply.text,
    hint: quickReply.hint || 'Select an option...',
    quick_replies: fromJS(quickReply.quick_replies),
    sender,
    showAvatar: true,
    chosenReply: null,
    timestamp: new Date().getTime()
  });
}


export function createFAQReply(quickReply, sender) {
  return Map({
    type: MESSAGES_TYPES.FAQ_REPLY,
    component: FrequentQuestions,
    text: quickReply.text.substr(7),
    hint: quickReply.hint || 'Select an option...',
    quick_replies: fromJS(quickReply.quick_replies),
    sender,
    showAvatar: true,
    chosenReply: null,
    timestamp: new Date().getTime()
  });
}

export function createCarouselType1(quickReply, sender) {
  return Map({
    type: MESSAGES_TYPES.CAROUSEL_TYPE1,
    component: CarouselType1,
    text: quickReply.text.substr(14),
    hint: quickReply.hint || 'Select an option...',
    quick_replies: fromJS(quickReply.quick_replies),
    sender,
    showAvatar: true,
    chosenReply: null,
    timestamp: new Date().getTime()
  });
}

export function createCarouselType2(quickReply, sender) {
  return Map({
    type: MESSAGES_TYPES.CAROUSEL_TYPE2,
    component: CarouselType2,
    text: quickReply.text.substr(14),
    hint: quickReply.hint || 'Select an option...',
    quick_replies: fromJS(quickReply.quick_replies),
    sender,
    showAvatar: true,
    chosenReply: null,
    timestamp: new Date().getTime()
  });
}

export function createCollectInfoType1(quickReply, sender) {
  return Map({
    type: MESSAGES_TYPES.COLLECTINFO_TYPE1,
    component: CollectInfoType1,
    text: quickReply.text.substr(17),
    hint: quickReply.hint || 'Select an option...',
    quick_replies: fromJS(quickReply.quick_replies),
    sender,
    showAvatar: true,
    chosenReply: null,
    timestamp: new Date().getTime()
  });
}

export function createCaptureatttype(quickReply, sender) {
  return Map({
    type: MESSAGES_TYPES.CAPTURE_ATTYPE,
    component: Captureatttype,
    text: quickReply.text.substr(15),
    hint: quickReply.hint || 'Select images...',
    quick_replies: fromJS(quickReply.quick_replies),
    sender,
    showAvatar: true,
    chosenReply: null,
    timestamp: new Date().getTime()
  });
}

export function createCaptureloctype(quickReply, sender) {
  return Map({
    type: MESSAGES_TYPES.CAPTURE_LOCTYPE,
    component: Captureatttype,
    text: quickReply.text.substr(15),
    hint: quickReply.hint || 'Select location...',
    quick_replies: fromJS(quickReply.quick_replies),
    sender,
    showAvatar: true,
    chosenReply: null,
    timestamp: new Date().getTime()
  });
}

export function createComponentMessage(component, props, showAvatar) {
  return Map({
    type: MESSAGES_TYPES.CUSTOM_COMPONENT,
    component,
    props,
    sender: MESSAGE_SENDER.RESPONSE,
    showAvatar,
    timestamp: new Date().getTime()
  });
}

export function getLocalSession(storage, key) {
  // Attempt to get local session from storage
  const cachedSession = storage.getItem(key);
  let session = null;
  if (cachedSession) {
    // Found existing session in storage
    const parsedSession = JSON.parse(cachedSession);
    // Format conversation from array of object to immutable Map for use by messages components
    const formattedConversation = parsedSession.conversation
      ? parsedSession.conversation
      : [];
    // Check if params is undefined
    const formattedParams = parsedSession.params
      ? parsedSession.params
      : {};
    const formattedMetadata = parsedSession.metadata
      ? parsedSession.metadata
      : {};
    // Create a new session to return
    session = {
      ...parsedSession,
      conversation: formattedConversation,
      params: formattedParams,
      metadata: formattedMetadata
    };
  }
  // Returns a formatted session object if any found, otherwise return undefined
  return session;
}

export function storeLocalSession(storage, key, sid) {
  // Attempt to store session id to local storage
  const cachedSession = storage.getItem(key);
  let session;
  if (cachedSession) {
    // Found exisiting session in storage
    const parsedSession = JSON.parse(cachedSession);
    session = {
      ...parsedSession,
      session_id: sid
    };
  } else {
    // No existing local session, create a new empty session with only session_id
    session = {
      session_id: sid
    };
  }
  // Store updated session to storage
  storage.setItem(key, JSON.stringify(session));
}

export const storeMessageTo = storage => (conversation) => {
  // Store a conversation List to storage
  const localSession = getLocalSession(storage, SESSION_NAME);
  const newSession = {
    // Since immutable List is not a native JS object, store conversation as array
    ...localSession,
    conversation: conversation.toJS(),
    lastUpdate: Date.now()
  };
  storage.setItem(SESSION_NAME, JSON.stringify(newSession));
  return conversation;
};

export const storeParamsTo = storage => (params) => {
  // Store a params List to storage
  const localSession = getLocalSession(storage, SESSION_NAME);
  const newSession = {
    // Since immutable Map is not a native JS object, store conversation as array
    ...localSession,
    params: params.toJS(),
    lastUpdate: Date.now()
  };
  storage.setItem(SESSION_NAME, JSON.stringify(newSession));
  return params;
};


export const storeMetadataTo = storage => (metadata) => {
  // Store a params List to storage
  const localSession = getLocalSession(storage, SESSION_NAME);
  const newSession = {
    // Since immutable Map is not a native JS object, store conversation as array
    ...localSession,
    metadata: metadata.toJS(),
    lastUpdate: Date.now()
  };
  storage.setItem(SESSION_NAME, JSON.stringify(newSession));
  return metadata;
};
