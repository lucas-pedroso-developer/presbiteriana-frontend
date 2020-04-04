import axios from 'axios'

const httpClient = axios.create({
	baseURL: 'https://presbiteriana-api.herokuapp.com' // api url
	//baseURL: 'http://localhost:8080' // api url
})

class ApiService {

	constructor(apiurl) {
		this.apiurl = apiurl;
	}

	get(url) {
		const requestUrl = `${this.apiurl}${url}`
		return httpClient.get(requestUrl)
	}

	post(url, object) {
		const requestUrl = `${this.apiurl}${url}`		
		return httpClient.post(requestUrl, object);
	}

	put(url, object) {
		const requestUrl = `${this.apiurl}${url}`
		return httpClient.put(requestUrl, object);
	}

	delete(url) {
		const requestUrl = `${this.apiurl}${url}`		
		return httpClient.delete(requestUrl);
	}

}

export default ApiService