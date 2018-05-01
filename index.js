const program = require('commander');
const fs = require('fs');
const kue  = require('kue');

var assert = require('assert');
assert.throws(
  function() {
    throw new Error("Wrong value");
  },
  function(err) {
    if ( (err instanceof Error) && /value/.test(err) ) {
      return true;
    }
  },
  "unexpected error"
);

program
  .version('0.0.1')
  .option('-i, --input <input>', 'JSNO payload for job(s)', '')
  .option('-j, --job <job>', 'Job name', '')
  .option('-q, --queue <queue>', 'Give a que prefix', '')
  .option('-h, --host <host>', 'Redis host name', '')
  .option('-p, --port <port>', 'Redis port name', '')
  .option('-a, --auth <auth>', 'Redis password', '')
  .parse(process.argv);

assert.notStrictEqual(program.input, '');
const filePath = program.input;

assert.notStrictEqual(program.job, '');
const jobName = program.job;


// Kue options
var options = {
 
};

if(program.port !== '' && program.host !== '') {
  Object.assign(options, { redis: {
    port: program.port,
    host: program.host
  }}) ;
}

if(program.auth !== '') {
  options.redis.auth = program.auth;
}

if(program.queue !== '') {
  options.prefix = program.queue;
}

// create kue 
const queue = kue.createQueue(options);

// create post method
var post = (payload) => {
  let job = queue.create(jobName, payload)
                .save( function(err){
                     if( !err ) console.log( job.id );
                  });
  return job;
}

// execute payload from file
fs.readFile(filePath, (err, data) => {  
    let obj = JSON.parse(data);
    if( Array.isArray(obj)) {
      obj.forEach((job) => {
        post(job);
      })
    } else if(typeof obj ===  'object') {
       post(obj);
    } else {
      console.log('no job payload found');
    }
});
