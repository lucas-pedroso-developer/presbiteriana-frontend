import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from '../components/card'
import FormGroup from '../components/form-group'
import UserTable from '../components/userTable'
import UserService from '../app/service/userService'
import * as messages from '../components/toastr'
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import InputMask from 'react-input-mask';
import jsPDF from "jspdf";
import "jspdf-autotable";

class SearchUser extends React.Component {

	state = {
		name: '',
		email: '',
		address: '',
		age: '',
		birthday: '',		
		isPresbyter: '',
		isLeader: '',
		idLeader: '',	
		idDependent: '',			        
        leaders: [],
		presbyters: [],
		nobodyChecked: '',
		showConfirmDialog: false,
		userDelete: {},
		users: []
	}

	constructor() {
		super();
		this.service = new UserService();
	}

	componentDidMount() {					
		this.getLeaders();
		this.getPresbyters();
	}

	search = () => {			
		const userFilter = {			
			name: this.state.name,
			email: this.state.email,
			address: this.state.address,
			age: this.state.age,
			birthday: this.state.birthday,
			isPresbyter: this.state.isPresbyter,
			isLeader: this.state.isLeader,
			idLeader: this.state.idLeader,
			idPresbyter: this.state.idPresbyter
		}
				
		this.service
				.consult(userFilter)
				.then(response => {
					const list = response.data														
					if(list.length < 1) {
						messages.mensagemAlert("Nenhum resultado encontrado.")
					} 
					this.setState({users: list})
				}).catch(error => {
					messages.mensagemErro(error.data)					
				})
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
					messages.mensagemErro(error.data)					
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
					messages.mensagemErro(error.data)					
                })        
    }

	editUserByIndex = (id) => {		
		this.props.history.push(`/register-user/${id}`)
	}
	
	deleteUserByIndex = () => {				
		this.service
			.deleteUser(this.state.userDelete.id)
			.then(response => {
				const users = this.state.users;				
				const index = users.indexOf(this.state.userDelete) 				
				users.splice(index, 1)				
				this.setState({users: users, showConfirmDialog: false})
				messages.mensagemSucesso('Usuário deletado com sucesso!');
			}).catch(error => {
				messages.mensagemErro('Erro ao deletar Usuário!');
			})
	}

	openConfirm = (user) => {
		this.setState({showConfirmDialog: true, userDelete: user})
	}

	cancelDelete = () => {
		this.setState({showConfirmDialog: false, userDelete: {}})	
	}

	prepareRegisterForm = () => {
		this.props.history.push('/register-user')
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
	
	onChangeNobody = () => {
		this.setState(initialState => ({
			nobodyChecked: !initialState.nobodyChecked,
		}));

		const nobody = !this.state.nobodyChecked;				
		if(nobody) {
			this.setState({
				isLeader: false,	
				isPresbyter: false,	
				idLeader: 0, 
				idPresbyter: 0,
			});
		} else {
			this.setState({
				isLeader: '',	
				isPresbyter: '',	
				idLeader: '', 
				idPresbyter: '',
			});
		}	
	}
		    
    exportPDF = () => {
        const unit = "pt";
        const size = "A4"; 
        const orientation = "portrait"; 
    
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
    
        doc.setFontSize(15);
    
        const title = "Relatório de usuários";
        const headers = [["Nome", "Endereço", "Telefone", "Celular", "Aniversário"]];
    
        const data = this.state.users.map(user=> [
            user.name, 
            user.address,
			user.phone,
			user.cellphone,
			user.birthday.toString().split(",").reverse().join("/")
        ]);
    
        let content = {
          startY: 50,
          head: headers,
          body: data
        };
    
        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("report.pdf")
    }
	
	render() {		
		const confirmDialogFooter = (
		    <div>
		        <Button label="Confirma" icon="pi pi-check" onClick={this.deleteUserByIndex} />
		        <Button label="Cancela" icon="pi pi-times" onClick={this.cancelDelete} />
		    </div>
		)
		
		return (
			<Card title="Consulta de Usuário">
				<div className="row">
					<div className="col-md-12" style={ {position : 'relative', left: '0px'} }>
						<div className="bs-component">		
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
									<InputMask id="dateMask" value={this.state.birthday} mask="99/99/9999" defaultValue="" placeholder="__/__/____" onChange={e => 
										this.setState({birthday: e.target.value})
									} className="form-control" />		
								</FormGroup>												
							</div>
							<div className="row">
								<div className="col-md-12" style={ {position : 'relative', left: '35px'} }>									
									<FormGroup>												
										<input type="checkbox"
											id="checkPresbyter"
											disabled={ this.state.nobodyChecked }
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
											id="checkLeader"
											disabled={ this.state.nobodyChecked }
											checked={this.state.isLeader}
											onChange={this.onChangeLeader}
											className="form-check-input"
									/>
									Líder										        
									</FormGroup>
								</div>
							</div>
							<div className="row">
								<div className="col-md-12" style={ {position : 'relative', left: '35px'} }>									
									<FormGroup>
										<input type="checkbox"											
											checked={this.state.nobodyChecked}
											onChange={this.onChangeNobody}
											className="form-check-input"
									/>
									Nenhum										        
									</FormGroup>
								</div>
							</div>
							<div className="col-lg-7">                                                    
								<FormGroup  label="Líder: *" htmlFor="leaderSelect">
									<select className="form-control"
										id="leaderSelect"
										value={this.state.idLeader}
										disabled={ this.state.isLeader, this.state.nobodyChecked }
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
										disabled={ this.state.isPresbyter, this.state.nobodyChecked }										
										onChange={e =>
											this.setState({
											idPresbyter: e.target.value,
											validationError:
												e.target.value === ""
												? "Escolha um Presbítero..."
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
							<div className="row">
								<div className="col-md-12" style={ {position : 'relative', left: '15px'} }>
									<button onClick={this.search} 
											type="button" 
											className="btn btn-success">
											<i className="pi pi-search"></i>Buscar
									</button>
									<button onClick={this.prepareRegisterForm} 
											type="button" 
											className="btn btn-danger">
											<i className="pi pi-plus"></i>Cadastrar
									</button>
									<button onClick={() => this.exportPDF() } 
											type="button" 
											className="btn btn-secondary">
											<i className="pi pi-file-pdf"></i>Gerar Relatório
									</button>
									
								</div>		
							</div>			
						</div>
					</div>
				</div>
				<br />
				<div className="row">
					<div className="col-md-12">
						<div className="bs-component">
							<UserTable users={this.state.users} 
											  deleteAction={this.openConfirm} 
											  editarAction={this.editUserByIndex} />
						</div>
					</div>
				</div>
				<div>
					<Dialog header="Confirmação" visible={this.state.showConfirmDialog} style={{width: '50vw'}} modal={true} 
							footer={confirmDialogFooter}
							onHide={() => this.setState({visible: false})}>
					    Confirma a exclusão deste Usuário?
					</Dialog>

				</div>
			</Card>
		)
	}
}

export default withRouter(SearchUser);