import React from 'react';
import ReactDOM from 'react-dom';
import { Widget } from './index_for_react_app';

const plugin = {
  init: (args) => {
    ReactDOM.render(
      <Widget
        baseUrl={args.baseUrl}
        customData={args.customData}
      />, document.querySelector('#tosall-chatbot')
    );
  }
};

export {
  plugin as default
};

