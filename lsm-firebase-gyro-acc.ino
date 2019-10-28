/*
  Blink

  Turns an LED on for one second, then off for one second, repeatedly.

  Most Arduinos have an on-board LED you can control. On the UNO, MEGA and ZERO
  it is attached to digital pin 13, on MKR1000 on pin 6. LED_BUILTIN is set to
  the correct LED pin independent of which board is used.
  If you want to know what pin the on-board LED is connected to on your Arduino
  model, check the Technical Specs of your board at:
  https://www.arduino.cc/en/Main/Products

  modified 8 May 2014
  by Scott Fitzgerald
  modified 2 Sep 2016
  by Arturo Guadalupi
  modified 8 Sep 2016
  by Colby Newman

  This example code is in the public domain.

  http://www.arduino.cc/en/Tutorial/Blink
*/


/*
   Created by K. Suwatchai (Mobizt)

   Email: k_suwatchai@hotmail.com

   Github: https://github.com/mobizt

   Copyright (c) 2019 mobizt
*/


/*
  Arduino LSM6DS3 - Simple Gyroscope

  This example reads the gyroscope values from the LSM6DS3
  sensor and continuously prints them to the Serial Monitor
  or Serial Plotter.

  The circuit:
  - Arduino Uno WiFi Rev 2 or Arduino Nano 33 IoT

  created 10 Jul 2019
  by Riccardo Rizzo

  This example code is in the public domain.
*/


/*
  Arduino LSM6DS3 - Simple Accelerometer

  This example reads the acceleration values from the LSM6DS3
  sensor and continuously prints them to the Serial Monitor
  or Serial Plotter.

  The circuit:
  - Arduino Uno WiFi Rev 2 or Arduino Nano 33 IoT

  created 10 Jul 2019
  by Riccardo Rizzo

  This example code is in the public domain.
*/


/*
  ––––––––––––––––––––––––––––––––––––––––
  ELSYSGK H19 GROUP 7: SMART CURLINGSTEIN 
  ––––––––––––––––––––––––––––––––––––––––
 
  Arduino Wifi Rev 2 connects to wifi,
  and then to Google Firebase.
  
  Integrated IMU on Rev 2 reads xyz of linear acceleration (accelerometer)
  and angular velocity (gyroscope).
  
  IMU data is pushed to Firebase via wifi.
  
  Rev 2 blinks every time data is pushed.
  
  Code is based on:
  - Examples – 01. Basics – Blink
  - Examples – Arduino Firebase based on WifiNINA – Basic
    (https://github.com/mobizt/Firebase-Arduino-WiFiNINA)
  - Examples – Arduino LSM6DS3 - Simple Gyroscope
  - Examples - Arduino LSM6DS3 - Simple Accelerometer
 */


#include <Arduino_LSM6DS3.h>

// Required WiFiNINA Library for Arduino from https://github.com/arduino-libraries/WiFiNINA
#include "Firebase_Arduino_WiFiNINA.h"

#define FIREBASE_HOST "curling-7.firebaseio.com"
#define FIREBASE_AUTH "018v2mR618K84IvGCmM8xeq4mr42ODQdF7IozCyI"
#define WIFI_SSID "Mia GS8"
#define WIFI_PASSWORD "qjuv4510"

// Define Firebase data object
FirebaseData firebaseData;




void setup() {

  // initialize digital pin LED_BUILTIN as an output.
  pinMode(LED_BUILTIN, OUTPUT);

  // Open serial port
  Serial.begin(9600);
  delay(100);
  Serial.println();

  // Connect to wifi
  Serial.print("Connecting to Wi-Fi");
  int status = WL_IDLE_STATUS;

  while (status != WL_CONNECTED) {
    status = WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print(".");
    delay(300);
  }

  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  // Provide the authentication data
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH, WIFI_SSID, WIFI_PASSWORD);
  Firebase.reconnectWiFi(true);

  // Initialize IMU
  while (!Serial);

  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");

    while (1);
  }

  /*
    Serial.print("Gyroscope sample rate = ");
    Serial.print(IMU.gyroscopeSampleRate());
    Serial.println(" Hz");
    Serial.println();
    Serial.println("Gyroscope in degrees/second");
    Serial.println("X\tY\tZ");
  */

  /*
    Serial.print("Accelerometer sample rate = ");
    Serial.print(IMU.accelerationSampleRate());
    Serial.println(" Hz");
    Serial.println();
    Serial.println("Acceleration in G's");
    Serial.println("X\tY\tZ");
  */

}




