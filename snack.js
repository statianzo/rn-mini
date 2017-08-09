import React, {Component} from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import {Constants} from 'expo';

const KEY = 'YOUR_WEATHERBIT_KEY';

const Display = ({temperature, description, city, state, icon}) =>
  <View style={styles.display}>
    <Image
      style={{width: 120, height: 120}}
      source={{uri: `https://www.weatherbit.io/static/img/icons/${icon}.png`}}
    />
    <Text style={styles.temperature}>
      {temperature}
    </Text>
    <Text>
      {description}
    </Text>
    <Text>
      {city}, {state}
    </Text>
  </View>;

export default class App extends Component {
  state = {
    current: null,
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.fetchWeather(position.coords.longitude, position.coords.latitude);
      },
      () => {
        this.fetchWeather(-181, 40);
      },
      {timeout: 2000}
    );
  }

  fetchWeather(lon, lat) {
    fetch(
      `https://api.weatherbit.io/v1.0/current?lat=${lat}&lon=${lon}&units=I&key=${KEY}`
    )
      .then(res => res.json())
      .then(json => {
        this.setState({
          current: json.data[0],
        });
      });
  }

  render() {
    const {current} = this.state;

    if (!current) return null;

    return (
      <View style={styles.container}>
        <Display
          temperature={current.temp}
          description={current.weather.description}
          city={current.city_name}
          state={current.state_code}
          icon={current.weather.icon}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  display: {
    backgroundColor: '#9ce',
    alignItems: 'center',
    padding: 24,
  },
  temperature: {
    fontSize: 102,
  },
});
