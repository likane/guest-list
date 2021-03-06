/* This component will be rendered in the content container depending on the route.  It will import the event's current information and provide functionality to update that information. */

import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import Auth from "../modules/Auth";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchEvents, selectEvent } from "../actions/index";
import ContentHeader from "./ContentHeader.jsx";
import DefaultSplash from "../components/DefaultSplash.jsx";

class EditEvent extends Component {
	// constructor function. Called whenever a new instance of the class is created
	constructor(props) { 
        super(props); 
		// add current values for fields when setting the initial state
		if (this.props.activeEvent){
			this.state = {
				updatedEvent: this.props.activeEvent
			}
		}
        // bind 'this' to all helper functions
        this.handleInputChange = this.handleInputChange.bind(this);
		this.processEventForm = this.processEventForm.bind(this);
		this.updateEvent = this.updateEvent.bind(this);
    }
	// event handler for input elements.  This takes the input and inserts it into the state using the 'name' of the element that triggered it as the key.
	handleInputChange(event) {
		const field = event.target.name;
        const updatedEvent = this.state.updatedEvent;
        updatedEvent[field] = event.target.value;
        this.setState({
            updatedEvent
        });
	}
	// this method will trigger when the submit button is clicked.  it will check the inputs for errors and then initiate the create event method to actually create the event.
	processEventForm(event) {
        // Prevent default action.  in this case, action is the form submission event.
        event.preventDefault();
		// do basic front-end checks to make sure form was filled out correctly
		const updatedEvent = this.state.updatedEvent;
		//create the event
		this.updateEvent(updatedEvent);
    }
	// this custom method will create the event in the database.  if successful, it redirects the user to the dashboard.
    updateEvent(updatedEvent){
        // add the new event to the mongo database 
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", "/api/event/edit");
        xhr.setRequestHeader("Authorization", `bearer ${Auth.getToken()}`);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.responseType = "json";
        xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
				// update the events in the application state
				this.props.fetchEvents(this.props.venue._id, Auth.getToken());
				// select the activeEvent in the application state 
				this.props.selectEvent(xhr.response.updatedEvent);
                // redirect to the dash, and have the dash select the newly created event for display
				this.props.router.push("/dash/event");
            } else {
				console.log("there was an error in creating the event. error:", xhr.response.message)
			};
        });
        xhr.send(JSON.stringify(updatedEvent));
    }
	// render the component 
	render() {
		// check to make sure a venue is in the props.
		if (!this.props.activeEvent){
			return (
				<DefaultSplash message="Select an event to edit it" />
			)
		}
		// if a venue is in the props, show add-event form.
		return (
			<div className="row">				
				<div className="col s12">
					<h3 className="center-align">Edit Event</h3>
					<form action="/" onSubmit={this.processEventForm} className="dashboard-form" id="edit-event-form">
						<div className="row" style={{paddingTop: "20px"}}>	
							<div className="col s6">
								<label htmlFor="headliner">Headliner *</label>
								<input name="headliner" onChange={this.handleInputChange} value={this.state.updatedEvent.headliner} type="text" className="validate">
								</input>								
							</div>							
							<div className="col s3">
								<label htmlFor="date">Date *</label>
								<input type="text" name="date" value={this.state.updatedEvent.date} onChange={this.handleInputChange}></input>	
							</div>					
							<div className="col s2">
								<label>Time *</label>
								<input type="text" name="time" value={this.state.updatedEvent.time} onChange={this.handleInputChange}></input>
							</div>	
							<div className="col s1">
								<label>AM/PM *</label>
								<input type="text" name="am_pm" value={this.state.updatedEvent.am_pm} onChange={this.handleInputChange}></input>
							</div>					
						</div>						
						<div className="row">							
							<div className=" col s4">
								<label htmlFor="supportOne">First Support</label>
								<input name="supportOne" type="text" className="validate" value={this.state.updatedEvent.supportOne} onChange={this.handleInputChange}></input>
							</div>
							<div className=" col s4">
								<label htmlFor="supportTwo">Second Support</label>
								<input name="supportTwo"  type="text" className="validate" value={this.state.updatedEvent.supportTwo} onChange={this.handleInputChange}></input>
							</div>
							<div className=" col s4">
								<label htmlFor="supportThree">Third Support</label>
								<input name="supportThree"  type="text" className="validate" value={this.state.updatedEvent.supportThree} onChange={this.handleInputChange}></input>
							</div>
						</div>
						<div className="row">							
							<div className=" col s3">
								<label htmlFor="headlinerAllotment">Headliner Allotment</label>
								<input name="headlinerAllotment"  type="text" className="validate" value={this.state.updatedEvent.headlinerAllotment} onChange={this.handleInputChange}></input>
							</div>
							<div className=" col s3">
								<label htmlFor="supportOneAllotment">First Support Allotment</label>
								<input name="supportOneAllotment"  type="text" className="validate" value={this.state.updatedEvent.supportOneAllotment} onChange={this.handleInputChange}></input>
							</div>
							<div className=" col s3">
								<label htmlFor="supportTwoAllotment">Second Support Allotment</label>								
								<input name="supportTwoAllotment"  type="text" className="validate" value={this.state.updatedEvent.supportTwoAllotment} onChange={this.handleInputChange}></input>
							</div>
							<div className=" col s3">
								<label htmlFor="supportThreeAllotment">Third Support Allotment</label>
								<input name="supportThreeAllotment"  type="text" className="validate" value={this.state.updatedEvent.supportThreeAllotment} onChange={this.handleInputChange}></input>
							</div>
						</div>						
					</form>
					<div className="row valign-wrapper" >
						<div className="col s6 right-align" >
							<Link className="grey darken-2 waves-effect waves-light btn center-align hoverable" to={'/dash/event'}>Cancel</Link>
						</div>

						<div className="col s6 left-align" >
							<button type="submit" form="edit-event-form" className="blue accent-2 waves-effect waves-light btn hoverable center-align">Submit</button>				
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		venue: state.venue,
		activeEvent: state.activeEvent
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ fetchEvents, selectEvent }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditEvent); 