# Udacity Fullstack Nanodegree Neighborhood Map Project  
This app demonstrates the ability to use Knockout, a Javascript framework, and several APIs, namely, Google Maps and Foursquare, to develop an asynchronous, responsively-designed web application.  

## APIs Utilized  
**Google Maps Javascript API** provides the functionality for the map, including markers and an infowindow for each marker.   

**Foursquare Places API** provides data on location.  For this app, I am only using it to identify the venue and then pull photos for each location from the API, but it offers a plethora of information for users that need more details on a location.  
  
## Features  
The application provides a Google Maps visual, complete with markers and infowindows on some of my favorite lunch locations I discovered during my time in the Northern Virginia area. Clicking on the location, either in the list view or its marker on the map will open an infowindow with a photo of a food item from the Foursquare Places API.  It also offers the user the ability to filter and search through the list by inputting text into the filter input box.  The application is asynchronous, so need to ever refresh the page, and responsive, so it can be viewed on mobile devices and desktops without any issues.  

## Installation  
A single step process that consists of downloading or cloning the repository, and opening 'index.html' with your favorite web browser.  

## Example  
You can find a version of the wep application hosted on Github at [this link](https://crichard93.github.io/google-maps-project/).  

## Code Overview  
###  CSS  
The application's CSS is applied through one file, 'style.css'. **Bootstrap**, version 4.1.3, CSS is included and utilized through a CDN link.  Bootstrap is used to achieve the grid structure of the page.  **Font Awesome**, version 5.2.0, is also applied through a CDN, and used to provide access to a few icons in the application. 
  
### HTML  
'index.html' is the application web page where the Knockout bindings are called to achieve an asynchronous web page.  
  
### Javascript  
**jQuery**, version 3.3.1, is used to submit queries to the Foursquare Places API and parse the responses.  It is also utilized by **Bootstrap** to provide some of its functionality. It is sourced though a CDN.  

''knockout-3.4.2' is used to build the ViewModel that allows the application to be asynchronous by defining the bindings called in the HTML 'index.html'.  
  
'app.js' is the application file, containing the definitions for the Knockout bindings, as well as the logic for the API calls and asynchonous functionality of the application.