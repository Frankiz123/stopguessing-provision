import swal from 'sweetalert';

import axios from 'axios';
import config from '../../../config/config';
const userdataObject = {
    userList: async (callback)=>{
        axios({
            method: 'GET',
            url: config.baseUrl+'/adminuser',
            data: {
            
            }
          }).then(response => {
                return callback(response);
          }) 
          .catch(err => {
                console.log(err);
          });
    },
    userSingle: async (callback)=>{
      axios({
          method: 'GET',
          url: config.baseUrl+'/adminSingleuser',
          data: {
          
          }
        }).then(response => {
              return callback(response);
        }) 
        .catch(err => {
              console.log(err);
        });
  },
    customerOrder: async (callback)=>{
      axios({
          method: 'GET',
          url: config.baseUrl+'/customerorder',
          data: {
          
          }
        }).then(response => {
              return callback(response);
        }) 
        .catch(err => {
              console.log(err);
        });
  },
   
    userDelete: async (userid,callback)=>{
      axios({
          method: 'DELETE',
          url: config.baseUrl+'/api/users/'+userid+'',
          data: {
          
          }
        }).then(response => {
              return callback(response);
        }) 
        .catch(err => {
              console.log(err);
        });
  },
  userImage: async (data,callback)=>{
      axios({
          method: 'POST',
          url: config.baseUrl+'/userimage',
          data: data
        }).then(response => {
              return callback(response);
        }) 
        .catch(err => {
            swal("Unauthorised User!", {
                  icon: "error",
                });
        });
  },
  adminComment: async (data,callback)=>{
      axios({
          method: 'POST',
          url: config.baseUrl+'/admincomment',
          data: data
        }).then(response => {
              return callback(response);
        }) 
        .catch(err => {
            swal("Unauthorised User!", {
                  icon: "error",
                });
        });
  }, 
 
  userProduct: async (data,callback)=>{
      axios({
          method: 'POST',
          url: config.baseUrl+'/userproduct',
          data: data
        }).then(response => {
              return callback(response);
        }) 
        .catch(err => {
            swal("Unauthorised User!", {
                  icon: "error",
                });
        });
  },
  
  userLogin: async (data,callback)=>{
      axios({
          method: 'POST',
          url: config.baseUrl+'/signinAdmin',
          data: data
        }).then(response => {
              return callback(response);
        }) 
        .catch(err => {
            swal("Unauthorised User!", {
                  icon: "error",
                });
        });
  },
  userSignup: async (data,callback)=>{
      axios({
          method: 'POST',
          url: config.baseUrl+'/api/users',
          data: data
        }).then(response => {
              return callback(response),
              
              swal("User Registration Successfully !", {
                  icon: "success",
                })
        }) 
        
        .catch(err => {
            console.log(err);
            
        });
  }
}
export default userdataObject;