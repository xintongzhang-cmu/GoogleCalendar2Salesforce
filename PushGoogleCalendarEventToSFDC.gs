//Entry point for running the script. Please run this function.
function main(){
  
  clearToken();
  
  loginToSalesforce();
  
  var event = retrieveCalendarEventFromGoogle();
  
  Logger.log(event.summary + ' will be synced to Salesforce.');
  
  sendEventToSalesforce(event);
}

//Google Calendar API: https://developers.google.com/google-apps/calendar/v3/reference/events/list
function retrieveCalendarEventFromGoogle() {
  var calendarId = 'primary';
  var optionalArgs = {
    timeMin: (new Date()).toISOString(),//Lower bound (inclusive) for an event's end time to filter by.
    showDeleted: false,
    singleEvents: true,
    maxResults: 1,//Maximum number of events returned on one result page.
    orderBy: 'startTime'
  };  
  var eventList = Calendar.Events.list(calendarId, optionalArgs).items;
  if(eventList.length > 0 ){
    return  eventList[0]; 
  }
}

function sendEventToSalesforce(event){
  var url = getRestAPIEndpoint()+'/sobjects/Event/';
  
  var payload = {
    "Subject" : event.summary,
    "Location" : event.location,
    "Description" : event.description,
    "StartDateTime" : Utilities.formatDate(new Date(), "GMT", "yyyy-mm-dd'T'hh:mm:ss'Z'"),
    "EndDateTime" : Utilities.formatDate(new Date(), "GMT", "yyyy-mm-dd'T'hh:mm:ss'Z'")
  }; 
  

 var options = {
    "method": "post",
    "contentType" : "application/json",
    "headers" : {
      "Authorization" : "Bearer " + PropertiesService.getUserProperties().getProperty('token')
    },
    "payload" : JSON.stringify(payload)
  };
  
  var res = postToURL(url, options);
  
  Logger.log(res.getContentText());//Click View > Logs, if you see "'success':true", then the scrip has run successfully. Check in your Salesforce org for the new event.

}

function clearToken(){
  PropertiesService.getUserProperties().deleteAllProperties();
}


