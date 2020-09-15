const validateRetryField = (isRetry, retries) => {
  if (isRetry) {
    if (retries > 0) {
      return true;
    }
    return false;
  }
  return true;
};
module.exports.validateExamForm = ({
  quiz,
  quizzes,
  title,
  nquiz,
  total,
  hr,
  min,
  sec,
  setRetry,
  retries,
  type,
  choice,
}) => {
  let totalMarksOfSelectedQuiz = 0;
  let nsec = parseInt(sec);
  let nmin = parseInt(min);
  let nhr = parseInt(hr);
  quizzes.forEach((aquiz) => {
    const isQuiz = quiz.some((q) => q.toString() === aquiz.quiz.id.toString());
    if (isQuiz) {
      totalMarksOfSelectedQuiz += aquiz.quiz.totalMarks;
    }
  });
  if (
    (nhr > 0 && nsec >= 0 && nsec <= 59 && nmin >= 0 && nmin <= 59) ||
    (nmin > 0 && nmin <= 59 && nhr >= 0 && nsec >= 0 && nsec <= 59) ||
    (nhr === 0 && nmin === 0 && nsec > 0 && nsec <= 59)
  ) {
    if (
      title.length &&
      total > 0 &&
      hr.length &&
      min.length &&
      sec.length &&
      choice.length &&
      nsec >= 0 &&
      nsec <= 59
    ) {
      if (type === "standard") {
        if (
          totalMarksOfSelectedQuiz.toString() === total.toString() &&
          nquiz.toString() === quiz.length.toString()
        ) {
          return validateRetryField(setRetry, retries);
        } else {
          return false;
        }
      }
      return validateRetryField(setRetry, retries);
    }
    return false;
  } else {
    return false;
  }
};
