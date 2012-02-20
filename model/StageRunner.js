
var mongoose = require('mongoose'),
    Stage = mongoose.model('Stage', StageSchema),
    Job = mongoose.model('Job', JobSchema);



var events = require('events'),
    util = require('util');

var Runner = function(){
    events.EventEmitter.call(this);
};
util.inherits(Runner, events.EventEmitter);

var RunData = function(jobs){
    this.jobs = jobs;
};

RunData.prototype.getRunner = function(job){
    var runner;
    while(runner = Runner.getNext()){
        if (runner.canRun(job)){
            return runner;
        }
    }
};

RunData.prototype.registerRunner = function(runner){
    var stop = function(result){
        runner.removeAllListeners('stop');
        this.onStop(result);
    };
    runner.on('stop', stop);
};



RunData.prototype.onStop = function(result){

    //TODO: on stop postprocess
    this.releaseJob(result.job);

    if (result.error){
        //TODO: on error
        this.stopBuild();
    }

    if (this.hasJobsLeft()){
        this.runJobs();
    }

};

RunData.prototype.runJobs = function(){
    var jobsCount = this.jobs.length,
        i = 0,
        job,
        runner;

    for (i; i < jobsCount;i++){
        job = this.jobs[i];
        if (this.canRun(job) &&
            (runner = this.getRunner(job)))
        {
            this.registerRunner(runner);
            this.registerJob(job);
            runner.run(job);
        }
    }
};

