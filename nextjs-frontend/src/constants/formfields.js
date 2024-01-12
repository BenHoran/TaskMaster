const loginFields = [
  {
    labelText: "Email address",
    labelFor: "emailAddress",
    id: "emailAddress",
    name: "email",
    type: "email",
    autoComplete: "email",
    isRequired: true,
    placeholder: "Email address",
  },
  {
    labelText: "Password",
    labelFor: "password",
    id: "password",
    name: "password",
    type: "password",
    autoComplete: "currentPassword",
    isRequired: true,
    placeholder: "Password",
  },
];

const signupFields = [
  {
    labelText: "Username",
    labelFor: "username",
    id: "username",
    name: "username",
    type: "text",
    autoComplete: "username",
    isRequired: true,
    placeholder: "Username",
  },
  {
    labelText: "Email address",
    labelFor: "emailAddress",
    id: "emailAddress",
    name: "email",
    type: "email",
    autoComplete: "email",
    isRequired: true,
    placeholder: "Email address",
  },
  {
    labelText: "Password",
    labelFor: "password",
    id: "password",
    name: "password",
    type: "password",
    autoComplete: "currentPassword",
    isRequired: true,
    placeholder: "Password",
  },
  {
    labelText: "Confirm Password",
    labelFor: "confirmPassword",
    id: "confirmPassword",
    name: "confirmPassword",
    type: "password",
    autoComplete: "confirmPassword",
    isRequired: true,
    placeholder: "Confirm Password",
  },
];

const taskFields = [
  {
    labelText: "Task name",
    labelFor: "taskName",
    id: "taskName",
    name: "task",
    type: "text",
    autoComplete: "task",
    isRequired: true,
    placeholder: "Task Name",
  },
  {
    labelText: "Date Due",
    labelFor: "dateDue",
    id: "dateDue",
    name: "dateDue",
    type: "date",
    autoComplete: "dateDue",
    isRequired: true,
    placeholder: "",
  },
];

export { loginFields, signupFields, taskFields };
