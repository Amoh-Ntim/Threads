import React, { useState } from 'react'
import { Button, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';


const NewThread = ({ navigation }) => {
    const [post, setPost] = useState('');
    const [image, setImage] = useState(null);

    const handlePost = async () => {
    try {
    let formData = new FormData();
    formData.append('post', post);

    // Check if there's an image to upload
    if (image) {
      const fileType = image.split('.').pop();

      formData.append('image', {
        uri: image,
        name: `image.${fileType}`,
        type: `image/${fileType}`,
      });
    }
    
            const response = await fetch('http://192.168.149.69:6000/thread/posts', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const responseData = await response.json();
            // const imageUrl = responseData.imageUrl;
            console.log(responseData);
    
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
      <View style={tw`flex justify-center items-center mt-8 `}>
        <Image
            source={require('../assets/Vectorlogothreads.png')}
        />
    </View>
      <View>
      {/* profile */}
      <View style={tw`flex items-end mr-2`}>
            <View style={tw`mr-4`}>
            <Image
            source={require('../assets/photo_5814503674691567334_y.jpg')}
            style={{ width: 40, height: 40, borderRadius: 80, }}
            />
            </View>
            <View  style={tw`flex ml-2`}>
            <Text style={tw`text-lg font-bold`}>sammy🇬🇭</Text>
            </View>
      </View>
            
      <TextInput
        style={tw`h-48 px-4 text-lg`}
        multiline
        numberOfLines={4}
        onChangeText={setPost}
        value={post}
        placeholder="Start a thread..."
      />
      </View>
      <View style={tw`ml-8`}>
      {image && <Image source={{ uri: image }} style={{ width: 300, height: 300 , borderRadius: 20 }} resizeMode="cover"/>}
      </View>

      <View style={tw`flex-row justify-between items-center px-4 mb-2 mt-4`}>
        <TouchableOpacity onPress={pickImage}>
        <Image
            source={require('../assets/FiCamera.png')}
          />
        </TouchableOpacity>
        <Text>Add an image to post</Text>
      </View>
        <View style={tw`flex-row justify-between items-center px-4 mb-4`}>
        <Text>Anyone can reply</Text>
        <TouchableOpacity onPress={handlePost}>
        <Text style={tw`rounded-full py-2 px-4 bg-gray-700 text-white`}>Post</Text>
        </TouchableOpacity>
      </View>
     </SafeAreaView>


    );
}

export default NewThread
