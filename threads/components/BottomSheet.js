// import React, { useRef, useState } from 'react';
// import { Animated, PanGestureHandler, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// const BottomSheet = ({
//   children,
//   onOpen,
//   onClose,
//   initialOpen = false, // Optional prop for initial open state
//   backgroundColor = '#fff', // Customizable background color
//   handleColor = '#ccc', // Customizable handle color
//   borderRadius = 10, // Customizable border radius
//   contentStyle = {}, // Optional prop for additional content styling
//   overlayColor = 'rgba(0, 0, 0, 0.3)', // Customizable overlay color
//   overlayOpacity = 0.3, // Customizable overlay opacity
// }) => {
//   const [isOpen, setIsOpen] = useState(initialOpen);
//   const translateY = useRef(new Animated.Value(1)).current;

//   const open = () => {
//     setIsOpen(true);
//     Animated.timing(translateY, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//     onOpen && onOpen(); // Call optional callback on open
//   };

//   const close = () => {
//     setIsOpen(false);
//     Animated.timing(translateY, {
//       toValue: 1,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//     onClose && onClose(); // Call optional callback on close
//   };

//   const handlePanGesture = Animated.event(
//     [{ nativeEvent: { translationY: translateY } }],
//     { useNativeDriver: true }
//   );

//   return (
//     <GestureHandlerRootView>
//       <Animated.View
//         style={[
//           styles.bottomSheet,
//           { transform: [{ translateY }], backgroundColor },
//           borderRadius && { borderRadius },
//         ]}
//       >
//         <PanGestureHandler onGestureEvent={handlePanGesture}>
//           <View style={[styles.content, contentStyle]}>
//             {children}
//             <View style={[styles.handle, { backgroundColor: handleColor }]} />
//           </View>
//         </PanGestureHandler>
//       </Animated.View>
//       {isOpen && (
//         <TouchableOpacity style={[styles.overlay, { opacity: overlayOpacity }]} onPress={close} />
//       )}
//     </GestureHandlerRootView>
//   );
// };

// const styles = StyleSheet.create({
//   bottomSheet: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     padding: 16,
//     alignItems: 'center',
//   },
//   content: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//   },
//   handle: {
//     width: 50,
//     height: 5,
//     borderRadius: 2.5,
//     marginVertical: 10,
//   },
//   overlay: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//   },
// });

// export default BottomSheet;
