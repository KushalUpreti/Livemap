import React from "react";
import { useForm } from "react-hook-form";

export default function ReactHookForm({ jsonSchema }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

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
  type = "text",
}) {
  console.log(errors[field]);
  return (
    <>
      {type === "submit" ? (
        <input type="submit" />
      ) : (
        <>
          <label>{field}</label>
          <input {...register(field, validationRules)} type={type} />
          <p>
            {errors[field] &&
              `${errors[field].type} ${validationRules[errors[field].type]}`}
          </p>
        </>
      )}
    </>
  );
}
