import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Platform, NativeEventEmitter, NativeModules, Alert } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

const audioRecorderPlayer = new AudioRecorderPlayer();

type NativeModulesType = {
  AudioInterruption?: any;
};

const NativeMod = NativeModules as NativeModulesType;

export default function App(): JSX.Element {
  const [recordingPath, setRecordingPath] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [recordTime, setRecordTime] = useState<string>('00:00:00');

  useEffect(() => {
    const emitter = new NativeEventEmitter(NativeMod.AudioInterruption || {});
    const sub = emitter.addListener('AUDIO_INTERRUPTION', (action: string) => {
      console.log('Native interruption event', action);
      if (action === 'PAUSE') {
        audioRecorderPlayer.pauseRecorder().then(() => {
          setIsPaused(true);
          setIsRecording(false);
        });
      } else if (action === 'RESUME') {
        audioRecorderPlayer.resumeRecorder().then(() => {
          setIsPaused(false);
          setIsRecording(true);
        }).catch(err => {
          console.warn('Resume failed', err);
        });
      }
    });

    return () => {
      sub.remove();
    };
  }, []);

  async function startRecording() {
    try {
      const fileName = `recording_${Date.now()}.m4a`;
      const path = Platform.OS === 'android' ? `${RNFS.ExternalDirectoryPath}/${fileName}` : `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const uri = await audioRecorderPlayer.startRecorder(path);
      audioRecorderPlayer.addRecordBackListener((e) => {
        setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
      });
      setRecordingPath(uri);
      setIsRecording(true);
      setIsPaused(false);
    } catch (e) {
      Alert.alert('Error', 'Failed to start recording: ' + String(e));
    }
  }

  async function pauseRecording() {
    try {
      await audioRecorderPlayer.pauseRecorder();
      setIsPaused(true);
      setIsRecording(false);
    } catch (e) {
      console.warn('Pause error', e);
    }
  }

  async function resumeRecording() {
    try {
      await audioRecorderPlayer.resumeRecorder();
      setIsPaused(false);
      setIsRecording(true);
    } catch (e) {
      console.warn('Resume error', e);
    }
  }

  async function stopRecording() {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setIsPaused(false);
      setRecordingPath(result);
    } catch (e) {
      console.warn('Stop error', e);
    }
  }

  async function playRecording() {
    if (!recordingPath) {
      Alert.alert('No recording', 'Please record something first.');
      return;
    }
    try {
      await audioRecorderPlayer.startPlayer(recordingPath);
    } catch (e) {
      console.warn('Play error', e);
    }
  }

  return (
    <SafeAreaView style={{flex:1, alignItems:'center', paddingTop:40}}>
      <Text style={{fontSize:20, fontWeight:'600'}}>RNAudioTaskApp</Text>

      <View style={{flexDirection:'row', marginTop:20}}>
        <TouchableOpacity onPress={startRecording} disabled={isRecording || isPaused} style={{margin:6, padding:10, backgroundColor:'#2b8'}}><Text>Start</Text></TouchableOpacity>
        <TouchableOpacity onPress={pauseRecording} disabled={!isRecording} style={{margin:6, padding:10, backgroundColor:'#f90'}}><Text>Pause</Text></TouchableOpacity>
        <TouchableOpacity onPress={resumeRecording} disabled={!isPaused} style={{margin:6, padding:10, backgroundColor:'#39f'}}><Text>Resume</Text></TouchableOpacity>
        <TouchableOpacity onPress={stopRecording} disabled={!isRecording && !isPaused} style={{margin:6, padding:10, backgroundColor:'#f33'}}><Text>Stop</Text></TouchableOpacity>
      </View>

      <View style={{marginTop:20}}>
        <Text>Recording time: {recordTime}</Text>
        <Text selectable style={{marginTop:6}}>{recordingPath || '—'}</Text>
      </View>

      <View style={{flexDirection:'row', marginTop:20}}>
        <TouchableOpacity onPress={playRecording} disabled={!recordingPath} style={{margin:6, padding:10, backgroundColor:'#06f'}}><Text>Play</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
