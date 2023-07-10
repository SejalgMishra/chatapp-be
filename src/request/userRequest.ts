import { object, string, number  } from "yup";

export const userValidation = object({
  username: string()
    .min(2, "username is Too Short!")
    .max(50, "username is Too Long!")
    .required("username is Required"),
  email: string().required("email is required").email("not valid email!"),
  password: string().min(6, "Your password is Too short").required(),
  image: string(),
});