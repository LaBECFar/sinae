import cv2
import numpy as np
import sys

img_name = sys.argv[1]
r  = int(sys.argv[2])

px = 450
py = 500

img_original = cv2.imread(img_name, 0)

x = px - r
y = py + r

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

# cv2.imshow('image',final)
cv2.imwrite("./img_example/final.jpg",final)

# cv2.waitKey(0)
# cv2.destroyAllWindows()