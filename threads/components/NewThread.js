import React, { useState } from 'react'
// import axios from 'react-native-axios';
import { Button, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
const NewThread = ({ navigation }) => {
    const [post, setPost] = useState('');
    // const [loading, setLoading] = useState(null)

    const handlePost = async () => {
        try {
            const data = {
                post,
                // ...other fields
            };
    
            const response = await fetch('http://192.168.122.69:6000/thread', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
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
    
      
    return (
      <SafeAreaView>
      <ScrollView>
      <TextInput
        style={tw`h-48 p-4 text-lg`}
        multiline
        numberOfLines={4}
        onChangeText={setPost}
        value={post}
        placeholder="Start a thread..."
      />
      </ScrollView>
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
