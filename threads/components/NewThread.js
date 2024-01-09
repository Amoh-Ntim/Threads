import React, { useState } from 'react'
// import axios from 'react-native-axios';
import { Button, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';


const NewThread = ({ navigation }) => {
    const [post, setPost] = useState('');
    // const [loading, setLoading] = useState(null)
    const [image, setImage] = useState(null);

    const handlePost = async () => {
        try {
            let formData = new FormData();
    formData.append('post', post);

    // Check if there's an image to upload
    if (image) {
      // Fetch the image data
      let response = await fetch(image);
      let blob = await response.blob();

      // Add the image data to the form
      formData.append('image', { uri: image, name: 'image.jpg', type: 'image/jpeg' });
    }
    
            const response = await fetch('http://192.168.184.69:6000/thread', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const responseData = await response.json();
            console.log(responseData);
    
            // Handle successful post (e.g., clear text input, display success message)
            // alert('New Post added successfully!');
            navigation.navigate('ViewThreads');
            setPost(''); // Clear the input field
        } catch (error) {
            console.error('Error posting thread:', error);
    
            // Provide user-friendly error messages
            if (error.response) {
                alert('Server error: Please try again later.');
            } else if (error.request) {
                alert('Network error: Check your connection and try again.');
            } else {
                alert('No internet connection!!! Turn on your mobile data or WIFI');
            }
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
        <Text style={tw`rounded-full py-2 px-4 bg-gray-400 text-white`}>Post</Text>
        </TouchableOpacity>
      </View>
     </SafeAreaView>


    );
}

export default NewThread
