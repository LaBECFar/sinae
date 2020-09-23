import cv2
import numpy as np
import sys
from pymongo import MongoClient
from bson import ObjectId
import os
from torchvision.utils import save_image
from fastai.vision import *


#funções necessárias para usar o modelo AI

def lovasz_grad(gt_sorted):
    """
    Computes gradient of the Lovasz extension w.r.t sorted errors
    See Alg. 1 in paper
    """
    p = len(gt_sorted)
    gts = gt_sorted.sum()
    intersection = gts - gt_sorted.float().cumsum(0)
    union = gts + (1 - gt_sorted).float().cumsum(0)
    jaccard = 1. - intersection / union
    if p > 1: # cover 1-pixel case
        jaccard[1:p] = jaccard[1:p] - jaccard[0:-1]
    return jaccard

def flatten_binary_scores2(scores, labels, ignore=None):
    """
    Flattens predictions in the batch (binary case)
    Remove labels equal to 'ignore'
    """
    scores = scores.contiguous().view(-1)
    labels = labels.contiguous().view(-1)
    if ignore is None:
        return scores, labels
    valid = (labels != ignore)
    vscores = scores[valid]
    vlabels = labels[valid]
    return vscores, vlabels

def lovasz_hinge(logits, labels, per_image=False, ignore=None):
    """
    Binary Lovasz hinge loss
      logits: [B, H, W] Variable, logits at each pixel (between -\infty and +\infty)
      labels: [B, H, W] Tensor, binary ground truth masks (0 or 1)
      per_image: compute the loss per image instead of per batch
      ignore: void class id
    """
    # print(logits.min(), logits.max(), logits.size())
    logits=logits[:,1,:,:]
    labels = labels.squeeze(1)
    if per_image:
        loss = mean(lovasz_hinge_flat(*flatten_binary_scores(log.unsqueeze(0), lab.unsqueeze(0), ignore))
                          for log, lab in zip(logits, labels))
    else:
        loss = lovasz_hinge_flat(*flatten_binary_scores2(logits, labels, ignore))
    return loss

def lovasz_hinge_flat(logits, labels):
    """
    Binary Lovasz hinge loss
      logits: [P] Variable, logits at each prediction (between -\infty and +\infty)
      labels: [P] Tensor, binary ground truth labels (0 or 1)
      ignore: label to ignore
    """

    if len(labels) == 0:
        # only void pixels, the gradients should be 0
        return logits.sum() * 0.
    signs = 2. * labels.float() - 1.
    errors = (1. - logits * Variable(signs))
    errors_sorted, perm = torch.sort(errors, dim=0, descending=True)
    perm = perm.data
    gt_sorted = labels[perm]
    grad = lovasz_grad(gt_sorted)
    loss = torch.dot(torch.nn.functional.relu(errors_sorted), Variable(grad))
    return loss

def combined_loss(logits, labels):
    logits=logits[:,1,:,:].float()
    labels = labels.squeeze(1).float()
    
    lh_loss = lovasz_hinge_flat(*flatten_binary_scores2(logits, labels, ignore=0))
    bce_loss = F.binary_cross_entropy_with_logits(logits, labels)
    
    return 0.8 * bce_loss + lh_loss

def combined_loss2(logits, labels):
    logits=logits[:,1,:,:].float() - logits[:,0,:,:].float()
    labels = labels.squeeze(1).float()
    
    lh_loss = lovasz_hinge_flat(*flatten_binary_scores2(logits, labels))
    bce_loss = F.binary_cross_entropy_with_logits(logits, labels)
    
    return 0.8 * bce_loss + lh_loss

def dice_loss(logits, true, eps=1e-7):
    """Computes the Sørensen–Dice loss.
    Note that PyTorch optimizers minimize a loss. In this
    case, we would like to maximize the dice loss so we
    return the negated dice loss.
    Args:
        true: a tensor of shape [B, 1, H, W].
        logits: a tensor of shape [B, C, H, W]. Corresponds to
            the raw output or logits of the model.
        eps: added to the denominator for numerical stability.
    Returns:
        dice_loss: the Sørensen–Dice loss.
    """
    num_classes = logits.shape[1]
    if num_classes == 1:
        true_1_hot = torch.eye(num_classes + 1)[true.squeeze(1)]
        true_1_hot = true_1_hot.permute(0, 3, 1, 2).float()
        true_1_hot_f = true_1_hot[:, 0:1, :, :]
        true_1_hot_s = true_1_hot[:, 1:2, :, :]
        true_1_hot = torch.cat([true_1_hot_s, true_1_hot_f], dim=1)
        pos_prob = torch.sigmoid(logits)
        neg_prob = 1 - pos_prob
        probas = torch.cat([pos_prob, neg_prob], dim=1)
    else:
        true_1_hot = torch.eye(num_classes)[true.squeeze(1)]
        true_1_hot = true_1_hot.permute(0, 3, 1, 2).float()
        probas = F.softmax(logits, dim=1)
    true_1_hot = true_1_hot.type(logits.type())
    dims = (0,) + tuple(range(2, true.ndimension()))
    intersection = torch.sum(probas * true_1_hot, dims)
    cardinality = torch.sum(probas + true_1_hot, dims)
    dice_loss = (2. * intersection / (cardinality + eps)).mean()
    return (1 - dice_loss)

