package utn.tienda_libros.servicio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utn.tienda_libros.modelo.Libro;
import utn.tienda_libros.repositorio.LibroRepositorio;
import java.util.List;

@Service
public class LibroServicio implements ILibroServicio {

    @Autowired
    private LibroRepositorio repositorio;

    @Override
    public List<Libro> listarLibros() { return repositorio.findAll();}


    @Override
    public Libro buscarLibroPorId(Integer idLibro) {
        Libro libro = repositorio.findById(idLibro).orElse(null);
        return libro;
    }

    @Override
    public void guardarLibro(Libro libro) {
        repositorio.save(libro);
    }

    @Override
    public void eliminarLibro(Libro libro) {
        repositorio.delete(libro);
    }

    @Override
    public Libro buscarPorNombreYAutor(String nombreLibro, String autor) {
        return repositorio.findByNombreLibroIgnoreCaseAndAutorIgnoreCase(nombreLibro, autor);
    }
}
