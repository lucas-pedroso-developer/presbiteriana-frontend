import React from 'react'
import Card from '../components/card'
import FormGroup from '../components/form-group'
import { withRouter } from 'react-router-dom'
import UserService from '../app/service/userService'
import VisitService from '../app/service/visitService'
import * as messages from '../components/toastr'
import SelectMenu from '../components/selectMenu'
import InputMask from 'react-input-mask';

class RegisterVisit extends React.Component {

	state = {		
		id: '',	
		idPresbyter: '',	
        idLeader: '',	
		visitDate: '',
		visitDateConverted: '',
		leaderName: '',
		presbyterName: '',			        
        presbyters: [],
        leaders: [],			    
		mensagemErro: null,
		updating: false		
	}

	constructor() {
		super();
        this.service = new VisitService();		
        this.userService = new UserService();		
	}

	componentDidMount() {				
		const params = this.props.match.params			
		this.getLeaders();
		this.getPresbyters();
		if(params.id) {			
			this.service
				.getVisitById(params.id)
				.then(response => {	
					console.log('aqui ta o response do didmount')				
					this.setState({...response.data, updating: true})					
				}).catch(error => {
					console.log('erro do didmount')				
					messages.mensagemErro(error.response.data)
				})
		}
		
	}

	save = () => {			
		const validateMessage = this.validate();
		if(validateMessage && validateMessage.length > 0) {
			validateMessage.forEach((validateMessage, index) => {
				messages.mensagemErro(validateMessage)
			});
			return false;
		}

		const {	idPresbyter, idLeader, visitDateConverted, leaderName, presbyterName } = this.state
		const visit = { idPresbyter, idLeader, visitDateConverted, leaderName, presbyterName }
						
		this.service.save(visit)
			.then(response => {
				messages.mensagemSucesso('Visita inserida com sucesso')
				this.props.history.push('/register-visit')
			}).catch(error => {
				messages.mensagemErro(error.response)
				console.log(error.response)
			})
	}
	
	getLeaders = () => {                
        this.userService
                .getLeaders()
                .then(response => {                    
                    let list = response.data.map(leader => {
                        return { value: leader.id, label: leader.name };
                    });

                    this.setState({
                        leaders: [
                          {
                            value: 0,
                            label: "Selecione o líder..."
                          }
                        ].concat(list)
                    })                                        
                    if(list.length < 1) {
                        messages.mensagemAlert("Nenhum resultado encontrado.")
					}
					console.log('leaders list')                    
					console.log(this.state.leaders)            
                }).catch(error => {

                })        
    }

    getPresbyters = () => {                
        this.userService
                .getPresbyters()
                .then(response => {                    
                    let list = response.data.map(presbyter => {
                        return { value: presbyter.id, label: presbyter.name };
                    });

                    this.setState({
                        presbyters: [
                          {
                            value: 0,
                            label: "Selecione o Presbítero..."
                          }
                        ].concat(list)
                    })                                        
                    if(list.length < 1) {
                        messages.mensagemAlert("Nenhum resultado encontrado.")
                    }                    
                }).catch(error => {

                })        
    }

	update = () => {			
		const validateMessage = this.validate();
		if(validateMessage && validateMessage.length > 0) {
			validateMessage.forEach((validateMessage, index) => {
				messages.mensagemErro(validateMessage)
			});
			return false;
		}

		const {	id, idLeader, idPresbyter, visitDateConverted, leaderName, presbyterName } = this.state
		const visit = { id, idLeader, idPresbyter, visitDateConverted, leaderName, presbyterName }
		
		this.service
				.updateVisit(visit)
				.then(response => {
					this.props.history.push('/search-visit')
					messages.mensagemSucesso('Visita atualizada com sucesso!')
				}).catch(error => {
					messages.mensagemErro(error.response.data)
				})
	}

	handleLeaderChange = (event) => {					
		const id = event.target.value.toString();				
			const leaderChoosed = this.state.leaders.find((leader) => {			  
			  return leader.value.toString() === id.toString();
			});
			
		this.setState({
			idLeader: leaderChoosed.value,		
			leaderName: leaderChoosed.label
		})		
	}

	handlePresbyterChange = (event) => {					
		const id = event.target.value.toString();				
			const presbyterChoosed = this.state.presbyters.find((presbyter) => {			  
			  return presbyter.value.toString() === id.toString();
			});
			
		this.setState({
			idPresbyter: presbyterChoosed.value,		
			presbyterName: presbyterChoosed.label
		})		
	}

	validate() {
		const validateMessages = []

		if(!this.state.idLeader) {
			validateMessages.push('Escolha o Líder')
		}

		if(!this.state.idPresbyter) {
			validateMessages.push('Escolha o Presbítero')
		}

		if(!this.state.visitDate) {
			validateMessages.push('Escolha a Data da Visita')
		}

		return validateMessages;
	}
	
	render() {
		return (			
				<div className="row">
					<div className="col-md-12" style={ {position : 'relative', left: '0px'} }>
						<div className="bs-docs-section">
							<Card title={this.state.atualizando ? 'Atualização de visita' : 'Cadastro de visita'}>
								<div className="row">
									<div className="col-lg-12">
										<div className="bs-component">
											<fieldset>												
												<div className="col-md-6">
													<FormGroup id="presbyterSelect" label="Presbítero: *">
														<SelectMenu id="presbyterSelect" lista={this.state.presbyters} className="form-control" name="presbyter" value={this.state.idPresbyter} onChange={this.handlePresbyterChange} />
													</FormGroup>
												</div>														                                                   
												<div className="col-md-6">
													<FormGroup id="lealderSelect" label="Líder: *">
														<SelectMenu id="lealderSelect" lista={this.state.leaders} className="form-control" name="leader" value={this.state.idLeader} onChange={this.handleLeaderChange} />
													</FormGroup>
												</div>												
												<div className="col-lg-3" style={ {position : 'relative', left: '0px'} }>
													<FormGroup  label="Data Visita:" htmlFor="dateMask">
														<InputMask id="dateMask" value={this.state.visitDate} mask="99/99/9999" placeholder="__/__/____" onChange={e => 
															this.setState({visitDate: e.target.value, visitDateConverted: e.target.value.split("/").reverse().join("-")})
														} className="form-control" />
													</FormGroup>	
												</div> 																
												<div className="col-md-12" style={ {position : 'relative', left: '0px'} }>
													{
														this.state.updating ? (
															<button onClick={this.update} className="btn btn-primary">
															<i className="pi pi-refresh"></i>Atualizar
															</button>
														) : (
															<button onClick={this.save} className="btn btn-success">
															<i className="pi pi-save"></i>Salvar
															</button>
														)
													}										
													<button onClick= {e => this.props.history.push('/search-visit')} className="btn btn-primary">
														<i className="pi pi-times"></i>Pesquisar
													</button>											
												</div>
											</fieldset>
										</div>
									</div>								
								</div>
							</Card>
						</div>
					</div>
				</div>	
				
			)
			
		}
	}

export default withRouter( RegisterVisit )