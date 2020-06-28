import { Injectable } from '@angular/core';
import Speech from 'speak-tts';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  speech = new Speech()

  constructor() { }

  async intializeSpeechConfig() {
    if (this.speech.hasBrowserSupport()) { // returns a boolean
      console.log("speech synthesis supported");

      let modify_voice = await this.speech.init({
        'volume': 1,
        'lang': 'en-GB',
        'rate': 1,
        'pitch': 1,
        'voice': 'Google UK English Female',
        'splitSentences': true,
        'localService': false,
        'default': false,
        'listeners': {
          'onvoiceschanged': (voices) => {
          }
        }
      })

      if (modify_voice) {
        console.log('Voice modifed');
        return true;
      }
    }
  }


  speak(speechText) {
    let volume = localStorage.getItem('volume');

    if (volume === 'true') {
      console.log('speaking')
      this.speech.speak({
        text: speechText,
      }).then(() => {
        console.log("Success !")
      }).catch(e => {
        console.error("An error occurred :", e)
      })
    }
  }
}

