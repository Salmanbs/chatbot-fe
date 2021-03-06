import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Style from 'style-it';
import $ from 'jquery';

import Send from 'assets/send_button';
import PaperClip from 'assets/paperclip';
import Gallery from 'assets/gallery';
import Location from 'assets/location';
import Document from 'assets/document';
import FlipMove from 'react-flip-move';
import {
  changeInputFieldHint,
  doInputDisabled,
  doAttachDisabled,
  doAttachLocationDisabled,
  doInputEnabled,
  emitUserMessage,
  addUserMessage
} from 'actions';

import './style.scss';
import LocationPickerEx from './LocationPicker';

const styles = {
  display: '-webkit-box',
  overflowY: 'hidden'
};

class Sender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      pictures: [],
      isPaperClipOpen: false,
      address: '',
      position: {
        lat: 0,
        lng: 0
      },
      isLocationOpen: false
    };

    this.inputElement = '';

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDropFile = this.onDropFile.bind(this);
    this.onUploadClick = this.onUploadClick.bind(this);
    this.triggerFileUpload = this.triggerFileUpload.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultImages !== this.props.defaultImages) {
      this.setState({ pictures: nextProps.defaultImages });
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.props.connected && (this.props.connected != prevProps.connected)) {
      this.setState({
        inputValue: ''
      });
    }
  }

  onDropFile(e) {
    const files = e.target.files;
    const allFilePromises = [];

    // Iterate over all uploaded files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      allFilePromises.push(file);
    }

    this.setState({
      pictures: allFilePromises,
      isPaperClipOpen: !this.state.isPaperClipOpen
    });
  }

  onUploadClick(e) {
    e.target.value = null;
  }

  togglePaperClip = () => {
    this.setState({
      isPaperClipOpen: !this.state.isPaperClipOpen
    });
  }

  handleChange = (e) => {
    this.setState({
      inputValue: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.props.disabledAttach) {
      const fd = new FormData();
      const files = this.state.pictures[0];
      fd.append('files[]', files, files.name);
      fd.append('label', 'WEBUPLOAD');
      fd.append('bot_id', 'eEw0U2F5emZ2ZkdHZjJ1RkFxd004Zz09');
      fd.append('session_id', '3745637');
      $.ajax({
        url: 'https://www.workchallenger.com/tosall_client2/api/capture_attachment',
        type: 'POST',
        data: fd,
        processData: false,
        contentType: false,
        crossDomain: true,
        headers: {
          Authorization: 'Bearer Kailashchandra353',
          token: 'Kailashchandra353'
        }

      }).done((result) => {
        if (result.status == 'success') {
          console.log('Success');
        }
      }).fail(() => {
        console.log('Failed!');
      });
      this.props.chooseReply({ title: 'Image uploaded', payload: files });

      this.props.doInputDisabled();
      this.props.doAttachDisabled();
      this.props.doAttachLocationDisabled();
      this.props.changeInputFieldHint('');
    } else if (!this.props.disabledAttachLocation) {
      this.props.chooseReply({ title: 'Location uploaded', payload: this.state.position });
      this.props.doInputDisabled();
      this.props.doAttachDisabled();
      this.props.doAttachLocationDisabled();
      this.props.changeInputFieldHint('');
    } else {
      this.props.sendMessage(e);
    }

    this.setState({
      inputValue: '',
      pictures: [],
      isPaperClipOpen: false,
      address: 'Dummy Location',
      position: {
        lat: 0,
        lng: 0
      },
      isLocationOpen: false
    });
  }

  removeImage(picture) {
    const removeIndex = this.state.pictures.findIndex(e => e === picture);
    const filteredPictures = this.state.pictures.filter((e, index) => index !== removeIndex);
    // const filteredFiles = this.state.files.filter((e, index) => index !== removeIndex);

    this.setState({
      pictures: filteredPictures
    });
  }

  renderPreview() {
    return (
      <div className="rw-uploadPicturesWrapper">
        <FlipMove enterAnimation="fade" leaveAnimation="fade" style={styles}>
          {this.renderPreviewPictures()}
        </FlipMove>
      </div>
    );
  }

  renderPreviewPictures() {
    return this.state.pictures.map((picture, index) => (
      <div key={index} className="rw-uploadPictureContainer">
        <div className="rw-deleteImage" onClick={() => this.removeImage(picture)}>X</div>
        <img src={URL.createObjectURL(picture)} className="rw-uploadPicture" alt="preview" />
      </div>
    ));
  }

  triggerFileUpload() {
    this.inputElement.click();
  }

  clearPictures() {
    this.setState({ pictures: [] });
  }

  triggerLocationUpload = () => {
    this.setState({
      isLocationOpen: true,
      isPaperClipOpen: !this.state.isPaperClipOpen
    });
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      });
    });
  }

  handleLocationChange = ({ position, address, places }) => {
    this.setState({ position });
  }

  render() {
    const {
      inputTextFieldHint,
      disabledInput,
      disabledAttach,
      disabledAttachLocation,
      userInput,
      sendButtonColor,
      userTypeWindowBgColor,
      placeholderTextColor,
      textFontFamily,
      inputCaretColor,
      chatFontSize,
      isTextAreaBoxShadowEnabled
    } = this.props;

    const boxShadowStyle = isTextAreaBoxShadowEnabled ? 'inset 0 0px 8px 0px #b5b5b5' : 'none';

    return (
      userInput === 'hide' ? <div /> : (
        <React.Fragment>
          {this.state.isPaperClipOpen &&
          <Style>
            {`
              .attachmentBtn {
                background-color: ${this.props.sendButtonColor};
              }
            `}
            <div className="rw-attachment-box">
              <button
                type={this.props.buttonType}
                className="rw-attachmentBtn"
                onClick={this.triggerFileUpload}
                disabled={disabledAttach}
              >
                <Gallery className="rw-send-icon" sendButtonColor="white" ready="true" alt="send" />
                <input
                  style={{
                    position: 'absolute',
                    visibility: 'hidden'
                  }}
                  type="file"
                  ref={input => this.inputElement = input}
                  multiple={!this.props.singleImage}
                  onChange={this.onDropFile}
                  onClick={this.onUploadClick}
                  accept={this.props.accept}
                />
              </button>
              <button
                type="button"
                className="rw-attachmentBtn"
                onClick={this.triggerLocationUpload}
                disabled={disabledAttachLocation}
              >
                <Location className="rw-send-icon" sendButtonColor="white" ready="true" alt="send" />
              </button>
            </div>
          </Style>
          }
          { this.state.pictures.length > 0 ? this.renderPreview() : null }
          {!disabledAttachLocation && this.state.isLocationOpen && <LocationPickerEx
            address={this.state.address}
            position={this.state.position}
            handleLocChange={this.handleLocationChange}
          />}
          <form
            className="rw-sender"
            onSubmit={this.handleSubmit}
            style={{
              backgroundColor: userTypeWindowBgColor,
              boxShadow: boxShadowStyle
            }}
          >
            {(!disabledAttach || !disabledAttachLocation) && <button
              type="button"
              className="rw-send"
              disabled={disabledAttach && disabledAttachLocation}
              style={{
                backgroundColor: userTypeWindowBgColor
              }}
              onClick={this.togglePaperClip}
            >
              <PaperClip className="rw-send-icon" sendButtonColor={sendButtonColor} ready="true" alt="send" />
            </button>}
            <Style>
              {`
                .rw-new-message::placeholder {
                  color: ${placeholderTextColor};
                  font-size: ${chatFontSize};
                  font-family: ${textFontFamily};
                }
              `}
              <div className="rw-input-div">
                <input
                  type="text"
                  multiline
                  onChange={this.handleChange}
                  className="rw-new-message"
                  name="message"
                  placeholder={inputTextFieldHint}
                  disabled={disabledInput || userInput === 'disable'}
                  autoFocus
                  autoComplete="off"
                  value={this.state.inputValue}
                  style={{
                    backgroundColor: userTypeWindowBgColor,
                    fontFamily: textFontFamily,
                    caretColor: inputCaretColor,
                    fontSize: chatFontSize
                  }}
                />
              </div>
            </Style>
            <button
              type="submit"
              className="rw-send"
              disabled={!(this.state.inputValue && this.state.inputValue.length > 0) &&
                !(this.state.pictures.length > 0) &&
                (disabledAttachLocation && !this.state.position.lng)}
              style={{
                backgroundColor: userTypeWindowBgColor
              }}
            >
              <Send
                className="rw-send-icon"
                sendButtonColor={sendButtonColor}
                ready={!!(this.state.inputValue && this.state.inputValue.length > 0) || this.state.pictures.length > 0 || (!disabledAttachLocation && this.state.position.lng)}
                alt="send"
              />
            </button>
          </form>
        </React.Fragment>));
  }
}
const mapStateToProps = state => ({
  messages: state.messages,
  inputTextFieldHint: state.behavior.get('inputTextFieldHint'),
  userInput: state.metadata.get('userInput')
});

