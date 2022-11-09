import { decode } from "html-entities";

export default function Answer(props) {
  const checkSelectedAnswer = props.answer.isSelected
    ? "selected"
    : "unselected";
  const checkCorrectAnswer = () => {
    if (props.answer.isCorrect && props.answer.isSelected) {
      return "correct";
    } else if (!props.answer.isCorrect && props.answer.isSelected) {
      return "incorrect";
    } else if (props.answer.isCorrect && !props.answer.isSelected) {
      return "correct";
    } else if (!props.answer.isCorrect && !props.answer.isSelected) {
      return "unselected";
    }
  };

  return (
    <button
      className={props.showAnswers ? checkCorrectAnswer() : checkSelectedAnswer}
      onClick={() => props.selectAnswer(props.id, props.answer.text)}
    >
      {decode(props.answer.text)}
    </button>
  );
}
