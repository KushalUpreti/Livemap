import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export default function ReactHookForm() {
  const schema = yup
    .object({
      firstName: yup.string().required(),
      age: yup.number().positive().integer().required(),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input field={"firstName"} register={register} errors={errors} />
      <Input field={"age"} register={register} errors={errors} />
      <Input type="submit" />
    </form>
  );
}

function Input({ register, field, errors, type = "text" }) {
  return (
    <>
      {type === "submit" ? (
        <input type="submit" />
      ) : (
        <>
          <input {...register(field)} />
          <p>{errors[field]?.message}</p>
        </>
      )}
    </>
  );
}
