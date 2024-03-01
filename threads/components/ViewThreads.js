import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';



const ViewThreads = () => {
  // const [posts, setPosts] = useState([]);
  const [pressedPosts, setPressedPosts] = useState({});
  const [threads, setThreads] = useState([]);
  // const [imageUrl, setImageUrl] = useState('');

  const imgDefault = require('../assets/Vectorlike.png');
  const imgOther = require('../assets/likedtrue.png');

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch('http://192.168.86.69:6000/thread/post');
        const threadsData = await response.json();
        setThreads(threadsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchThreads();
  }, []);
  

  const navigation = useNavigation();
  
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://192.168.86.69:6000/thread/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Remove the deleted thread from local state
      setThreads(threads => threads.filter(thread => thread._id !== id));
  
      const responseData = await response.json();
      console.log(responseData);
      navigation.navigate('ViewThreads');
    } catch (error) {
      console.error('Error deleting thread:', error);
  
      // Provide user-friendly error messages
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        alert('Network error: Check your connection and try again.');
      } else {
        alert('Server error: Please try again later.');
      }
    }
  };
  
  const handlePress = (id) => {
    setPressedPosts(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  return (
    <SafeAreaView>
    <View style={tw`flex justify-center items-center mt-8 `}>
        <Image
            source={require('../assets/Vectorlogothreads.png')}
        />
    </View> 
      <ScrollView>
        {threads.slice(0).reverse().map((thread) => (
          <View key={thread._id} style={tw`p-4 border-b border-gray-200`}>
          <View>
            <Text style={tw`text-lg mb-8`}>{thread.post}</Text>
          </View>
          <View>
          {
            thread.image && (
            <Image
            source={{ uri: thread.imageUrl }}
            style={{ width: 200, height: 200 }}
            onError={() => console.error('Image loading failed:', thread.image.url)}
          />         
            )    
          }
          </View>
          {/* view for the buttons */}
          <View style={tw`flex flex-row gap-x-4`}>
          <View>
          <TouchableOpacity onPress={() => handlePress(thread._id)}>
                <Image source={pressedPosts[thread._id] ? imgOther : imgDefault} />
          </TouchableOpacity>
           </View> 
           <View>
          <Image
            source={require('../assets/Framecomment.png')}
          />
           </View>
           <View>
          <Image
            source={require('../assets/Framerepost.png')}
          />
           </View>
           <TouchableOpacity onPress={() => handleDelete(thread._id)}>
           <View>
          <Image
            source={require('../assets/FiTrash2.png')}
          />
           </View>
           </TouchableOpacity>
          </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewThreads;

