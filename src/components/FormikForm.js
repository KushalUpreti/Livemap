import React, { useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import classes from "../styles/Form.module.css";

export default function SignupForm() {
  useEffect(() => {
    console.log("Formik rerendered");
  });

  return (
    <Formik
      initialValues={{ firstName: "", lastName: "", email: "" }}
      validationSchema={Yup.object({
        firstName: Yup.string()
          .max(15, "Must be 15 characters or less")
          .required("Required"),
        lastName: Yup.string()
          .max(20, "Must be 20 characters or less")
          .required("Required"),
        email: Yup.string().email("Invalid email address").required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
      }}
    >
      <Form>
        <label htmlFor="firstName">First Name</label>
        <Field name="firstName" type="text" />
        <p>
          <ErrorMessage name="firstName" />
        </p>

        <label htmlFor="lastName">Last Name</label>
        <Field name="lastName" type="text" />
        <p>
          <ErrorMessage name="lastName" />
        </p>

        <label htmlFor="email">Email Address</label>
        <Field name="email" type="email" />
        <p>
          <ErrorMessage name="email" />
        </p>

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
}
