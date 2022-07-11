import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import userCtrl from '../UserManagement/controllers/userCtrl';

function UserRow(props) {
  const user = props.user
  const userLink = `/users/${user.id}` 

  const getBadge = (status) => {
    return status === 'Active' ? 'success' :
      status === 'Inactive' ? 'secondary' :
        status === 'Pending' ? 'warning' :
          status === 'Banned' ? 'danger' :
            'primary'
  }

  return (
    <tr key={user.id.toString()}>
      <th scope="row">{user.id}</th>
      <td><Link to={userLink}>{user.name}</Link></td>
      <td>{user.subscribe_date}</td>
      <td>{user.email}</td>
      <td>{user.phone}</td>
      <td>{user.city + ' ' + user.address + ' ' + user.zip}</td>
      <td><Badge color={getBadge(user.status)}>{user.subscribe_status}</Badge></td>

    </tr>
  )
}

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersData: [],
  
    };
  }
  
  componentDidMount()
  {
      userCtrl.userList((resulData)=>{
      this.setState({
        usersData : resulData.data.response
      })
      })
  }

  render() {
    
    const userList = this.state.usersData.filter((user) => user.id )

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i>Users
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col">Id</th>
                      <th scope="col">Name</th>
                      <th scope="col">Registered</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Address</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user, index) =>
                      <UserRow key={index} user={user}/>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Users;
