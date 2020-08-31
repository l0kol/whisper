var state = 0;

var package = {address : '0x23423434'};

var demand = { 
    "id" : "demand",
    "packageAddress" : "xxx",
    "startDate" : 0,
    "endDate" : 0,
    "demandEndDate" : 0,
    "timestamp" : 0
}

var offer = {
    "id" : 'offer',
    "addressWarehouse" : 'sdfsdfsdfsdfsdf',
    "cost" : 0.0,
    "timestamp" : 0,
    "offerStartDate" : 0,
    "offerEndDate" : 0
}

var agreement = {
    "id" : 'offer',
    "provider" : 'sdfsdfsdfsdfsdf',
    "consumer" : 'sadfsafds',
    "timestamp" : 0,
    "cost" : 0,
    "signed" : 0,
    "resolved_C" : 0,
    "resolved_P" : 0
}

var ClientofferRsp = {
    "id" : 'offerRsp',
    "acceptance" : false
}

var WarhouseOfferEnd = {
    "id" : 'offerEnd',
    "acceptance" : false
}


var MessageToSign = { 
    "id" : "MsgSign",
    "text" : "xxx"
}

var SignedMessage = { 
    "id" : "SignedMsg",
    "text" : "xxx"
}

var clientAddress = { 
    "id" : "authenticate",
    "text" : "xxx"
}

var authenticate = { 
    "id" : "authentication",
    "state" : false
}




const variables = {};

variables.package = package;
variables.demand = demand;
variables.offer = offer;
variables.ClientofferRsp = ClientofferRsp;
variables.MessageToSign = MessageToSign;
variables.clientAddress = clientAddress;
variables.SignedMessage = SignedMessage;
variables.authenticate = authenticate;
variables.WarhouseOfferEnd = WarhouseOfferEnd;

variables.agreement = agreement;



module.exports = variables;
