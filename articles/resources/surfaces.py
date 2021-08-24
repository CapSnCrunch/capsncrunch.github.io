import pygame
import numpy as np
import scipy.signal
import sounddevice as sd
from pygame.locals import *

# Uncomment the desired surface
# Change constants and domains according to suggested values
# Rotate surface using arrow keys
# Press P to play 1 second sound corresponding to current frame

# Press R to enter recording mode to save up to 500 frames (~10 seconds) of rotation and press P to play this clip
# Pressing R again will leave recording mode

# Scale or width / height can be adjusted to fit surface to the window

width, height = 500, 500
center = np.array([width/2, height/2])

volume = 0.3
upsample = 1000
fs = 48000

theta = 0.02
scale = 50
rotation_speed = 0.01

du, dv = 40, 40

# https://en.wikipedia.org/wiki/List_of_surfaces
# https://en.wikipedia.org/wiki/List_of_complex_and_algebraic_surfaces

sin, cos, sqrt = np.sin, np.cos, np.sqrt

a, b, c, d = 1, 0.95, 0.2, 0.3
#surface = lambda u, v: np.array([(a+b*cos(u))*cos(v), (a+b*cos(u))*sin(v), b*sin(u)]) # Torus (2,1) [0, 2pi] [0, 2pi]
surface = lambda u, v: np.array([cos(v)/np.cosh(u), sin(v)/np.cosh(u), np.tanh(u)]) # Hemisphere
surface = lambda u, v: np.array([sin(3*u)/(2+cos(v)), (sin(u)+2*sin(2*u))/(2+cos(v+np.pi*2/3)), (cos(u)-2*cos(2*u))*(2+cos(v))*(2+cos(v+np.pi*2/3))/8]) # Trefoil Knot [0, 2pi] [0, 2pi]
#surface = lambda u, v: np.array([a*cos(u)*sin(v), a*sin(u)*sin(v), a*(cos(v)*np.log(np.tan(v/2))) + b*u]) # Dini's Surface (1, 0.2) [0, 4pi] [0, 2]
#surface = lambda u, v: np.array([(d*(c-a*cos(u)*cos(v))+(b**2)*cos(u))/(a-c*cos(u)*cos(v)), b*sin(u)*(a-d*cos(v))/(a-c*cos(u)*cos(v)), b*sin(v)*(c*cos(u)-d)/(a-c*cos(u)*cos(v))]) # Dupin Cyclide (1, 0.95, 0.2, 0.3) [0, 2pi] [0, 2pi] 30 30
#surface = lambda u, v: np.array([(sqrt(2)*(cos(v)**2)*cos(2*u)+cos(u)*sin(2*v))/(2-sqrt(2)*sin(3*u)*sin(2*v)), (sqrt(2)*(cos(v)**2)*cos(2*u)-sin(u)*sin(2*v))/(2-sqrt(2)*sin(3*u)*sin(2*v)), 3*(cos(v)**2)/(2-sqrt(2)*sin(3*u)*sin(2*v))]) # Boy's Surface [-pi/2, pi/2] [0, pi]

u = np.linspace(0.01, 2*np.pi, du)
v = np.linspace(0.01, 2*np.pi, dv)

curves = [np.array([surface(u[0]+t, v[0]+s) for t in u]) for s in v]
perp_curves = [np.array([surface(u[0]+t, v[0]+s) for s in v]) for t in u]

def draw_curves(curves):
    for i in range(len(curves)):
        points = curves[i]
        for j in range(len(curves[i])-1):
            color = np.array([21, 121, 91]) # np.array([9, 215, 102])
            pygame.draw.line(win, color, scale * points[j][:2] + center, scale * points[(j+1)%len(points)][:2] + center, 2) # Lines
            #pygame.draw.line(win, np.floor_divide(np.array([9, 215, 102]),  np.abs(points[i][2]) + 1), scale * points[i][:2] + center, scale * points[(i+1)%len(points)][:2] + center, 2) # Depth Lines
            #pygame.draw.circle(win, np.array([9, 115, 2]), scale * points[j][:2] + center, 1) # Dots

