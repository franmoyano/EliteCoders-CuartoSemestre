# help(str.capitalize)

mensaje1 = 'hola mundo'
mensaje2 = mensaje1.capitalize()

print(f'Mensaje1: {mensaje1}, id: {id(mensaje1)}')
print(f'Mensaje2: {mensaje2}, id: {id(mensaje2)}')

mensaje1 += ' Adios'
print(f'mensaje1: {mensaje1}, id: {id(mensaje1)}')

lista_cursos = ['Python', 'Java', 'Angular', 'PHP']
mensaje = ', '.join(lista_cursos)
print(f'Mensaje: {mensaje}')

cadena = 'HolaMundo'
mensaje = '.'.join(cadena)
print(f'Mensaje: {mensaje}')

diccionario = {'nombre': 'Juan', 'apellido': 'Perez', 'edad': '18'}
llaves = '-'.join(diccionario.keys())
valores = '-'.join(diccionario.values())

print(f'Llaves: {llaves}, Type: {type(llaves)}')
print(f'Valores: {valores}, Type: {type(valores)}')
