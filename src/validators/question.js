const pattern2 = /(xmlns="[a-zA-Z0-9/:.]+")/gi;
const pattern3 = /<mo>&#160;<\/mo>/g;
const pattern4 = /<math[ ]+>/g;
const pattern = /(<[\/]{0,}p>)/gi;

module.exports.validateQuestion = (opts, answer, question) => {
  question = question.replace(pattern2, "");
  question = question.replace(pattern3, "");
  question = question.replace(/&nbsp;/, "");
  question = question.replace(pattern4, `<math>`);
  question = question.replace(pattern, "");
  let count = 0;
  const options = opts.length;
  opts.forEach((option) => {
    if (option.value.length) count++;
  });
  if (
    options >= 2 &&
    answer.length >= 1 &&
    question.length &&
    count === options
  ) {
    return true;
  }
  return false;
};
