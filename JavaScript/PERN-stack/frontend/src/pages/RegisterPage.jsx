import { Button, Card, Input } from "../components/ui/index.js";
import { useForm } from "react-hook-form";
import { Axios } from "axios";

function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = handleSubmit(async (data) => {

    const res = await Axios.post("http://localhost:3000/api/signup", data, {
      withCredentials: true
    });
    console.log(res.data);
  });

  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center">
      <Card>
        <h3 className="text-2xl font-bold ">Registro</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input placeholder="Ingrese su nombre"
           {...register("name", { required: true })} /> 

          {
          errors.name && <span className="text-red-500">Este campo es requerido</span>
          }

          <Input type="email" placeholder="Ingrese su email"
           {...register("email", { required: true })} />

          {
          errors.email && <span className="text-red-500">Este campo es requerido</span>
          }

          <Input type="password" placeholder="Ingrese su contraseña"
           {...register("password", { required: true })} />

          {
          errors.password && <span className="text-red-500">Este campo es requerido</span>
          }

          <Button>Registrarse</Button>
        </form>
      </Card>
    </div>
  );
}

export default RegisterPage;