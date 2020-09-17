import React, { useEffect, useReducer, useState } from "react";
import QuestionDisplayArea from "../sub-components/question-display";
import OptionLabel from "../sub-components/option-label";
import Loading from "../sub-components/Loading";
import { checkForEquation } from "../../utils/transformQuestion";
import "../../css/solution.css";
const correct = {
  backgroundColor: "green",
};
const choosed = {
  backgroundColor: "red",
};
const QuestionDisplay = (props) => {
  return (
    <div>
      <div className="quiz-tab">{props.children}</div>
      <QuestionDisplayArea index={props.index} question={props.question} />
      <div className="question-options">
        <ul>
          {props.options.map((q, i) => {
            const isAnswer = q.isAnswer;
            const chosen = q.option === props.answer;
            return (
              <li style={isAnswer ? correct : chosen ? choosed : null}>
                <OptionLabel i={i} />
                <div>{checkForEquation(q.option)}</div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="control-buttons">
        <button onClick={() => props.nav("backward")}>prev</button>
        <button onClick={() => props.nav("forward")}>next</button>
      </div>
    </div>
  );
};
const Solutions = (props) => {
  const { question } = props.location.state;
  const [loading, setLoading] = useState(true);
  const questionReducer = (state, action) => {
    let index = 0;
    switch (action.type) {
      case "load":
        return {
          ...state,
          currentQuestionIndex: 0,
          currentQuizIndex: 0,
          quizzes: action.quizzes,
          questions: action.quizzes[0].questions,
          question: action.quizzes[0].questions[0],
        };
      case "currentQuestion":
        return {
          ...state,
        };
      case "switch":
        return {
          ...state,
          currentQuizIndex: action.quid,
          questions: state.quizzes[action.quid].questions,
          currentQuestionIndex: 0,
          question: state.quizzes[action.quid].questions[0],
        };
      case "viewQuestion":
        return {
          ...state,
        };
      case "next":
        index = state.currentQuestionIndex + 1;
        return {
          ...state,
          currentQuestionIndex: index,
          question: state.quizzes[state.currentQuizIndex].questions[index],
        };
      case "prev":
        index = state.currentQuestionIndex - 1;
        return {
          ...state,
          currentQuestionIndex: index,
          question: state.quizzes[state.currentQuizIndex].questions[index],
        };
      default:
        return state;
    }
  };
  const [data, dispatch] = useReducer(questionReducer, {
    quizzes: [],
    currentQuestionIndex: 0,
    currentQuizIndex: 0,
    questions: [],
    question: {},
  });
  const getQuestionPaper = () => {
    const url = `${process.env.REACT_APP_HEAD}/school/exam/result?sheet=${question}`;
    fetch(url)
      .then((res) => res.json())
      .then((datas) => {
        console.log(datas);
        dispatch({
          type: "load",
          quizzes: datas.solution.quizzes,
        });
        setLoading(false);
      });
  };
  const genQuizSelectors = (quizzes) => {
    const selectors = quizzes.map((quiz, i) => {
      return (
        <button onClick={() => dispatch({ type: "switch", quid: i })}>
          {quiz.title}
        </button>
      );
    });
    return selectors;
  };
  const switchQuestion = (direction) => {
    if (
      direction === "forward" &&
      data.currentQuestionIndex < data.questions.length - 1
    ) {
      dispatch({ type: "next" });
    } else if (direction === "backward" && data.currentQuestionIndex > 0) {
      return dispatch({ type: "prev" });
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(getQuestionPaper, []);
  return (
    <section className="solution">
      {loading ? (
        <Loading />
      ) : (
        <div>
          <div className="question-paper">
            {data.questions.length && (
              <QuestionDisplay
                index={data.currentQuestionIndex + 1}
                question={data.question.question}
                options={data.question.options}
                answer={data.question.answer}
                answered={data.question.isAnswered}
                nav={switchQuestion}
              >
                {genQuizSelectors(data.quizzes)}
              </QuestionDisplay>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
export default Solutions;
