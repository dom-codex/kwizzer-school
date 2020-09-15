module.exports.Validatename = (name) => {
  if (name.length < 3) {
    return {
      result: false,
      message: "name is too short",
    };
  } else if (name.length === 0) {
    return {
      result: false,
      message: "invalid name",
    };
  } else {
    return {
      result: true,
      message: "",
    };
  }
};
module.exports.Validateemail = (email) => {
  if (email.length < 5) {
    return {
      result: false,
      message: "email is too short",
    };
  } else if (email.length === 0) {
    return {
      result: false,
      message: "invalid email",
    };
  } else {
    return {
      result: true,
      message: "",
    };
  }
};
module.exports.Validatepassword = (password) => {
  if (password.length < 5) {
    return {
      result: false,
      message: "password is too short",
    };
  } else if (password.length === 0) {
    return {
      result: false,
      message: "invalid password",
    };
  } else {
    return {
      result: true,
      message: "",
    };
  }
};
module.exports.comfirmpassword = (pass1, pass2) => {
  if (pass1 !== pass2) {
    return {
      result: false,
      message: "passwords do not match",
    };
  }
  return {
    result: true,
    messgae: "",
  };
};
module.exports.canSubmit = (data) => {
  const { name, email, password, comfirm } = data;
  const match = comfirm === password;
  if (name.length >= 3 && email.length >= 5 && password.length >= 5 && match) {
    return true;
  }
  return false;
};
