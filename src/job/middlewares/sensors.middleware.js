"use strict";

function sensors() {
  return (next, err, job) => {
    if(err) return next(err);

    job.on('remove', function(){
      console.log('job #' + job.id + ' is remove from queue');
    })
    .on('complete', function(result){
      console.log('job #' + job.id + ' is completed with data ', result);
    })
    .on('failed attempt', function(errorMessage, doneAttempts){
      console.log('job #' + job.id + ' has failed ' +doneAttempts+ ' time(s)', errorMessage);
    })
    .on('failed', function(errorMessage){
      console.log('job #' + job.id + ' has failed', errorMessage);
    })
    .on('progress', function(progress, data){
      console.log('job #' + job.id + ' ' + progress + '% complete with data ', data );
    })
    .on('promotion', function(){
       console.log('job #' + job.id + ' is now promoted from delayed state to queued');
    })
    .on('start', function(){
      console.log('job #' + job.id + ' is now started');
    })
    .on('enqueue', function(){
      console.log('job #' + job.id + ' is now queued' );
    });
    return next(null, job);
  }
}

module.exports = sensors;