const mapDispatchToProps = dispatch => ({
  doInputDisabled: () => dispatch(doInputDisabled()),
  doAttachDisabled: () => dispatch(doAttachDisabled()),
  doAttachLocationDisabled: () => dispatch(doAttachLocationDisabled()),
  changeInputFieldHint: hint => dispatch(changeInputFieldHint(hint)),
  chooseReply: ({ title, payload }) => {
    dispatch(addUserMessage(title));
    dispatch(emitUserMessage(title));
  }
});

Sender.propTypes = {
  sendMessage: PropTypes.func,
  inputTextFieldHint: PropTypes.string,
  disabledInput: PropTypes.bool,
  disabledAttach: PropTypes.bool,
  disabledAttachLocation: PropTypes.bool,
  userInput: PropTypes.string
};

Sender.defaultProps = {
  className: '',
  fileContainerStyle: {},
  buttonClassName: '',
  buttonStyles: {},
  withPreview: false,
  accept: 'image/*',
  name: '',
  withIcon: true,
  buttonText: 'Choose images',
  buttonType: 'button',
  withLabel: true,
  label: 'Max file size: 5mb',
  labelStyles: {},
  labelClass: '',
  imgExtension: ['.jpg', '.jpeg', '.gif', '.png'],
  maxFileSize: 5242880,
  fileSizeError: ' file size is too big',
  fileTypeError: ' is not a supported file extension',
  errorClass: '',
  style: {},
  errorStyle: {},
  singleImage: false,
  onChange: () => {},
  defaultImages: []
};

export default connect(mapStateToProps, mapDispatchToProps)(Sender);
