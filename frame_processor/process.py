import cv2
import numpy as np
import sys
from pymongo import MongoClient
from bson import ObjectId
import os

# run 
# python process.py /home/battisti/versionado/sinae/api/src/uploads/experimentos/pxt/1/24h/Q1_11000.jpg 40 5e0e5a65a7c6ed0024b5f219 1 218 228 2 214 310 3 52 390 4 51 306 5 55 60 6 136 60 7 220 60 8 55 142 9 136 142 10 220 142 11 55 225 12 136 225 13 136 310 14 136 395 15 215 395
# python process.py /home/battisti/versionado/sinae/frame_processor/experimentos/pxt/1/0/Q1_2000.jpg 40 5e0e5a65a7c6ed0024b5f219 b02 55 60 c02 136 60 d02 220 60  
# python process.py /home/battisti/versionado/sinae/frame_processor/experimentos/pxt/1/0/Q2_5000.jpg 40 5e0e5a65a7c6ed0024b5f219 b02 55 65 c02 136 65 d02 220 65
# python process.py /home/battisti/versionado/sinae/frame_processor/experimentos/pxt/1/0/Q1_2000.jpg 360 5e0e5a65a7c6ed0024b5f219 b02 440 480 c02 1088 480 d02 1760 480
# python process.py /home/battisti/versionado/sinae/frame_processor/experimentos/pxt/1/0/Q1_2000.jpg 360 5e0e5a65a7c6ed0024b5f219 b02 440 480 c02 1088 480 d02 1760 480 b02 440 480 c02 1088 480 d02 1760 480  b02 440 480 c02 1088 480 d02 1760 480  b02 440 480 c02 1088 480 d02 1760 480  

# python process.py /home/battisti/versionado/sinae/frame_processor/experimentos/pxt/1/0/Q1_2000.jpg 320 5e0e5a65a7c6ed0024b5f219 1 1728 3136 2 1048 3104 3 400 3112 4 440 480 5 1088 480 6 1760 480 7 440 1136 8 1088 1136 9 1760 1136 10 440 1800 11 1088 1800 12 1760 1800 13 440 2480 14 1088 2480 15 1760 2480

# parametros
# 1 - caminho da imagem 
# 2 - raio do poco
# 3 - Id do Frame no banco
# repetindo (4, 5, 6) nome do poco, x e y

r  = int(sys.argv[2])

# numero de pocos que foram inseridos na linha de comando, por padrao tem que ser 15
qtd_pocos = ((len(sys.argv) - 4) / 3)+1

img_name = sys.argv[1]

path = img_name.split('/')

quadrante = path[-1].split('_')[0]

path = '/'.join(path[0:-1])

files = []
# le todos os arquivos do diretorio
for rd, dd, fd in os.walk(path):
    for file in fd:
        if quadrante in file:
            files.append(os.path.join(rd, file))

# armazena a posicao no primeiro frame de cada poco
posicao_cada_poco = []

################
img_name = files[0]
img_original = cv2.imread(img_name, 0)

aux_nome = img_name.split('.')
aux_nome_data = img_name.split('/')
# nome_final = aux_nome_data[-1].split('_')
# mills = nome_final[1].split('.')

# pasta onde sera salva a imagem     
folder_name = '/'.join(aux_nome_data[:-1])+'/'+quadrante

# cria a pasta caso nao exista
try:
    os.makedirs(folder_name)
except OSError:
    pass

# aqui estamos pegando a posicao de cada poco dentro da imagem que sera cortada 
# de cada frame
for i in range(1,qtd_pocos):
    pos_nome = 3*(int(i)-1)+4
    nome = str(sys.argv[pos_nome])

    pos_y = 3*(int(i)-1)+5
    y = int(sys.argv[pos_y])

    pos_x = 3*(int(i)-1)+6
    x = int(sys.argv[pos_x])

    # crop image as a square
    ax = x - r
    bx = x + r
    ay = y - r
    by = y + r

    img = img_original[ax:bx, ay:by]    
    min_r = int(0.9*r)
    max_r = int(1.2*r)

    circles = cv2.HoughCircles(img, cv2.HOUGH_GRADIENT, 0.9, r, param1=1, param2=1, minRadius=min_r, maxRadius=max_r)
    
    # essa jah eh a imagem cortada por isso usamos o raio para todas as posicoes
    kx = r
    ky = r
    kr = r

    # se nao achou o circulo vai com fundo mesmo
    if circles is not None:
        circles = np.uint16(np.around(circles))
        kx, ky, kr = circles[0][0]

    posicao_cada_poco.append({'kx':kx,'ky':ky, 'kr':kr})

# processa todas as imagens do quadrante (por conta da posicao do x e y de cada poco e para distribuir o processamento)
for img_name in files:
   
    img_original = cv2.imread(img_name, 0)

    aux_nome = img_name.split('.')
    aux_nome_data = img_name.split('/')
    nome_final = aux_nome_data[-1].split('_')
    mills = nome_final[1].split('.')

    # lista com os pocos identificados dentro daquele frame
    pocos = []

    for i in range(1,qtd_pocos):        
        pos_nome = 3*(int(i)-1)+4
        nome = str(sys.argv[pos_nome])

        pos_y = 3*(int(i)-1)+5
        y = int(sys.argv[pos_y])

        pos_x = 3*(int(i)-1)+6
        x = int(sys.argv[pos_x])

        # crop image as a square
        ax = x - r
        bx = x + r

        ay = y - r
        by = y + r

        # print(ax, ay, bx, by)

        # img eh a imagem cortada contendo o circulo selecionado pelo usuario
        img = img_original[ax:bx, ay:by]
        
        # DEIXAR ISSO AQUI 
        # salva a imagem na pasta antes de pasar pelo circle
        # nome_img_poco_sem = folder_name+'/'+nome+'_'+mills[0]+'_org.'+aux_nome[1]
        # cv2.imwrite(nome_img_poco_sem,img)

        # essa jah eh a imagem cortada por isso usamos o raio para todas as posicoes
        kx = posicao_cada_poco[i-1]['kx']
        ky = posicao_cada_poco[i-1]['ky']
        kr = posicao_cada_poco[i-1]['kr']

        # create a mask
        mask = np.full((img.shape[0], img.shape[1]), 0, dtype=np.uint8) 

        # create circle mask, center, radius, fill color, size of the border
        cv2.circle(mask,(kx,ky), kr, (255,255,255),-1)

        # get only the inside pixels
        fg = cv2.bitwise_or(img, img, mask=mask)
        mask = cv2.bitwise_not(mask)
        background = np.full(img.shape, 255, dtype=np.uint8)
        bk = cv2.bitwise_or(background, background, mask=mask)
        img_final = cv2.bitwise_or(fg, bk)

        nome_img_poco = folder_name+'/'+nome+'_'+mills[0]+'.'+aux_nome[1]

        # print(nome_img_poco)
        # pocos.append(Poco(nome, nome_img_poco))
        poco = {}
        poco['nome'] = nome
        poco['url'] = nome_img_poco
        pocos += [poco]
        
        # salva a imagem na pasta
        cv2.imwrite(nome_img_poco,img_final)

    # MONGO DB SALVA DADOS
    client = MongoClient()
    db = client['sinae']
    collection = db['frames']
    id_frame = {'_id': ObjectId(sys.argv[3])}
    # atualiza o frame dizendo que ele ja foi processado
    frame = collection.find_one(id_frame)
    novos_valores = { '$set': { 'processado': True, 'pocos': pocos}}
    collection.update_one(id_frame, novos_valores)
    # print(frame)