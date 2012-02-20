
var mongoose = require('mongoose'),
    Project = mongoose.model('Project', ProjectSchema);

Project.prototype.run = function(runData){
    var i = 0,
        stageCount = this.stages.length,
        stage;
    for (i; i < stageCount; i++){
        stage = this.stages[i];
        stage.run(runData);
    }
};