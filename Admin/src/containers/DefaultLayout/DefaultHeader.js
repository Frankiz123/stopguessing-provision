import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { createHashHistory } from 'history'
import swal from 'sweetalert';

import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.png'

export const history = createHashHistory()

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props){
    super(props)
     this.state={
      loggedIn:true
    }
    this.onLogout = this.onLogout.bind(this)

  }

  onLogout = () => {
    swal({
      title: "Are you sure want to logout?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(clickedOk => {
      if (clickedOk) {
        localStorage.clear();

    history.push('/')
    window.location.reload();
      }
    })
  }

  // onLogout()
  // {
  //   localStorage.clear();

  //   history.push('/')
  //   window.location.reload();

  //  }

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
        >Stop Guessing</AppNavbarBrand>
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        
        <Nav className="ml-auto" navbar>
        
         
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <img src={logo} style={{width:30,height:30}}/>
            </DropdownToggle>
            <DropdownMenu right>
             
              <DropdownItem onClick={() => this.onLogout()}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
