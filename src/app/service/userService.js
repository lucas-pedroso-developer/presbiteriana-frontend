import ApiService from '../apiservice'

class UserService extends ApiService {

	constructor() {
		super('/api/users')
	}

	save(user) {
		return this.post('/', user);
	}

	deleteUser(id) {		
		return this.delete(`/${id}`)
	}

	updateUser(user) {
		return this.put(`/${user.id}`, user);
	}

	getUserById(id) {
		return this.get(`/${id}`);
	}

	getLeaders() {
		return this.get('/leaders');
	}

	getPresbyters() {
		return this.get('/presbyters');
	}

	consult(userFilter) {
		let params = `?`;

		if(userFilter.name) {
			params = `${params}&name=${userFilter.name}`
		}

		if(userFilter.email) {
			params = `${params}&email=${userFilter.email}`
		}

		if(userFilter.address) {
			params = `${params}&address=${userFilter.address}`
		}

		if(userFilter.age) {
			params = `${params}&age=${userFilter.age}`
		}

		if(userFilter.birthday) {
			params = `${params}&birthday=${userFilter.birthday}`
		}

		if(userFilter.isPresbyter) {
			params = `${params}&isPresbyter=${userFilter.isPresbyter}`
		}

		if(userFilter.isLeader) {
			params = `${params}&isLeader=${userFilter.isLeader}`
		}

		if(userFilter.idPresbyter) {
			params = `${params}&idPresbyter=${userFilter.idPresbyter}`
		}

		if(userFilter.idLeader) {
			params = `${params}&idLeader=${userFilter.idLeader}`
		}

		if(userFilter.phone) {
			params = `${params}&phone=${userFilter.phone}`
		}

		if(userFilter.cellphone) {
			params = `${params}&cellphone=${userFilter.cellphone}`
		}

		if(userFilter.idPresbyter === 0 && userFilter.idLeader === 0) {
			params = `${params}&isPresbyter=${userFilter.isPresbyter}`
			params = `${params}&isLeader=${userFilter.isLeader}`
			params = `${params}&idLeader=${userFilter.idLeader}`
			params = `${params}&idPresbyter=${userFilter.idPresbyter}`
		}
		
		return this.get(params);
	}

}

export default UserService