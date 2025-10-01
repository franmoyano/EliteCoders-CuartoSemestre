nombre = 'Franco'
edad = 24
mensaje_con_formato = 'Mi nombre es %s y tengo %d años' %(nombre, edad)

persona = ('Carla', 'Gómez', 10000.00)
mensaje_con_formato = 'Hola %s %s, tu sueldo es $%.2f' # %(persona[0], persona[1], persona[2])
print(mensaje_con_formato % persona)


nombre = 'Juan'
edad = 35
sueldo = 3000.00

mensaje_con_formato = 'Nombre: {}. Edad: {}. Sueldo: {:.2f}'.format(nombre, edad, sueldo)
print(mensaje_con_formato)


mensaje = 'Edad {1} Nombre {0} Sueldo {2:.2f}'.format(nombre, edad, sueldo)
print(mensaje)


mensaje = 'Nombre {n} Edad {e} Sueldo {s:.2f}'.format(n=nombre, e=edad, s=sueldo)
print(mensaje)

diccionario = {'nombre': 'Ivan', 'edad': 53, 'sueldo': 994.41}
mensaje = 'Nombre {p[nombre]} Edad {p[edad]} Sueldo {p[sueldo]}'.format(p=diccionario)
print(mensaje)