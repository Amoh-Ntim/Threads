import React from 'react'
import { Image, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc';

const ViewThreads = () => {
  return (
    <SafeAreaView>
    <View style={tw`flex justify-center items-center`}>
        <Image
            source={require('../assets/Vectorlogothreads.png')}
        />
    </View>
    <View>
        <View>
            
        </View>
    </View>
    </SafeAreaView>
  )
}

export default ViewThreads
