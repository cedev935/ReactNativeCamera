/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
'use strict';
import React, { Component } from 'react';
import { Platform, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import { RNCamera } from 'react-native-camera';
import { dirPicutures } from './dirStorage';

const moment = require('moment');
const RNFS = require('react-native-fs');

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>Waiting</Text>
  </View>
);

//move the attachment to app folder
const moveAttachment = async (filePath, newFilepath) => {
  return new Promise((resolve, reject) => {
    console.log("dirPicutures=" + dirPicutures);
    console.log("filePath=" + filePath);
    console.log("newFilepath=" + newFilepath);
    RNFS.mkdir(dirPicutures)
      .then(() => {
        RNFS.moveFile(filePath, newFilepath)
          .then(() => {
            console.log('FILE MOVED', filePath, newFilepath);
            resolve(true);
          })
          .catch(error => {
            console.log('moveFile error', error);
            reject(error);
          });
      })
      .catch(err => {
        console.log('mkdir error', err);
        reject(err);
      });
  });
};

export default class Camera extends Component {

  render() {

    return (
      <View style={styles.container}>
        <RNCamera
          ref={cam => {
            this.camera = cam;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes)
          }}>
          <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={this.takePicture.bind(this)}
              style={styles.capture}>
              <Icon name="camera" style={{ fontSize: 40, color: 'white' }} />
            </TouchableOpacity>
          </View>
        </RNCamera>
      </View>
    );
  }

  takePicture = async function () {
    if (this.camera) {
      const options = { quality: 0.5, base64: true }
      const data = await this.camera.takePictureAsync(options)

      this.saveImage(data.uri);
      console.log(data.uri);
    }
  };

  saveImage = async filePath => {
    try {
      // set new image name and filepath
      const newImageName = `${moment().format('DDMMYY_HHmmSSS')}.jpg`;
      const newFilepath = `${dirPicutures}/${newImageName}`
      // move and save image to new filepath
      const imageMoved = await moveAttachment(filePath, newFilepath);
      console.log('image moved', imageMoved);
    } catch (error) {
      console.log(error);
    }
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20
  }
});
