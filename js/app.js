// Locations that will be used in Application. Restaurants I enjoyed in DC! 
var locationsdb = [
{id: 0, title: "Pollo Peru", location: {lat: 38.9683883, lng: -77.3551893}, address: "1675 Reston Pkwy, Reston, VA 20194"},
{id: 1, title: "Bar Taco",	location: {lat: 38.9580539, lng: -77.36063690000003}, address: "12021 Town Square St, Reston, VA 20190"},
{id: 2, title: "Super Pho", location: {lat: 38.9214064, lng: -77.41643879999998}, address: "3065 Centreville Rd, Herndon, VA 20171"},
{id: 3, title: "Barcelona Wine Bar", location: {lat: 38.9580393, lng: -77.3608544}, address: "12023 Town Square St, Reston, VA 20190"},
{id: 4, title: "Pokehub", location: {lat: 38.9589182, lng: -77.3608266}, address: "11990 Market St, Reston, VA 20190"}
];
var map;
var markersArray = [];
var infowindow;

//Provide lat, lng coords and return photo
function getFourSqarePhoto(location) {
	var client_secret = 'R22OL3UWPL1KYSK2XI0CZDZLKCQX4QOPUENZ0HOYV0R4FPVU';
	var client_id = '1FNXGRY10KVF2DVQUHFOYTWJHL3Q2F23YN5SA53EUW4KXRMB';
	fetch('https://api.foursquare.com/v2/venues/explore?client_id='+client_id+'&client_secret='+client_secret+'&v=20180323&limit=1&ll=40.7243,-74.0018&query=coffee')
	    .then(function() {
	        // Code for handling API response
	    })
	    .catch(function() {
	        // Code for handling errors
	    });

}
function initMap() {
	//Create Map Object
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 38.90, lng: -77.35},
		zoom: 11,
	});
	//Create markers and infowindows, add to their arrays
	for (i=0; i<locationsdb.length; i++) {
		var marker = new google.maps.Marker({
			position: locationsdb[i].location,
			animation: google.maps.Animation.DROP,
			map: map,
			title: locationsdb[i].title
		});

		//Attach Bounce Animation to each marker on click
		function attachBounce(marker) {
			marker.addListener('click', function(){
				markersArray.forEach(function(markerItem){
					if (marker.getAnimation() == null) {
					markerItem.setAnimation(null);
					}
				})
				marker.setAnimation(google.maps.Animation.BOUNCE);
			})
		}

		//Attach Infowindow to each marker on click
		function attachInfoWindow(marker){
			var text = marker.getTitle();
			marker.addListener('click', function(){
				if (infowindow) {
					infowindow.close();
				}
				infowindow = new google.maps.InfoWindow({
					content: text
				})
				infowindow.open(map, marker);
			});
		}
		attachBounce(marker);
		attachInfoWindow(marker);
		markersArray.push(marker);
	};
}
//Inititialize View Model
var ViewModel = function() {
	var self = this;
	//Variable to hold filter text 
	this.filterText = ko.observable("");
	//Create Observable Array for Locations
	this.locationList = ko.observableArray([]);

	locationsdb.forEach(function(locationItem){
		self.locationList.push( new Location(locationItem));
		})

	//Construct Filtered Location List, Update markers, and ViewModel
	this.filteredLocationList = ko.computed(function(){
		var tempFilteredLocationList = ko.observableArray([]);
		if (!self.filterText()){
			console.log('Returning default list');
			markersArray.forEach(function(marker){
				marker.setMap(map);
			})
			return self.locationList();
		}
		else{
			//Clear list
			tempFilteredLocationList([]);
			self.locationList().forEach(function(locationItem){
				if(locationItem.title().toLowerCase().includes(self.filterText().toLowerCase())) {
					console.log('filtering this text');
					console.log(self.filterText());
					tempFilteredLocationList().push(locationItem);
				}
			});
			//If Search returns results, return them, else print no results
			if (tempFilteredLocationList()[0]) {
				//Update Markers
				self.updateMarkers(tempFilteredLocationList());				
				return tempFilteredLocationList();
			}
			else {
				self.updateMarkers(tempFilteredLocationList());
				console.log('Search provided no results');
			}
		}
	}, this);
	//Hide all markers, then show markers in marker array for each marker in filtered array
	this.updateMarkers = function(locations){
		markersArray.forEach(function(marker){
			marker.setMap(null);
		})
		locations.forEach(function(locationItem){
			markersArray[locationItem.id()].setMap(map);
		})
	};
	//When marker is clicked, bounce and open info window for location
	this.clickMarkerEvent = function(locationItem){
		self.openInfoWindow(locationItem);
		self.bounceMarker(locationItem);
	}
	//Open info window given location item from list
	this.openInfoWindow = function(locationItem){
		if (infowindow) {
			infowindow.close();
		}
		//return test values
		infowindow = new google.maps.InfoWindow({
			content: locationItem.title()
		});
		infowindow.open(map, markersArray[locationItem.id()]);
	};
	//Bounce Marker given location item from list
	this.bounceMarker = function(locationItem){
		markersArray.forEach(function(markerItem){
			if (markersArray[locationItem.id()].getAnimation() == null) {
			markerItem.setAnimation(null);
			}
		})
		markersArray[locationItem.id()].setAnimation(google.maps.Animation.BOUNCE);
	};
}


//Create Location Object as a knockout observable by passing in location data
var Location = function(data) {
	this.title = ko.observable(data.title);
	this.location = ko.observable(data.location);
	this.address = ko.observable(data.address);
	this.id = ko.observable(data.id)
	this.display = ko.observable(true);
};

ko.applyBindings(new ViewModel());
/*
FourSquare Keys
Client ID
1FNXGRY10KVF2DVQUHFOYTWJHL3Q2F23YN5SA53EUW4KXRMB
Client Secret
R22OL3UWPL1KYSK2XI0CZDZLKCQX4QOPUENZ0HOYV0R4FPVU
*/