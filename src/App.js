import React, { Component } from 'react';
import {
  PageHeader,
  Table
} from 'react-bootstrap';
import './App.css'

class App extends Component {
  constructor(props){
    super(props)
    let today = new Date()
    this.state = {
      apiKey: "KMBhxkF429tf77KcvD1Fwfq5zDVdOH8HZzGvJbfF",
      startDate:`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`,
      apiUrl: "https://api.nasa.gov/neo/rest/v1/feed",
      asteroids: []
    }
  }

  componentWillMount(){
    // Get hold of the part of the response we are interested in
    fetch(`${this.state.apiUrl}?start_date=${this.state.startDate}&api_key=${this.state.apiKey  }`).then((rawResponse)=>{
    // rawResponse.json() returns a promise that we pass along
        return rawResponse.json()
      }).then((parsedResponse) => {

    // when this promise resolves, we can work with our data
      let neoSpace = parsedResponse.near_earth_objects

    // Instantiate a new array to hold our mapped data
      let newAsteroids = []

    // To iterate of attributes of a JS Object, we call: Object.keys()
      Object.keys(neoSpace).forEach((date)=>{

      // Object.keys returns the name of the attribute, so we need to access that attribute
      // on our data structure, and loop over each asteroid it contains
      neoSpace[date].forEach((asteroid) =>{

        // Now that we have the asteroid, we can add it to our newAsteroids array
        newAsteroids.push({
          id: asteroid.neo_reference_id,
          name: asteroid.name,
          date: asteroid.close_approach_data[0].close_approach_date,

          // Calling '.toFixed(0)' on a float cuts off everything behind the decimal point.
          // This formats the information for a good user experience.
          diameterMin: asteroid.estimated_diameter.feet.estimated_diameter_min.toFixed(0),
          diameterMax: asteroid.estimated_diameter.feet.estimated_diameter_max.toFixed(0),
          closestApproach: asteroid.close_approach_data[0].miss_distance.miles,
          velocity: parseFloat(asteroid.close_approach_data[0].relative_velocity.miles_per_hour).toFixed(0),
          distance: asteroid.close_approach_data[0].miss_distance.miles
        })
      })
    })

    // Finally, now that we have collected all the asteroids, we can assign them to state
    // so that we can use them later on in the render function
    this.setState({asteroids: newAsteroids})
  })
}
  render() {
    return (
      <div>
        <div id="title">
          <PageHeader>
          <img src="./space.jpeg" alt="Asteroid" width="150px"/>
            <h1>Earth Beware</h1>
          </PageHeader>
          <p> This webpage shows data about asteroids approaching Earth. This data is taken in real-time from NASA. </p>
        </div>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Diameter (feet)</th>
              <th>Date of Closest Approach</th>
              <th>Distance (miles)</th>
              <th>Velocity (miles/hour)</th>
            </tr>
          </thead>
            <tbody>
              {this.state.asteroids.map((asteroid) => {
                return (
                  <tr key={asteroid.id}>
                  <td>{asteroid.name}</td>
                  <td>{asteroid.diameterMin} - {asteroid.diameterMax}</td>
                  <td>{asteroid.date}</td>
                  <td>{asteroid.distance}</td>
                  <td>{asteroid. velocity}</td>
                  </tr>
                )
              })}
            </tbody>
        </Table>
      </div>

    );
  }
}

export default App;
