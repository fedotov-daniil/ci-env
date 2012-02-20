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
    Artifact = new Schema({
        tags : [Tag],
        publisher : String,
        config : {}
    }),
    Task = new Schema({
        title : String,
        type : String,
        config : {}
    }),
    Job = new Schema({
        title : String,
        tasks : [Task],
        repo : Repo,
        tags : [Tag],
        artifacts : [Artifact],
        is_parallel : Boolean
    }),
    Stage = new Schema({
        title:String,
        jobs:[Job]
    }),
    ProjectSettings = new Schema({

    }),
    Project = new Schema({
        title:String,
        stages:[Stage],
        settings : ProjectSettings
    }),
    Runner = new Schema({
        type : String,
        config : {}
    });
