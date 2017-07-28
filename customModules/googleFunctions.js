
let google = require('googleapis');
let authentication = require("../authentication");

module.exports.updateData = function(auth, doc) {
  let valuesARR = [];
  doc.forEach(function(item,index){
        let  data = [];
        data.push(item["startDate"]);
        data.push(item["profileLink"]);
        data.push(item["first name"]);
        data.push(item["last name"]);
        data.push(item["age"]);
        data.push(item["Nationality"]);
        data.push(item["Lives in"]);
        data.push(item["Number of Friends"]);
        data.push(item["messenger user id"]);
        data.push(item["profile pic url"]); 
        valuesARR.push(data);
  });
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.update({
    auth: auth,
	spreadsheetId: '10utEusTbOMFvtxeqp8XgpfFiJxv6cYy0aOSdVzAkuTI',
    /* 1H5HOiSbuDs-gJRfnSVkksGf97Y6FpXu1MoX2NBHPxco langroo oficial
	//spreadsheetId: '10utEusTbOMFvtxeqp8XgpfFiJxv6cYy0aOSdVzAkuTI' teste sheet,*/
    range: 'Student - DATA2!A2:J', //Change Sheet1 if your worksheet's name is something else
    valueInputOption: "USER_ENTERED",
    resource: {
      values:valuesARR
    /*  values: [
                [
                  doc['dateMessaged'],
          				doc['profileLink'],
          				doc['first name'],
          				doc['las name'],
          				doc['age'],
          				doc['Nationality'],
          				doc['Lives in'],
          				doc['Number of Friends'],
          				doc['weeks since first interaction'],
          				doc['last Answer to bot']
                ]
  				    ]*/
    }
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } else {
        console.log("Appended");
    }
  });
}

module.exports.appendData = function(auth, doc) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.append({
    auth: auth,
	spreadsheetId: '10utEusTbOMFvtxeqp8XgpfFiJxv6cYy0aOSdVzAkuTI',
    /* 1H5HOiSbuDs-gJRfnSVkksGf97Y6FpXu1MoX2NBHPxco langroo oficial
	//spreadsheetId: '10utEusTbOMFvtxeqp8XgpfFiJxv6cYy0aOSdVzAkuTI' teste sheet,*/
    range: 'Student - DATA2!A2:J', //Change Sheet1 if your worksheet's name is something else
    valueInputOption: "USER_ENTERED",
    resource: {
      values:[  doc  ]
    /*  values: [
                [
                  doc['dateMessaged'],
          				doc['profileLink'],
          				doc['first name'],
          				doc['las name'],
          				doc['age'],
          				doc['Nationality'],
          				doc['Lives in'],
          				doc['Number of Friends'],
          				doc['weeks since first interaction'],
          				doc['last Answer to bot']
                ]
  				    ]*/
    }
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } else {
        console.log("Appended");
    }
  });
}
