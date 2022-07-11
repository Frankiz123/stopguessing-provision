import React, { Component, lazy, Suspense } from 'react';
import userCtrl from '../UserManagement/controllers/userCtrl';
import ClipLoader from "react-spinners/ClipLoader";

import {
 Badge,Row,Col,Card,CardHeader,CardBody,Table,Button,Modal,ModalBody,FormGroup,Label,Input} from 'reactstrap';

function UserRow(props) {
  const user = props.user
  const userLink = `/users/${user.id}` 
  const xyz = user.id;

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
      <td><div>{user.subscribe_date}</div>sub-id : { user.subscribe_id}</td>
      <td>{user.city + ' '+ user.address+ ' '+ user.zip}</td>
      <td>{user.userProduct == null || user.userProduct == '' ? "No product" : user.userProduct}</td>

      <td><div>{user.name }</div>{ user.phone}</td>
  <td><div><Badge color={getBadge(user.status)}>{user.subscribe_status}</Badge></div><div>{user.shipping_status}</div><div>{ user.priority}</div> {user.delivery}</td>
      <td><Button onClick={() => window.helloComponent.toggleLarge(user.id)}>Click</Button></td>

    </tr>
    
  )
}

class Dashboard extends Component {
  
  constructor(props) {
    super(props);
    window.helloComponent = this;

    this.state = {
      usersData: [],
       large:false,
       shippingStatus:"",
       priority:'',
       delivery:'',
       loading: false,

    };
    this.toggle = this.toggle.bind(this);
    this.toggleLarge = this.toggleLarge.bind(this);
    this.onChange = this.onChange.bind(this);
    this.orderManagementAdmin = this.orderManagementAdmin.bind(this);

  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  
  orderManagementAdmin = async () => {

    const id = localStorage.getItem("orderId")

    this.setState({
      loading: true
    })
    // creates entity
    fetch("http://18.222.228.44:3000/ordermanagement", {
      "method": "POST",
      "headers": {

        "content-type": "application/json",
        "accept": "application/json"
      },
      "body": JSON.stringify({
        user_id: id,
        shippingStatus: this.state.shippingStatus,
            priority: this.state.priority,
           delivery: this.state.delivery,
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response.status == "true") {
          this.setState({
            loading: false,
            large:false
          })
         window.location.reload();
        }
        else {
          this.setState({
            loading: false,
            large:false
          })
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  toggleLarge(id) {
    localStorage.setItem("orderId",id)

    this.setState({
      large: !this.state.large,
    });
   
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  componentDidMount()
  {

      userCtrl.customerOrder((resulData)=>{
        localStorage.setItem("orderId",resulData.data.response[0].id);
      this.setState({
        usersData : resulData.data.response
      })
      })
  }
  
  render() {
       
    const userList = this.state.usersData.filter((user) => user.id)
   
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i>Orders
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col">Id</th>
                      <th scope="col">Order</th>
                      <th scope="col">Address</th>
                      <th scope="col">User product</th>

                      <th scope="col">Customer</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user, index) =>
                      <UserRow key={index} user={user}/>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            
              <Modal isOpen={this.state.large} toggle={this.toggleLarge}
                       className={'modal-md ' + this.props.className}>
                         <ModalBody>
                           
                 <Row>
                  <Col xs="12">
                    <FormGroup>
                      <Label >Shipping status</Label>
                      <Input type="text" name="shippingStatus" placeholder="Enter" value={this.state.shippingStatus} onChange={this.onChange} required />
                      <Label >Priority</Label>
                      <Input type="text" name="priority" placeholder="Enter" value={this.state.priority} onChange={this.onChange}  />
                      <Label >Delivery in days</Label>
                      <Input type="text" name="delivery" placeholder="Enter" value={this.state.delivery} onChange={this.onChange} required />
                      <Col style={{ marginTop: 10, marginLeft: '70%' }} sm="6" md="4" sm className="mb-1 mb-xl-0">
                      <Button onClick={this.orderManagementAdmin} block color="info">Save</Button>
                    </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <div className="sweet-loading">
                  <ClipLoader
                    style={{}}
                    size={15}
                    color={"blue"}
                    loading={this.state.loading}
                  />
                </div>
                </ModalBody>
                </Modal>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
  
}

export default Dashboard;
