import os
import pygame
from contstantes import ASSETS_PATH

class Personaje:
    def __init__(self, x, y):
        # Construye la ruta a la imagen del personaje
        self.image = pygame.image.load(os.path.join(ASSETS_PATH, 'personaje1.png'))
        self.image = pygame.transform.scale(self.image, (95, 95))
        self.shape = self.image.get_rect(center=(x, y))
        self.lasers = []
        self.energia = 100 #barra de energia

    def mover(self, dx, dy):
        self.shape.x += dx
        self.shape.y += dy

    def lanzar_laser(self):
        laser = pygame.Rect(self.shape.centerx, self.shape.top)
        self.lasers.append(laser)

    def recibir_dano(self):
        self.energia -= 10
        if self.energia <= 0:
            self.energia <= 0
            return False
        return True

    def dibujar(self, screen):
        screen.blit(self.image, self.shape.topleft)
        for laser in self.lasers:
            laser.dibujar(screen)
            laser.mover()

        #dibujar barra de energia
        pygame.draw.rect(screen, (255, 0, 0), (10, 10, 100, 20)) #barra de fondo
        pygame.draw.rect(screen, (0, 255, 0), (10, 10, self.energia, 10)) #barra de energia

class Enemigo:
    def __init__(self, x, y):
        self.image = pygame.image.load(os.path.join(ASSETS_PATH, 'images', 'enemigo1.png'))
        self.image = pygame.transform.scale(self.image, (80, 80))
        self.image = self.image.get_rect(center=(x, y))

    def mover(self, screen):
        screen.blit(self.image, self.rect.topleft)

class Laser:
    def __init__(self, x, y):
        self.imnage = pygame.image.load(os.path.join(ASSETS_PATH, 'images', 'laser.png'))
        self.rect = self.imnage.get_rect(center=(x, y))

    def mover(self, x, y):
        self.rect = self.imnage.get_rect(center=(x, y))

    def dibujar(self, screen):
        screen.blit(self.imnage, self.rect.topleft)

class Explosion:
    def __init__(self, x, y):
        self.images = [pygame.image.load(os.path.join(ASSETS_PATH, 'images', f'regularExplosion0{i:2}.png')) for i in range(9)]
        self.index = 0 #indice de la animiacion
        self.image = self.images[self.index]
        self.rect = self.image.get_rect(center=(x, y))
        self.frame_rate = 0 #contador de frames
        self.max_frames = 20 #maximo de frames por imagen

    def actualizar(self):
        #actualiza la animacion
        self.frame_rate += 1
        if self.frame_rate >= self.max_frames:
            self.index += 1
            if self.index >= len(self.images):
                return False # retorna en false porque aqui termina la animacion
            self.image = self.images[self.index]
            return True

    def dibujar(self, screen):
        screen.blit(self.image, self.rect.topleft)
