import React from 'react'

export default props => {		
	const rows = props.visits.map( visit => {        
        
		return (
			<tr key={visit.id}>
				<td>{visit.presbyterName}</td>
				<td>{visit.leaderName}</td>
				<td>{visit.visitDate}</td>		                
				<td>					
					<button type="button" className="btn btn-primary" title="Editar"
							onClick={e => props.editarAction(visit.id)}>
							<i className="pi pi-pencil"></i>								
					</button>
					<button type="button" className="btn btn-danger" title="Deletar"
					 		onClick={e => props.deleteAction(visit)}>
							<i className="pi pi-trash"></i>
					</button>
				</td>
			</tr>
		)
	})

	return (
		<table className="table table-hover">
			<thead>
				<tr>					
					<th scope="col">Presbítero</th>
					<th scope="col">Líder</th>
					<th scope="col">Data Visita</th>	                    					
					<th scope="col">Ações</th>
				</tr>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</table>
	)
}