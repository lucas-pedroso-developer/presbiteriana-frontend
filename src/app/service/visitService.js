import ApiService from '../apiservice'

class VisitService extends ApiService {

	constructor() {
		super('/api/visit')
	}

	save(visit) {
		return this.post('/', visit);
	}

	deleteVisit(id) {		
		return this.delete(`/${id}`)
	}

	updateVisit(visit) {
		return this.put(`/${visit.id}`, visit);
	}

    getVisitById(id) {
		return this.get(`/${id}`);
	}

    consult(visitFilter) {
		let params = `?`;

		if(visitFilter.idLeader) {
			params = `${params}&idLeader=${visitFilter.idLeader}`
		}

		if(visitFilter.idPresbyter) {
			params = `${params}&idPresbyter=${visitFilter.idPresbyter}`
		}

		if(visitFilter.visitDate) {
			params = `${params}&visitDate=${visitFilter.visitDate}`
		}
		
		return this.get(params);
	}

}

export default VisitService