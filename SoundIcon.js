import React from 'react';
import { TouchableOpacity, Animated, Easing, Image } from 'react-native';
import { Audio } from 'expo-av';

class SoundIcon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rotation: new Animated.Value(0),
            isWiggling: false,
        };

        this.startWiggle = this.startWiggle.bind(this);
        this.stopWiggle = this.stopWiggle.bind(this);
    }

    async stopWiggle() {
        console.log('Stopping wiggle animation');
        this.state.rotation.stopAnimation(() => {
            this.state.rotation.setValue(0);
            this.setState({ isWiggling: false }); // Set isWiggling to false
        });
        await Audio.setIsEnabledAsync(false); // Stop any sound playing
        await Audio.setIsEnabledAsync(true); // Re-enable audio for future use
    }

    startWiggle() {
        console.log('Starting wiggle animation');
        this.setState({ isWiggling: true }); // Set isWiggling to true
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.state.rotation, {
                    toValue: 1,
                    duration: 100,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(this.state.rotation, {
                    toValue: -1,
                    duration: 200,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(this.state.rotation, {
                    toValue: 0,
                    duration: 100,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }

    render() {
        if (!this.props.currentMessage.showSoundIcon && !this.props.currentMessage.showSoundIcon2) {
            return null;
        }

        const spin = this.state.rotation.interpolate({
            inputRange: [-1, 1],
            outputRange: ['-10deg', '10deg'],
        });

        let leftPosition = 160;
        if (this.props.currentMessage.showSoundIcon2) {
            leftPosition = 120;
        }

        return (
            <TouchableOpacity
                onPress={async () => {
                    if (this.state.isWiggling) {
                        await this.stopWiggle(); // Stop the wiggle animation and sound
                    } else {
                        this.startWiggle();
                        if (this.props.currentMessage) {
                            await this.props.playSound(this.props.currentMessage.text, this.stopWiggle);
                        }
                    }
                }}
                style={{
                    width: 25,
                    height: 25,
                    position: 'absolute',
                    bottom: -3,
                    left: leftPosition,
                    right: 0,
                    alignItems: 'center',
                    zIndex: 21,
                }}
            >
                <Animated.Image
                    source={require('./assets/images/bluesound.png')}
                    style={{
                        width: 40,
                        height: 40,
                        resizeMode: 'contain',
                        transform: [{ rotate: spin }],
                    }}
                />
            </TouchableOpacity>
        );
    }
}

export default SoundIcon;
