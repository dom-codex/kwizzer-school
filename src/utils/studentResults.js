export const resulReducer = (state, action) => {
  switch (action.type) {
    case "load":
      return {
        ...state,
        exams: action.exams,
      };
    default:
      return state;
  }
};
