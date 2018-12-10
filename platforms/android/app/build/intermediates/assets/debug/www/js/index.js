var isCharging = false;
var date;
var db;
var batteryStatus;
var perc_plugged = 0;
var perc_unplugged = 0;
var time_start = new Date();
var time_end = new Date();
var latitude = 0.0;
var longitude = 0.0;
var chargeItems;
var item;
var minsStart;
var minsEnd;

// Document-Ready function
$(function() {

    $('body').append('<script src="https://maps.googleapis.com/maps/api/js?key=' + mapsAPIKey + '" async defer></script>');
    db = window.openDatabase("battery_db", "1.0", "Database for Cordova App 'Battery Events'", 200000, console.info("DB created"));
    $.initDB();
    // $.insertSampleData();
    showOverview();


    // Sobald das Device ready ist, wird der Batterie-Sensor aktiviert
    document.addEventListener('deviceready', $.initSystem, false);
});

// Funktionen die innerhalb dieses Scripts durch '$.funktion' aufgerufen werden können
jQuery.extend({
    initSystem: function() {
        console.info('Device is now ready');
        window.addEventListener("batterystatus", $.onBatteryChanged, false);
        console.info("Battery-Sensor is initiated");
    },
    // Trackt den Ladestand der Batterie und die aktuelle Zeit und speichert danach die Daten in der Datenbank     
    gatherData: function(locationInfo) {
        isCharging = !isCharging;
        latitude = locationInfo.coords.latitude;
        longitude = locationInfo.coords.longitude;
        // Unterscheidung zwischen Stromquelle angeschlossen/abgehängt
        if (isCharging == true) {
            // Neuer Datensatz wird angelegt
            time_start = new Date();
            perc_plugged = batteryStatus.level;
            $.savePlugData();
        } else {
            // Bestehender Datensatz wird ergänzt
            time_end = new Date();
            perc_unplugged = batteryStatus.level;
            $.saveUnplugData();
        }
    },
    // Wird jedes mal ausgeführt, wenn sich der Batterie Status ändert:
    //  - Prozentzahl ändert sich
    //  - Stromquelle wird angeschlossen
    //  - Stromquelle wird entfernt
    onBatteryChanged: function(status) {
        batteryStatus = status;
        // Wird ausgeführt wenn das Handy angeschlossen wird und wenn es wieder abgehängt wird
        if (batteryStatus.isPlugged == true && isCharging == false || batteryStatus.isPlugged == false && isCharging == true) {
            // Trackt die aktuelle Position und reicht die Daten an die Funktion 'gatherData' weiter
            navigator.geolocation.getCurrentPosition($.gatherData);
        }
    },
    //  CRUD Funktionen für Zugriff auf die Datenbank
    // -------------------------------------------------------------------------------
    initDB: function() {
        db.transaction($.createTables, $.errorCB);
    },
    // Erzeugung der Beispiel-Daten
    insertSampleData: function() {
        db.transaction(function(tx) {
            tx.executeSql('INSERT INTO CHARGES(perc_plugged, perc_unplugged, time_start, time_end, latitude, longitude) VALUES ("10", "90", "Fri Dec 07 2016 15:32:15 GMT+0100 (Mitteleuropäische Normalzeit)", "Fri Dec 07 2016 18:32:15 GMT+0100 (Mitteleuropäische Normalzeit)", "47.42819844730578", "9.376605279664727")');
            tx.executeSql('INSERT INTO CHARGES(perc_plugged, perc_unplugged, time_start, time_end, latitude, longitude) VALUES ("20", "80", "Fri Jan 26 2018 19:32:15 GMT+0100 (Mitteleuropäische Normalzeit)", "Fri Jan 26 2018 23:32:15 GMT+0100 (Mitteleuropäische Normalzeit)", "47.42819844730578", "9.376605279664727")');
            tx.executeSql('INSERT INTO CHARGES(perc_plugged, perc_unplugged, time_start, time_end, latitude, longitude) VALUES ("10", "90", "Mon Nov 19 2018 15:32:15 GMT+0100 (Mitteleuropäische Normalzeit)", "Mon Nov 19 2018 18:32:15 GMT+0100 (Mitteleuropäische Normalzeit)", "47.42819844730578", "9.376605279664727")');
            tx.executeSql('INSERT INTO CHARGES(perc_plugged, perc_unplugged, time_start, time_end, latitude, longitude) VALUES ("10", "90", "Mon Dec 10 2018 15:32:15 GMT+0100 (Mitteleuropäische Normalzeit)", "Mon Dec 10 2018 18:32:15 GMT+0100 (Mitteleuropäische Normalzeit)", "47.42819844730578", "9.376605279664727")');
        })
    },
    savePlugData: function() {
        db.transaction($.startEntry, $.errorCB);
    },
    saveUnplugData: function() {
        db.transaction($.completeEntry, $.errorCB);
    },
    deleteEntry: function() {
        db.transaction($.deleteDBEntry, $.errorCB);
    },
    deleteAllEntries: function() {
        db.transaction($.deleteAllDBEntries, $.errorCB);
    },
    createTables: function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS CHARGES(id integer PRIMARY KEY, perc_plugged , perc_unplugged, time_start, time_end, latitude, longitude)');
    },
    startEntry: function(tx) {
        tx.executeSql('INSERT INTO CHARGES(perc_plugged, time_start, latitude, longitude) VALUES ("' + perc_plugged + '", "' + time_start.toString() + '", "' + latitude + '", "' + longitude + '")');
    },
    completeEntry: function(tx) {
        tx.executeSql('SELECT * FROM CHARGES ORDER BY id DESC LIMIT 1', [], function(tx, results) {
            var activeId = results.rows.item(0).id;
            tx.executeSql('UPDATE CHARGES SET perc_unplugged = "' + perc_unplugged + '", time_end = "' + time_end.toString() + '" WHERE id = ' + activeId);
            refreshEntries();
        });
    },
    deleteDBEntry: function(tx) {
        tx.executeSql('DELETE FROM CHARGES WHERE ID = ' + item.id);
        showOverview();
    },
    deleteAllDBEntries: function(tx) {
        tx.executeSql('DELETE FROM CHARGES');
        refreshEntries();
    },
    // Dynamische Erzeugung aller vollständigen Einträge
    // Wird in folgenden Fällen ausgeführt:
    //  - App wird geöffnet
    //  - Handy wird vom Strom getrennt
    //  - Filter auf Übersichtsseite wird neu gesetzt
    processCompleteEntries: function(tx) {
        tx.executeSql("SELECT * FROM CHARGES", [], function(tx, results) {
            chargeItems = results;
            $('#charges').html('');


            if (chargeItems.rows.length == 0) {
                $('#deleteButton').hide();
            } else {
                $('#deleteButton').show();
            }
            for (var i = 0; i < results.rows.length; i++) {
                if (results.rows.item(i).perc_unplugged != undefined) {
                    var item = results.rows.item(i);
                    var startDate = new Date(item.time_start);
                    var endDate = new Date(item.time_end);
                    // Filterung der Einträge nach gesetztem Zeitfilter
                    if (startDate.getTime() > $.now() - $('#daysToShow').val() || $('#daysToShow').val() == 0) {
                        var chargeDate = startDate.getDate() + (".") + (startDate.getMonth() + 1) + (".") + (startDate.getFullYear());
                        minsStart = startDate.getMinutes();
                        if (minsStart < 10) {
                            minsStart = "0" + minsStart;
                        }
                        minsEnd = endDate.getMinutes();
                        if (minsEnd < 10) {
                            minsEnd = "0" + minsEnd;
                        }
                        // Erzeugung des dynamischen HTML-Codes
                        var chargeCycle =

                            '<div id="' + item.id + '" class="row col s10 m10 l4 offset-s1 offset-m1 offset-l4 chargePanel" onclick="showDetails(' + item.id + ')" ondrag="deleteEntry()">' +

                            '<div class="col row s5 m5 l4 teal white-text round-corners-left">' +
                            '<i class="col s12 m4 l4 fas fa-battery-half icon"></i>' +
                            '<div class="col s12 m8 l8 align-center bold">' + item.perc_plugged + '% - ' + item.perc_unplugged + '%</div>' +
                            '</div>' +

                            '<div class="row col s7 m7 l8 teal white-text  lighten-2 align-center round-corners-right  valign-wrapper">' +
                            '<i class="icon col s3 m3 l3 far fa-calendar-alt"></i>' +
                            '<div class="row col s8 m8 l8">' +
                            '<div class="col s12 m6 l6">' + chargeDate + '</div>' +
                            '<div class="col s12 m6 l6">' + startDate.getHours() + ':' + minsStart + ' - ' + endDate.getHours() + ':' + minsEnd + '</div>' +
                            '</div>' +
                            '</div>' +

                            '</div>';

                        $('#charges').append(chargeCycle);
                    }
                }
            }

        });
    },
    // -------------------------------------------------------------------------------
    errorCB: function() {
        alert("Fehler bei der SQL-Aktion");
    }


});

