import React from "react";
import { useForm } from "react-hook-form";
import classes from "../styles/Form.module.css";

export default function ReactHookForm({ jsonSchema, onFormSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => onFormSubmit(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {Object.values(jsonSchema.fields).map((item) => {
        return (
          <Input
            field={item.field}
            register={register}
            errors={errors}
            validationRules={item.validations}
            type={item.type}
            placeholder={item.placeholder}
          />
        );
      })}
    </form>
  );
}

function Input({
  register,
  field,
  errors,
  validationRules = {},
  placeholder = "",
  type = "text",
}) {
  return (
    <>
      {type === "submit" ? (
        <input type="submit" />
      ) : (
        <>
          <label>{field}</label>
          <input
            {...register(field, validationRules)}
            type={type}
            placeholder={placeholder}
          />
          <p className={classes.form_p}>
            {errors[field] &&
              `${errors[field].type} ${validationRules[errors[field].type]}`}
          </p>
        </>
      )}
    </>
  );
}