# run 
# sudo python process.py 1 40 5e11f5add6f73000247d162e 1 55 60 2 136 60 3 220 60 4 55 142 5 136 142 6 220 142 7 55 225 8 136 225 9 220 225 10 55 310 11 136 310 12 220 310 13 50 395 14 136 395 15 215 395
# docker build . -t frame_processor

# parametros
# 1 - quadrante
# 2 - raio
# 3 - Id do Frame no banco
# repetindo (4, 5, 6) nome do poco, x e y

r  = int(sys.argv[2])

quadrante = sys.argv[1]

# numero de pocos que foram inseridos na linha de comando, por padrao tem que ser 15
qtd_pocos = int(((len(sys.argv) - 4) / 3)+1)

# conecta no banco de dados  (DENTRO DO DOCKER)
client = MongoClient("mongodb://mongo:27017/")

db = client['sinae']
collection = db['frames']

# localiza todos os frames da analise x
id_frame = {'analiseId': sys.argv[3],'quadrante':int(quadrante)}
frames = collection.find(id_frame)

# armazena a posicao no primeiro frame de cada poco
posicao_cada_poco = []

img_name = frames[0]['url']
img_original = cv2.imread(img_name, 0)

aux_nome = img_name.split('.')
aux_nome_data = img_name.split('/')


# pasta onde serao salva a imagem, quero colocar o Q antes do quadrante
folder_name = '/'.join(aux_nome_data[:-1])+'/Q'+quadrante

# carrega o modelo AI
learner_location = '/usr/uploads/settings/modelo.pkl'
learner = load_learner(os.path.dirname(learner_location), os.path.basename(learner_location))

# cria a pasta para o quadrantecaso nao exista
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
    min_r = int(0.8*r)
    max_r = int(1.2*r)

    circles = cv2.HoughCircles(img, cv2.HOUGH_GRADIENT, 0.9, r, param1=1, param2=3, minRadius=min_r, maxRadius=max_r)
    
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
for frame in frames:
    
    img_name = frame['url']
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
        background = np.full(img.shape, 0, dtype=np.uint8)
        bk = cv2.bitwise_or(background, background, mask=mask)
        img_final = cv2.bitwise_or(fg, bk)

        nome_img_poco = folder_name+'/'+nome+'_'+mills[0]+'.'+aux_nome[1]

        poco = {}
        poco['nome'] = nome
        poco['url'] = nome_img_poco
        pocos += [poco]
        
        # save well image (poço)
        cv2.imwrite(nome_img_poco,img_final)

        # predict parasite through AI and saves prediction as image
        img_to_predict = open_image(nome_img_poco)
        prediction = learner.predict(img_to_predict)
        prediction_float = prediction[1].float()
        mask_filepath = nome_img_poco.replace(".","_pred.")
        save_image(prediction_float, mask_filepath)

        # use predicted image as mask (to separate parasite)
        mask = cv2.imread(mask_filepath, 0)
        mask = cv2.resize(mask, (img_final.shape[0], img_final.shape[1]))

        # apply mask
        res = cv2.bitwise_and(img_final, mask)

        # remove background color
        # res = cv2.cvtColor(res, cv2.COLOR_BGR2BGRA)
        res_filepath = nome_img_poco.replace(".","_seg.")
        # res[:, :, 3] = mask

        # saves resulting image
        cv2.imwrite(res_filepath, res)

    # MONGO DB SALVA DADOS
    collection = db['frames']
    id_frame = {'_id': frame['_id']}

    # atualiza o frame dizendo que ele ja foi processado
    frame = collection.find_one(id_frame)
    novos_valores = { '$set': { 'processado': True, 'pocos': pocos}}
    collection.update_one(id_frame, novos_valores)