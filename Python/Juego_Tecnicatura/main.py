import sys
import pygame
import random
import os
from personaje import Personaje,Enemigo, Explosion
from contstantes import SCREEN_WIDTH, SCREEN_HEIGHT,COLOR_LASER,ASSETS_PATH

# Inicializar el juego

def mostrar_imagen_inicial(screen, imagen_path, duracion):
    imagen = pygame.image.load(imagen_path).bonvert()
    imagen = pygame.transform.scale(imagen, (SCREEN_WIDTH, SCREEN_HEIGHT))

    #Bucle para mostrar la imagen principal con una opacidad
    alpha = 255 #transparencia inicial
    Clock = pygame.time.Clock()

    tiempo_inicial = pygame.time.get_ticks()
    timepo_total = duracion #duracion en milisegundos

while pygame.time.get_ticks() - tiempo_inicial < tiempo_total:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    keys = pygame.key.get_pressed()
    dx, dy = 0, 0
    if keys[pygame.K_LEFT]:
        dx = -5
    if keys[pygame.K_RIGHT]:
        dx = 5
    if keys[pygame.K_UP]:
        dy = -5
    if keys[pygame.K_DOWN]:
        dy = 5

    personaje.mover(dx, dy)

    if keys[pygame.K_SPACE]:
        personaje.lanzar_laser()
        sonido_laser.play()

    #Actualizar la posicion de los enemigos y manejar colisiones
    for enemigo in enemigos[:]:
        enemigo.mover()
        if enemigo.rect.top > SCREEN_HEIGHT:
            enemigos.remove(enemigo)

    #Verificar colisiones entre lasers y enemigos
    for laser in personaje.lasers[:]:
        if enemigo.react.colliderect(laser.rect):
            personaje.lasers.remove(laser)
            enemigos.remove(enemigo)
            explosiones.append(Explosion(enemigo.rect.centerx, enemigo.rect.centery))
            sonido_explosion.play()
            puntos += 10
            break

    if enemigo.react.colliderect(Personaje.shape):
        if not Personaje.recibbir_dano():
            running = False # Termina el juego si la energia llega a 0

    # Generar enemigos aleatoriamente
    if random.randint(1, 10) < 2:
        x = random.randint(0, SCREEN_WIDTH - 50)
        enemigo = Enemigo(x, 0)
        enemigos.append(enemigo)

    # Actualizar explosiones
    explosion = [explosion for explosion in explosiones if explosion.actualizar()]

    # Actualizar fondo cada 250 puntos
    if puntos >0 and puntos % 250 == 0:
        if fondo_actual == fondo2:
            fondo_actual = fondo3
        else:
            fondo_actual = fondo2
            puntos +=10 #aumenta puntos y cambia el fondo

    #Dibujar el fondo y objetos del juego
    screen.blit(fondo_actual, (0, 0))
    personajes.dibujar(screen)
    for enemigo in enemigos:
        enemigo.dibujar(screen)
    for explosion in explosiones:
        explosion.dibujar(screen)
