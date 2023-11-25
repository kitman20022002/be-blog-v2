/* eslint-disable no-console */
import axios from 'axios';
const config = require('../config/app');

const findPlacesByText = async (query:string) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json', {
      params: {
        input: query,
        inputtype: 'textquery',
        fields: 'formatted_address,name,geometry',
        key: config.googleAPIKey,
      },
    });
    return response.data.candidates;
  } catch (error) {
    console.error('Error fetching places', error);
    throw error;
  }
};

interface LatLng {
  lat: number;
  lng: number;
}


async function searchPlacesNearby(center: LatLng, radius: number, keyword: string): Promise<any> {
  const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
  const url = `${baseUrl}location=${center.lat},${center.lng}&radius=${radius}&key=${config.googleAPIKey}&keyword=${encodeURIComponent(keyword)}`;

  try {
    const response = await axios.get(url);

    if (response.data && response.data.results) {
      return response.data.results;
    }
    return null;
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return null;
  }
}

export { findPlacesByText, searchPlacesNearby };