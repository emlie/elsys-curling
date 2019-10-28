'''
import python_jwt as jwt
import gcloud
import sseclient
import crypto
from firebase import firebase

firebase = firebase.FirebaseApplication('https://curling-7.firebaseio.com', None)
result = firebase.get('/accData', None)
print(result)
'''


from firebase import Firebase
import pycrypto
import Crypto
import cryptography
from Crypto.PublicKey import RSA

config = {
  "apiKey": "AIzaSyBb0Va2ly57td4O3d7f1kg-otFkJhpmkeQ",
  "authDomain": "curling-7.firebaseapp.com",
  "databaseURL": "https://curling-7.firebaseio.com",
  "projectId": "curling-7",
  "storageBucket": "curling-7.appspot.com",
  "messagingSenderId": "467948403523",
  "appId": "1:467948403523:web:9eb6dd7b4b37061a618df6"
}

firebase = Firebase(config)
