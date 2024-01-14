  import React, { useState, useEffect } from 'react';
  import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
  import tw from 'twrnc';
  import axios from 'axios';
  import { useNavigation } from '@react-navigation/native';
    
    const ViewThreads = () => {
      const [posts, setPosts] = useState([]);
      const [pressedPosts, setPressedPosts] = useState({});
    
      const imgDefault = require('../assets/Vectorlike.png');
      const imgOther = require('../assets/likedtrue.png');
    
      const navigation = useNavigation();
    
      useEffect(() => {
        const fetchPosts = async () => {
          try {
            const response = await axios.get('http://192.168.51.69:6000/threads');
            setPosts(response.data);
          } catch (error) {
            console.error('Error fetching posts:', error);
            // Handle errors appropriately
          }
        };
    
        fetchPosts();
      }, []);
    
      
    
    const handlePress = (id) => {
      setPressedPosts(prevState => ({
        ...prevState,
        [id]: !prevState[id]
      }));
    };


    return (
      <View style={{ flex: 1 }}>
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
        <View>
          {post.image && post.image.url && (
            <Image source={{ uri: post.image.url }} style={{ width: 200, height: 200 }} />
          )}
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
      </View>
    );
  };

  export default ViewThreads;

