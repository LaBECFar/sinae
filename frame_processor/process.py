import cv2
import numpy as np
import sys
from pymongo import MongoClient
from bson import ObjectId
import os

# run 
# python process.py /home/battisti/versionado/sinae/frame_processor/experimentos/pxt/1/0/Q1_2000.jpg 40 5e0e5a65a7c6ed0024b5f219 b02 55 60 c02 136 60 d02 220 60  
# python process.py /home/battisti/versionado/sinae/frame_processor/experimentos/pxt/1/0/Q2_5000.jpg 40 5e0e5a65a7c6ed0024b5f219 b02 55 60 c02 136 60 d02 220 60  

# parametros
# 1 - caminho da imagem 
# 2 - raio do poco
# 3 - Id do Frame no banco
# repetindo (4, 5, 6) nome do poco, x e y

img_name = sys.argv[1]
r  = int(sys.argv[2])

px = 450
py = 500

img_original = cv2.imread(img_name, 0)

# numero de pocos que foram inseridos na linha de comando, por padrao tem que ser 15
qtd_pocos = ((len(sys.argv) - 4) / 3)+1

aux_nome = img_name.split('.')
aux_nome_data = img_name.split('/')
nome_final = aux_nome_data[-1].split('_')
mills = nome_final[1].split('.')

try:
    os.makedirs(aux_nome[0])
except OSError:
    pass

# print(mills[0])
# sys.exit()

pocos = []

for i in range(1,qtd_pocos):
    pos_nome = 3*(int(i)-1)+4
    nome = str(sys.argv[pos_nome])

    pos_x = 3*(int(i)-1)+5
    x = int(sys.argv[pos_x]) - r

    pos_y = 3*(int(i)-1)+6
    y = int(sys.argv[pos_y]) + r

    # crop image as a square
    img = img_original[y:y+r*2, x:x+r*2]

    # create a mask
    mask = np.full((img.shape[0], img.shape[1]), 0, dtype=np.uint8) 

    # create circle mask, center, radius, fill color, size of the border
    cv2.circle(mask,(r,r), r, (255,255,255),-1)

    # get only the inside pixels
    fg = cv2.bitwise_or(img, img, mask=mask)
    mask = cv2.bitwise_not(mask)
    background = np.full(img.shape, 255, dtype=np.uint8)
    bk = cv2.bitwise_or(background, background, mask=mask)
    final = cv2.bitwise_or(fg, bk)

    nome_img_poco = aux_nome[0]+'/'+nome+'.'+aux_nome[1]

    # salva a imagem na pasta
    cv2.imwrite(nome_img_poco,final)

    # pocos.append(Poco(nome, nome_img_poco))

    poco = {}
    poco['nome'] = nome
    poco['url'] = nome_img_poco
    pocos += [poco]


# MONGO DB SALVA DADOS
client = MongoClient()
db = client['sinae']
collection = db['frames']
id_frame = {'_id': ObjectId(sys.argv[3])}
# atualiza o frame dizendo que ele ja foi processado
frame = collection.find_one(id_frame)
novos_valores = { '$set': { 'processado': True, 'pocos': pocos}}
collection.update_one(id_frame, novos_valores)
print(frame)


