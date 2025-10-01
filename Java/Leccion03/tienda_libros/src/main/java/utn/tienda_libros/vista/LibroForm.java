package utn.tienda_libros.vista;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import utn.tienda_libros.servicio.LibroServicio;

import javax.swing.*;

@Component
public class LibroForm extends JFrame {

    LibroServicio servicio;
    private JPanel panel;

    @Autowired
    public LibroForm(LibroServicio libroServicio) {
        this.servicio = libroServicio;
        iniciarFormulario();
    }

    private void iniciarFormulario() {
        setContentPane(panel);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setVisible(true);
        setSize(900, 700);
    }
}
