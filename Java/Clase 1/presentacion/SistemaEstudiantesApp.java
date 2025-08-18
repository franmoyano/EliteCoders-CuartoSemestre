package utn.presentacion;

import utn.conexion.Conexion;
import utn.datos.EstudianteDAO;
import utn.dominio.Estudiante;
import utn.datos.EstudianteDAO;

import java.util.Scanner;

public class SistemaEstudiantesApp {
    public static void main(String[] args) {
        var salir = false;
        var consola = new Scanner(System.in);
        // Instancia de la clase servicio
        var estudianteDao = new utn.datos.EstudianteDAO();
        while(!salir){
            try {
                mostrarMenu(); //devuelve booleano
                salir = ejecutarOpciones(consola, estudianteDao);

            } catch(Exception e){
                System.out.println("Ocurrió un error al ejecutar la operación: = " + e.getMessage());
            }

        }

    }

    private static void mostrarMenu() {
        System.out.println("""
                ******* Sistema de Estudiantes *******
                1. Listar estudiantes
                2. Buscar estudiantes
                3. Agregar estudiante
                4. Modificar estudiante
                5. Eliminar estudiante
                6. Salir
                Elige una opción:
                """);
    }

    private static boolean ejecutarOpciones(Scanner consola, EstudianteDAO estudianteDAO) {
        var opcion = Integer.parseInt(consola.nextLine());
        var salir = false;
        switch (opcion) {
            case 1 -> {//Listar estudiantes
                System.out.println("Listado de Estudiantes...");
                var estudiantes = estudianteDAO.listar();
                estudiantes.forEach(System.out::println); // imprime la lista
            } // fin caso 1
            case 2 -> {//Buscar estudiante por ID
                System.out.println("Introduce el id_estudiante a buscar: ");
                var idEstudiante = Integer.parseInt(consola.nextLine());
                var estudiante = new Estudiante(idEstudiante);
                var encontrado = estudianteDAO.buscarPorId(idEstudiante);
                if (encontrado != null)
                    System.out.println("Estudiante encontrado: " + estudiante);
                else
                    System.out.println("Estudiante NO encontrado = " + estudiante);
            } // Fin caso 2
            case 3 -> { // Agregar estudiante
                System.out.println("Agregar estudiante: ");
                System.out.println("Nombre: ");
                var nombre = consola.nextLine();
                System.out.println("Apellido: ");
                var apellido = consola.nextLine();
                System.out.println("Telefono: ");
                var telefono = consola.nextLine();
                System.out.println("Email: ");
                var email = consola.nextLine();
                // crear objeto estudiante sin ID
                var estudiante = new Estudiante(nombre, apellido, telefono, email);
                var agregado = estudianteDAO.agregar(estudiante);
                if(agregado)
                    System.out.println("Estudiante agregado: " + agregado);
                else
                    System.out.println("Estudiante NO agregado: " + agregado);
            } // Fin caso 3

            case 4 -> { // Modificar estudiante
                System.out.println("Modificar estudiante: ");
                //Especificar ID
                System.out.println("ID ESTUDIANTE: ");
                var idEstudiante = Integer.parseInt(consola.nextLine());
                var nombre = consola.nextLine();
                System.out.println("Apellido: ");
                var apellido = consola.nextLine();
                System.out.println("Telefono: ");
                var telefono = consola.nextLine();
                System.out.println("Email: ");
                var email = consola.nextLine();
                // crea el objeto a modificar
                var estudiante =
                        new Estudiante(idEstudiante, nombre, apellido, telefono, email);
                var modificado = estudianteDAO.modificar(estudiante);
                if(modificado)
                    System.out.println("Estudiante modificado: " + modificado);
                else
                    System.out.println("Estudiante NO modificado: " + modificado);
            } // Fin caso 4
            case 5 -> { //Eliminar estudiante
                System.out.println("Eliminar estudiante: ");
                //Especificar ID
                System.out.println("ID ESTUDIANTE: ");
                var idEstudiante = Integer.parseInt(consola.nextLine());
                var estudiante = new Estudiante(idEstudiante);
                var eliminado = estudianteDAO.eliminarEstudiante(estudiante);
                if(eliminado)
                    System.out.println("Estudiante eliminado: " + eliminado);
                else
                    System.out.println("Estudiante NO eliminado: " + eliminado);
            } // Fin caso 5
            case 6 -> {//salir
                System.out.println("Hasta pronto!!");
                salir = true;
            } // Fin caso 6
            default -> System.out.println("Opción no reconocida, ingrese otra opción");
        } // Fin switch
        return salir;
    }

} // Fin clase
