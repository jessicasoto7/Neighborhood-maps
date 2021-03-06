import React, { Component } from 'react';
import './App.css';
import { withScriptjs, withGoogleMap, GoogleMap, InfoWindow, Marker} from 'react-google-maps';
import axios from 'axios'
import  Sidebar from './components/sidebar.js'
import  Error from './components/Error.js'

//react-google-maps components to mount map, markers, and infowindows
const GoogleMaps = withScriptjs(withGoogleMap(props => (
  <GoogleMap
    defaultCenter={{lat: 44.986656, lng: -93.258133}}
    defaultZoom={13}
  >
    {props.places.map(place => (
       <Marker
         position={{
           lat: place.venue.location.lat,
           lng: place.venue.location.lng
         }}
         animation={(place.venue.id === props.activeMarkers) && (window.google.maps.Animation.BOUNCE)}
         key={place.venue.id}
         onClick={() => props.onToggleOpen(place.venue.id)}
        >
          {place.venue.id === props.activeMarkers &&
            <InfoWindow
              tabIndex="0"
              aria-label="Info window" >
              <div tabIndex="1">
                <h4 tabIndex="1">{place.venue.name}</h4>
                <p tabIndex="1">{place.venue.location.formattedAddress}</p>
              </div>
            </InfoWindow>
          }

        </Marker>
     ))}
  </GoogleMap>
)));

class App extends Component {
  state = {
    open: false,
    places: [],
    activeMarkers:"",
    filtered: null,
  }

  styles = {
    menuButton: {
      background: "white",
      padding: 10,
      float:' left',
      border: 'none',
      fontSize: '24px'
    },
    hide: {
      display: 'none'
    },
    header: {
      marginTop:'0px'
    }
  };

  componentDidMount() {
    this.fetchAPI();
    this.setState({
      ...this.state,
      filtered: this.filterPlaces(this.state.places, "")
    })
  }
  //Toggle Sidebar funtion
  toggleDrawer = () => {
    this.setState({
      open: !this.state.open
    });
  }
  //Toggle InfoWindow open and close
  onToggleOpen = placeKey => {
    this.setState({
      activeMarkers: placeKey,
      open: false
    })
  }

  //call API from Foursquare
  fetchAPI = () => {
    const url = 'https://api.foursquare.com/v2/venues/explore?'
    const parameters = {
      client_id: 'OXBDHJTAQEW2GZ2HILCTVWROC0PSQYPZPQGVQURTO5HRUGXY',
      client_secret:'H5ZL5RVF12D5VAZCW2PUEUFE3UCZLTH044MJCO2V1PQZHK5A',
      query:'outdoors',
      near:'Minneapolis',
      v:'20180323',
      //limit: '5'
    }

    axios.get(url + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          places: response.data.response.groups[0].items,
          filtered: response.data.response.groups[0].items
        })
      })
      .catch(error => {
          alert("Error! " + error);
      });
  }
  // Update the query value and filter the list of locations accordingly
  updateQuery = (query) => {
    this.setState({
      ...this.state,
      selectedIndex: null,
      filtered: this.filterPlaces(this.state.places, query)
    });
  }
  // Filter locations to match query string
  filterPlaces = (places, query) => {
    return places.filter(place => place.venue.name.toLowerCase().includes(query.toLowerCase()));
  }

  render() {
    const center = {
      lat: this.props.lat,
      lng: this.props.lng
    }

    return (
      <div className="App">
        <div>
          <button onClick={this.toggleDrawer} style={this.styles.menuButton}>
            <i className="fa fa-bars"></i>
          </button>
          <h1 style = {{float:'right'}}> Outdoor Venues in Minneapolis, MN</h1>
        </div>
        <Sidebar
          places={this.state.filtered}
          open={this.state.open}
          toggleDrawer={this.toggleDrawer}
          filterPlaces={this.updateQuery}
          listClick={this.listClick}
          onToggleOpen={this.onToggleOpen}
        />
        <div style={{ height: '100vh',
          width: '100%',
          display: 'flex',
          flexFlow: 'row nowrap',
          justifyContent: 'center',
          padding: 0 }}>
          <Error>
            <GoogleMaps
              role="application"
              aria-label="map"

              google={this.props.google}
              zoom = {this.props.zoom}
              initialCenter={center}


              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDQx0zrGHKCqC5PpgVCNP8dQCBB5v_-VFM&libraries=places"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={ <div style={{ width: '100%', marginLeft: 0 }} /> }
              mapElement={ <div style={{ height: `100%` }} /> }

              places={this.state.filtered}
              activeMarkers={this.state.activeMarkers}
              onToggleOpen={this.onToggleOpen}
            >
            </GoogleMaps>
          </Error>
          </div>
      </div>
    );
  }
}

export default App;