void loop() {

  float aX,aY, aZ, gX, gY, gZ;

  // Paths in Firebase
  String pathAcc = "/accData";
  String pathGyro = "/gyroData";

  if (IMU.accelerationAvailable()) {

    if (IMU.gyroscopeAvailable()) {

      IMU.readAcceleration(aX, aY, aZ);

      IMU.readGyroscope(gX, gY, gZ);

      // Acceleration data to JSON object (string)
      String jsonAX = "{\"aX\":" + String(aX) + ",";
      String jsonAY = "\"aY\":" + String(aY) + ",";
      String jsonAZ = "\"aZ\":" + String(aZ) + "}";
      String jsonAXYZ = jsonAX + jsonAY + jsonAZ;

      // Gyroscope data to JSON object (string)
      String jsonGX = "{\"gX\":" + String(gX) + ",";
      String jsonGY = "\"gY\":" + String(gY) + ",";
      String jsonGZ = "\"gZ\":" + String(gZ) + "}";
      String jsonGXYZ = jsonGX + jsonGY + jsonGZ;

      if (Firebase.pushJSON(firebaseData, pathAcc, jsonAXYZ)) {
        Serial.println("----------Push result-----------");
        Serial.println("PATH: " + firebaseData.dataPath());
        Serial.print("PUSH NAME: ");

        // Acceleration data
        Serial.println("Acceleration in G's");
        Serial.println("aX\taY\taZ");
        Serial.print(aX);
        Serial.print("\t");
        Serial.print(aY);
        Serial.print("\t");
        Serial.println(aZ);

        // Randomly generated primary key
        Serial.println(firebaseData.pushName());
        Serial.println("--------------------------------");
        Serial.println();

        /*
        // blink
        digitalWrite(LED_BUILTIN, HIGH);   // Turn the LED on (HIGH is the voltage level)
        delay(1000);                       // Wait for a second
        digitalWrite(LED_BUILTIN, LOW);    // Turn the LED off by making the voltage LOW
        delay(1000);
        */

        if (Firebase.pushJSON(firebaseData, pathGyro, jsonGXYZ)) {
        Serial.println("----------Push result-----------");
        Serial.println("PATH: " + firebaseData.dataPath());
        Serial.print("PUSH NAME: ");

        // Gyroscope data
        Serial.println("Gyroscope in degrees/second");
        Serial.println("gX\tgY\tgZ");
        Serial.print(gX);
        Serial.print("\t");
        Serial.print(gY);
        Serial.print("\t");
        Serial.println(gZ);

        // Randomly generated primary key
        Serial.println(firebaseData.pushName());
        Serial.println("--------------------------------");
        Serial.println();

        // Blink
        digitalWrite(LED_BUILTIN, HIGH);   // Turn the LED on (HIGH is the voltage level)
        delay(1000);                       // Wait for a second
        digitalWrite(LED_BUILTIN, LOW);    // Turn the LED off by making the voltage LOW
        delay(1000);
        }
        else {
          Serial.println("----------Can't push data--------");
          Serial.println("REASON: " + firebaseData.errorReason());
          Serial.println("--------------------------------");
          Serial.println();
        }
      
      }
      else {
        Serial.println("----------Can't push data--------");
        Serial.println("REASON: " + firebaseData.errorReason());
        Serial.println("--------------------------------");
        Serial.println();
      }

    }
  }

}
