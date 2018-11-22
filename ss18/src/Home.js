import React from 'react';
import logo from './react.svg';
import './Home.css';

class Home extends React.Component {


  render() {
    return (
      <div className="Home">
        <button onClick={this.submit}>Submit</button>
      </div>
    );
  }

  submit() {

    var fakeData = [
      {
        "id": 0,
        "name": "Jordan",
        "emailAddress": "dev@spun-labs.com",
        "address": "Flat 209, 3 Cambridge Street, Chorlton Mill, Manchester M15BY",
        "cantHave": [1]
      },
      {
        "id": 1,
        "name": "Vanesa",
        "emailAddress": "dev@spun-labs.com",
        "address": "Flat 209, 3 Cambridge Street, Chorlton Mill, Manchester M15BY",
        "cantHave": [0]
      },
      {
        "id": 2,
        "name": "Laura",
        "emailAddress": "dev@spun-labs.com",
        "address": "8 The Mount, Canterbury, Kent CT3 4AN",
        "cantHave": []
      },
      {
        "id": 3,
        "name": "Olivia",
        "emailAddress": "dev@spun-labs.com",
        "address": "100 Battersby Road, London SE6 1SB",
        "cantHave": [4]
      },
      {
        "id": 4,
        "name": "Tirth",
        "emailAddress": "dev@spun-labs.com",
        "address": "100 Battersby Road, London SE6 1SB",
        "cantHave": [3]
      },
      {
        "id": 5,
        "name": "Carly",
        "emailAddress": "dev@spun-labs.com",
        "address": "34 Todshaugh Gardens, Kirkliston EH29 9GE",
        "cantHave": [6, 7]
      },
      {
        "id": 6,
        "name": "Michael",
        "emailAddress": "dev@spun-labs.com",
        "address": "34 Todshaugh Gardens, Kirkliston EH29 9GE",
        "cantHave": [5, 7]
      },
      {
        "id": 7,
        "name": "Liam",
        "emailAddress": "dev@spun-labs.com",
        "address": "126 Plodder Lane, Bolton BL4 0BU",
        "cantHave": [5, 6]
      },
      {
        "id": 8,
        "name": "Harriet",
        "emailAddress": "dev@spun-labs.com",
        "address": "14/2 Henderson Street, Edinburgh, EH6 6BS",
        "cantHave": []
      },
    ];

    var restrictedFirst = [];

    for (var k = 0; k < fakeData.length; k++) {
      restrictedFirst = fakeData.sort(function(a, b) {
        var aRestricted = a.cantHave.length;
        var bRestricted = b.cantHave.length;
        return bRestricted - aRestricted;
      });
    }

    //console.log("[restricted first]", restrictedFirst);

    var dataToSend = [];

    for (var i = 0; i < restrictedFirst.length; i++) {
      var thisGuy = restrictedFirst[i];

      //console.log("[already taken]", dataToSend.map(x => x.ss_id));

      var cantHaves = thisGuy.cantHave.concat([thisGuy.id]).concat(dataToSend.map(x => x.ss_id));
      //console.log("["+ thisGuy.name  +" can't have]", cantHaves);

      var canHave = restrictedFirst.filter(function(person) {
        return cantHaves.indexOf(person.id) === -1;
      }).sort(function() {
        return 0.5 - Math.random();
      });

      var recipient = canHave[0];

      if (canHave.length === 0) {
        //we need to jiggle someone out
        var randomAppropriatePerson = restrictedFirst.find(function(person) {
          var theirData = dataToSend.find(function(sendData) {
            return sendData.id === person.id;
          });

          if (theirData) {
            var theirPerson = restrictedFirst.find(function(peeps) {
              return peeps.id === theirData.ss_id;
            });

            //if they can have you, and you can have their person...
            return person.cantHave.indexOf(thisGuy.id) === -1 && thisGuy.cantHave.indexOf(theirPerson.id) === -1;
          }

          //not in the data to send pile?
          return false;
        });

        var sendingData = dataToSend.find(function(el) {
          return el.id === randomAppropriatePerson.id;
        });

        //your recipient is now their person
        recipient = restrictedFirst.find(function(peeps) {
          return peeps.id === sendingData.ss_id;
        });

        console.log("[amendment for " + sendingData.to_name + "]", thisGuy.name);

        //you are now their recipient
        sendingData.ss_id = thisGuy.id;
        sendingData.ss_name = thisGuy.name;
        sendingData.ss_address = thisGuy.address;
      }

      console.log("["+ thisGuy.name  +" has]", recipient.name);

      dataToSend.push({
        "id": thisGuy.id,
        "to_name": thisGuy.name,
        "to_email": thisGuy.emailAddress,
        "ss_id": recipient.id,
        "ss_name": recipient.name,
        "ss_address": recipient.address
      });

      //console.log("[data to send]", dataToSend);
    }

    console.log("[data to send]", dataToSend);

    for(var y = 0; y < dataToSend.length; y++) {
      var emailParams = {
        service_id: 'sendgrid',
        template_id: 'template_fpKv8aBD',
        user_id: 'user_5WQaWmRYiqDIkifesP1Cz',
        template_params: {
            'to_name': dataToSend[y].to_name,
            'to_email': dataToSend[y].to_email,
            'ss_name': dataToSend[y].ss_name,
            'ss_address': dataToSend[y].ss_address
        }
      };

      // avoiding any accidental sending!
      // fetch('https://api.emailjs.com/api/v1.0/email/send', {
      //   method: 'POST',
      //   headers: {
      //     'Accept': 'application/json',
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(emailParams)
      // });
    }
  }
}

export default Home;