// Zeigt eine Google-Maps Karte mit den Koordinaten des geladenen Eintrags
// Erstellt einen Marker an der exakten Position
function initMap() {
    var myLatLng = new google.maps.LatLng(parseFloat(item.latitude), parseFloat(item.longitude));
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 14
    });
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: ''
    });
}
// Lädt die Detailansicht des angeklickten Eintrags
// Initialisiert die Seite mit den entsprechenden Daten und einer Karte
function showDetails(itemID) {
    for (var i = 0; i < chargeItems.rows.length; i++) {
        if (chargeItems.rows.item(i).id == itemID) {
            item = chargeItems.rows.item(i);
        }
    }
    $('#content_container').load("html/detailPage.html", function() {
        startDate = new Date(item.time_start);
        endDate = new Date(item.time_end);
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + item.latitude + "," + item.longitude + "&key=" + placesAPIKey;
        $.getJSON(url, function(json) {

            console.log(json.results[0].address_components[2].long_name);
            var placeName = json.results[0].address_components[2].long_name;
            var address = json.results[0].formatted_address;
            $('#title').html(placeName);
            $('#lblAddress').html(address);

        });

        // Wenn der backbutton des Phones auf dieser Seite geklickt wird, soll die Übersicht wieder angezeigt werden
        document.addEventListener("backbutton", showOverview, false);

        var chargeDate = startDate.getDate() + (".") + (startDate.getMonth() + 1) + (".") + (startDate.getFullYear());
        var timeSpan = startDate.getHours() + ':' + minsStart + ' - ' + endDate.getHours() + ':' + minsEnd + " Uhr";
        $('#lblDate').html(chargeDate);
        $('#lblTime').html(timeSpan);
        $('#lblCharge').html(item.perc_plugged + "% - " + item.perc_unplugged + "%");
        initMap();
    });
}

// Lädt die Übersicht über alle in der Datenbank verfügbaren Einträge
function showOverview() {
    $('#content_container').load("html/overviewPage.html", function() {
        // der überschriebene Evenlistener für den Backbutton wird entfernt (App wird nun bei Klick geschlossen)
        document.removeEventListener('backbutton', showOverview, false);
        // Initialisierung der Materialize controls 
        $('#daysToShow').formSelect();
        $('.modal').modal();
        refreshEntries();
    });
}

function refreshEntries() {
    db.transaction($.processCompleteEntries, $.errorCB);
}

function confirmDeletion() {
    var confirmation;
    confirmation = confirm("Do you really want to delete this element?")
    if (confirmation == true) {
        $.deleteEntry();
    }
}

function confirmDeletionAll() {
    var confirmation;
    confirmation = confirm("Do you really want to delete all elements?")
    if (confirmation == true) {
        $.deleteAllEntries();
    }
}