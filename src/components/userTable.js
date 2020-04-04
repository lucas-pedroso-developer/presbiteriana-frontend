import React from 'react'

export default props => {		
	const rows = props.users.map( user => {

		let isPresbyterString = user.isPresbyter === true ? `Sim`: `Não`;
		let isLeaderString = user.isLeader === true ? `Sim`: `Não`;
		
		return (
			<tr key={user.id}>
				<td>{user.name}</td>										
				<td>{user.phone}</td>
				<td>{user.cellphone}</td>
				<td>{user.birthday}</td>
				<td>{isPresbyterString}</td>
				<td>{isLeaderString}</td>
				<td>					
					<button type="button" className="btn btn-primary" title="Editar"
							onClick={e => props.editarAction(user.id)}>
							<i className="pi pi-pencil"></i>								
					</button>
					<button type="button" className="btn btn-danger" title="Deletar"
					 		onClick={e => props.deleteAction(user)}>
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
					<th scope="col">Nome</th>					
					<th scope="col">Telefone</th>
					<th scope="col">Celular</th>
					<th scope="col">Aniversário</th>
					<th scope="col">Presbítero</th>
					<th scope="col">Líder</th>
					<th scope="col">Ações</th>
				</tr>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</table>
	)
}