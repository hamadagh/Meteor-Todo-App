import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ReactiveDict } from "meteor/reactive-dict";

import { Tasks } from "../api/tasks";
import { AllUsers } from "../api/tasks";

import "./task.js";
import "./body.html";

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe("tasks");
  Meteor.subscribe("allUsers");
});

Template.body.helpers({
  frontendTasks() {
    const instance = Template.instance();
    if (instance.state.get("hideCompleted")) {
      // If hide completed is checked, filter tasks
      return Tasks.find(
        { checked: { $ne: true }, selection: { $eq: "Frontend" } },
        { sort: { createdAt: -1 } }
      );
    }
    // Otherwise, return all of the tasks
    return Tasks.find(
      { selection: { $eq: "Frontend" } },
      { sort: { createdAt: -1 } }
    );
  },
  backendTasks() {
    const instance = Template.instance();
    if (instance.state.get("hideCompleted")) {
      // If hide completed is checked, filter tasks
      return Tasks.find(
        { checked: { $ne: true }, selection: { $eq: "Backend" } },
        { sort: { createdAt: -1 } }
      );
    }
    // Otherwise, return all of the tasks
    return Tasks.find(
      { selection: { $eq: "Backend" } },
      { sort: { createdAt: -1 } }
    );
  },
  designTasks() {
    const instance = Template.instance();
    if (instance.state.get("hideCompleted")) {
      // If hide completed is checked, filter tasks
      return Tasks.find(
        { checked: { $ne: true }, selection: { $eq: "Design" } },
        { sort: { createdAt: -1 } }
      );
    }
    // Otherwise, return all of the tasks
    return Tasks.find(
      { selection: { $eq: "Design" } },
      { sort: { createdAt: -1 } }
    );
  },

  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
  users() {
    return Meteor.users.find();
    console.log(Meteor.users.find());
  },
});

Template.body.events({
  "submit .new-task"(event) {
    event.preventDefault();

    const target = event.target;
    const text = target.text.value;
    const selection = target.select.value;

    if (text !== "") {
      Meteor.call("tasks.insert", text, selection);

      target.text.value = "";
    }
  },
  "change .hide-completed input"(event, instance) {
    instance.state.set("hideCompleted", event.target.checked);
  },
  "change .show-frontend-tasks input"(event, instance) {
    instance.state.set("showFrontendTasks", event.target.checked);
  },
  "change .show-backend-tasks input"(event, instance) {
    instance.state.set("showBackendTasks", event.target.checked);
  },
  "change .show-design-tasks input"(event, instance) {
    instance.state.set("showDesignTasks", event.target.checked);
  },
});
