import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

export const SESSION_NAME = 'chat_session';

export const MESSAGE_SENDER = {
  CLIENT: 'client',
  RESPONSE: 'response'
};

export const MESSAGES_TYPES = {
  TEXT: 'text',
  CAROUSEL: 'carousel',
  VIDREPLY: {
    VIDEO: 'vidreply'
  },
  IMGREPLY: {
    IMAGE: 'imgreply'
  },
  QUICK_REPLY: 'quickreply',
  FAQ_REPLY: 'faqreply',
  CAROUSEL_TYPE1: 'carouseltype1',
  CAROUSEL_TYPE2: 'carouseltype2',
  COLLECTINFO_TYPE1: 'collectinfotype1',
  CAPTURE_ATTYPE: 'captureatttype',
  CAPTURE_LOCTYPE: 'captureloctype',
  CUSTOM_COMPONENT: 'component'
};

const replybuttons = PropTypes.shape({
  title: PropTypes.string,
  url: PropTypes.string,
  payload: PropTypes.string,
  type: PropTypes.string
});

const senderType = PropTypes.oneOf([
  MESSAGE_SENDER.CLIENT,
  MESSAGE_SENDER.RESPONSE
]);

export const NEXT_MESSAGE = 'mrbot_next_message';

export const PROP_TYPES = {

  MESSAGE: ImmutablePropTypes.contains({
    type: PropTypes.oneOf([
      MESSAGES_TYPES.TEXT,
      MESSAGES_TYPES.QUICK_REPLY,
      MESSAGES_TYPES.FAQ_REPLY,
      MESSAGES_TYPES.CAROUSEL,
      MESSAGES_TYPES.IMGREPLY.IMAGE,
      MESSAGES_TYPES.VIDREPLY.VIDEO,
      MESSAGES_TYPES.CAROUSEL_TYPE1,
      MESSAGES_TYPES.CAROUSEL_TYPE2,
      MESSAGES_TYPES.COLLECTINFO_TYPE1,
      MESSAGES_TYPES.CAPTURE_ATTYPE,
      MESSAGES_TYPES.CAPTURE_LOCTYPE
    ]),
    id: PropTypes.number,
    text: PropTypes.string,
    sender: senderType
  }),

  CAROUSEL: ImmutablePropTypes.contains({
    id: PropTypes.number,
    elements: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        title: PropTypes.string,
        subtitle: PropTypes.string,
        imageUrl: PropTypes.string,
        buttons: ImmutablePropTypes.listOf(replybuttons),
        defaultActions: replybuttons
      })),
    sender: senderType
  }),

  VIDREPLY: ImmutablePropTypes.contains({
    type: PropTypes.oneOf([
      MESSAGES_TYPES.TEXT,
      MESSAGES_TYPES.VIDREPLY.VIDEO
    ]),
    id: PropTypes.number,
    title: PropTypes.string,
    src: PropTypes.string,
    sender: senderType
  }),

  IMGREPLY: ImmutablePropTypes.contains({
    type: PropTypes.oneOf([
      MESSAGES_TYPES.TEXT,
      MESSAGES_TYPES.IMGREPLY.IMAGE
    ]),
    id: PropTypes.number,
    title: PropTypes.string,
    src: PropTypes.string,
    sender: senderType
  }),

  QUICK_REPLY: ImmutablePropTypes.contains({
    type: PropTypes.oneOf([
      MESSAGES_TYPES.QUICK_REPLY
    ]),
    id: PropTypes.number,
    text: PropTypes.string,
    hint: PropTypes.string,
    quick_replies: ImmutablePropTypes.listOf(replybuttons),
    sender: senderType,
    chooseReply: PropTypes.func,
    getChosenReply: PropTypes.func,
    doInputDisabled: PropTypes.func,
    doAttachDisabled: PropTypes.func,
    doAttachLocationDisabled: PropTypes.func,
    doInputEnabled: PropTypes.func,
    doAttachEnabled: PropTypes.func,
    doAttachLocationEnabled: PropTypes.func,
    inputState: PropTypes.bool,
    chosenReply: PropTypes.string
  }),

  FAQ_REPLY: ImmutablePropTypes.contains({
    type: PropTypes.oneOf([
      MESSAGES_TYPES.FAQ_REPLY
    ]),
    id: PropTypes.number,
    text: PropTypes.string,
    hint: PropTypes.string,
    quick_replies: ImmutablePropTypes.listOf(replybuttons),
    sender: senderType,
    chooseReply: PropTypes.func,
    getChosenReply: PropTypes.func,
    doInputDisabled: PropTypes.func,
    doAttachDisabled: PropTypes.func,
    doAttachLocationDisabled: PropTypes.func,
    doInputEnabled: PropTypes.func,
    doAttachEnabled: PropTypes.func,
    doAttachLocationEnabled: PropTypes.func,
    inputState: PropTypes.bool,
    chosenReply: PropTypes.string
  }),

  CAROUSEL_TYPE1: ImmutablePropTypes.contains({
    type: PropTypes.oneOf([
      MESSAGES_TYPES.CAROUSEL_TYPE1
    ]),
    id: PropTypes.number,
    text: PropTypes.string,
    hint: PropTypes.string,
    quick_replies: ImmutablePropTypes.listOf(replybuttons),
    sender: senderType,
    chooseReply: PropTypes.func,
    getChosenReply: PropTypes.func,
    doInputDisabled: PropTypes.func,
    doAttachDisabled: PropTypes.func,
    doAttachLocationDisabled: PropTypes.func,
    doInputEnabled: PropTypes.func,
    doAttachEnabled: PropTypes.func,
    doAttachLocationEnabled: PropTypes.func,
    inputState: PropTypes.bool,
    chosenReply: PropTypes.string
  }),

  CAROUSEL_TYPE2: ImmutablePropTypes.contains({
    type: PropTypes.oneOf([
      MESSAGES_TYPES.CAROUSEL_TYPE2
    ]),
    id: PropTypes.number,
    text: PropTypes.string,
    hint: PropTypes.string,
    quick_replies: ImmutablePropTypes.listOf(replybuttons),
    sender: senderType,
    chooseReply: PropTypes.func,
    getChosenReply: PropTypes.func,
    doInputDisabled: PropTypes.func,
    doAttachDisabled: PropTypes.func,
    doAttachLocationDisabled: PropTypes.func,
    doInputEnabled: PropTypes.func,
    doAttachEnabled: PropTypes.func,
    doAttachLocationEnabled: PropTypes.func,
    inputState: PropTypes.bool,
    chosenReply: PropTypes.string
  }),

  COLLECTINFO_TYPE1: ImmutablePropTypes.contains({
    type: PropTypes.oneOf([
      MESSAGES_TYPES.COLLECTINFO_TYPE1
    ]),
    id: PropTypes.number,
    text: PropTypes.string,
    hint: PropTypes.string,
    quick_replies: ImmutablePropTypes.listOf(replybuttons),
    sender: senderType,
    chooseReply: PropTypes.func,
    getChosenReply: PropTypes.func,
    doInputDisabled: PropTypes.func,
    doAttachDisabled: PropTypes.func,
    doAttachLocationDisabled: PropTypes.func,
    doInputEnabled: PropTypes.func,
    doAttachEnabled: PropTypes.func,
    doAttachLocationEnabled: PropTypes.func,
    inputState: PropTypes.bool,
    chosenReply: PropTypes.string
  }),

  CAPTURE_ATTYPE: ImmutablePropTypes.contains({
    type: PropTypes.oneOf([
      MESSAGES_TYPES.CAPTURE_ATTYPE
    ]),
    id: PropTypes.number,
    text: PropTypes.string,
    hint: PropTypes.string,
    quick_replies: ImmutablePropTypes.listOf(replybuttons),
    sender: senderType,
    chooseReply: PropTypes.func,
    getChosenReply: PropTypes.func,
    doInputDisabled: PropTypes.func,
    doAttachDisabled: PropTypes.func,
    doAttachLocationDisabled: PropTypes.func,
    doInputEnabled: PropTypes.func,
    doAttachEnabled: PropTypes.func,
    doAttachLocationEnabled: PropTypes.func,
    inputState: PropTypes.bool,
    chosenReply: PropTypes.string
  }),

  CAPTURE_LOCTYPE: ImmutablePropTypes.contains({
    type: PropTypes.oneOf([
      MESSAGES_TYPES.CAPTURE_LOCTYPE
    ]),
    id: PropTypes.number,
    text: PropTypes.string,
    hint: PropTypes.string,
    quick_replies: ImmutablePropTypes.listOf(replybuttons),
    sender: senderType,
    chooseReply: PropTypes.func,
    getChosenReply: PropTypes.func,
    doInputDisabled: PropTypes.func,
    doAttachDisabled: PropTypes.func,
    doAttachLocationDisabled: PropTypes.func,
    doInputEnabled: PropTypes.func,
    doAttachEnabled: PropTypes.func,
    doAttachLocationEnabled: PropTypes.func,
    inputState: PropTypes.bool,
    chosenReply: PropTypes.string
  })

};
