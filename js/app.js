// Locations that will be used in Application. Restaurants I enjoyed in DC! 
var locationsdb = [
{title: "Pollo Peru", location: {lat: 38.9683883, lng: -77.3551893}, address: "1675 Reston Pkwy, Reston, VA 20194"},
{title: "Bar Taco",	location: {lat: 38.9580539, lng: -77.36063690000003}, address: "12021 Town Square St, Reston, VA 20190"},
{title: "Super Pho", location: {lat: 38.9214064, lng: -77.41643879999998}, address: "3065 Centreville Rd, Herndon, VA 20171"},
{title: "Barcelona Wine Bar", location: {lat: 38.9580393, lng: -77.3608544}, address: "12023 Town Square St, Reston, VA 20190"},
{title: "Pokehub", location: {lat: 38.9589182, lng: -77.3608266}, address: "11990 Market St, Reston, VA 20190"}
];
var map;
var markersArray = [];
function initMap() {
	//Create Map Object
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 38.90, lng: -77.35},
		zoom: 11,
	});
//Create markers and add to markers array
	for (i=0; i<locationsdb.length; i++) {
		var marker = new self.google.maps.Marker({
			position: locationsdb[i].location,
			map: map,
			title: locationsdb[i].title
		})
		markersArray.push(marker);
	}
//Create info windows
}

var ViewModel = function() {
	var self = this;
	//Create Observable Array for Locations
	this.locationList = ko.observableArray([]);
	locationsdb.forEach(function(locationItem){
		self.locationList.push( new Location(locationItem));
		})
	//When list is clicked, open Info Window on map
	this.openInfoWindow = function(){};
	//Filter Code here
};

//Create Location Object as a knockout observable by passing in location data
var Location = function(data) {
	this.title = ko.observable(data.title);
	this.location = ko.observable(data.location);
	this.address = ko.observable(data.address);
	this.display = ko.observable(true);
};

ko.applyBindings(new ViewModel());