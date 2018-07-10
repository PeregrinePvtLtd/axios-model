# axios-model
A model class with helper functions for axios js

## Introduction
It's just a javascript class to help simplify http requests sent using [axios](https://github.com/axios/axios)

## Requirements and Assumption
You will need to install [axios](https://github.com/axios/axios) in order to use the **_Model.js_** class. You can install it

using npm:
```
npm install axios
```
using bower:
```
bower install axios
```
using cdn:
```html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

This library assumes your backend responds with data that is in json format.

Something like the following
```js
//single item (sample laravel backend response)
{
  "id": 1,
  "name": "John Doe",
  "email": "johndoe@example.com",
  "created_at": "2018-07-09 10:02:14",
  "updated_at": "2018-07-09 10:02:14"
}

//collection (sample laravel backend response)
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "johndoe@example.com",
      "created_at": "2018-07-09 10:02:14",
      "updated_at": "2018-07-09 10:02:14"
    },
    {
      "id": 2,
      "name": "Gladyce Kuhn",
      "email": "xryan@example.com",
      "created_at": "2018-07-09 10:02:14",
      "updated_at": "2018-07-09 10:02:14"
    }
  ],
  "first_page_url": "http://someapp/users?page=1",
  "from": 1,
  "last_page": 4,
  "last_page_url": "http://someapp/users?page=4&per_page=2",
  "next_page_url": "http://someapp/users?page=2&per_page=2",
  "path": "http://someapp/users",
  "per_page": 2,
  "prev_page_url": null,
  "to": 2,
  "total": 8
}
```

## Features
axios-model (_Model.js_) provides helper methods for sending **get**, **post**, **patch** and **delete** requests. 

The Following is the **_Model.js_** class. Examples are showns as we go forward.

### Model.js
```js
import axios from 'axios';

export default class Model {

    /**
     * Create a new model
     * @param {object} data model data
     * @param {string} url request url
     * @param {object} params additional url parameters
     */
    constructor(data, url, params = {}) {
        this.url = url;
        this.originalData = data;
        this.list = [];
        this.item = null;
        this.loading = false;
        this.editMode = false;

        this.params = {
            query: null,
            page: null,
            per_page: 15,
            include: null
        };

        this.setParams(params);

        this.setFields(data);
    }

    /**
     * Set additional parameters
     * @param {object} params url parameters
     */
    setParams(params = {}) {
        this.params = Object.assign({}, this.params, params);
    }

    /**
     * Set fields as model properties
     * @param {object} data model data
     */
    setFields(data = {}) {
        for (const field in data) {
            this[field] = data[field];
        }
    }

    /**
     * Set all model properties to null
     */
    clean() {
        for (const property in this.originalData) {
            this[property] = null;
        }
    }

    /**
     * Fetches a paginated list of a specific resource
     * @param {object} params additional url parameters
     * @param {callback} transformResponseCallback function for transforming the response
     * @param {callback} transformRequestCallback function for transforming the request
     * @return Promise
     */
    fetch(params = {}, transformResponseCallback = null, transformRequestCallback = null) {
        this.setParams(params);
        return this.submit('get', this.url, null, null, transformResponseCallback, transformRequestCallback);
    }

    /**
     * Fetches the resource matching the provided id
     * @param {integer} id resource id
     * @param {object} params additional url parameters
     * @param {callback} transformResponseCallback function for transforming the response
     * @param {callback} transformRequestCallback function for transforming the request
     * @return Promise
     */
    get(id, params = {}, transformResponseCallback = null, transformRequestCallback = null) {
        this.setParams(params);
        return this.submit('get', `${this.url}/${id}`, null, null, transformResponseCallback, transformRequestCallback);
    }

    /**
     * Creates a resource with the provided data
     * @param {object} data request payload
     * @param {callback} transformResponseCallback function for transforming the response
     * @param {callback} transformRequestCallback function for transforming the request
     * @return Promise
     */
    create(data, transformResponseCallback = null, transformRequestCallback = null) {
        return this.submit('post', this.url, data, null, transformResponseCallback, transformRequestCallback);
    }

    /**
     * Updates the resource matching the provided id with the provided data
     * @param {integer} id resource id
     * @param {object} data request payload
     * @param {callback} transformResponseCallback function for transforming the response
     * @param {callback} transformRequestCallback function for transforming the request
     * @return Promise
     */
    update(id, data, transformResponseCallback = null, transformRequestCallback = null) {
        return this.submit('patch', `${this.url}/${id}`, data, null, transformResponseCallback, transformRequestCallback);
    }

    /**
     * Deletes the resource matching the provided id
     * @param {integer} id resource id
     * @param {callback} transformResponseCallback function for transforming the response
     * @param {callback} transformRequestCallback function for transforming the request
     * @return Promise
     */
    destroy(id, transformResponseCallback = null, transformRequestCallback = null) {
        return this.submit('delete', `${this.url}/${id}`, null, null, transformResponseCallback, transformRequestCallback);
    }

    /**
     * Sends an ajax request with the specified configurations
     * @param {string} requestType ajax request method
     * @param {string} url request url
     * @param {object} data request payload
     * @param {object} headers request headers
     * @param {callback} transformResponseCallback function for transforming the response
     * @param {callback} transformRequestCallback function for transforming the request
     * @return Promise
     */
    submit(requestType, url, data = null, headers = null, transformResponseCallback = null, transformRequestCallback = null) {
        let config = {
            method: requestType,
            url: url,
            data: data
        };

        if (requestType == 'get') {
            config.params = this.params;
        }

        if (headers != null) {
            config.headers = headers;
        }

        if (transformResponseCallback != null) {
            config.transformResponse = [transformResponseCallback];
        }

        if (transformRequestCallback != null) {
            config.transformRequest = [transformRequestCallback];
        }

        this.loading = true;

        return new Promise((resolve, reject) => {
            axios(config)
                .then(response => resolve(response))
                .catch(error => reject(error))
                .finally(() => this.loading = false);
        });
    }
}
```
Now you can initialise an object
```js
let user = new Model({any: 'default', fields: 'you want'}, '/route-to-fetch-users', {any: 'additional url params'});
```

To send request:
**fetch many records**

To simplify further you can extend the **_Model.js_** class and add any additional methods can be useful for your needs.
