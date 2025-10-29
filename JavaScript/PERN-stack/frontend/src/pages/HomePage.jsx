import { useContext } from 'react';
import Card from '../components/ui/Card.jsx';
import { AuthContext } from '../context/authContext.js';

function HomePage() {
  const data = useContext(AuthContext);
  console.log(data);
  return (
    <Card>
      <h1 className='font-bold justify-center text-2xl py-4'>
        {" "}
        Desarrollo de una Aplicación PERN con Autenticación y CRUD
      </h1>

    </Card>
  )
}

export default HomePage