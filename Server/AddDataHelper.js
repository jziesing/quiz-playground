/*
 * @AddDataHelper.js
 */
"use strict";


let { Client } = require('pg'),
    multer = require('multer'),
    multerS3 = require('multer-s3'),
    AWS = require("aws-sdk"),
    Kafka = require('no-kafka');

var s3  = new AWS.S3({
  accessKeyId: process.env.HDRIVE_S3_ACCESS_KEY,
  secretAccessKey: process.env.HDRIVE_S3_SECRET_KEY,
  region: 'us-east-1'
});

var producer = new Kafka.Producer({
    connectionString: process.env.KAFKA_URL,
    ssl: {
        cert: process.env.KAFKA_CLIENT_CERT,
        key: process.env.KAFKA_CLIENT_CERT_KEY
    }
});

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'quiz-playground',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            var filePathAndName = 'quizs/' + req.headers.pg_id + '/questions__' + new Date().toJSON().replace(/-/g,'_').replace(/:/g,'-').replace(/\./g,'--')  + '.json';
            req.headers['file_path_s'] = filePathAndName;
            cb(null, filePathAndName);
        }
    })
}).array('questions', 1);



class AddDataHelper {

    constructor() {
		// methods
        this.addQuizBasicInfo = this.addQuizBasicInfo.bind(this);
        this.addQuestions =  this.addQuestions.bind(this);
    }

    addQuizBasicInfo(basic_info) {
        return new Promise((resolve, reject) => {

            let currclient = new Client({
                connectionString: process.env.DATABASE_URL,
                ssl: true,
            });
            console.log('basic_info');
            console.log(basic_info);

            currclient.connect();

            currclient.query('INSERT INTO salesforce.quiz__c(name, description__c, edit_password__c) VALUES($1, $2, $3) RETURNING *;', [basic_info.name, basic_info.description__c, basic_info.edit_password__c],(err, res) => {
                if(err) {
                    reject();
                }

                console.log('csccc');
                console.log(process.env.HDRIVE_S3_SECRET_KEY);

                s3.putObject({
                    Key: 'quizs/' + res.rows[0]["id"] + '/info',
                    Bucket: 'quiz-playground',
                    Body:  Buffer.from('quiz name: ' + res.rows[0]["name"] + ',  password: ' + res.rows[0]["edit_password__c"], 'utf8')
                }, (errorr, data) => {
                    if(errorr) {
                        console.log('s3 errr');
                        reject(errorr);
                    } else {
                        console.log('s3 successs');
                        console.log(data);
                        currclient.end();
                        resolve(res.rows);
                    }
                });
            });
        });

    }


    addQuestions(req, res) {

        return new Promise((resolve, reject) => {

            upload(req, res, function(err) {
                if(err) {
                    console.log('upload errrorrr');
                    console.log(err);
                    reject(err);
                } else {
                    console.log('upload success');
                    console.log(req.headers['file_path_s']);
                    // add sfid of quiz
                    let msgData = {
                        file_path: req.headers['file_path_s'],
                        quiz_sfid: req.headers['sfid']
                    }
                    producer.init().then(function() {
                        producer.send({
                            topic: 'potomac-66595.add_qs_ms',
                            partition: 0,
                            message: {
                                value: JSON.stringify(msgData)
                            }
                        });
                    }).then(function(result) {
                        console.log('kafka result');
                        console.log(result);
                        resolve(result);
                    });
                }
            });

        });
    }

}

module.exports = AddDataHelper;
