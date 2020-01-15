import React from 'react';

let ajax = require('superagent');


class NewQuiz extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
            isLoading: true,
            name: '',
			description: '',
			quiz_pwd: '',
            errormsgs: [],
            successmsg: ''
        };
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	componentWillMount() {
		this.setState({isLoading: false});
	}

	handleFormChange(event) {
		console.log(this.state);
        switch(event.target.id) {
            case 'name':
                this.setState({name: event.target.value});
                break;
			case 'description':
                this.setState({description: event.target.value});
                break;
			case 'quiz_pwd':
                this.setState({quiz_pwd: event.target.value});
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
	handleFormSubmit(event) {
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
                        console.log(response);
						this.setState({
                            isLoading: false,
                            name: '',
							successmsg: 'Success! Now add your questions.',
                            errormsg: ''
						});
                    } else {
                        console.log('fail');
                        console.log(error);
                        this.setState({
                            isLoading: false,
                            name: '',
							successmsg: '',
                            errormsg: 'something went wrong, please try again.'
						})
                    }
                });
		} else {
			// this.addErrors();
			this.setState({isLoading: false});
		}
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
	markup() {
		if(this.state.isLoading) {
			return (
				<form class="form-horizontal" action="">
					<div class="col-sm-offset-4 col-sm-4">
						<i class="fa fa-spinner fa-spin loadingCon" />
					</div>
					<div class="form-group">
						<div class="col-sm-offset-2 col-sm-10">
							<button type="submit" class="btn btn-cSend disabled">Save &amp; Next</button>
						</div>
					</div>
				</form>
			);
		} else {
			return (
				<form class="form-horizontal" action="" onSubmit={this.handleFormSubmit}>
                    <div class="form-group">
                        <label for="message" class="col-sm-2 control-label">Quiz Name</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="name" placeholder="quiz name" onChange={this.handleFormChange} value={this.state.name} />
                        </div>
                    </div>
					<div class="form-group">
                        <label for="message" class="col-sm-2 control-label">Quiz Description</label>
                        <div class="col-sm-10">
                            <textarea rows="4" type="text" class="form-control" id="description" placeholder="quiz description" onChange={this.handleFormChange} value={this.state.description} ></textarea>
                        </div>
                    </div>
					<div class="form-group">
                        <label for="message" class="col-sm-2 control-label">Quiz Picture</label>
                        <div class="col-sm-10">
                            <input type="file" name="quizPic" id="quizPic"  />
                        </div>
                    </div>
					<div class="form-group">
                        <label for="message" class="col-sm-2 control-label">Quiz Admin Password to Edit</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="quiz_pwd" placeholder="quiz admin password" onChange={this.handleFormChange} value={this.state.quiz_pwd} />
                        </div>
                    </div>
					<div class="form-group">
						<div class="col-sm-offset-2 col-sm-10">
							<button type="submit" class="btn btn-cSend">Save &amp; Next</button>
						</div>
					</div>
				</form>
			);
		}
	}

	render() {


		return (
			<div>
				<div class="row">
	                <div class="text-center">
	                    <h1>Add a new Quiz</h1>
	                </div>
		    	</div>
				<div class="row">
	                <div class="text-center">
	                    { this.msgMarkup() }
	                </div>
		    	</div>
				{ this.markup() }
			</div>
		);
	}
}

export default NewQuiz;
