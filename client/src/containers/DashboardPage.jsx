/*
This is the dashboard page.  After a user logs in successfully, this page will be displayed instead of the home page.
*/

import React, {Component} from "react";
import Auth from "../modules/Auth";
import Dashboard from "../components/Dashboard.jsx";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchVenue, fetchEvents } from "../actions/index";

class DashboardPage extends Component {
    // class constructor
    constructor(props) {
        super(props);

        this.state = {
            venueInfo: {},
        };

    }

    // lifecycle methods.
    componentWillMount(){
        //make a request to the server to get venue information related to this user
        this.props.fetchVenue(localStorage.getItem("userId"), Auth.getToken());
    }
    
    componentDidMount(){
        // make a request to get all the event info 
        //this.props.fetchEvents(this.props.venue._id, Auth.getToken());
        this.props.fetchEvents("58d038c295cda41ce0391d99", Auth.getToken());
        
    }

    // render the component
    render() {
        // e.g. console.log("Test asdf:", this.props.asdf) // -> "Test asdf: 123"
        return (
            <Dashboard 
                children={this.props.children}
            />
        );
    }
}

function mapStateToProps(state) {
	// whatever is returned will be mapped to the props of this component
	return {
		venue: state.venue
	};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchVenue, fetchEvents }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);