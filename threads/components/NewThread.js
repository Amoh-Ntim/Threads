import React, { useState } from 'react'
import { Button, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
const NewThread = () => {
    const [text, setText] = useState('');

    return (
      <SafeAreaView>
      <ScrollView>
      <TextInput
        style={tw`h-48 p-4 text-lg`}
        multiline
        numberOfLines={4}
        onChangeText={setText}
        value={text}
        placeholder="Start a thread..."
      />
      </ScrollView>
      <View style={tw`flex-row justify-between items-center px-4`}>
        <Text>Anyone can reply</Text>
        <TouchableOpacity>
        <Text style={tw`rounded-full py-2 px-4 bg-gray-400 text-white`}>Post</Text>
        </TouchableOpacity>
      </View>
     </SafeAreaView>


    );
}

export default NewThread
