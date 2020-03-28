import React from 'react'
import Card from '../components/card'
import FormGroup from '../components/form-group'
import { withRouter } from 'react-router-dom'
import UserService from '../app/service/userService'
import * as messages from '../components/toastr'
import InputMask from 'react-input-mask';

class RegisterUser extends React.Component {

	state = {		
		id: '',	
		name: '',	
		email: '',	
		address: '',
		age: '',
		birthday: '',
		birthdayConverted: '',
		phone: '',
		cellphone: '',
		idLeader: '',	
		idDependent: '',			        
        leaders: [],
        presbyters: [],
		isPresbyter: false,
	    isLeader: false,	    
		mensagemErro: null,
		updating: false		
	}

	constructor() {
		super();
		this.service = new UserService();		
	}

	componentDidMount() {				
		const params = this.props.match.params
		console.log('params')		
		console.log(params)		
		this.getLeaders();
		this.getPresbyters();
		if(params.id) {		
			console.log('params.id')
			console.log(params.id)				
			this.service
				.getUserById(params.id)
				.then(response => {								
					this.setState({...response.data, updating: true})					
				}).catch(error => {								
					//messages.mensagemErro(error.response)
					console.log(error)
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
		
		const {	name, email, address, age, birthdayConverted, phone, cellphone, isPresbyter, isLeader, idLeader, idPresbyter } = this.state
		const user = {	name, email, address, age, birthdayConverted, phone, cellphone, isPresbyter, isLeader, idLeader, idPresbyter }
			
		this.service.save(user)
			.then(response => {
				messages.mensagemSucesso('Usuário cadastrado com sucesso')
				this.props.history.push('/register-user')
			}).catch(error => {
				messages.mensagemErro(error.response)				
			})
	}

	onChangePresbyter = () => {
		this.setState(initialState => ({
		isPresbyter: !initialState.isPresbyter,
    	}));
  	}

	onChangeLeader = () => {
		this.setState(initialState => ({
		isLeader: !initialState.isLeader,
		}));
	}
		
	handleChange = (event) => {
		const value = event.target.value;
		const name =  event.target.name;
		this.setState({[name]: value})
	}

	getLeaders = () => {                
        this.service
                .getLeaders()
                .then(response => {                    
                    let list = response.data.map(leader => {
                        return { value: leader.id, display: leader.name };
                    });
                    this.setState({
                        leaders: [
                          {
                            value: 0,
                            display: "Selecione o líder..."
                          }
                        ].concat(list)
                    })                                        
                    if(list.length < 1) {
                        messages.mensagemAlert("Nenhum resultado encontrado.")
                    }                    
                }).catch(error => {

                })        
    }

    getPresbyters = () => {                
        this.service
                .getPresbyters()
                .then(response => {                    
                    let list = response.data.map(presbyter => {
                        return { value: presbyter.id, display: presbyter.name };
                    });

                    this.setState({
                        presbyters: [
                          {
                            value: 0,
                            display: "Selecione o Presbítero..."
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

		const {	id, name, email, address, age, birthdayConverted, phone, cellphone, isPresbyter, isLeader, idLeader, idPresbyter } = this.state
		const user = {	id, name, email, address, age, birthdayConverted, phone, cellphone, isPresbyter, isLeader, idLeader, idPresbyter }					
		this.service
				.updateUser(user)
				.then(response => {
					this.props.history.push('/search-user')
					messages.mensagemSucesso('Usuário atualizado com sucesso!')
				}).catch(error => {
					messages.mensagemErro(error.response.data)
				})
	}

	validate() {
		const validateMessages = []

		if(!this.state.name) {
			validateMessages.push('Escolha o Nome!')
		}

		return validateMessages;
	}

	render() {
		return (			
				<div className="row">
					<div className="col-md-12" style={ {position : 'relative', left: '0px'} }>
						<div className="bs-docs-section">
							<Card title={this.state.atualizando ? 'Atualização de usuário' : 'Cadastro de usuário'}>
								<div className="row">
									<div className="col-lg-12">
										<div className="bs-component">
											<fieldset>
												<div className="col-lg-12">
													<FormGroup label="Nome: *" htmlFor="inputName">
														<input type="text" 
															value={this.state.name}														
															onChange={e => this.setState({name: e.target.value})}
															className="form-control" 
															id="inputName" 														
															placeholder="Nome" />
													</FormGroup>								
												</div>
												<div className="col-lg-12">
													<FormGroup label="Email: *" htmlFor="inputEmail">
														<input type="email" 
															value={this.state.email}														
															onChange={e => this.setState({email: e.target.value})}
															className="form-control" 
															id="inputEmail" 										
															placeholder="usuario@email.com" />
													</FormGroup>
												</div>
												<div className="col-lg-12">
													<FormGroup label="Endereço: *" htmlFor="inputAddress">
														<input type="text" 
															value={this.state.address}														
															onChange={e => this.setState({address: e.target.value})}
															className="form-control" 
															id="inputAdress" 										
															placeholder="Avenida Brasil, 777, Centro" />
													</FormGroup>
												</div>
												<div className="col-lg-1">
													<FormGroup label="Idade: *" htmlFor="inputIdade">
														<input type="text" 
															value={this.state.age}														
															onChange={e => this.setState({age: e.target.value})}
															className="form-control" 
															id="inputAge" 										
															placeholder="77" />
													</FormGroup>
												</div>
												<div className="col-lg-3">													
													<FormGroup  label="Data Nasc.:" htmlFor="dateMask">
														<InputMask id="dateMask" value={this.state.birthday} mask="99/99/9999" placeholder="__/__/____" onChange={e => 
															this.setState({birthday: e.target.value, birthdayConverted: e.target.value.split("/").reverse().join("-")})
														} className="form-control" />		
                                					</FormGroup>												
												</div>				
												<div className="col-lg-3">													
													<FormGroup  label="Telefone Fixo:" htmlFor="phoneMask">
														<InputMask id="phoneMask" value={this.state.phone} mask="(99)9999-9999" placeholder="(99)9999-9999" onChange={e => 
															this.setState({phone: e.target.value})
														} className="form-control" />		
                                					</FormGroup>												
												</div>	
												<div className="col-lg-3">													
													<FormGroup  label="Celular:" htmlFor="cellphoneMask">
														<InputMask id="cellphoneMask" value={this.state.cellphone} mask="(99)99999-9999" placeholder="(99)99999-9999" onChange={e => 
															this.setState({cellphone: e.target.value})
														} className="form-control" />		
                                					</FormGroup>												
												</div>									
												<div className="row">
													<div className="col-md-12" style={ {position : 'relative', left: '35px'} }>
														<FormGroup>												
															<input type="checkbox"
																checked={this.state.isPresbyter}
																onChange={this.onChangePresbyter}
																className="form-check-input"
														/>
														Presbitero										        								              
														</FormGroup>
													</div>	
												</div>
												<div className="row">
													<div className="col-md-12" style={ {position : 'relative', left: '35px'} }>
														<FormGroup>
															<input type="checkbox"
																checked={this.state.isLeader}
																onChange={this.onChangeLeader}
																className="form-check-input"
														/>
														Líder										        
														</FormGroup>
													</div>
												</div>		
												<div className="col-lg-12">                                                    
                                                    <FormGroup  label="Líder: *" htmlFor="leaderSelect">
														<select className="form-control"
															id="leaderSelect"
															value={this.state.idLeader}
															disabled={ this.state.isLeader }
                                                            onChange={e =>
                                                                this.setState({
                                                                idLeader: e.target.value,
                                                                validationError:
                                                                    e.target.value === ""
                                                                    ? "Escolha um Líder..."
                                                                    : ""
                                                                })
                                                            }
                                                            >
                                                            { this.state.leaders.map(leader => (
                                                                <option
                                                                    key={leader.value}
                                                                    value={leader.value}>
                                                                    {leader.display}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </FormGroup>
                                                    <FormGroup  label="Presbítero: *" htmlFor="presbyterSelect">
														<select className="form-control"
															id="presbyterSelect"
															value={this.state.idPresbyter}
															disabled={ this.state.isPresbyter }
                                                            onChange={e =>
                                                                this.setState({
                                                                idPresbyter: e.target.value,
                                                                validationError:
                                                                    e.target.value === ""
                                                                    ? "Escolha um presbítero..."
                                                                    : ""
                                                                })
                                                            }
                                                            >
                                                            { this.state.presbyters.map(presbyter => (
                                                                <option
                                                                    key={presbyter.value}
                                                                    value={presbyter.value}>
                                                                    {presbyter.display}
                                                                </option>
                                                            ))}
                                                        </select>
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
													<button onClick= {e => this.props.history.push('/search-user')} className="btn btn-primary">
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

export default withRouter( RegisterUser )