def rotate_curves(curves, R):
    for i in range(len(curves)):
        curves[i] = curves[i] @ R

def play_sound(curve, recording = False):
    if not recording:
        repeat = int(fs / upsample)
        left = np.tile(scipy.signal.resample(curve[:,0], upsample), repeat)
        right = np.tile(scipy.signal.resample(curve[:,1], upsample), repeat)
        stereo = np.column_stack((left * volume, right * volume))
        sd.play(stereo, fs, blocking = True)
    else:
        sd.play(curve, fs, blocking = True)

if __name__ == '__main__':
    win = pygame.display.set_mode((width, height))
    pygame.display.set_caption('Projection')

    recording = False
    frames = 0

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
            elif event.type == KEYDOWN:
                # Play the audio for current image (P)
                if event.key == 112:
                    play_sound(full_curve, recording)
                    #play_sound(np.vstack((np.vstack(curves), np.vstack(perp_curves))))
                    #play_sound(np.vstack(curves))
                    #play_sound(np.vstack(perp_curves))
                # Begin / End recording of surface rotation to play (R)
                elif event.key == 114:
                    recording = not recording
        
        win.fill((255, 255, 255))

        draw_curves(curves)
        draw_curves(perp_curves)

        keys = pygame.key.get_pressed()
        if keys[pygame.K_UP]:
            R = np.array([[1, 0, 0], [0, cos(-theta), -sin(-theta)], [0, sin(-theta), cos(-theta)]])
            rotate_curves(curves, R)
            rotate_curves(perp_curves, R)
        if keys[pygame.K_DOWN]:
            R = np.array([[1, 0, 0], [0, cos(theta), -sin(theta)], [0, sin(theta), cos(theta)]])
            rotate_curves(curves, R)
            rotate_curves(perp_curves, R)
        if keys[pygame.K_LEFT]:
            R = np.array([[cos(-theta), 0, -sin(-theta)], [0, 1, 0], [sin(-theta), 0, cos(-theta)]])
            rotate_curves(curves, R)
            rotate_curves(perp_curves, R)
        if keys[pygame.K_RIGHT]:
            R = np.array([[cos(theta), 0, -sin(theta)], [0, 1, 0], [sin(theta), 0, cos(theta)]])
            rotate_curves(curves, R)
            rotate_curves(perp_curves, R)
        
        if recording:
            frames += 1
            if np.array_equal(full_curve, np.vstack(curves)):
                repeat = int(fs / upsample)
                #left = np.tile(scipy.signal.resample(np.vstack(curves)[:,0], upsample), repeat)
                #right = np.tile(scipy.signal.resample(np.vstack(curves)[:,1], upsample), repeat)
                left = scipy.signal.resample(np.append(np.vstack(curves)[:,0], np.vstack(perp_curves)[:,0]), upsample)
                right = scipy.signal.resample(np.append(np.vstack(curves)[:,1], np.vstack(perp_curves)[:,1]), upsample)
                full_curve = np.column_stack((left * volume, right * volume))
            repeat = int(fs / upsample)
            #left = np.tile(scipy.signal.resample(np.vstack(curves)[:,0], upsample), repeat)
            #right = np.tile(scipy.signal.resample(np.vstack(curves)[:,1], upsample), repeat)
            left = scipy.signal.resample(np.append(np.vstack(curves)[:,0], np.vstack(perp_curves)[:,0]), upsample)
            right = scipy.signal.resample(np.append(np.vstack(curves)[:,1], np.vstack(perp_curves)[:,1]), upsample)
            stereo = np.column_stack((left * volume, right * volume))
            if frames < 500:
                full_curve = np.vstack((full_curve, stereo))
        else:
            frames = 0
            full_curve = np.vstack(curves)
        
        print(len(full_curve))

        pygame.display.update()