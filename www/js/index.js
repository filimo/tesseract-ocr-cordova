/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    base64ToBlob: (data, type = '', sliceSize = 512) => {
        //if data is Uint8Array when a data from sql.js
        if(data.buffer) {
            return new Blob([data], {type})
        }

        const byteCharacters = atob(data)
        const byteArrays = []

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize)

            const byteNumbers = new Array(slice.length)
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i)
            }

            const byteArray = new Uint8Array(byteNumbers)

            byteArrays.push(byteArray)
        }

        return new Blob(byteArrays, {type})
    },


    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        document.getElementById('scan').addEventListener('click', () => {
            var language = 'eng'; //fra

            document.querySelector('.received').innerHTML = `Loading ${language} language`
            document.getElementById('scan').style.display='none'

            Promise.resolve()
            .then(() => {
                return new Promise((resolve, reject) => {
                    TesseractPlugin.loadLanguage(language, resolve, reject);
                })
            })
            .then(response => {
                console.log('language', response);
            })
            .catch(reason => {
                document.querySelector('.received').innerHTML = ``
                document.getElementById('scan').style.display=''
                alert('Error on loading OCR file for your language. ' + reason);
            })
            .then(() => {
                return new Promise((resolve, reject) => {
                    navigator.camera.getPicture(resolve, reject, {
                        quality: 90,
                        destinationType: navigator.camera.DestinationType.DATA_URL,
                        sourceType: navigator.camera.PictureSourceType.CAMERA,
                        correctOrientation: true,
                        saveToPhotoAlbum: false,
                        allowEdit: false
                    })
                })
            })
            .then(response => {
                let url = URL.createObjectURL(this.base64ToBlob(response))
                console.log(url)

                document.querySelector('.received').innerHTML = `Recognizing...`
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                    TesseractPlugin.recognizeText(response, language, resolve, reject);
                    }, 100)
                })
            })
            .then(recognizedText => {
                document.querySelector('.received').innerHTML = ``
                document.getElementById('scan').style.display=''
                console.log(recognizedText)
                alert(recognizedText);
            })
            .catch(reason => {
                document.querySelector('.received').innerHTML = ``
                document.getElementById('scan').style.display=''
                alert('Error on recognizing text from image. ' + reason);
            })

        })
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();