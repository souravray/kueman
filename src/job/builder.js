"use strict";

const { save } = require('./middelwares') 

class JobBuilder {
  constructor(queue, jobName) {
    // initialize Job Builder object with isFinalized False
    this.isFinalized = false;

    this.queue = queue;
    this.jobName =  jobName;
    this.payloads =[];

    this.use(function(next) {
      // Prevent  middleware pipeline to accept payloads before finalizing
      if(!this.isFinalized) return next( Error('Builder is not finalized'));

      let payload = this.payloads.shift();
      if(typeof payload === "undefined") return next( Error('No payload available'));

      let job = this.queue.create(this.jobName, payload);
      next(null, job)
    })
  }
  
  finalize() {
    // set save as the final endpoint of the middleware pipeline
    this.use(save());
    this.isFinalized = true;
    return this;
  }

  add(payload) {
    this.payloads.push(payload);
    return this;
  }

  use(fn) {
    // once finalized no middileware can be added to the pipeline
    if(this.isFinalized) return next( Error('Cannot add middlewares after finalize'));

    this.run = ( stack => next => 
      stack(fn.bind(this,next.bind(this)))
    )(this.run);
    return this;
  }

  run(next) { next(); }
}

// factory method
function create(queue, jobName) {
  return new JobBuilder(queue, jobName);
}

module.exports = create;
