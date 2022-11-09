import Answer from "./Answer";
import { decode } from "html-entities";
import { nanoid } from "nanoid";

export default function Question(props) {
  const answerBtns = props.answers.map((answer) => (
    <Answer
      key={nanoid()}
      id={props.id}
      answer={answer}
      selectAnswer={props.selectAnswer}
      showAnswers={props.showAnswers}
    />
  ));

  return (
    <div>
      <h2 className="quiz--question">{decode(props.question)}</h2>
      <div className="quiz--options">{answerBtns}</div>
      <hr className="separator" />
    </div>
  );
}
