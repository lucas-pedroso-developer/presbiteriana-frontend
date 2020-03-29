import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from '../components/card'
import FormGroup from '../components/form-group'
import VisitTable from '../components/visitTable'
import UserService from '../app/service/userService'
import VisitService from '../app/service/visitService'
import * as messages from '../components/toastr'
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import InputMask from 'react-input-mask';
import jsPDF from "jspdf";
import "jspdf-autotable";

class SearchVisit extends React.Component {

	state = {
        id: '',	
		idPresbyter: '',	
        idLeader: '',	
        presbyterName: '',
        leaderName: '',
        visitDate: '',				        
        presbyters: [],
        leaders: [],
        visits: [],			    
        visitDelete: [],
        visitDateConverted: '',
		mensagemErro: null,
		updating: false,		
		showConfirmDialog: false,
		userDelete: {},
		users: []
	}

	constructor() {
		super();
        this.service = new VisitService();
        this.userService = new UserService();
	}

	componentDidMount() {					
		this.getLeaders();
		this.getPresbyters();
	}

	search = () => {		
		const visitFilter = {						
			idLeader: this.state.idLeader,
			idPresbyter: this.state.idPresbyter,
			visitDate: this.state.visitDateConverted		
        }		
        console.log('visitFilter')
        console.log(visitFilter)
		this.service
				.consult(visitFilter)
				.then(response => {
                    const list = response.data
                    console.log('list')
                    console.log(list)
					if(list.length < 1) {
						messages.mensagemAlert("Nenhum resultado encontrado.")
					} 
					this.setState({visits: list})
				}).catch(error => {

				})
	}

	getLeaders = () => {                
        this.userService
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
        this.userService
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

	editUserByIndex = (id) => {		
		this.props.history.push(`/register-visit/${id}`)
	}
	
	deleteVisitByIndex = () => {				
		this.service
			.deleteVisit(this.state.visitDelete.id)
			.then(response => {
				const visits = this.state.visits;				
				const index = visits.indexOf(this.state.visitDelete) 				
				visits.splice(index, 1)				
				this.setState({visits: visits, showConfirmDialog: false})
				messages.mensagemSucesso('Usuário deletado com sucesso!');
			}).catch(error => {
				messages.mensagemErro('Erro ao deletar Usuário!');
			})
	}

	openConfirm = (visit) => {
		this.setState({showConfirmDialog: true, visitDelete: visit})
	}

	cancelDelete = () => {
		this.setState({showConfirmDialog: false, visitDelete: {}})	
	}

	prepareRegisterForm = () => {
		this.props.history.push('/register-visit')
    }

    exportPDF = () => {
        const unit = "pt";
        const size = "A4"; 
        const orientation = "portrait"; 
    
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
    
        doc.setFontSize(15);
    
        const title = "Relatório de usuários";
        const headers = [["Líder", "Presbítero", "Data Visita"]];
    
        const data = this.state.visits.map(visit=> [
            visit.leaderName, 
            visit.presbyterName,
			visit.visitDate.toString().split(",").reverse().join("/")			
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
			<Card title="Consulta de Visita">                
				<div className="row">
					<div className="col-md-12" style={ {position : 'relative', left: '0px'} }>
						<div className="bs-component">									
							<div className="col-lg-7">   
                                <FormGroup  label="Presbítero:" htmlFor="presbyterSelect">
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
                            <div className="col-lg-7">                                                  
								<FormGroup  label="Líder:" htmlFor="leaderSelect">
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
                            </div>							                                           
                            <div className="col-lg-3" style={ {position : 'relative', left: '0px'} }>
                                <FormGroup  label="Data Visita:" htmlFor="dateMask">
                                    <InputMask id="dateMask" value={this.state.visitDate} mask="99/99/9999" placeholder="__/__/____" onChange={e => 
                                        this.setState({visitDate: e.target.value, visitDateConverted: e.target.value.split("/").reverse().join("-")})
                                    } className="form-control" />		
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
                                            <i class="pi pi-file-pdf"></i>Gerar Relatório
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
							<VisitTable visits={this.state.visits} 
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

export default withRouter(SearchVisit);