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
} from "react-native";
import axios from "axios";
import { ACCESS_KEY, SECRET_KEY } from "./env.json";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState([]);
  const { height, width } = Dimensions.get("window");
  const [focused, setFocused] = useState(false);

  const scaleIn = useRef(new Animated.Value(0)).current;

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
      </View>
    );
  };

  return loading ? (
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
  ) : (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <FlatList horizontal pagingEnabled data={image} renderItem={renderItem} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
