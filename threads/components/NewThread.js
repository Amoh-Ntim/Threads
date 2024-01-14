import React, { useEffect, useState } from 'react'
// import axios from 'react-native-axios';
import { Button, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';
import FormData from 'form-data';
import axios from 'axios';



const NewThread = ({ navigation }) => {
    const [post, setPost] = useState('');
    // const [loading, setLoading] = useState(null)
    const [image, setImage] = useState(null);

    // useEffect(() => {
    //   const fetchPosts = async () => {
    //     try {
    //       const response = await fetch('http://localhost:6000/thread', {
    //         method: 'GET', // Assuming you're fetching posts with GET
    //         headers: {
    //           Accept: 'application/json',
    //         },
    //       });
    
    //       const postsData = await response.json();
    //       setPosts(postsData);
    //     } catch (error) {
    //       console.error('Error fetching posts:', error);
    //       // Handle errors appropriately
    //     }
    //   };
    
    //   fetchPosts();
    // }, []);
    
    const handlePost = async () => {
      try {
        const formData = new FormData();
        formData.append('post', post);
  
        if (image) {
          formData.append('image', {
            uri: image,
            name: 'myImage.jpg', // Adjust filename if needed
            type: 'image/jpeg',  // Adjust for other image types
          });
        }
  
        const response = await axios.post('http://192.168.51.69:6000/thread', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Handle successful posting
        console.log('Response Data:', response.data);
        alert('Thread posted successfully!');
        navigation.navigate('ViewThreads');
        setPost('');
        // Refetch posts if needed, using a function like fetchPosts
      } catch (error) {
        console.error('Error posting thread:', error);
        // Provide user-friendly error messages
      }
    };
    
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };
    return (
      <SafeAreaView>
      <View>
      <TextInput
        style={tw`h-48 p-4 text-lg`}
        multiline
        numberOfLines={4}
        onChangeText={setPost}
        value={post}
        placeholder="Start a thread..."
      />
      </View>
      <View style={tw`ml-8`}>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>

      <View style={tw`flex-row justify-between items-center px-4 mb-8 mt-8`}>
        <TouchableOpacity onPress={pickImage}>
        <Image
            source={require('../assets/FiCamera.png')}
          />
        </TouchableOpacity>
        <Text>Add an image to post</Text>
      </View>
            <View style={tw`flex-row justify-between items-center px-4`}>
        <Text>Anyone can reply</Text>
        <TouchableOpacity onPress={handlePost}>
        <Text style={tw`rounded-full py-2 px-4 bg-gray-400 text-white bg-[#1FB9FC]`}>Post</Text>
        </TouchableOpacity>
      </View>
     </SafeAreaView>


    );
}

export default NewThread
