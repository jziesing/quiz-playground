import React from 'react';

let ajax = require('superagent');


class EditQuiz extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
            isLoading: true,
            name: '',
			description__c: '',
			edit_password__c: '',
			sfid: '',
			id: '',
            questions: [],
            errormsgs: [],
            successmsg: ''
        };
        this.handleFormBasicChange = this.handleFormBasicChange.bind(this);
		this.handleAddQuestionsFormSubmit = this.handleAddQuestionsFormSubmit.bind(this);
        this.handleBasicFormSubmit = this.handleBasicFormSubmit.bind(this);
	}

	componentWillMount() {
        let fetchQuizEditURL = '/fetch/quiz-edit/' + this.props.params.name + '/' + this.props.params.pwd;
        ajax.get(encodeURI(fetchQuizEditURL))
        	.end((error, response) => {
          		if (!error && response) {
                    console.log(response);
                    console.log(JSON.parse(response.text));
                    let retData = JSON.parse(response.text);
	              	this.setState({
                        isLoading: false,
	                	name: retData.info[0].name,
                        description__c: retData.info[0].description__c,
                        edit_password__c: retData.info[0].edit_password__c,
                        id: retData.info[0].id,
                        sfid: retData.info[0].sfid,
                        questions: retData.questions
	            	});
          		} else {
              		console.log(`Error fetching data`, error);
                    this.setState({isLoading: false});
          		}
        	});
	}

	handleFormBasicChange(event) {
		console.log(this.state);
        switch(event.target.id) {
            case 'name':
                this.setState({name: event.target.value});
                break;
			case 'description__c':
                this.setState({description__c: event.target.value});
                break;
			case 'edit_password__c':
                this.setState({edit_password__c: event.target.value});
                break;
        }
	}
    validateForm() {
		let retBool = true;
		let currErrMsgs = [];

		if(this.state.name.length < 4) {
			currErrMsgs.push('Quiz Name is too short');
			retBool = false;
		}
		if(this.state.description.length < 6) {
			currErrMsgs.push('Quiz Description is too short');
			retBool = false;
		}
		if(this.state.quiz_pwd.length < 6) {
			currErrMsgs.push('Quiz Password is too short');
			retBool = false;
		}
		this.setState({errormsgs: currErrMsgs});

		return retBool;
	}
	handleBasicFormSubmit(event) {
        event.preventDefault();
		this.setState({isLoading: true});
		if(this.validateForm()) {
			let newQuizBasicURL = '/new/quiz/basic';
			ajax.post(newQuizBasicURL)
				.set({ 'Content-Type': 'application/json' })
				.send({
					name: this.state.name,
					description__c: this.state.description,
					edit_password__c: this.state.quiz_pwd
				}).end((error, response) => {
                    if(!error && response.status == 200) {
                        console.log('success');
                        console.log(JSON.parse(response.text));
						let rettData = JSON.parse(response.text);

						let redirUrl = '/edit/' + rettData[0].name + '/' + rettData[0].edit_password__c;
						this.setState({
                            isLoading: false,
                            name: '',
							description: '',
							quiz_pwd: '',
							successmsg: 'Success! Now add your questions.',
				            errormsgs: []
						});
						browserHistory.push(encodeURI(redirUrl));
                    } else {
                        console.log('fail');
                        console.log(error);
                        this.setState({
                            isLoading: false,
                            name: '',
							description: '',
							quiz_pwd: '',
							successmsg: '',
                            errormsg: ['something went wrong, please try again.']
						})
                    }
                });
		} else {
			// this.addErrors();
			this.setState({isLoading: false});
		}
	}

	handleAddQuestionsFormSubmit(event) {
        event.preventDefault();
		this.setState({isLoading: true});

		var formData = new FormData();
        var files = document.getElementById("questionsFile").files;
        formData.append("questions", files[0]);

		let addQsURL = '/new/questions/' + this.state.name + '/' +  this.state.edit_password__c;

        ajax.post(encodeURI(addQsURL))
			.set('quiz_name', this.state.name)
			.set('sfid', this.state.sfid)
			.set('edit_password__c', this.state.edit_password__c)
			.set('pg_id', this.state.id)
			.send(formData)
			.end((err, response) => {
				console.log(err, response);
				if(err) {
					console.log('err');
					console.log(err);
				} else {
					console.log('Succeessss');
					console.log(response);
				}
				this.setState({isLoading: false})
        });
	}

    msgMarkup() {
        if(this.state.errormsgs.length > 0) {
            return this.state.errormsgs.map((dat, index) => {
				return (
					<div key={index} class="alert alert-danger" role="alert">
	                    {dat}
	                </div>
				);
			});
        } else if(this.state.successmsg != '') {
            return (
                <div class="alert alert-success" role="alert">
                    { this.state.successmsg }
                </div>
            );
        }
    }

	render() {

        if(this.state.isLoading) {
			return (
				<form class="form-horizontal" action="">
					<div class="col-sm-offset-4 col-sm-4">
						<i class="fa fa-spinner fa-spin loadingCon" />
					</div>
				</form>
			);
		} else {
            return (
    			<div>
    				<div class="row">
    	                <div class="text-center">
    	                    <h1>Edit Quiz</h1>
    	                </div>
    		    	</div>
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="row editRow">
                                    <div class="col-xs-6">
                                        <div class="text-left">
                                            <h2>Add Questions</h2>
                                        </div>
                                        <div class="text-left">
                                            <p>format:</p>
                                            <ul>
                                                <li>file format = JSON</li>
                                                <li>object properties</li>
                                                <ul>
                                                    <li>questions = array of objects</li>
                                                    <li>question = string</li>
                                                    <li>correct_answer = array of ints (index of answers array)</li>
                                                    <li>answer = array of strings (possible answers up to 6)</li>
                                                </ul>
                                            </ul>
                                            <pre>{`{
    questions: [{
        question: 'What color is the sky?',
        correct_answer: [ 1 ],
        answers: ['red', 'blue']
    }]
}`}
                                            </pre>
                                        </div>
                                    </div>
                                    <div class="col-xs-6">
										<div class="text-right">
											<form class="form-horizontal" action="" onSubmit={this.handleAddQuestionsFormSubmit}>
												<div class="form-group">
													<label for="exampleInputFile">File input</label>
													<input type="file" name="questions" id="questionsFile" accept=".json" />
													<p class="help-block">Use file format on the left.</p>
												</div>
												<button type="submit" class="btn btn-default">Submit</button>
											</form>
										</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-12">
                                <div class="row editRow">
                                    <div class="col-xs-6">
                                        <div class="text-left">
                                            <h2>Current Questions</h2>
                                        </div>
                                    </div>
                                    <div class="col-xs-6">
                                        <div class="text-left">
                                            <h2>{this.state.questions.length} questions</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-12">
                                <div class="row editRow">
                                    <div class="col-xs-6">
                                        <div class="text-left">
                                            <h2>Basic Info</h2>
                                        </div>
                                    </div>
                                    <div class="col-xs-6">
                                        <div class="row">
                                            <div class="text-center">
                                                { this.msgMarkup() }
                                            </div>
                                        </div>
                                        <form class="form-horizontal" action="" onSubmit={this.handleBasicFormSubmit}>
                                            <div class="form-group">
                                                <label for="message" class="col-sm-2 control-label">Quiz Name</label>
                                                <div class="col-sm-10">
                                                    <input type="text" class="form-control" id="name" placeholder="quiz name" onChange={this.handleFormBasicChange} value={this.state.name} />
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="message" class="col-sm-2 control-label">Quiz Description</label>
                                                <div class="col-sm-10">
                                                    <textarea rows="4" type="text" class="form-control" id="description" placeholder="quiz description" onChange={this.handleFormBasicChange} value={this.state.description__c} ></textarea>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="message" class="col-sm-2 control-label">Quiz Admin Password to Edit</label>
                                                <div class="col-sm-10">
                                                    <input type="text" class="form-control" id="quiz_pwd" placeholder="quiz admin password" onChange={this.handleFormBasicChange} value={this.state.edit_password__c} />
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <div class="col-sm-offset-2 col-sm-10">
                                                    <button type="submit" class="btn btn-cSend">Save</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
    		    	</div>
    			</div>
    		);
        }


	}
}

export default EditQuiz;
