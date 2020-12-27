//IMPORT MODULES
const firebase = require('firebase-admin');
const serviceAccount = require('./firestoreAccountKey.json');
const firestore = require('firebase-admin');
const { GeoPoint } = require('@google-cloud/firestore');

//INITIALIZE "APP"
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: //[redacted],
});

//FUNCTION WHERE EVERYTHING HAPPENS
//GETS VALUES FROM REALTIME DATABASE AND THEN UPLOADS AND SYNCS TO GOOGLE FIRESTORE
function rtdbData() {
    const rtdbRef = firebase.database().ref(/*[redacted]*/); //SPECIFY WHERE TO FIND COORDINATES
    rtdbRef.on('value', function (snapshot) { //BEGINS MONITORING REALTIME DATABASE
        BusData = snapshot.exportVal(); //TAKES SNAPSHOTS AND EXPORTS THEM TO STRINGS
        async function firestoreWrite() { //WRITE THE SNAPSHOT DATA TO FIRESTORE
            
            //SPECIFY VARIABLES
            const db = firestore.firestore();
            const batch = db.batch(); //WRITES TO MULTIPLE DOCUMENTS (WORKS SIMILAR TO GITHUB PUSH/COMMIT)

            //CREATE GEOPOINTS FROM THE SNAPSHOT AND SET EACH BUS VARIABLE
            const Bus1 = new GeoPoint(BusData[1].Latitude, BusData[1].Longitude);
            const Bus2 = new GeoPoint(BusData[2].Latitude, BusData[2].Longitude);
            const Bus3 = new GeoPoint(BusData[3].Latitude, BusData[3].Longitude);
            const Bus4 = new GeoPoint(BusData[4].Latitude, BusData[4].Longitude);
            const Bus5 = new GeoPoint(BusData[5].Latitude, BusData[5].Longitude);

            //SPECIFY PATH WHERE EACH DOCUMENT IS LOCATED
            const bus1Coll = db.collection('Bus Track Details').doc('Bus 1');
            const bus2Coll = db.collection('Bus Track Details').doc('Bus 2');
            const bus3Coll = db.collection('Bus Track Details').doc('Bus 3');
            const bus4Coll = db.collection('Bus Track Details').doc('Bus 4');
            const bus5Coll = db.collection('Bus Track Details').doc('Bus 5');

            //SET EACH DOCUMENT TO UPDATE TO FIRESTORE
            batch.set(bus1Coll, { location: Bus1 });
            batch.set(bus2Coll, { location: Bus2 });
            batch.set(bus3Coll, { location: Bus3 });
            batch.set(bus4Coll, { location: Bus4 });
            batch.set(bus5Coll, { location: Bus5 });

            //COMMIT TO FIRESTORE (DON'T FORGET THIS COMMAND OR NOTHING WILL HAPPEN WILL UPDATE)
            await batch.commit();
        }

        firestoreWrite(); //RUN THE FUNCTION

    }, function (error) {
        console.log(error);
    },
    );
}

rtdbData(); //RUN THE WHOLE PROGRAM
