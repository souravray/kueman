function save() {
  return (next, err, job) => {
    if(err) return next(err);

    job.save( err => {
      if(err) return next(err);

      // if no error return the job
      return next(null, job);
    })
  }
}

module.exports = save;