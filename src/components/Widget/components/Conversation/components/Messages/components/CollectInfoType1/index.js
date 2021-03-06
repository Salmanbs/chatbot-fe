/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  changeInputFieldHint,
  doInputDisabled,
  doAttachDisabled,
  doAttachLocationDisabled,
  doInputEnabled,
  emitUserMessage
} from 'actions';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Style from 'style-it';
import CollectInfoForm from './CollectInfoForm/CollectInfoForm';
import './styles.scss';


class CollectInfoType1 extends PureComponent {
  constructor(props) {
    super(props);
    const { message, getChosenReply, inputState, id } = this.props;
    const hint = message.get('hint');
    const chosenReply = getChosenReply(id);
    this.handleSubmit = this.handleSubmit.bind(this);

    if (!chosenReply && !inputState) {
      this.props.doInputDisabled();
      this.props.doAttachDisabled();
      this.props.doAttachLocationDisabled();
      this.props.changeInputFieldHint(hint);
    }
  }

  handleSubmit(data) {
    const info = `collectinfotype1${JSON.stringify(data)}`;
    const userContactInfo = info.replace(/{|}/g, '');
    this.props.chooseReply(userContactInfo);

    this.props.doInputDisabled();
    this.props.doAttachDisabled();
    this.props.doAttachLocationDisabled();
    this.props.changeInputFieldHint('');
  }

  render() {
    const {
      message,
      isLast,
      contactInfoStyle,
      isTextAreaBoxShadowEnabled
    } = this.props;

    const isBoxShadowEnabled = isTextAreaBoxShadowEnabled ? '0 0px 5px 1px #b5b5b5' : '';

    return (
      <Style>
        {`
          .rw-contactInfo-box {
            background-color: ${contactInfoStyle.contactInfoBgColor};
            min-width: ${contactInfoStyle.contactInfoMinWidth};
            width: ${contactInfoStyle.contactInfoActualWidth};
            min-height: ${contactInfoStyle.contactInfoMinHeight};
            box-shadow: ${isBoxShadowEnabled};
          }

          .rw-contactInfo-header {
            color: ${contactInfoStyle.contactInfoHeaderFontColor};
            font-size: ${contactInfoStyle.contactInfoHeaderFontSize};
            font-style: ${contactInfoStyle.contactInfoHeaderFontStyle};
          }

          .rw-contactInfo-detail {
            color: ${contactInfoStyle.contactInfoHeaderFontColor};
            font-size: ${contactInfoStyle.contactInfoHeaderFontSize};
            font-style: ${contactInfoStyle.contactInfoHeaderFontStyle};
          }
        `}
        {
          isLast && <div className="rw-contactInfo-box">
            <div className="rw-contactInfo-header"><strong>Contact Information</strong></div>
            <div className="rw-contactInfo-detail">Please enter your details</div>
            <CollectInfoForm contactInfoStyle={contactInfoStyle} submitInfo={data => this.handleSubmit(data)} />
          </div>
        }
      </Style>
    );
  }
}


const mapStateToProps = state => ({
  getChosenReply: id => state.messages.get(id).get('chosenReply'),
  inputState: state.behavior.get('disabledInput'),
  linkTarget: state.metadata.get('linkTarget')
});

const mapDispatchToProps = dispatch => ({
  doInputDisabled: () => dispatch(doInputDisabled()),
  doAttachDisabled: () => dispatch(doAttachDisabled()),
  doAttachLocationDisabled: () => dispatch(doAttachLocationDisabled()),
  doInputEnabled: () => dispatch(doInputEnabled()),
  changeInputFieldHint: hint => dispatch(changeInputFieldHint(hint)),
  chooseReply: (contactInfo) => {
    dispatch(emitUserMessage(contactInfo));
    dispatch(doInputEnabled());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectInfoType1);
