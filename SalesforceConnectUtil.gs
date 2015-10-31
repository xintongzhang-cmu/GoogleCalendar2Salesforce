//Salesforce Authorizatin Endpoint
var AUTHORIZE_URL = 'https://login.salesforce.com/services/oauth2/token'; 

//PUT YOUR USER SETTINGS HERE
var CLIENT_ID = 'REPLACE_WITH_YOUR_CLIENT_ID';//Consumer Key
var CLIENT_SECRET='REPLACE_WITH_YOUR_CLIENT_SECRET';//Consumer Secret
var USERNAME = 'REPLACE_WITH_YOUR_USERNAME';
var PASSWORD = 'REPLACE_WITH_YOUR_PASSWORD_SECURITY_TOKEN';//password+securitytoken

function loginToSalesforce(){
  var token = PropertiesService.getUserProperties().getProperty('token');
  //If user doesn't have a token
  if(!token){
    //Request access token using username and password
    var response = requestService().getContentText();
    //Parse and store access token, instance_url
    parseResponse(response);
  } 
}

function requestService(){
  var payload = {
    "grant_type" : "password",
    "client_id" : CLIENT_ID,
    "client_secret" : CLIENT_SECRET,
    "username" : USERNAME,
    "password": PASSWORD
  };
  var options = {
    "method": "post",
    "payload": payload
  };
  return postToURL(AUTHORIZE_URL, options);
}

function parseResponse(r){
  //Parse Response
  var tokenResponse = JSON.parse(r);
  //store token and instsanceURL
  PropertiesService.getUserProperties().setProperty( 'instance_url', tokenResponse.instance_url);
  PropertiesService.getUserProperties().setProperty( 'token', tokenResponse.access_token);
}

function postToURL(url, options){
  var response = UrlFetchApp.fetch(url, options);
  return response;
}

function getRestAPIEndpoint(){
  var instance_url = PropertiesService.getUserProperties().getProperty('instance_url');
  if(!instance_url) {
    logintoSalesforce();
  }else{
    return instance_url+'/services/data/v26.0';
  }
}
