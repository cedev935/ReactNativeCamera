/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
'use strict';
import React, { Component } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import Permissions from 'react-native-permissions'

import Camera from './Camera';

const RNFS = require('react-native-fs');

export default class App extends Component {

  constructor() {
    super()
    this.state = {
      WRITE_EXTERNAL_STORAGE: "",
      CAMERA: "",
      RECORD_AUDIO: ""
    }
  }

  async requestPermission() {
    this.requestPermissionCamera();
  }

  async requestPermissionCamera() {

    Permissions.request('camera').then(response => {
      console.log("camera.response", response)
      this.setState({
        CAMERA: response,
      })

      if (response === 'authorized') {
        this.requestPermissionStorage();
      } else {
        this.requestPermissionCamera();
      }

    })
  }

  async requestPermissionStorage() {

    Permissions.request('storage').then(response => {
      console.log("storage.response", response)
      this.setState({
        WRITE_EXTERNAL_STORAGE: response,
      })

      if (response === 'authorized') {
        this.requestPermissionMicrophone();
      } else {
        this.requestPermissionStorage();
      }

    })
  }

  async requestPermissionMicrophone() {

    Permissions.request('microphone').then(response => {
      console.log("microphone.response", response)
      this.setState({
        RECORD_AUDIO: response,
      })

      if (response === 'authorized') {
          
      } else {
        this.requestPermissionMicrophone();
      }
    })

  }

  componentDidMount() {
    this.requestPermission();
  }

  render() {

    if (this.state.WRITE_EXTERNAL_STORAGE === 'authorized' && this.state.CAMERA === 'authorized' && this.state.RECORD_AUDIO === 'authorized') {
      return <Camera />
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>Permissions Required</Text>
        </View>
      );
    }
  }

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
});
