import { ResponsePayload } from "../../middlewares/response";
import { supabase } from "../../db";
import { signToken } from "../../middlewares/auth";

export const verifyComissaoExistence = async (
  email: string,
  matricula: string,
  cpf: string
): Promise<ResponsePayload | null> => {
  const { data, error } = await supabase
    .from("committee_members")
    .select("*")
    .eq("cpf", cpf)
    .eq("email", email)
    .eq("if_registration", matricula)
    .maybeSingle();

  console.log(data, "data");
  console.log(error, "error");

  if (error !== null) {
    return { error: true, message: "Error on database", status: 404 };
  }

  if (data !== null) {
    console.log("comissao-login-token", data);
    const token = await signToken(data);
    return {
      error: false,
      message: "Committee user found",
      status: 200,
      data: {
        token,
        islogin: true,
      },
    };
  }
  return null;
};

export const handlerComissaoRegister = async (
  email: string,
  matricula: string,
  name: string,
  cpf: string,
  password: string
): Promise<ResponsePayload | null> => {
  const { data, error } = await supabase
    .from("committee_members")
    .insert([
      {
        email: email,
        if_registration: matricula,
        name: name,
        cpf: cpf,
        password: password,
      },
    ])
    .select();

  console.log(error, data);
  if (error !== null) {
    const { code } = error;
    if (code === "23505") {
      return {
        error: true,
        message: "Email, matricula or CPF already registered",
        status: 409,
        code: error.code,
      };
    } else {
      return {
        error: true,
        message: "Error on database",
        status: 404,
      };
    }
  }

  if (data !== null) {
    const token = await signToken(data[0]);
    return {
      error: false,
      message: "Committee user created",
      status: 201,
      data: {
        token,
        islogin: false,
      },
    };
  }

  return null;
};
