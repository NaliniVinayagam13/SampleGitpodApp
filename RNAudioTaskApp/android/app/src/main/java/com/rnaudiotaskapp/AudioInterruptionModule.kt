package com.rnaudiotaskapp

import android.content.Context
import android.media.AudioManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.modules.core.DeviceEventManagerModule

class AudioInterruptionModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val audioManager = reactContext.getSystemService(Context.AUDIO_SERVICE) as AudioManager

    private val afChangeListener = AudioManager.OnAudioFocusChangeListener { focusChange ->
        when (focusChange) {
            AudioManager.AUDIOFOCUS_LOSS, AudioManager.AUDIOFOCUS_LOSS_TRANSIENT -> {
                sendEvent("PAUSE")
            }
            AudioManager.AUDIOFOCUS_GAIN -> {
                sendEvent("RESUME")
            }
        }
    }

    init {
        audioManager.requestAudioFocus(afChangeListener, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN)
    }

    private fun sendEvent(action: String) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("AUDIO_INTERRUPTION", action)
    }

    override fun getName(): String {
        return "AudioInterruption"
    }
}
