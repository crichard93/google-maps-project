// Locations that will be used in Application Model. Restaurants I enjoyed in DC! 
var locationsdb = [
{id: 0, title: "Pollo Peru", location: {lat: 38.9683883, lng: -77.3551893}, address: "1675 Reston Pkwy, Reston, VA 20194"},
{id: 1, title: "Bar Taco",	location: {lat: 38.9580539, lng: -77.36063690000003}, address: "12021 Town Square St, Reston, VA 20190"},
{id: 2, title: "Super Pho", location: {lat: 38.9214064, lng: -77.41643879999998}, address: "3065 Centreville Rd, Herndon, VA 20171"},
{id: 3, title: "Barcelona Wine Bar", location: {lat: 38.9580393, lng: -77.3608544}, address: "12023 Town Square St, Reston, VA 20190"},
{id: 4, title: "Pokehub", location: {lat: 38.9589182, lng: -77.3608266}, address: "11990 Market St, Reston, VA 20190"}
];

//Declare global variables for accessibility
var map;
var markersArray = [];
var infowindow;

//Helper functions

//Update Four Square Venue ID to query photo, callback is GetFourSquarePhoto
function getFourSquareVenueID(marker, callback){
	var venue;
	var latlng = marker.getPosition();
	var lat = latlng.lat();
	var lng = latlng.lng();
	var client_secret = 'R22OL3UWPL1KYSK2XI0CZDZLKCQX4QOPUENZ0HOYV0R4FPVU';
	var client_id = '1FNXGRY10KVF2DVQUHFOYTWJHL3Q2F23YN5SA53EUW4KXRMB';
	var idurl = 'https://api.foursquare.com/v2/venues/search?client_id='+client_id+'&client_secret='+client_secret+'&v=20180323&limit=1&ll='+lat+','+lng;
	var venueData = $.getJSON(idurl, function(){
	})
	.done(function(data){
		venue = data.response.venues[0].id;
		callback(venue, marker);
	})
	.fail(function(){
		alert('Error running Four Square API. Please refresh page to try again');
	});
}



//Update photo URL to place it in InfoWindow
function getFourSquarePhoto(venueID, marker) {
	var client_secret = 'R22OL3UWPL1KYSK2XI0CZDZLKCQX4QOPUENZ0HOYV0R4FPVU';
	var client_id = '1FNXGRY10KVF2DVQUHFOYTWJHL3Q2F23YN5SA53EUW4KXRMB';
	var photourl = 'https://api.foursquare.com/v2/venues/'+venueID+'?client_id='+client_id+'&client_secret='+client_secret+'&v=20180323&limit=1';
	var imgURL = "";
	size = '100x100';
	var venuePhotoData = $.getJSON(photourl, function(){
	})
	.done(function(data){
		var imgURLPrefix = data.response.venue.photos.groups[1].items[0].prefix;
		var imgURLSuffix = data.response.venue.photos.groups[1].items[0].suffix;
		imgURL = imgURLPrefix + size + imgURLSuffix;
		updateInfoWindowText(imgURL, marker);
	})
	.fail(function(){
		alert('Error running Four Square API. Please refresh page to try again.')
	});
};


//Onclick, highlight the marker's list item by applying css style
function attachHighlightListItem(marker){
	var title = marker.getTitle();
	marker.addListener('click', function(){
		for (let i = 0; i<locationsdb.length; i++){
			if (markersArray[i].getTitle() == title){
				vm.ViewModel.highlightListItem(vm.ViewModel.locationList()[i]);
			}
		}
	});

}


//Attach Bounce Animation to each marker on click
function attachBounce(marker) {
	marker.addListener('click', function(){
		markersArray.forEach(function(markerItem){
			if (marker.getAnimation() == null) {
			markerItem.setAnimation(null);
			}
		})
		marker.setAnimation(google.maps.Animation.BOUNCE);
	});
}


//Attach Infowindow to each marker on click
function attachInfoWindow(marker){
	marker.addListener('click', function(){
		//Close infowindow if it is already open
		if (infowindow) {
			infowindow.close();
		}
		//Update infowindow with image, callback function needed to prioritize API call before infowindow is filled
		getFourSquareVenueID(marker, getFourSquarePhoto);
	});
}


//Pass in marker and imgURL to update InfoWindow
function updateInfoWindowText(imgURL, marker){
	var title = marker.getTitle();
	var text = "<h4>"+title+"</h4> <div class='col'> <img class='img-fluid' src="+imgURL+" alt='Food Item not found'> <p class='infoWindowText'>Image provided by Foursquare Places API</p> </div>";
	infowindow.setContent(text);
	infowindow.open(map, marker);
}


//Initialize Google Maps objects separately from ViewModel
function initMap() {
	//Create Map Object
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 38.90, lng: -77.35},
		zoom: 11,
	});
	infowindow = new google.maps.InfoWindow({
		maxWidth: 350
	})
	//Create markers, add click events and push the markersArray
	for (let i=0; i<locationsdb.length; i++) {
		var marker = new google.maps.Marker({
			position: locationsdb[i].location,
			animation: google.maps.Animation.DROP,
			map: map,
			title: locationsdb[i].title
		});
		attachHighlightListItem(marker);
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
		//Return Unfiltered List if Filter Input is Empty
		if (!self.filterText()){
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
		self.highlightListItem(locationItem);
	}
	

	this.highlightListItem = function(locationItem){
		//Toggle off highlight
		var locations = document.getElementsByClassName("location");
		locations = Array.from(locations);
		locations.forEach(function(element){
			element.classList.remove("highlight");
		})
		//Turn highlight on for select locationItem, reference by id
		locations.forEach(function(element){
			if (element.id == locationItem.id()){
				element.classList.toggle("highlight");
			}
		});
	}
	

	//Open info window given location item from list
	this.openInfoWindow = function(locationItem){
		if (infowindow) {
			infowindow.close();
		}
		getFourSquareVenueID(markersArray[locationItem.id()],getFourSquarePhoto);
	};
	

	//Bounce Marker given location item from list
	this.bounceMarker = function(locationItem){
		markersArray.forEach(function(markerItem){
			if (markersArray[locationItem.id()].getAnimation() == null) {
			markerItem.setAnimation(null);
			}
		})
		markersArray[locationItem.id()].setAnimation(google.maps.Animation.BOUNCE);
	}
}


//Create Location Object as a knockout observable by passing in location data
var Location = function(data) {
	this.title = ko.observable(data.title);
	this.location = ko.observable(data.location);
	this.address = ko.observable(data.address);
	this.id = ko.observable(data.id)
	this.display = ko.observable(true);
};


//Store viewmodel in vm to reference its function outside of viewmodel
var vm = {ViewModel: new ViewModel() };
ko.applyBindings(vm.ViewModel);