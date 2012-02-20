var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Tag = {
        name : String
    },
    Repo = {
        type : String,
        local : String,
        remote : String,
        config : {}
    },
    ArtifactSchema = new Schema({
        tags : [Tag],
        publisher : String,
        config : {}
    }),
    TaskSchema = new Schema({
        title : String,
        type : String,
        config : {}
    }),
    JobSchema = new Schema({
        title : String,
        tasks : [TaskSchema],
        repo : Repo,
        tags : [Tag],
        artifacts : [ArtifactSchema],
        is_parallel : Boolean
    }),
    StageSchema = new Schema({
        title:String,
        jobs:[JobSchema]
    }),
    ProjectSettingsSchema = new Schema({

    }),
    ProjectSchema = new Schema({
        title:String,
        stages:[StageSchema],
        settings : ProjectSettingsSchema
    }),
    RunnerSchema = new Schema({
        type : String,
        config : {}
    });
