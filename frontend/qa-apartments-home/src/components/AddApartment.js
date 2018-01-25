import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Notifications from './NotificationComp/HomeNotifications'

import 'react-datepicker/dist/react-datepicker.css';

import {baseUrl} from './helperFunctions';

function create(apartmentObject){

    let url = baseUrl + "apartment/json";

    let fetchData = {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: apartmentObject
    };

    fetch(url, fetchData).then((response)=>{
      });

}

class AddApartment extends React.Component {
        constructor(){
      super();
      this.state={
        apartment:{

        },
        apartment:{
           addressField:{},
          leaseStart: moment(),
          leaseEnd: moment(),
          breakClause: moment()
        }
       
      }
    }

    getFullDate = (dateRequired) => {
      var year = dateRequired._d.getFullYear().toString()
      var month = Number((dateRequired._d.getMonth()) + 1).toString()
      var day = dateRequired._d.getDate().toString()
      if(month < 10)
      {
        month = 0 + month;
      }
      if(day < 10)
      {
        day = 0 + day;
      }
      return year + "-" + month + "-" + day;

    }

    onChange=e=>{
        this.setState({apartment:{...this.state.apartment,[e.target.id]: e.target.value}})
        console.log(this.state)
    }

       onChangeAdd=e=>{
        // console.log(e.target.value)
        this.setState({apartment:{...this.state.apartment,addressField:{...this.state.apartment.addressField,[e.target.id]: e.target.value}}})
        console.log(this.state)
    }

    addApartment=()=>{
        const stateToSend = {...this.state.apartment}
        let startLeaseDate = stateToSend.leaseStart;
        let endLeaseDate = stateToSend.leaseEnd;
        let breakClauseDate = stateToSend.breakClause;
        startLeaseDate = this.getFullDate(startLeaseDate);
        endLeaseDate = this.getFullDate(endLeaseDate);
        breakClauseDate = this.getFullDate(breakClauseDate);
        stateToSend.leaseStart = startLeaseDate;
        stateToSend.leaseEnd = endLeaseDate;
        stateToSend.breakClause = breakClauseDate;
        stateToSend.noRooms = Number(stateToSend.noRooms);
        stateToSend.deposit = (Number(stateToSend.deposit));
        stateToSend.rent = Number(stateToSend.rent);
        create(JSON.stringify(stateToSend));
    }
    
    handleChange1 =(date)=> {
        this.setState({
          apartment:{...this.state.apartment, leaseStart: date}
        });
      }

      handleChange2 =(date)=> {
        this.setState({
          apartment:{...this.state.apartment, leaseEnd: date}
        });
      }

      handleChange3 =(date)=> {
        this.setState({
          apartment:{...this.state.apartment, breakClause: date}
        });
      }
    
      render(){
        return (
          <div className='pageheader'>
            <h2>Lets get adding son</h2>
                <i>* indicates required fields</i><br/>
                <input type='text' id='buildingName' onChange={this.onChange} placeholder='Building name'/>*<br/>
                <input type='text' id='apartmentNo' onChange={this.onChange} placeholder='Apartment number'/>*<br/>
                <input type='text' id='agency' onChange={this.onChange} placeholder='Agency'/>*<br/>
                <input type='text' id='landlord' onChange={this.onChange} placeholder='Landlord'/><br/>
                <input type='text' id='tenant' onChange={this.onChange} placeholder='Tenant'/>*<br/>
                <DatePicker id='leaseStart' selected={this.state.apartment.leaseStart}onChange={this.handleChange1}/>
                <DatePicker id='leaseEnd' selected={this.state.apartment.leaseEnd}onChange={this.handleChange2}/>
                <DatePicker id='breakClause' selected={this.state.apartment.breakClause}onChange={this.handleChange3}/>
                <input type='text' id='agencyPhoneNo' onChange={this.onChange} placeholder='Agency Telephone Number'/>*<br/>
                <input type='text' id='noRooms' onChange={this.onChange} placeholder='Number of rooms'/><br/>
                <input type='text' id='rent' onChange={this.onChange} placeholder='Rent: 00.00'/>*<br/>
                <input type='text' id='notes' onChange={this.onChange} placeholder='Notes here...'/><br/>
                <input type='text' id='address' onChange={this.onChange} placeholder='Address line 1'/>*<br/>
                <input type='text' id='street'onChange={this.onChangeAdd} placeholder='Street'/><br/>
                <input type='text' id='city'onChange={this.onChangeAdd} placeholder='City'/><br/>
                <input type='text' id='postcode'onChange={this.onChangeAdd} placeholder='Postcode'/><br/>
                <input type='text' id='deposit' onChange={this.onChange} placeholder='deposit'/>*<br/>
                <button onClick={()=>this.addApartment()}> Submit </button>

          </div>
        );
      }
    };


export default AddApartment;