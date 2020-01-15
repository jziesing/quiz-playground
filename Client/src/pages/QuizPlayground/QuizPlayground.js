import React from 'react';

import {Link} from 'react-router';
let ajax = require('superagent');


class QuizPlayground extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
            quizs: [],
            searchQuizs: [],
            searchString: ''
        };
        // methods
        this.handleSearchChange = this.handleSearchChange.bind(this);
	}

    componentWillMount() {
        let fetchAccountsURL = '/fetch/quizs/';
        ajax.get(fetchAccountsURL)
        	.end((error, response) => {
          		if (!error && response) {
                    console.log(JSON.parse(response.text));
	              	this.setState({
	                	quizs: JSON.parse(response.text),
                        searchQuizs: JSON.parse(response.text)
	            	});
          		} else {
              		console.log(`Error fetching data`, error);
          		}
        	});
  	}

    handleSearchChange(e) {
        this.setState({ searchString: e.target.value });
    }

    renderQuizs() {
        //
        // 0 = open row, 1 = close row
        var tagFlag = 0;
        var retArr = [];

        for(var i=0; i<this.state.searchQuizs.length; i = i + 2){
            var urlReadyStr1 = '/view/' + encodeURI(this.state.searchQuizs[i].name);

            if(typeof(this.state.searchQuizs[i + 1]) == 'undefined') {
                retArr.push((<div key={i} class="row"><Link to={urlReadyStr1}><div key={i} class="col-xs-6 quiz-col">{this.state.searchQuizs[i].name}</div></Link></div>));
            } else {
                var urlReadyStr2 = '/view/' + this.state.searchQuizs[i + 1].name.replace(/\s+/g, '-').toLowerCase();
                retArr.push((<div key={i} class="row"><Link to={urlReadyStr1}><div key={i} class="col-xs-6 quiz-col">{this.state.searchQuizs[i].name}</div></Link><Link to={urlReadyStr2}><div key={i + 1} class="col-xs-6 quiz-col">{this.state.searchQuizs[i + 1].name}</div></Link></div>));
            }

        }

        return retArr;
    }

	render() {


        let renderQuizsMarkup;

        let searchString = this.state.searchString.trim().toLowerCase();

        if(searchString.length > 0){
            this.state.searchQuizs = this.state.quizs.filter(function(l){
                return String(l.name).toLowerCase().match(searchString);
            });
        } else {
            this.state.searchQuizs = this.state.quizs;
        }

        renderQuizsMarkup = this.renderQuizs();
        console.log(renderQuizsMarkup);
		return (
			<div>
				<div class="row">
	                <div class="text-center">
	                    <h1>Quiz Playground</h1>
	                </div>
		    	</div>
                <div class="row">
                    <div class="input-group">
                        <span class="input-group-addon" id="basic-addon1">Search</span>
                        <input type="text" class="form-control" value={this.state.searchString} onChange={this.handleSearchChange} placeholder="Quiz's" aria-describedby="basic-addon1" />
                    </div>
                </div>
                <div class="container-fluid quizArea">
                    {renderQuizsMarkup}
                </div>

            </div>
		);
	}
}

export default QuizPlayground;
