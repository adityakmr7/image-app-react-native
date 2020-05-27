import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { ACCESS_KEY, SECRET_KEY } from "./env.json";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState([]);
  const { height, width } = Dimensions.get("window");
  const [focused, setFocused] = useState(false);

  const scaleIn = useRef(new Animated.Value(0)).current;
  const actionBarY = useRef(new Animated.Value(1)).current;

  const scaleInImage = (item) => {
    setFocused(!focused);
    if (focused) {
      Animated.spring(scaleIn, {
        toValue: 0.9,
      }).start();
    } else {
      Animated.spring(scaleIn, {
        toValue: 1,
      }).start();
    }
  };

  const URL = `https://api.unsplash.com/photos/random?count=30&client_id=${ACCESS_KEY}`;
  useEffect(() => {
    loadWallpapers();
  }, []);

  const loadWallpapers = () => {
    axios
      .get(URL)
      .then((res) => {
        setImage(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        console.log("request completed");
      });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: "black",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color="grey" />
        </View>
        <TouchableWithoutFeedback onPress={() => scaleInImage(item)}>
          <Animated.View
            key={item.id}
            style={[{ height, width }, { transform: [{ scale: scaleIn }] }]}
          >
            <Image
              style={{ flex: 1, height: null, width: null }}
              source={{ uri: item.urls.regular }}
            />
          </Animated.View>
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: actionBarY.interpolate({
              inputRange: [0.9, 1],
              outputRange: [0, -80],
            }),
            height: 80,
            backgroundColor: "white",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => alert("loadImages")}
            >
              <Ionicons name="ios-refresh" color="white" size={40} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={"large"} color="grey" />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <FlatList
          scrollEnabled={!focused}
          horizontal
          pagingEnabled
          data={image}
          renderItem={renderItem}
        />
      </SafeAreaView>
    );
  }
}
