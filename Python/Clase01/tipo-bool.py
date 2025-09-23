#Bool contiene los valores de True y False
#Los tipos numericos, es false para el 0(cero), true para los demas valores
valor = 0
resultado = bool(valor)
print(f'valor: {valor}, resultado: {resultado}')

valor = 0.1
resultado = bool(valor)
print(f'valor: {valor}, resultado: {resultado}')

# Tipo string -> False '', True demas valores
valor = ''
resultado = bool(valor)
print(f'valor: "{valor}", resultado: {resultado}')

valor = 'Hola'
resultado = bool(valor)
print(f'valor: "{valor}", resultado: {resultado}')

#Tipo colecciones -> False para colecciones vacias
#Tipo colecciones -> True para todo lo demas
valor = []
resultado = bool(valor)
print(f'valor de lista vacia: {valor}, resultado: {resultado}')

valor = [1, 2, 3]
resultado = bool(valor)
print(f'valor de lista con elementos: {valor}, resultado: {resultado}')

#Tupla
valor = ()
resultado = bool(valor)
print(f'valor de tupla vacia: {valor}, resultado: {resultado}')

valor = (1, 2, 3)
resultado = bool(valor)
print(f'valor de tupla con elementos: {valor}, resultado: {resultado}')

#Diccionario
valor = {}
resultado = bool(valor)
print(f'valor de diccionario vacio: {valor}, resultado: {resultado}')

valor = {'a': 1, 'b': 2}
resultado = bool(valor)
print(f'valor de diccionario con elementos: {valor}, resultado: {resultado}')

# Sentencia de control con bool
if (1,):
    print('Regresa Verdadero')
else:
    print('Regresa Falso')

#ciclos
variable = 17
while variable:
    print('Regresa Verdadero')
    break
else:
    print('Regresa Falso')