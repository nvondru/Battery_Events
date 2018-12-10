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

function showDetails(id) {
    var item = chargeItems.rows.item(id - 1);
    $('#content_container').load("html/detailPage.html", function() {
        document.addEventListener("backbutton", showOverview, false);
        $('#title').html(item.perc_plugged + "% - " +
            item.perc_unplugged + "%");
    });
}

function showOverview() {
    $('#content_container').load("html/overviewPage.html", function() {
        document.removeEventListener('backbutton', showOverview, false);
        $('#daysToShow').formSelect();
        $.refreshEntries();

    });
}

function deleteEntry() {
    alert("dragged");
}

$(function() {
    db = window.openDatabase("battery_db", "1.0", "Database for Cordova App 'Battery Events'", 200000, console.info("DB created"));
    $.initDB();
    showOverview();

    document.addEventListener('deviceready', $.initSystem, false);



});

jQuery.extend({
    initSystem: function() {
        console.info('Device is now ready');
        window.addEventListener("batterystatus", $.onBatteryChanged, false);
        console.info("System is initiated");
    },
    gatherData: function(locationInfo) {
        isCharging = !isCharging;
        latitude = locationInfo.coords.latitude;
        longitude = locationInfo.coords.longitude;
        if (isCharging == true) {
            time_start = new Date();
            perc_plugged = batteryStatus.level;
            // alert("Device got plugged in on " + time_start + " at " + batteryStatus.level + "% charge. The current position is: lat:" + latitude + " / long: " + longitude);
            $.savePlugData();

        } else {
            time_end = new Date();
            perc_unplugged = batteryStatus.level;
            // alert("Device got unplugged on " + time_end + " at " + batteryStatus.level + "% charge. The current position is: lat:" + latitude + " / long: " + longitude);
            $.saveUnplugData();

        }
    },
    printError: function(errorMsg) {
        alert(errorMsg);
    },
    onBatteryChanged: function(status) {
        batteryStatus = status;
        if (batteryStatus.isPlugged == true && isCharging == false) {

            navigator.geolocation.getCurrentPosition($.gatherData);

        } else if (batteryStatus.isPlugged == false && isCharging == true) {

            navigator.geolocation.getCurrentPosition($.gatherData);
        }
    },

    initDB: function() {
        db.transaction($.createTables, $.errorCB, $.successCB);
    },
    savePlugData: function() {
        db.transaction($.startEntry, $.errorCB, $.successCB);
    },
    saveUnplugData: function() {
        db.transaction($.completeEntry, $.errorCB, $.successCB);
    },
    createTables: function(tx) {
        // tx.executeSql('DROP TABLE IF EXISTS CHARGES');
        // tx.executeSql('CREATE TABLE IF NOT EXISTS CHARGES(id INTEGER PRIMARY KEY, perc_plugged INTEGER, perc_unplugged INTEGER, time_start VARCHAR(100), time_end VARCHAR(100), latitude DOUBLE(4,16), longitude DOUBLE(4, 16))');
        tx.executeSql('CREATE TABLE IF NOT EXISTS CHARGES(id integer PRIMARY KEY, perc_plugged , perc_unplugged, time_start, time_end, latitude, longitude)');

    },
    errorCB: function() {
        alert("Fehler bei der SQL-Aktion");
    },
    successCB: function() {
        // alert("SQL-Aktion ausgeführt.");
    },
    startEntry: function(tx) {
        tx.executeSql('INSERT INTO CHARGES(perc_plugged, time_start, latitude, longitude) VALUES ("' + perc_plugged + '", "' + time_start.toString() + '", "' + latitude + '", "' + longitude + '")');
    },
    completeEntry: function(tx) {
        tx.executeSql('SELECT * FROM CHARGES ORDER BY id DESC LIMIT 1', [], function(tx, results) {
            var activeId = results.rows.item(0).id;
            tx.executeSql('UPDATE CHARGES SET perc_unplugged = "' + perc_unplugged + '", time_end = "' + time_end.toString() + '" WHERE id = ' + activeId);
            $.refreshEntries();
        });
    },
    processCompleteEntries: function(tx) {
        tx.executeSql("SELECT * FROM CHARGES", [], function(tx, results) {

            chargeItems = results;
            $('#charges').html('');

            for (var i = 0; i < results.rows.length; i++) {
                if (results.rows.item(i).perc_unplugged != undefined) {
                    var item = results.rows.item(i);
                    var startDate = new Date(item.time_start);
                    var endDate = new Date(item.time_end);

                    var chargeDate = startDate.getDate() + (".") + (startDate.getMonth()) + (".") + (startDate.getFullYear());
                    var chargeCycle =

                        '<div id="' + item.id + '" class="row col s10 m10 l4 offset-s1 offset-m1 offset-l4 chargePanel" onclick="showDetails(' + item.id + ')" ondrag="deleteEntry()">' +

                        '<div class="col row s5 m5 l4 teal white-text round-corners-left">' +
                        '<i class="col s12 m4 l4 fas fa-battery-half icon"></i>' +
                        '<div class="col s12 m8 l8 align-center">' + item.perc_plugged + '% - ' + item.perc_unplugged + '%</div>' +
                        '</div>' +

                        '<div class="row col s7 m7 l8 teal white-text  lighten-2 align-center round-corners-right">' +
                        '<i class="icon col s3 m3 l3 far fa-calendar-alt"></i>' +
                        '<div class="row col s8 m8 l8">' +
                        '<div class="col s12 m6 l6">' + chargeDate + '</div>' +
                        '<div class="col s12 m6 l6">' + startDate.getHours() + ':' + startDate.getMinutes() + ' - ' + endDate.getHours() + ':' + endDate.getMinutes() + '</div>' +
                        '</div>' +
                        '</div>' +

                        '</div>';

                    $('#charges').append(chargeCycle);

                }
            }
        });
    },

    refreshEntries: function() {

        db.transaction($.processCompleteEntries, $.errorCB, $.successCB);

    }


});