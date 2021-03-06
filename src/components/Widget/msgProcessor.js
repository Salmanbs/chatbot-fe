export function isCarousel(message) {
  return Object.keys(message).includes('attachment')
    && Object.keys(message.attachment).includes('type')
    && message.attachment.type === 'template'
    && Object.keys(message.attachment).includes('payload')
    && Object.keys(message.attachment.payload).indexOf('template_type') >= 0
    && message.attachment.payload.template_type === 'generic'
    && Object.keys(message.attachment.payload).indexOf('elements') >= 0
    && message.attachment.payload.elements.length > 0;
}

export function isVideo(message) {
  return Object.keys(message).includes('attachment')
  && Object.keys(message.attachment).includes('type')
  && message.attachment.type === 'video';
}

export function isImage(message) {
  return Object.keys(message).includes('attachment')
  && Object.keys(message.attachment).includes('type')
  && message.attachment.type === 'image';
}

export function isText(message) {
  return Object.keys(message).length === 1 &&
          Object.keys(message).includes('text')
          && !message.text.includes('collectinfotype1')
          && !message.text.includes('captureatttype')
          && !message.text.includes('captureloctype');
}

export function isQR(message) {
  return Object.keys(message).length === 2
    && Object.keys(message).includes('text')
    && Object.keys(message).includes('quick_replies');
}

export function isFAQ(message) {
  return Object.keys(message).length === 2
    && message.text.includes('FAQFAQ')
    && Object.keys(message).includes('quick_replies');
}

export function isCarouselType1(message) {
  return Object.keys(message).length === 2
    && message.text.includes('carouseltype1')
    && Object.keys(message).includes('quick_replies');
}

export function isCarouselType2(message) {
  return Object.keys(message).length === 2
    && message.text.includes('carouseltype2')
    && Object.keys(message).includes('quick_replies');
}

export function isCollectInfoType1(message) {
  return Object.keys(message).length === 1
    && message.text.includes('collectinfotype1');
}

export function isCaptureatttype(message) {
  return Object.keys(message).length === 1
    && message.text.includes('captureatttype');
}

export function isCaptureloctype(message) {
  return Object.keys(message).length === 1
    && message.text.includes('captureloctype');
}
