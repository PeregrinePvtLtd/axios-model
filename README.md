# axios-model
A model class with helper functions for [axios](https://github.com/axios/axios) js.

## Introduction
It's just a javascript class to help simplify http requests sent using [axios](https://github.com/axios/axios).

## Requirements and Assumption
This library assumes your backend responds with data that is in json format.

Something like the following.
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

You will need to install [axios](https://github.com/axios/axios) in order to use the **_Model.js_** class. You can install it in the following ways.

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

## Installation

using npm:
```
npm install axios-model
```

using yarn:
```
yarn add axios-model
```

## Features
The axios-model provides helper methods for sending **get**, **post**, **patch** and **delete** requests.

You can ```import``` or ```require``` to use it in your project.

Examples are shown below.
```js
// src/Model.js

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

### Send HTTP request

Before starting to send http requests you need initialise a new model object.
```js
import Model from 'axios-model';

let user = new Model({any: 'default', fields: 'you want'}, '/route-to-fetch-users', {any: 'additional url params'});
```

#### Fetch Many Records
```js
//simplest
user.fetch().then(response => {
    // use the list property to store the response data
    user.list = response.data.data // yeah i know :|
    // do your thing
}).catch(error => { /* handle it */ });

//with additional parameters
user.fetch({sortby: 'id', per_page: 20}, (response) => {
    // this is an optional callback to transform response (TransformResponseCallback)
    // do your thing
}, (request) => {
    // this is an optional callback to transform request (TransformRequestCallback)
    // do your thing
}).then(response => {
    // do your thing
    user.list = response.data.data
}).catch(error => { /* handle it */ });
```

You can use the model **list** property to save the data array from the response.

**_TransformResponseCallback_** and **_TransformRequestCallback_** methods can be used with all http methods.

#### Get Single Record
```js
user.get(userId, params).then(response => {
    // use the item property to store single item
    user.item = response.data;
}).catch(error => { /* handle it */ });
```

You can use the model **item** property to save the single item from the response

#### Create New Record
```js
user.create({name: 'Jane Doe', email: 'janedoe@example.com', password: 'password'}).then(response => {
    user.item = response.data;
    // do any other stuff you want
}).catch(error => { /* handle it */ });
```
Pass the payload ``` {name: 'Jane Doe', email: 'janedoe@example.com', password: 'password'} ``` as an object to create method to store new record.

#### Update Existing Record
```js
user.update(userId, {name: 'Jane Doe The 3rd', email: 'janedoe3rd@example.com'}).then(response => {
    // do stuff
}).catch(error => { /* handle it */ });
```

Pass the record id ``` userId ``` along with fields to update ``` {name: 'Jane Doe The 3rd', email: 'janedoe3rd@example.com'} ``` to update method to change an existing record.

#### Delete Existing Record
```js
user.destroy(userId).then(response => {
    // do stuff
}).catch(error => { /* handle it */ });
```

Pass the record id ``` userId ```  to destroy method to delete an existing record.

### Extending and Additional HTTP Methods
To simplify further you can **extend** the **_Model.js_** class and add any **additional methods** that can be useful for your needs.

#### Extend
It is easy.
```js

import Model from 'axios-model';

export default class User extends Model {

    /**
     * Create a new user model
     * @param {object} data model data
     * @param {object} params additional url parameters
     * @param {string} url request url
     */
    constructor(data = null, params = null, url = '/users') {
        if (data == null) {
            data = {
                name: null,
                email: null,
                password: null,
                password_confirmation: null
            };
        }

        super(data, url, params);
    }
}
```

Now you can initialise a user object which required less arguments.
```js
import User from './User'; // from wherever you store this

let user = new User();
```

As shown in the **User Class** above, some default fields can be set when initialising. This can be useful when using with a frontend library like [Vuejs](https://vuejs.org/). You can use them like ``` v-model="user.name" ```. These properties can be accessed directly from the object like ``` user.name, user.email ```.

#### Additional Methods
You can define any additional methods you want in your extended class.
```js

import Model from "axios-model";

export default class Photo extends Model {

    /**
     * Create a new photo model
     * @param {object} data model data
     * @param {object} params additional url parameters
     * @param {string} url request url
     */
    constructor(data = null, params = null, url = '/photos') {
        if (data == null) {
            data = {
                title: null
            };
        }

        super(data, url, params);
    }

    /**
     * Upload photo
     * @param {FormData} data request payload
     * @param {string} url request url
     * @param {string} headers request headers
     * @param {callback} transformResponseCallback function for transforming the response
     * @param {callback} transformRequestCallback function for transforming the request
     * @return Promise
     */
    upload(data, url = `photos/${this.id}/upload`, headers = { 'Content-Type': 'multipart/form-data' }, transformResponseCallback = null, transformRequestCallback = null) {
        return this.submit('post', url, data, headers, transformResponseCallback, transformRequestCallback);
    }
}
```

Now to initialise and send request, it would look something like the following.
```js
import Photo from './Photo';

let photo = new Photo();
photo.id = 10; // just to show it works
photo.upload(formData).then(response => {
    // do stuff here
}).catch(error => { /* handle it */});
```

For example this method will send a **post** request to ``` http://someapp/photos/10/upload ``` and response might look something like the following.
```js
{
  "id": "10",
  "user_id": 1,
  "title": "My First Photo",
  "mime": "png",
  "created_at": "2018-07-09 10:02:17",
  "updated_at": "2018-07-09 10:02:17",
  "download_link": "http://someapp/photos/10/download/my-first-photo-original.png",
  "thumbnail_link": "http://someapp/photos/10/my-first-photo-thumbnail.png",
}
```

You can define additional methods to your heart's content.
