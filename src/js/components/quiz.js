var $ = require('jquery');
var React = require('react');

var Question = require('./question.js');


var Quiz = React.createClass({

  getInitialState: function(){
    return {
      quiz: {},
      user_answers: [],
      step: 0
    }
  },

  componentDidMount: function(){
    $.getJSON("./assets/quiz.json", function(result) {
      this.setState({quiz: result});
    }.bind(this))
  },

  nextStep: function(){
    this.setState({step: (this.state.step + 1)});
  },

  setAnswer: function(event){
    this.state.user_answers[this.state.step] = this.state.user_answers[this.state.step] || [];
    this.state.user_answers[this.state.step][parseInt(event.target.value)] = event.target.checked;
  },

  isAnswerRight: function(index){
    var result = true;
    Object.keys(this.state.quiz.questions[index].answers).map(function(value, answer_index){
      var answer = this.state.quiz.questions[index].answers[value]
      if (!this.state.user_answers[index] || (answer.is_right != (this.state.user_answers[index][value] || false))) {
        result = false;
      }
    }.bind(this));
    return result;
  },

  computeScore: function(index){
    var score = 0
    Object.keys(this.state.quiz.questions).map(function(value, index){
      if (this.isAnswerRight(parseInt(value))) {
        score = score + 1;
      }
    }.bind(this));
    return score;
  },

  renderResult: function(){
    var result = Object.keys(this.state.quiz.questions).map(function(value, index){
      if (this.isAnswerRight(value)) {
        return (
          <div>{"Question " + index + ": You were right!"}</div>
        )
      } else {
        return (
          <div>{"Question " + index + ": You were wrong!"}</div>
        )
      }
    }.bind(this));
    return (
      <div>
        <h3>Results</h3>
        <div>
          {this.computeScore()}/{this.state.quiz.questions.length}
        </div>
        <div>
          <h3>Your answers</h3>
            {result}
        </div>
      </div>
   );
  },

  render: function(){
    if (!this.state.quiz.questions) {return <div></div>}
    return (
      <div>
        <h1>{this.state.quiz.title}</h1>
        {(this.state.step < this.state.quiz.questions.length
          ? (<Question
                id={this.state.step}
                data={this.state.quiz.questions[this.state.step]}
                validateAnswers={this.nextStep}
                setAnswer={this.setAnswer}/>)
          : (<div>{this.renderResult()}</div>)
        )}
      </div>
    )
  }
});

module.exports = Quiz;
