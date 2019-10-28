from firebase import firebase
firebase = firebase.FirebaseApplication('https://curling-7.firebaseio.com', None)
result = firebase.get('/accData', None)
print(result)