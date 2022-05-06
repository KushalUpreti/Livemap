import { useEffect, useState } from "react";
import classes from "../styles/Form.module.css";

export default function Form() {
  const [formState, setFormState] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  useEffect(() => {
    console.log("Form rerendered");
  });

  function onFormSubmit(e) {
    e.preventDefault();
    alert("Form submitted");
  }

  return (
    <form action="" onSubmit={onFormSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        type="text"
        value={formState.firstname}
        onChange={(e) => {
          setFormState((prev) => {
            return { ...prev, firstname: e.target.value };
          });
        }}
      />

      <label htmlFor="firstName">Last Name</label>
      <input
        type="text"
        value={formState.lastname}
        onChange={(e) => {
          setFormState((prev) => {
            return { ...prev, lastname: e.target.value };
          });
        }}
      />

      <label htmlFor="firstName">Email</label>
      <input
        type="text"
        value={formState.email}
        onChange={(e) => {
          setFormState((prev) => {
            return { ...prev, email: e.target.value };
          });
        }}
      />

      <input type="submit" value="Submit" />
    </form>
  );
}
