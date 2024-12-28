import React, { } from 'react';
import 'react-native-url-polyfill/auto'
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Modal } from 'react-native';
import { Animated } from 'react-native';
import 'react-native-gesture-handler';

class CustomDialog extends React.Component {
    state = {
        opacity: new Animated.Value(0), // Proper initialization of Animated.Value
    };

    componentDidUpdate(prevProps) {
        if (!prevProps.visible && this.props.visible) {
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }).start();
        } else if (prevProps.visible && !this.props.visible) {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }).start();
        }
    }

    render() {
        console.log('Avatar Image Prop:', this.props.avatarImage);

        return (
            <Modal animationType="none" transparent={true} visible={this.props.visible}>
                <Animated.View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: this.state.opacity,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 10,
                            width: '80%',
                            height: 300,
                            borderColor: 'black',
                            borderWidth: 3,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 20,
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}
                        >
                            Traducción
                        </Text>

                        {this.props.title ? (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 20,
                                    marginBottom: 20,
                                    marginLeft: 20,
                                    marginRight: 20,
                                }}
                            >
                                <Image
                                    source={this.props.avatarImage}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        marginRight: 10,
                                    }}
                                />
                                <ScrollView
                                    style={{
                                        maxHeight: 170,
                                        flex: 1,
                                    }}
                                >
                                    <View
                                        style={{
                                            padding: 8,
                                            backgroundColor: '#FFB901',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: 16,
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {this.props.title}
                                        </Text>
                                    </View>
                                </ScrollView>
                            </View>
                        ) : (
                            <Image
                                source={require('./assets/images/loadingicon.gif')}
                                style={{
                                    width: 100,
                                    height: 100,
                                    position: 'absolute',
                                    top: 100,
                                    left: 100,
                                }}
                            />
                        )}

                        <TouchableOpacity
                            onPress={this.props.onClose}
                            style={{ alignSelf: 'center', marginTop: 'auto' }}
                        >
                            <Text style={{ color: 'grey', fontSize: 16, textAlign: 'center' }}>
                                {this.props.buttonLabel}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Modal>
        );
    }
}

export default CustomDialog;
