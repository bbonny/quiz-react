React quizz component example
=============================
This is a quick tutorial showing how you can fastly develop a simple and reusable component using ReactJS.

![alt text](https://github.com/bbonny/quiz-react/blob/master/src/assets/head.png "Head")

----------


The need
-------------

We want a component that can display a quiz.

We need to display a question, allow the user to select one or more answers, validate its answers and go to the next question.

After all questions have been answered we'd like to inform the user of its score and list the questions where he was right or false.

Quiz data (quiz title, questions and answers) can be fetched from an api returning a formated json (we'll use a local json file for the tutorial).

The way
-------------

ReactJs components must define a render method which returns the html they have to display depending on their properties and state.

For our case we will split our component in two component: a main component ```Quiz``` representing the whole quiz and a stateless ```Question``` component. The ```Quiz``` component state will contains: quiz data, user answers and current question to display properties will not be used as our component is standalone.
```Question``` component properties will be: question id, question data and two callback methods: one to add an answer choice and one to validate all choices (and go to the next question).

We first create an empty React Quiz component and export it:
```javascript
var React = require('react');
var $ = require('jquery'); // We will need it later to get the quiz JSON
var Quiz = React.createClass({
});
module.exports = Quiz;
```

Then state is initiated as follow:
```javascript
  getInitialState: function(){
    return {
      quiz: {},
      user_answers: [],
      step: 0
    }
  },
```
```quiz``` is an object that will contain quiz data, user_answers will evolve when user add its choices to questions. Step indicates the current question it's initializated to 0.

Now we need to load quiz data from a json file and update the state consequently. For this we'll use the componentDidMount method which is called just after the initial render.
When state is updated render method is called again. This time with quiz data.
```javascript
  componentDidMount: function(quizId){
    $.getJSON("./assets/quiz.json", function(result) {
      this.setState({quiz: result});
    }.bind(this))
  },
```
Quiz data is a json formated as follow:
```json
{
  "title": "Quiz title",
  "questions": [
    {"question": "What is the first question?",
     "answers": [
        {
          "is_right": true,
          "value": "This one"
        },
        {
          "is_right": false,
          "value": "The next one"
        },
        ...
     ]
    }
    ...
  ]
}
```

Our component has all data it needs to display a quiz. We can add a few methods to make it alive: go to the next question, add a user answer, redo the quiz, compute the current score:
```javascript
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
```

Finaly we can write the render method. We want our component to display two types of screen; a question with its available answer and the result of a quiz session. Our main render call one of them depending of the current state:
```javascript
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
```

Question component simply defines a render method using properties given by Quie component and calling callbacks when user interacts:
```javascript
var React = require('react');

var Question = React.createClass({
  propTypes: {
    setAnswer: React.PropTypes.func,
    validateAnswers: React.PropTypes.func,
    data: React.PropTypes.obj
  },

  render: function(){
    var answersNodes = Object.keys(this.props.data.answers).map(function(value, index){
      return (
        <div>
          <input
            id={"answer-input-" + index}
            type="checkbox"
            value={value}
            onChange={this.props.setAnswer}
            defaultChecked={false}
          />
          <label htmlFor={"answer-input-" + index}>
            {(parseInt(index) + 1) + ": " + this.props.data.answers[index].value}
          </label>
        </div>
      )
    }.bind(this));

    return (
      <div>
        <h4>{(parseInt(this.props.id) + 1) + ": " + this.props.data.question}</h4>
        <form>
          {answersNodes}
          <br/>
          <button type="button" onClick={this.props.validateAnswers}>
              Validate answer
          </button>
        </form>
      </div>
    );
  }
});
module.exports = Question;
``` 

And renderResult call isAnswerRight method to list result for each question:
```javascript
 renderResult: function(){
    var result = Object.keys(this.state.quiz.questions).map(function\
(value, index){
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
```

Instalation
-------------

You can localy install the project on your computer.
Requirements: npm must be installed on your computer, you can use httpster to serve the files.

```
git clone git@github.com:bbonny/quiz-react.git
cd quiz-react
npm install
./node_modules/gulp/bin/gulp.js
```

And then in an other shell launch httpster:
```
cd quiz-react/dist
httpster
```
Now you can access the quiz localy: http://localhost:3333
