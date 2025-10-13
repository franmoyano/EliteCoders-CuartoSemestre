import os
import pygame
from contstantes import ASSETS_PATH

class Explosion:
    def __init__(self, x, y):
        self.images = [pygame.image.load(os.path.join(ASSETS_PATH, 'images', f'regularExplosion0{i}.png')) for i in range(9)]
        self.index = 0
        self.image = self.images[self.index]
        self.rect = self.image.get_rect(center=(x, y))
        self.frame_rate =0
        self.max_frames = 20

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
