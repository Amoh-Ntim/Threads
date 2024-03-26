import React, { useState, useEffect,useRef } from 'react';
import { Button, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import { Modal } from 'react-native';

const ViewThreads = () => {
  const [pressedPosts, setPressedPosts] = useState({});
  const [threads, setThreads] = useState([]);
  const [isOpen,setIsOpen] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const bottomSheetRef = useRef(null);
  // const DelbottomSheetRef = useRef(null);

  const handlePresentSheetPress = () => {
    bottomSheetRef.current.expand();
  };
  const handleCloseModal = () => {
  setIsVisible(false); // Hide the modal
}


  const imgDefault = require('../assets/Vectorlike.png');
  const imgOther = require('../assets/likedtrue.png');

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch('http://192.168.149.69:6000/thread/posts');
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
      const response = await fetch(`http://192.168.27.69:6000/thread/${id}`, {
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
    <>
    <SafeAreaView>
    <View style={tw`flex justify-center items-center mt-8`}>
        <Image
            source={require('../assets/Vectorlogothreads.png')}
        />
    </View> 
      <ScrollView style={tw`mb-32 mt-4`}>
        {threads.slice(0).reverse().map((thread) => (
          <View key={thread._id} style={tw`p-4 border-b border-gray-300`}>
          <View style={tw`flex flex-row mb-4`}>
          <Image
            source={require('../assets/photo_5814503674691567334_y.jpg')}
            style={{ width: 40, height: 40, borderRadius: 80, }}
            />
            <View  style={tw`flex justify-center items-center ml-2`}>
            <Text style={tw`text-lg font-bold`}>sammy🇬🇭  ✅</Text>
            </View>
          </View>
          <View>
            <Text style={tw`text-lg mb-2 ml-4`}>{thread.post}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {
            thread.imageUrl && (
            <Image
            source={{ uri: thread.imageUrl }}
            style={{ width: 300, height: 240, borderRadius: 20 }}
            resizeMode="stretch"
            onError={() => console.error('Image loading failed:', thread.imageUrl)}
          />         
            )    
          }
          </View>
          {/* view for the buttons */}
          <View style={tw`flex flex-row gap-x-4 mt-4 ml-4`}>
          <View>
          <TouchableOpacity onPress={() => handlePress(thread._id)}>
                <Image source={pressedPosts[thread._id] ? imgOther : imgDefault} />
          </TouchableOpacity>
           </View> 
           <View>
           <TouchableOpacity onPress={handlePresentSheetPress}>
          <Image
            source={require('../assets/Framecomment.png')}
          />
           </TouchableOpacity>
           </View>
           <View>
          <Image
            source={require('../assets/Framerepost.png')}
          />
           </View>
           <TouchableOpacity onPress={() => setIsVisible(true)}>
           <View>
          <Image
            source={require('../assets/FiTrash2.png')}
          />
           </View>
           </TouchableOpacity>
          </View>
          {/* modal view */}
          <Modal animationType="fade" visible={isVisible} onRequestClose={() => handleCloseModal()}>
          {/* Your modal content here */}
          <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
           <View style={tw`flex justify-center items-center text-gray-400 `}>
           <Text style={tw`text-lg font-bold`}>Are you sure you want to delete this post?</Text>
           </View>
           {/* buttons for deleteing */}
           <View style={tw`flex flex-row gap-x-4`}>
           <View style={tw`flex justify-center items-center text-lg text-gray-400 bg-violet-200 mt-4 rounded-lg py-2 px-4`}>
          <TouchableOpacity onPress={() => handleDelete(thread._id)}>
           <Text style={tw`font-bold text-lg`}>Delete Post</Text>
           </TouchableOpacity>
           </View>
           <View style={tw`flex justify-center items-center text-lg text-gray-400 bg-green-200 mt-4 rounded-lg py-2 px-4`}>
          <TouchableOpacity onPress={() => setIsVisible(false)} >
           <Text style={tw`font-bold text-lg`}>Cancel</Text>
           </TouchableOpacity>
           </View>
           </View>

           </View>
          </Modal>

          </View>
          
        ))}
      </ScrollView>
    </SafeAreaView>
      <BottomSheet
           ref={bottomSheetRef}
           index={0}
           snapPoints={['25%', '50%' ,'80%', ]}
           enablePanDownToClose={true}
           >
           <BottomSheetView>
           <Text style={tw`flex justify-center items-center text-lg ml-4 font-bold`}>Oops! No comments on this post yet! 😢</Text>
           <Text style={tw`flex justify-center items-center text-lg ml-20 text-gray-400`}>Be The First to comment</Text>
           </BottomSheetView>
           </BottomSheet>
    </>
  );
};

export default ViewThreads;

