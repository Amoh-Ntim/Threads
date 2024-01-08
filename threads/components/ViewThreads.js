import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';


const ViewThreads = () => {
  const [posts, setPosts] = useState([]);
  const [isPressed, setIsPressed] = useState(false);
  const [pressedPosts, setPressedPosts] = useState({});

  const imgDefault = require('../assets/Vectorlike.png');
  const imgOther = require('../assets/likedtrue.png');

  useEffect(() => {
    fetch('http://192.168.184.69:6000/thread')
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, [posts]);
  const navigation = useNavigation();

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://192.168.184.69:6000/thread/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedPosts = await fetch('http://192.168.184.69:6000/thread').then((response) => response.json());
      setPosts(updatedPosts);
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
    <View style={tw`flex justify-center items-center`}>
        <Image
            source={require('../assets/Vectorlogothreads.png')}
        />
    </View> 
      <ScrollView>
        {posts.slice(0).reverse().map((post) => (
          <View key={post._id} style={tw`p-4 border-b border-gray-200`}>
          <View>
            <Text style={tw`text-lg mb-8`}>{post.post}</Text>
          </View>
          {/* view for the buttons */}
          <View style={tw`flex flex-row gap-x-4`}>
          <View>
          <TouchableOpacity onPress={() => handlePress(post._id)}>
                <Image source={pressedPosts[post._id] ? imgOther : imgDefault} />
          </TouchableOpacity>
           </View> 
           <View style={tw``}>
          <Image
            source={require('../assets/Framecomment.png')}
          />
           </View>
           <View style={tw``}>
          <Image
            source={require('../assets/Framerepost.png')}
          />
           </View>
           <TouchableOpacity onPress={() => handleDelete(post._id)}>
           <View style={tw``}>
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

