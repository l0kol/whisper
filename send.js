'use strict'
const {performance} = require('perf_hooks');
const Web3 = require('web3');

const mongo = require('mongodb');
const url = "mongodb://localhost:27017";


// Useful constants
const DEFAULT_CHANNEL = "warehouse";
const DEFAULT_TOPIC = "0x11223344"; //dolžina more bit 8

//------------------------------------------------

const whisperWeb3 = new Web3();
const whisperWeb33 = new Web3();


const variables = require ('./variables.js');


var WhisperData = 0;
var WhisperData2 = 0;
var new_data = 0;
var new_data2 = 0;
var state=0;
const channelTopic = "0x11223344";
var t0 = 0;
var t1 = 0;

var Dt0 = 0;
var Dt1 = 0;

const pubKey11='0x048d329324fe16768c141211277bb79d400672b4339dbc4947bcd006c9a414cceb07c93cae0c1c77bc198598b08086a80edee3da45e7c46b105f9d724b3c1b679b';



var OfferAvgTime = [];
var OfferTotalAvgTime = 0;

var DemandAvgTime = [];
var DemandTotalAvgTime = 0;

var responses = 0;
var responseArray = [];
var id = 0;
var time1;
mongo.connect(url, {useNewUrlParser: true}, (err, db) => {
  var db = db.db('meritve');



(async () => {


//---------------------------------------------------- WHISPER ------------------------------------------------------
    
    try {
      whisperWeb3.setProvider(new Web3.providers.WebsocketProvider("ws://localhost:8546"));
        await whisperWeb3.eth.net.isListening();
    } catch(err) {
      console.log(err);
      process.exit();
    }

    try {
      whisperWeb33.setProvider(new Web3.providers.WebsocketProvider("ws://localhost:8546"));
        await whisperWeb33.eth.net.isListening();
    } catch(err) {
      console.log(err);
      process.exit();
    }
 
 
 
        const channelSymKey = await whisperWeb3.shh.generateSymKeyFromPassword(DEFAULT_CHANNEL); 

   
        const keyPair2 = await whisperWeb3.shh.addPrivateKey('0xda7ebd93449d957176f07e308aa0086ed73ff7b3fa4d8372c868b07ce5cf22c5');
        await whisperWeb3.shh.hasKeyPair(keyPair2);
        const pubKey2 = await whisperWeb3.shh.getPublicKey(keyPair2);

        const keyPair11 = await whisperWeb33.shh.addPrivateKey('0x29d295b652252257efc1dc1c5c323d9a287da1feffe079818a90e14bd75f0765');
        await whisperWeb33.shh.hasKeyPair(keyPair11);
        


        whisperWeb3.shh.subscribe("messages", {
          minPow: 2,
          privateKeyID: keyPair2,
          topics: [channelTopic]
      }).on('data', (data) => {
          WhisperData = whisperWeb3.utils.toAscii(data.payload); 
          new_data = 1;
          responses++;
      }).on('error', (err) => {
          console.log("Couldn't decode message: " + err.message);
      });


    

setInterval( async function listen() {

  if (new_data) {

      var obj = JSON.parse(WhisperData);
      
      //console.log(obj);
      if (responses == 1) { //responses odvisno kolko providerjev imaš

      if(obj.id == "offer") {

          t1 = new Date().getTime();
          var time = t1 - t0;
          OfferAvgTime.push(time);

          new_data=0;
          responses = 0;

          db.collection('test', function (err, collection) {
            collection.insertMany([{sentAt: t0, DemandRecived: obj.timestamp, OfferRecived: t1}]);
          });

          if (OfferAvgTime.length < 5) {

            var dataToSend = JSON.stringify(variables.demand);

            t0 = new Date().getTime();
            sendData(whisperWeb3,  pubKey11, keyPair2, channelTopic, dataToSend);           

          } else {



             /*  console.log(responseArray)
              console.log(OfferAvgTime);

            for(var i = 0; i <= OfferAvgTime.length-1; i++) {
              OfferTotalAvgTime += OfferAvgTime[i];
              DemandTotalAvgTime += DemandAvgTime[i];    
            }

            DemandTotalAvgTime = DemandTotalAvgTime/DemandAvgTime.length;
            console.log('avg demand time is: ' + DemandTotalAvgTime);

            OfferTotalAvgTime = OfferTotalAvgTime/OfferAvgTime.length;
            console.log('avg offer time is: ' + OfferTotalAvgTime); */


            
          }

        
      
                
    }
}
      }

  }, 1);

  var dataToSend = JSON.stringify(variables.demand);

  t0 = new Date().getTime();
  sendData(whisperWeb3,  pubKey11, keyPair2, channelTopic, dataToSend);
   
//---------------------------------------------------------------------------------------------------------------------
})();








async function sendData(web3, pubKey, keyPair, channelTopic, data) {
  await web3.shh.post({
    pubKey: pubKey,
    sig: keyPair,
    ttl: 100,
    topic: channelTopic,
    payload: web3.utils.fromAscii(data),
    powTime: 100,
    powTarget: 2
});

}

});