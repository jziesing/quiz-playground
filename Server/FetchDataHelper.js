/*
 * @FetchAccountsHelper.js
 */
"use strict";

const { Client } = require('pg');


class FetchDataHelper {

    constructor() {
		// methods
        this.fetchQuizs = this.fetchQuizs.bind(this);
        this.fetchQuiz = this.fetchQuiz.bind(this);
        this.fetchQuizEdit = this.fetchQuizEdit.bind(this);
    }

    fetchQuizs() {
        return new Promise((resolve, reject) => {

            let currclient = new Client({
                connectionString: process.env.DATABASE_URL,
                ssl: true,
            });

            currclient.connect();

            currclient.query('SELECT id, sfid, name, description__c, edit_password__c, picture_url__c FROM Salesforce.quiz__c;', (err, res) => {
                if (err){
                    console.log(err);
                    reject();
                }
                currclient.end();
                resolve(res.rows);
            });
        });

    }

    fetchQuiz(name) {
        console.log('name');
        console.log(name);
        return new Promise((resolve, reject) => {

            let currclient = new Client({
                connectionString: process.env.DATABASE_URL,
                ssl: true,
            });

            let queryString = 'SELECT id, sfid, name, description__c, edit_password__c, picture_url__c FROM salesforce.quiz__c WHERE name=\'' + name + '\';';
            console.log('queryString!!!');
            console.log(queryString);
            currclient.connect();

            currclient.query(queryString, (err, res) => {
                if (err){
                    console.log(err);
                    reject();
                }
                console.log(res);
                currclient.end();
                resolve(res.rows);
            });
        });

    }



    fetchQuizEdit(name, pwd) {
        console.log('name');
        console.log(name);
        return new Promise((resolve, reject) => {

            let currclient = new Client({
                connectionString: process.env.DATABASE_URL,
                ssl: true,
            });

            let queryString = 'SELECT id, sfid, name, description__c, edit_password__c, picture_url__c FROM salesforce.quiz__c WHERE name=\'' + name + '\' AND edit_password__c=\'' + pwd + '\';';
            console.log('queryString!!!');
            console.log(queryString);
            currclient.connect();

            currclient.query(queryString, (err, res) => {
                if(err){
                    console.log(err);
                    reject();
                }
                console.log(res);
                var basic_info = res.rows;
                let questionsQueryStr = 'SELECT id, sfid, name, quiz__c, question__c, correct_answer__c, answer_1__c, answer_2__c, answer_3__c, answer_4__c, answer_5__c, answer_6__c FROM salesforce.quiz_question__c WHERE quiz__c=\'' + basic_info[0].sfid + '\';'
                currclient.query(questionsQueryStr, (errs, ress) => {
                    if(errs){
                        console.log(errs);
                        reject();
                    }
                    currclient.end();
                    resolve({questions: ress.rows, info: basic_info});
                });
            });
        });

    }

}

module.exports = FetchDataHelper;
