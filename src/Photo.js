import Model from "./Model";

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
