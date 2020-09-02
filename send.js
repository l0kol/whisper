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

const pubKey11='0x048d329324fe16768c141211277bb79d400672b4339dbc4947bcd006c9a414cceb07c93cae0c1c77bc198598b08086a80edee3da45e7c46b105f9d724b3c1b679b';
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
      whipserWeb3.setProvider(new Web3.providers.WebsocketProvider("ws://localhost:8546"));
        await whipserWeb3.eth.net.isListening();
    } catch(err) {
        process.exit();
    }

    keyPair1 = await whipserWeb3.shh.addPrivateKey('0xc3fd481af655e47d119423131b2dba0a37751ccadf78f0ee019fed3c918c22e9');
    await whipserWeb3.shh.hasKeyPair(keyPair1);
    pubKey1 = await whipserWeb3.shh.getPublicKey(keyPair1);
    console.log(pubKey1);

    /* keyPair1 = await whipserWeb3.shh.newKeyPair();

    //Obtain public key
    pubKey1 = await whipserWeb3.shh.getPublicKey(keyPair1);
    console.log(pubKey1); */


    
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

  var dataToSend = JSON.stringify(variables.demand);
  sendData(whipserWeb3,  pubKey11, keyPair1, channelTopic, dataToSend);

   
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


