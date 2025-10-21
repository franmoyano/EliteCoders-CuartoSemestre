package utn.tienda_libros.vista;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import utn.tienda_libros.modelo.Libro;
import utn.tienda_libros.servicio.LibroServicio;

import javax.swing.*;
import javax.swing.border.LineBorder;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.JTableHeader;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

@Component
public class LibroForm extends JFrame {

    LibroServicio libroServicio;
    private JPanel panel;
    private JTable tablaLibros;
    private DefaultTableModel tablaModeloLibros;
    private JTextField idTexto;
    private JTextField libroTexto;
    private JTextField autorTexto;
    private JTextField precioTexto;
    private JTextField existenciasTexto;
    private JButton agregarButton;
    private JButton modificarButton;
    private JButton eliminarButton;

    @Autowired
    public LibroForm(LibroServicio libroServicio) {
        this.libroServicio = libroServicio;
        iniciarFormulario();
        agregarButton.addActionListener(e -> agregarLibro());
        tablaLibros.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                super.mouseClicked(e);
                cargarLibroSeleccionado();
            }
        });
        modificarButton.addActionListener(e -> modificarLibro());
        eliminarButton.addActionListener(e -> eliminarLibro());
    }

    private void iniciarFormulario() {
        setTitle("Tienda de Libros");
        setContentPane(panel);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setVisible(true);
        setSize(900, 700);

        // Centramos la ventana
        Toolkit toolkit = Toolkit.getDefaultToolkit();
        Dimension tamanioPantalla = toolkit.getScreenSize();
        int x = (tamanioPantalla.width - getWidth()) / 2;
        int y = (tamanioPantalla.height - getHeight()) / 2;
        setLocation(x, y);

        // Icono principal
        Image icono = new ImageIcon(getClass().getResource("/icons/book_icon.png")).getImage();
        setIconImage(icono);

        estilizarComponentes();
    }

    private void agregarLibro() {
        if (libroTexto.getText().equals("")) {
            mostrarMensaje("Ingresar el nombre del libro");
            libroTexto.requestFocusInWindow();
            return;
        }
        var nombreLibro = libroTexto.getText();
        var autor = autorTexto.getText();
        var precio = Double.parseDouble(precioTexto.getText());
        var existencias = Integer.parseInt(existenciasTexto.getText());

        Libro libroExistente = this.libroServicio.buscarPorNombreYAutor(nombreLibro, autor);
        if (libroExistente != null) {
            mostrarMensaje("El libro ya está cargado en el sistema");
            return;
        }

        var libro = new Libro(null, nombreLibro, autor, precio, existencias);
        this.libroServicio.guardarLibro(libro);
        mostrarMensaje("Se agregó el libro correctamente.");
        limpiarFormulario();
        listarLibros();
    }

    private void cargarLibroSeleccionado() {
        var renglon = tablaLibros.getSelectedRow();
        if (renglon != -1) {
            idTexto.setText(tablaLibros.getModel().getValueAt(renglon, 0).toString());
            libroTexto.setText(tablaLibros.getModel().getValueAt(renglon, 1).toString());
            autorTexto.setText(tablaLibros.getModel().getValueAt(renglon, 2).toString());
            precioTexto.setText(tablaLibros.getModel().getValueAt(renglon, 3).toString());
            existenciasTexto.setText(tablaLibros.getModel().getValueAt(renglon, 4).toString());
        }
    }

    private void modificarLibro() {
        if (idTexto.getText().equals("")) {
            mostrarMensaje("Debes seleccionar un registro en la tabla");
            return;
        }
        if (libroTexto.getText().equals("")) {
            mostrarMensaje("Digite el nombre del libro...");
            libroTexto.requestFocusInWindow();
            return;
        }

        int idLibro = Integer.parseInt(idTexto.getText());
        var nombreLibro = libroTexto.getText();
        var autor = autorTexto.getText();
        var precio = Double.parseDouble(precioTexto.getText());
        var existencias = Integer.parseInt(existenciasTexto.getText());
        var libro = new Libro(idLibro, nombreLibro, autor, precio, existencias);
        libroServicio.guardarLibro(libro);
        mostrarMensaje("Se modificó el libro correctamente.");
        limpiarFormulario();
        listarLibros();
    }

    private void eliminarLibro() {
        var renglon = tablaLibros.getSelectedRow();
        if (renglon != -1) {
            String idLibro = tablaLibros.getModel().getValueAt(renglon, 0).toString();
            var libro = new Libro();
            libro.setIdLibro(Integer.parseInt(idLibro));
            libroServicio.eliminarLibro(libro);
            mostrarMensaje("Libro " + idLibro + " eliminado.");
            limpiarFormulario();
            listarLibros();
        } else {
            mostrarMensaje("Debes seleccionar un libro.");
        }
    }

    private void limpiarFormulario() {
        libroTexto.setText("");
        autorTexto.setText("");
        precioTexto.setText("");
        existenciasTexto.setText("");
    }

    private void mostrarMensaje(String mensaje) {
        JOptionPane.showMessageDialog(this, mensaje);
    }

    private void createUIComponents() {
        idTexto = new JTextField("");
        idTexto.setVisible(false);
        this.tablaModeloLibros = new DefaultTableModel(0, 5) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        String[] cabecera = {"Id", "Libro", "Autor", "Precio", "Existencias"};
        this.tablaModeloLibros.setColumnIdentifiers(cabecera);
        this.tablaLibros = new JTable(tablaModeloLibros);
        tablaLibros.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        listarLibros();
    }

    private void listarLibros() {
        tablaModeloLibros.setRowCount(0);
        var libros = libroServicio.listarLibros();
        libros.forEach((libro) -> {
            Object[] renglonLibro = {
                    libro.getIdLibro(),
                    libro.getNombreLibro(),
                    libro.getAutor(),
                    libro.getPrecio(),
                    libro.getExistencias()
            };
            this.tablaModeloLibros.addRow(renglonLibro);
        });
    }

    // --- Estilos visuales de la interfaz ---
    private void estilizarComponentes() {
        panel.setBackground(new Color(244, 246, 248)); // Fondo gris claro

        // --- Tabla ---
        tablaLibros.setBackground(Color.WHITE);
        tablaLibros.setForeground(new Color(46, 58, 89));
        tablaLibros.setGridColor(new Color(209, 217, 230));
        tablaLibros.setSelectionBackground(new Color(78, 115, 223));
        tablaLibros.setSelectionForeground(Color.WHITE);
        tablaLibros.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        tablaLibros.setRowHeight(25);

        JTableHeader header = tablaLibros.getTableHeader();
        header.setBackground(new Color(78, 115, 223));
        header.setForeground(Color.WHITE);
        header.setFont(new Font("Segoe UI", Font.BOLD, 14));

        // JScrollPane redondeado
        JScrollPane scrollPane = (JScrollPane) tablaLibros.getParent().getParent();
        scrollPane.setBorder(BorderFactory.createCompoundBorder(
                new LineBorder(new Color(209, 217, 230), 1, true),
                BorderFactory.createEmptyBorder(5, 5, 5, 5)
        ));
        scrollPane.setBackground(new Color(244, 246, 248));

        // --- Botones con iconos e íconos ---
        configurarBoton(agregarButton, new Color(28, 200, 138),
                "/icons/add_icon.png");
        configurarBoton(modificarButton, new Color(246, 194, 62),
                "/icons/edit_icon.png");
        configurarBoton(eliminarButton, new Color(231, 74, 59),
                "/icons/delete_icon.png");
    }

    private void configurarBoton(JButton boton, Color colorFondo, String iconPath) {
        boton.setBackground(colorFondo);
        boton.setForeground(Color.WHITE);
        boton.setFont(new Font("Segoe UI", Font.BOLD, 14));
        boton.setFocusPainted(false);
        boton.setBorder(BorderFactory.createEmptyBorder(10, 20, 10, 20));
        boton.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));

        // Bordes redondeados
        boton.setBorder(new LineBorder(colorFondo.darker(), 2, true));

        // Ícono
        try {
            ImageIcon icon = new ImageIcon(getClass().getResource(iconPath));
            Image img = icon.getImage().getScaledInstance(20, 20, Image.SCALE_SMOOTH);
            boton.setIcon(new ImageIcon(img));
            boton.setHorizontalTextPosition(SwingConstants.RIGHT);
            boton.setIconTextGap(10);
        } catch (Exception e) {
            System.out.println("No se pudo cargar el ícono: " + iconPath);
        }
    }
}
