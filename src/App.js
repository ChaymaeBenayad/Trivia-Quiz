import "./App.css";
import Question from "./components/Question";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Form from "./components/Form";

function App() {
  const [startQuiz, setStartQuiz] = useState(false);
  const [triviaData, setTriviaData] = useState([]);
  const [formData, setFormData] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [count, setCount] = useState(0);
  //put answers in a random order
  const shuffledAnswers = (answers) => answers.sort(() => 0.5 - Math.random());

  const { questionNumber, questionCategory, questionDifficulty, questionType } =
    formData;
  //fetch data from https://opentdb.com/api_config.php
  useEffect(() => {
    async function getData() {
      const res = await fetch(
        `https://opentdb.com/api.php?amount=${questionNumber}&category=${questionCategory}&difficulty=${questionDifficulty}&type=${questionType}`
      );
      const data = await res.json();
      setTriviaData(
        data.results.map((item) => {
          //data reconstruction
          return {
            id: nanoid(),
            question: item.question,
            answers: shuffledAnswers([
              {
                text: item.correct_answer,
                isCorrect: true,
                isSelected: false,
              },
              ...item.incorrect_answers.map((answer) => ({
                text: answer,
                isCorrect: false,
                isSelected: false,
              })),
            ]),
            getScore: false,
          };
        })
      );
    }
    getData();
  }, [
    count,
    questionNumber,
    questionCategory,
    questionDifficulty,
    questionType,
  ]);

  function handleFormChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  function startTriviaQuiz(e) {
    e.preventDefault();
    setStartQuiz((prevState) => !prevState);
  }

  // Check to see if an answer has been selected
  function selectAnswer(questionId, answerText) {
    setTriviaData((oldData) => {
      const newTriviaData = oldData.map((question) => {
        if (questionId === question.id) {
          const newAnswersArray = question.answers.map((answer) => {
            if (answerText === answer.text) {
              return { ...answer, isSelected: true };
            }
            return { ...answer, isSelected: false };
          });
          const newQuestion = { ...question, answers: newAnswersArray };
          return newQuestion;
        }
        return question;
      });
      return newTriviaData;
    });
  }

  //checks to see if the selected answer is correct
  function checkAnswers() {
    setTriviaData((oldData) => {
      const newTriviaData = oldData.map((question) => {
        const selectedAnswer = question.answers.find(
          (answer) => answer.isSelected
        );
        if (selectedAnswer && selectedAnswer.isCorrect) {
          const rightAnswer = { ...question, getScore: true };
          return rightAnswer;
        }
        const wrongAnswer = { ...question, getScore: false };
        return wrongAnswer;
      });
      return newTriviaData;
    });
    setShowAnswers(true);
  }

  //array of correct answers
  const correctAnswers = triviaData.filter((question) => question.getScore);

  //runs when new quiz is clicked
  function newQuiz() {
    setStartQuiz(false);
    setShowAnswers(false);
    setCount((count) => count + 1);
  }

  const questionElements = triviaData.map((elem) => (
    <Question
      key={elem.id}
      id={elem.id}
      question={elem.question}
      answers={elem.answers}
      selectAnswer={selectAnswer}
      showAnswers={showAnswers}
    />
  ));
  //render UI elements
  return (
    <main>
      {!startQuiz ? (
        <div className="start-page">
          <h1 className="title">Trivia Quiz</h1>
          <Form
            questionsNumber={questionNumber}
            questionsDifficulty={questionDifficulty}
            questionsCategory={questionCategory}
            questionsType={questionType}
            handleSubmit={startTriviaQuiz}
            handleFormChange={handleFormChange}
          />
        </div>
      ) : (
        <div className="questions--container">
          {questionElements}
          <div className="score--container">
            {showAnswers && (
              <h3>
                You got {correctAnswers.length}/{triviaData.length} correct
                answers !
              </h3>
            )}
            <button
              className="btn check--button"
              onClick={showAnswers ? newQuiz : checkAnswers}
            >
              {showAnswers ? "New Quiz" : "Check Answers"}!
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
