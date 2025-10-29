import { useAuth } from '../context/authContext';
import { Container, Card, Button } from "../components/ui";

function ProfilePage() {
  const { user, signout } = useAuth();

  return (
    <Container className="h-[calc(100vh-10rem)] flex items-center justify-center">
      <Card>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-6">
            <img
              src={user?.gravatar}
              alt={user?.name || "avatar"}
              className="h-24 w-24 rounded-full border-2 border-sky-500 object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.name || "Sin nombre"}</h2>
              <p className="text-slate-300">{user?.email || "Sin email"}</p>
              <p className="text-sm text-slate-400 mt-2">Miembro desde: <span className="font-medium text-slate-200">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</span></p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-zinc-800 p-4 rounded">
              <h3 className="text-sm text-slate-400">Tareas</h3>
              <p className="text-xl font-semibold text-white">{user?.tareasCount ?? "-"}</p>
            </div>
            <div className="bg-zinc-800 p-4 rounded">
              <h3 className="text-sm text-slate-400">Gravatar</h3>
              <p className="text-xl font-semibold text-white">{user?.gravatar ? "Disponible" : "No disponible"}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button className="bg-sky-500 hover:bg-sky-600">Editar perfil</Button>
            <Button className="bg-red-500 hover:bg-red-600" onClick={() => signout()}>Cerrar sesión</Button>
          </div>

          <details className="mt-6 bg-zinc-800 p-4 rounded text-sm text-slate-300">
            <summary className="cursor-pointer font-medium">Ver detalles (raw)</summary>
            <pre className="mt-2 overflow-auto text-xs">{JSON.stringify(user, null, 2)}</pre>
          </details>
        </div>
      </Card>
    </Container>
  );
}

export default ProfilePage;