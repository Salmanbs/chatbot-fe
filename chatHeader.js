const data = {
  title: 'My bot chat',
  subtitle: 'My bot subtitle',
  profileAvatar: 'https://www.tosall.com/chatbot/chatbot-logo.png',
  titleAvatar: 'https://www.tosall.com/chatbot/chatbot-logo.png',
  botWindowSIze: '400px',
  chatFontSize: '14px',
  chatTextColor: '#90FF3F',
  bgColor: '#900C3F',
  botButtonColor: '#900C3F',
  botButtonTextColor: '#900C3F',
  titleColor: '#90FF3F',
  titleFontSize: '20px',
  subTitleColor: '#000000',
  subTitleFontSize: '8px',
  botChatTextColor: '#FB19E0',
  sendButtonColor: '#120C3F',
  botWindowOpenTime: 5
};

const args = {
  selector: '#tosall-chatbot',
  initPayload: '/greet_as_bill_assistant',
  embedded: false,
  tooltipPayload: 'Hi there !!!',
  hideWhenNotConnected: false,
  interval: 1000, // 1000 ms between each message
  customData: { sender_id: '123' }, // arbitrary custom data. Stay minimal as this will be added to the socket
  socketUrl: 'https://chatbot.tosall.com:5005',
  socketPath: '/socket.io/',
  title: data.title,
  subtitle: data.subtitle,
  botWindowSIze: data.botWindowSIze,
  chatFontSize: data.chatFontSize,
  chatTextColor: data.chatTextColor,
  bgColor: data.bgColor,
  botButtonColor: data.botButtonColor,
  botButtonTextColor: data.botButtonTextColor,
  titleColor: data.titleColor,
  titleFontSize: data.titleFontSize,
  subTitleColor: data.subTitleColor,
  subTitleFontSize: data.subTitleFontSize,
  botChatTextColor: data.botChatTextColor,
  sendButtonColor: data.sendButtonColor,
  botWindowOpenTime: data.botWindowOpenTime,
  profileAvatar: data.profileAvatar,
  titleAvatar: data.titleAvatar,
  showCloseButton: true,
  fullScreenMode: false,
  connectOn: 'open',
  autoClearCache: true,
  params: {
    storage: 'session'
  },
  onWidgetEvent: {
    onChatOpen: () => {
      localStorage.clear();
    }
  },
  onSocketEvent: {
    bot_uttered: () => console.log('the bot said something'),
    connect: () => console.log('connection established'),
    disconnect: () => sessionStorage.clear()
  },
  customMessageDelay: message => 500 + message.length
};


export default args;
