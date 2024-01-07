import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native';
import tw from 'twrnc';

const ViewThreads = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://192.168.122.69:6000/thread')
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  return (
    <SafeAreaView>
    <View style={tw`flex justify-center items-center`}>
        <Image
            source={require('../assets/Vectorlogothreads.png')}
        />
    </View> 
      <ScrollView>
        {posts.map((post) => (
          <View key={post._id} style={tw`p-4 border-b border-gray-200`}>
          <View>
            <Text style={tw`text-lg`}>{post.post}</Text>
          </View>
          {/* view for the buttons */}
          <View style={tw`flex flex-row gap-x-4`}>
          <View>
          <Image
            source={require('../assets/Vectorlike.png')}
          />
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
           <View style={tw``}>
          <Image
            source={require('../assets/Framesend.png')}
          />
           </View>
          </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewThreads;

