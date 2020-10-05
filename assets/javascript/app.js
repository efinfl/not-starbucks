//zomato api key - e97edef9cbe1d4aecc6f02392e0b3e41
//mapbox api key - pk.eyJ1Ijoic3JxZ2FsNzAiLCJhIjoiY2pveGRqczZ3MHRqNDN2bzNqZnZyY24wZCJ9.6yrKtG9SdZfVs33fh-L99Q
//yelp api key - lxumwcnCqBbwZiKU7_BmKQ0lfWWWGL5Z4fg3pjWYQpKLI2HV7Xspd9sGDSeSBzC6ygaEnYe9BFdDJJq-cdY_OZ2UPf7Gt2IPaTPHxg24C8w9N2RAsupCTdoWeh78W3Yx

// Yelp api key - lxumwcnCqBbwZiKU7_BmKQ0lfWWWGL5Z4fg3pjWYQpKLI2HV7Xspd9sGDSeSBzC6ygaEnYe9BFdDJJq-cdY_OZ2UPf7Gt2IPaTPHxg24C8w9N2RAsupCTdoWeh78W3Yx

// Eric FourSquare
// Client ID
// WQL4F35RFS2BMBNVUKYJSDZDIEWP4IPOHIW0CKHLWO2YZPUZ
// Client Secret
// 11OK3MBODQM3HWUWYRYWRHRUVFMFYU5JGWIONSTSXBY5DMS1

let lat;
let lon;



// This is the FourSquare API call
$(document).ready(function () {

// ==================== On click "Start Seach Button" ===================

    $("#geolocation").on("click", function (event) {

        event.preventDefault();

        console.log("I've been clicked");

        // Calls Geolacation of user
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log("Current location; " + position.coords.longitude, position.coords.latitude);
            lat = parseFloat(position.coords.latitude);
            console.log("here is the lat number: " + lat);
            lon = parseFloat(position.coords.longitude);
            console.log("here is the lon number: " + lon);
            mapboxgl.accessToken = 'pk.eyJ1IjoiZWZpbmZsIiwiYSI6ImNqcDJsMmR2aDA4YTkzcW83ODg4bG5veWgifQ.LVd65lpkssEHU6RLtdydOQ';

            // Displays apBox Map and center it to users location
            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v10',
                center: [lon, lat],
                zoom: 10,
            });

            // Places zoom control in map
            map.addControl(new mapboxgl.NavigationControl());

            // Function to retrieve data from FourSquere

            function getVenues(lat, lon) {
                var CLIENT_ID = "WQL4F35RFS2BMBNVUKYJSDZDIEWP4IPOHIW0CKHLWO2YZPUZ"
                var CLIENT_SECRET = "11OK3MBODQM3HWUWYRYWRHRUVFMFYU5JGWIONSTSXBY5DMS1"

                var queryUrl = "https://api.foursquare.com/v2/venues/search?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&ll=" + lat + "," + lon + "&query=coffee&limit=10&v=20181127"


                console.log(queryUrl)

                $.ajax({
                    url: queryUrl,
                    type: "GET",
                    dataType: "jsonp",
                    cache: "false"

                }).then(function (response) {
                    let results = response.response.venues
                    apiResponse = results
                    console.log(response)

                    $("#coffeeShops > tbody").empty();

                    for (i = 0; i < results.length; i++) {
                        if (results[i].name !== "Starbucks") {
                            console.log(results[i])
                            // Variable taked from results for use in display
                            var name = results[i].name;
                            console.log("---" + name);
                            var street = results[i].location.address;
                            console.log(street);
                            var city = results[i].location.city;
                            console.log(city);
                            var state = results[i].location.state;
                            console.log(state);
                            var zipCode = results[i].location.postalCode;
                            console.log(zipCode);
                            var distance = (results[i].location.distance * 0.000621371192).toFixed(1);
                            console.log(distance);

                            var newRow = $("<tr>").append(
                                $("<td>").html("<i class='material-icons tiny'>free_breakfast</i>"),
                                $("<td>").text(name),
                                $("<td>").text(distance),
                                $("<td>").text(street),
                                $("<td>").text(city + ", " + state + " " + zipCode)

                            );

                            $("#coffeeShops > tbody").append(newRow);

                            var marker = new mapboxgl.Marker()
                                .setLngLat([results[i].location.lng, results[i].location.lat])
                                .setPopup(new mapboxgl.Popup({ offset: 25 })
                                    .setHTML("<p>" + results[i].name + "<p>"))
                                .addTo(map);

                            // var popup = new mapboxgl.Popup()
                            //     .setLngLat([results[i].location.lng, results[i].location.lat])
                            //     .setHTML("<p>" + results[i].name + "</p>")
                            //     .addTo(map)

                        }
                    }

                });
            }

            getVenues(lat, lon);

        });

    });

// ============= On Clicks for sorting =======================

    $("#alpha").on("click", function (event) {
        sortTableAlpha(1);
    })

    $("#dist").on("click", function (event) {
        sortTableDist(2);
    })
// ========================= Sort Table by Name ========================
    // Full disclosure: Got this sort table function from wc3.
    function sortTableAlpha(n) {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("coffeeShops");
        switching = true;
        // Set the sorting direction to ascending:
        dir = "asc";
        /* Make a loop that will continue until
        no switching has been done: */
        while (switching) {
            // Start by saying: no switching is done:
            switching = false;
            rows = table.rows;
            /* Loop through all table rows (except the
            first, which contains table headers): */
            for (i = 1; i < (rows.length - 1); i++) {
                // Start by saying there should be no switching:
                shouldSwitch = false;
                /* Get the two elements you want to compare,
                one from current row and one from the next: */
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                /* Check if the two rows should switch place,
                based on the direction, asc or desc: */
                if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                /* If a switch has been marked, make the switch
                and mark that a switch has been done: */
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                // Each time a switch is done, increase this count by 1:
                switchcount++;
            } else {
                /* If no switching has been done AND the direction is "asc",
                set the direction to "desc" and run the while loop again. */
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    }
// ==================Sort Table by Distance==================
    function sortTableDist(n) {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("coffeeShops");
        switching = true;
        // Set the sorting direction to ascending:
        dir = "asc";
        /* Make a loop that will continue until
        no switching has been done: */
        while (switching) {
            // Start by saying: no switching is done:
            switching = false;
            rows = table.rows;
            /* Loop through all table rows (except the
            first, which contains table headers): */
            for (i = 1; i < (rows.length - 1); i++) {
                // Start by saying there should be no switching:
                shouldSwitch = false;
                /* Get the two elements you want to compare,
                one from current row and one from the next: */
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                /* Check if the two rows should switch place,
                based on the direction, asc or desc: */
                if (dir == "asc") {
                    if (Number(x.innerHTML) > Number(y.innerHTML)) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                /* If a switch has been marked, make the switch
                and mark that a switch has been done: */
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                // Each time a switch is done, increase this count by 1:
                switchcount++;
            }
        }
    }










});

