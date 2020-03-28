import React from 'react'
import NavbarItem from './navbarItem'

function Navbar() {
	return(
		<div className="navbar navbar-expand-lg fixed-top navbar-dark bg-primary">
	      <div className="container">
	        <a href="#/" className="navbar-brand">Presbiteriana</a>
	        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
	          <span className="navbar-toggler-icon"></span>
	        </button>
	        <div className="collapse navbar-collapse" id="navbarResponsive">
	          <ul className="navbar-nav">	          	
			  	<NavbarItem render={true} href="#/register-user" label="Cadastro Usuário" />	        
	          	<NavbarItem render={true} href="#/search-user" label="Consulta Usuário" />
				<NavbarItem render={true} href="#/register-visit" label="Cadastro Visita" />	        
	          	<NavbarItem render={true} href="#/search-visit" label="Consulta Visita" />	          	
	          </ul>
	          
	        </div>
	      </div>
	    </div>
	)
}

export default Navbar