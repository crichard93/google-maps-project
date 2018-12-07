app.use("C:\Users\User\Documents\Udacity\map_project", express.static('/'));

// Locations that will be used in Application. Food I enjoyed in DC! 
var locationsdb = [
{title: "Pollo Peru", location: {lat: 38.9683883, lng: -77.3551893}, address: "1675 Reston Pkwy, Reston, VA 20194"},
{title: "Bar Taco",	location: {lat: 38.9580539, lng: -77.36063690000003}, address: "12021 Town Square St, Reston, VA 20190"},
{title: "Super Pho", location: {lat: 38.9214064, lng: -77.41643879999998}, address: "3065 Centreville Rd, Herndon, VA 20171"},
{title: "Barcelona Wine Bar", location: {lat: 38.9580393, lng: -77.3608544}, address: "12023 Town Square St, Reston, VA 20190"},
{title: "Pokehub", location: {lat: 38.9589182, lng: -77.3608266}, address: "11990 Market St, Reston, VA 20190"}
];

function initMap() {
		var map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 38.90, lng: -77.35},
			zoom: 13,
		});
	}

var ViewModel = function() {
	var self = this;
	var markers = [];
};

var location = function(data) {
	this.title = ko.observable(data.title);
	this.location = ko.observable(data.location);
	this.address = ko.observable(data.address);
	this.display = ko.observable(true);
};

ko.applyBindings(new ViewModel());
