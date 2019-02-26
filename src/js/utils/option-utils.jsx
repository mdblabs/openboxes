import _ from 'lodash';
import queryString from 'query-string';
import apiClient from './apiClient';

export const debouncedUsersFetch = _.debounce((searchTerm, callback) => {
  if (searchTerm) {
    apiClient.get(`/openboxes/api/persons?name=${searchTerm}&fields=id,firstName,lastName`)
      .then(result => callback(
        null,
        {
          complete: true,
          options: _.map(result.data.data, obj => (
            {
              value: {
                ...obj,
                name: `${obj.firstName} ${obj.lastName}`,
              },
              firstName: obj.firstName + obj.lastName,
              lastName: obj.lastName,
              name: `${obj.firstName} ${obj.lastName}`,
              label: `${obj.firstName} ${obj.lastName}`,
            }
          )),
        },
      ))
      .catch(error => callback(error, { options: [] }));
  } else {
    callback(null, { options: [] });
  }
}, 500);

export const debouncedLocationsFetch = _.debounce((searchTerm, callback) => {
  if (searchTerm) {
    const fields = ['id', 'name', 'locationType'];
    apiClient.get(`/openboxes/api/locations?direction=${queryString.parse(window.location.search).direction}&name=${searchTerm}&fields=${fields.join(',')}`)
      .then(result => callback(
        null,
        {
          complete: true,
          options: _.map(result.data.data, obj => (
            {
              value: {
                id: obj.id,
                type: obj.locationType.locationTypeCode,
                name: obj.name,
                label: `${obj.name} [${obj.locationType.description}]`,
              },
              label: `${obj.name} [${obj.locationType.description}]`,
            }
          )),
        },
      ))
      .catch(error => callback(error, { options: [] }));
  } else {
    callback(null, { options: [] });
  }
}, 500);
