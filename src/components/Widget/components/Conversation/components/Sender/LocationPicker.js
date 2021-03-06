import React, { Component } from 'react';
import LocationPicker from 'react-location-picker';

class LocationPickerEx extends Component {
  render() {
    return (
      <div
        style={{
          position: 'absolute',
          width: '90%',
          left: '5%',
          bottom: '12%'
        }}
      >
        <h1>{this.props.address}</h1>
        <div>
          <LocationPicker
            containerElement={<div style={{ height: '100%' }} />}
            mapElement={<div style={{ height: '250px' }} />}
            defaultPosition={this.props.position}
            onChange={this.props.handleLocChange}
          />
        </div>
      </div>
    );
  }
}

export default LocationPickerEx;
