var Runner = function () {
};
Runner.prototype = {
    canRun:function (job) {
        return true;
    },
    run:function (job, callback) {
        var result;

        callback(result);
    },
    reserve:function (reserved) {
        this.reserved = reserved;
    },
    getNext:function () {
        return Runner.find({reserved:false});
    }
};


var JobStatus = {'queued':0, 'running':1, 'stopped':2};
Object.freeze(JobStatus);

var StageRunner = function (jobs, onSuccess, onFail) {
    this.jobs = jobs;
    this.jobs.map(function (job) {
        job.status = JobStatus.queued;
    });
    this.onSuccess = onSuccess;
    this.onFail = onFail;
};

StageRunner.prototype = {

    getRunner:function (job) {
        var runner;
        while (runner = Runner.prototype.getNext()) {
            runner.reserve(true);
            if (runner.canRun(job)) {
                return runner;
            }
            else {
                runner.release(false);
            }
        }
    },
    hasJobsLeft:function () {
        return this.jobs.some(function (job) {
            return job.status === JobStatus.queued;
        });
    },
    isFinished:function () {
        return this.jobs.every(function (job) {
            return job.status === JobStatus.stopped;
        });
    },
    canRun:function (job) {
        return job.status === JobStatus.queued &&
            (job.is_parallel ||
                !this.jobs.some(function (job) {
                    return job.status === JobStatus.running;
                }));
    },

    onStop:function (result) {

        //TODO: on stop postprocess
        result.job.status = JobStatus.stopped;

        if (result.error) {
            //TODO: on error
            this.onFail(result.error);
        }

        if (this.hasJobsLeft()) {
            this.runJobs();
        }
        if (this.isFinished()) {
            this.onSuccess();
        }

    },
    runJobs:function () {
        var jobsCount = this.jobs.length,
            i = 0,
            job,
            runner;

        for (i; i < jobsCount; i++) {
            job = this.jobs[i];
            if (this.canRun(job) &&
                (runner = this.getRunner(job))) {
                job.status = JobStatus.running;
                runner.run(job, this.onStop.bind(this));
            }
        }
    }
};


