const express = require("express");
const bodyParser = require("body-parser");

const Venue = require("mongoose").model("Venue");
const Event = require("mongoose").model("Event");
const Guest = require("mongoose").model("Guest");


const router = new express.Router();

/* 
api routes that require authentication go below
*/

// venue route - get all info on a venue by owner (user) id 
router.get("/venue/:userId", (req, res) => {
    console.log("received api/venue/:userid GET request for:", req.params.userId);
    Venue.findOne({owner: req.params.userId}).
    populate({
            path: "events",
            populate: {
                path: "guests"
            }
        }
    ).
    exec((err, venue) => {
        // handle errors 
        if (err) {
            res.json({message: err});
        // if no errors 
        } else {
            res.status(200).json({
                venue: venue
            });
        };
    });
}); 

// event route - create an event 
router.post("/event", (req, res) => {
    console.log("received api/event POST request:", req.body);
    // create a new event record, via the Event schema
    const newEvent = new Event(req.body);
    // save the new event record 
    newEvent.save((err, doc) => {
        //console.log("err:", err)
        //console.log("doc:", doc)
        // handle errors with the save.
        if (err) { 
            //check to see if it is a duplicate code
            if (err.code === 11000){
                res.status(500).json({message: "that Event is already in the database"})
            } else {
                console.log("error:", err)
                res.status(500).json({message: err})
            };
        // if no errors.
        } else {
            // push the id of this new event to the owning venue
            Venue.findOneAndUpdate(
                {"_id": req.body.venue},
                {$push: {"events": doc._id}},
                {new: true},
                function(error, document){
                    if (error){
                        res.send(error);
                    } else {
                        res.status(200).json({
                            newEvent: doc
                        }); 
                    };
                }
            );
        };
    });    
}); 

// event route - get all events by venue id 
router.get("/event/all/:venueId", (req, res) => {
    console.log("received api/event/all GET request:", req.params.venueId);
    // finding all events where the venue matches the venueId, and populate the guests in the event 
    Event.find({
            venue: req.params.venueId
        }).
        limit(10).
        sort({ date: -1 }).
        populate("guests").
        exec((err, docs) => {
            // handle errors with the save.
            if (err) { 
                res.json({message: err})
            // if no errors.
            } else {
                res.status(200).json({
                    events: docs
                });
            };
        });    
}); 

// event route - get info for one event by that event's id 
router.get("/event/one/:eventId", (req, res) => {
    console.log("received api/event/one GET request:", req.params.eventId);
    // finding all events where the venue matches the venueId, and populate the guests in the event 
    Event.findOne({
            _id: req.params.eventId
        }).
        populate("guests").
        exec((err, docs) => {
            // handle errors with the save.
            if (err) { 
                res.json({message: err})
            // if no errors.
            } else {
                res.status(200).json({
                    event: docs
                });
            };
        });    
});

// event route - update an event 
router.put("/event/edit", (req, res) => {
    console.log("received api/event PUT request", req.body);
    // update the event record 
    Event.findOneAndUpdate(
        {"_id": req.body._id},  // find using this filter 
        {$set: req.body},  // make this update 
        {
            new: true // return updated rather than original 
        },  
        function(error, doc){
            if (error){
                res.send(error);
            } else {
                console.log("response from db", doc);
                res.status(200).json({
                    updatedEvent: doc
                }); 
            };
        }
    );
}); 

//route to get guest info for one guest by id
router.get("/guest/:guestId", (req, res) => {
    console.log("received api/dashboard/id GET request for:", req.params.guestId);
    Guest.findOne({_id: req.params.guestId}, function(err, guestInfo){
        if (err) {
            res.send(err);
        } else {
            res.status(200).json({
                guest: guestInfo
            });
        };
    })
    
}); 

// guest routes 
router.post("/guest", (req, res) => {
    console.log("received api/guest POST request:", req.body);
    // create a new guest record, via the guest schema, from the request data
    const newGuest = new Guest(req.body);
    // save the new guest record 
    newGuest.save((err, doc) => {
        //console.log("err:", err)
        //console.log("doc:", doc)
        // handle errors with the save.
        if (err) { 
            //check to see if it is a duplicate code
            if (err.code === 11000){
                res.status(500).json({message: "that guest is already in the database"})
            } else {
                res.status(500).json({message: err})
            };
        // if no errors.
    } else {
            const guestsToAdd = parseInt(req.body.plusOne) + 1;
            console.log(guestsToAdd + "guests to add");
            //push this guest id to the event as a guest 
            Event.findOneAndUpdate(
                {"_id": req.body.eventId},
                {
                    $push: {"guests": doc._id},
                    $inc: {"totalGuest": guestsToAdd}
                },
                {new:true},
                function(error, document){
                    console.log(document + "guests eventsdoc");
                    if (error){
                        res.send(error);
                    } else {
                       res.status(200).json({
                            message: doc
                         }); 
                    }
                }
            )
        };
    });
    
}); 


module.exports = router;