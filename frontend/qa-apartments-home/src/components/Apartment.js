import React from 'react';

import ApartmentList from './ApartmentComps/ApartmentList';
import RoomList from './ApartmentComps/RoomList';
import RoomSchedule from './ApartmentComps/RoomSchedule';

import {baseUrl} from './helperFunctions';

class Apartment extends React.Component {

      constructor() {
        super();

    this.state = {
      stateText:[],
      roomText:[],
      roomSchedule:[],
      leaseStart:null,
      leaseEnd:null,
      breakClause:null
    };
  }

  componentDidMount=()=>{
    this.getApartmentList();
  }

  getApartment = () => {
    let selectBox = document.getElementById("apartmentSelect");
    let selectedValue = selectBox.options[selectBox.selectedIndex].value;
    let id;
    const url = `${baseUrl}apartment/json/`;

    let fetchData = { 
      method: 'GET',
    };
   
    fetch(url+selectedValue,fetchData)
    .then(response=>{
        //If a 2xx response is received return the response as JSON
        if(response.ok){  
          return response.json();  
        }
        //Throw an error otherwise and jump to the catch statement
        throw Error(response.statusText);
    })
    .then(response=>{
      this.setState({
                    leaseStart:response.leaseStart,
                    leaseEnd:response.leaseEnd,
                    breakClause:response.breakClause
                  })
      id = response.id;
      //  console.log('getting room details for selected Value: '+selectedValue)
    
    })
    .then(()=>
        this.getAllRooms(String(id))
    )
    .catch(error=>{
      console.log("Request Failed: " + error.message);
    });
}

getApartmentList = () => {
  let url = `${baseUrl}apartment/json/`;
  let fetchData = { 
    method: 'GET',
  };

  fetch(url,fetchData)
  .then(function(response){ 
      return response.json();  
  })
  .then(response=>{

     let apartList = [];

    for(let x in response){
        apartList.push(response[x].id);
    }

    this.setState({stateText:apartList});

  })

}

getAllRooms = (idValue) => {
  let url = `${baseUrl}room/getRoom/`;
  let fetchData = { 
    method: 'GET',
  };

  fetch(url,fetchData)
  .then(response=>
    response.ok?response.json():Error(response.statusText)
  )
  .then(data=>
     data.reduce((acc,room)=>{
        if(String(idValue)===String(room.apartment.id)){
          acc.push(room.roomId);
        }
      return acc;
    },[]))
  .then((roomIds)=>{
      this.setState({roomText:roomIds});
  })
  .catch(error=>{
    console.log("Request Failed: " + error.message);
  });
}

getRoomDetails = () => {
  let selectBox = document.getElementById("roomSelect");
  let selectedValue = selectBox.options[selectBox.selectedIndex].value;
  let url = `${baseUrl}schedule/json/`;

  let fetchData = { 
    method: 'GET',
  };

  fetch(url,fetchData)
  .then(response=>{
      //If a 2xx response is received return the response as JSON
      if(response.ok){  
        return response.json();  
      }
      //Throw an error otherwise and jump to the catch statement
      throw Error(response.statusText);
  })
  .then(response=>{
    const roomData = response.reduce((acc,room)=>{
      console.log(room)
        if(String(selectedValue) === String(room.roomID.roomId)){
          acc.push(room);
        }
      return acc;
    },[])
    console.log(roomData)
    this.setState({roomSchedule:roomData});
  })
  .catch(error=>{
    console.log("Request Failed: " + error.message);
  });
}

  render() {
    return (
      <div>
        <div>
         <ApartmentList list={this.state.stateText}/>
            <br/>
            <button id="getApartment"onClick={()=>this.getApartment()}>Get Apartment</button><br/>
            <button id="refreshList" onClick={()=>this.getApartmentList()}>Refresh</button><br/>
        </div>
        <br/> <br/> 
        <hr/>
        <div> 
          <select id="roomSelect">
          {
              this.state.roomText.map(room => 
                <RoomList room={room}/>
              )
          } 
          </select>
          <button id="getRoomInfo" onClick={()=>this.getRoomDetails()}>Get Room Details</button><br/>
          {
              this.state.roomSchedule.map(roomInfo => 
                <RoomSchedule roomInfo={roomInfo}/>
              )
          }
        </div>
        <br/> <br/> <br/> <br/>
        <hr/>
        <div>
            <p>Misc Section</p>
            <label for="leaseStartBox">Lease Start</label>
            <input type="text" id="leaseStartBox" value={this.state.leaseStart ? this.state.leaseStart: 'Lease Start'}/>
            <label for="leaseEndBox">Lease End</label>
            <input type="text" id="leaseEndBox" value={this.state.leaseEnd ? this.state.leaseEnd: 'Lease End'}/>
            <label for="breakClauseBox">Break Clause</label>
            <input type="text"  id="breakClauseBox" value={this.state.breakClause ? this.state.breakClause: 'Break Clause'}/>
        </div>
      </div>
    );
  }
}

export default Apartment;