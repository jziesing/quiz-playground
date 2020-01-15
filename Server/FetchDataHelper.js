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

}

module.exports = FetchDataHelper;
