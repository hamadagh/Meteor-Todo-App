import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const AllUsers = new Mongo.Collection("allUsers");

if (Meteor.isServer) {
  Meteor.publish("allUsers", function usersPublication() {
    return Meteor.users.find({}, { fields: { username: 1, emails: 1 } });
  });
}
