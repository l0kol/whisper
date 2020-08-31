'use strict'

const Web3 = require('web3');


const whipserWeb3 = new Web3();


// Useful constants
const DEFAULT_CHANNEL = "warehouse";
const DEFAULT_TOPIC = "0x11223344"; //dolžina more bit 8
//------------------------------------------------

const variables = require ('./variables.js');


var WhisperData = 0;
var new_data = 0;
var state = 0;
var id;


var t0 = 0;
var t1 = 0;


var keyPair1;
var pubKey1;

const pubKey2 = '0x0451d51ad6bc66265319ff615b9d23d6a37d5ec7ed06135f06df4b0b7ec0da22178a93f7c46252e6032c1e61bfd386aec2eaf19bc745e43497d4d2dcccd5921b6f';
const channelTopic = "0x11223344";



(async () => {
//--------------------------------------------------------------
setInterval( async function listen() {

  if (new_data) {

      var obj = JSON.parse(WhisperData);      

      if(obj.id == "demand" && state == 0) {   

          var dataToSend = JSON.stringify(variables.offer);
          sendData(whipserWeb3, pubKey2, keyPair1, channelTopic, dataToSend);

          new_data=0;

      }

      new_data=0;

  }

 }, 1);
//--------------------------------------------------------------

//---------------------------------------------------- WHISPER ------------------------------------------------------
    
    try {
      whipserWeb3.setProvider(new Web3.providers.WebsocketProvider("ws://localhost:8546", {headers: {Origin: "mychat"}}));
        await whipserWeb3.eth.net.isListening();
    } catch(err) {
        process.exit();
    }

    keyPair1 = await whipserWeb3.shh.addPrivateKey('0x29d295b652252257efc1dc1c5c323d9a287da1feffe079818a90e14bd75f0765');
    await whipserWeb3.shh.hasKeyPair(keyPair1);
    pubKey1 = await whipserWeb3.shh.getPublicKey(keyPair1);
    console.log(pubKey1);


    
    //Generate a symmetric key
    const channelSymKey = await whipserWeb3.shh.generateSymKeyFromPassword(DEFAULT_CHANNEL); 



    whipserWeb3.shh.subscribe("messages", {
      minPow: 2,
      privateKeyID: keyPair1,
      topics: [channelTopic]
  }).on('data', (data) => {
      WhisperData = whipserWeb3.utils.toAscii(data.payload); 
      new_data = 1;
      console.log(WhisperData)
  }).on('error', (err) => {
      console.log("Couldn't decode message: " + err.message);
  });

   
//---------------------------------------------------------------------------------------------------------------------
})();


async function sendData(web3, pubKey, keyPair, channelTopic, data) {
  await web3.shh.post({
    pubKey: pubKey,
    sig: keyPair,
    ttl: 20,
    topic: channelTopic,
    payload: web3.utils.fromAscii(data),
    powTime: 100,
    powTarget: 2
});

}

