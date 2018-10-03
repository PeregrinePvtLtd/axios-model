import Model from "./Model";

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
