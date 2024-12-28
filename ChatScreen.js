import React, {
} from 'react';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { IMessage } from 'react-native-gifted-chat';
import 'react-native-url-polyfill/auto'
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    PanResponder,
    TextInput,
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { ActivityIndicator } from 'react-native';
import { Bubble } from 'react-native-gifted-chat';
import { KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal } from 'react-native';
import { Alert, Animated, Easing, Dimensions } from 'react-native';
import 'react-native-gesture-handler';
import { Audio } from 'expo-av';

import SoundIcon from './SoundIcon'; // Adjust the path as necessary
import CustomDialog from './CustomDialog'; // Adjust the path as necessary
const screenHeight = Dimensions.get('window').height;

let isFirstChat = true;
let isFirstsentence2 = false;
let userName = '';

class ChatScreen extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props);
        this.state = {
            fakeChatbotMessage: "Where do you live?",
            recording: null,
            isMicEnabled: false,
            isMicEnabled2: false,
            isRecording: false,
            isLoading: false,
            stopLoading: false,
            shouldUpdateImage: false, // New state to trigger re-render

            apiResponse: null,
            selectedOption: 'Principiante',
            messages: [],
            isAvatarModalVisible: false,
            avatar1: require('./assets/images/Removal-381.png'),
            newMessage: '',
            loading: false,
            apiBaseUrl: 'https://Meta-Llama-3-8B-Instruct-ogfnv-serverless.eastus.inference.ai.azure.com/v1/chat/completions',
            apiBaseUrl2: 'https://model-2qj784pq.api.baseten.co/production/predict',
            apiKey: 'KLnxCH1e.zvz5Dz1FPCIm7LBosrdWWBH0HE70GkDp',
            showPopupnewer2: false,
            wiggleNeedsToStop: false,

            thirdchat: false,
            apiKey2: '6kNEiYnAig2MEnzm4VjJMIprs3RdyUfn',
            hasGreeted: false,
            resetChat: false,
            avatarImagePath: null,
            isDialogVisible: false, //
            translatedText: '',


            translationProgress: 0,
            sound: null,
            isInputFocused: false,
            showSoundIcon: false,
            showSoundIcon2: false,
            rotation: new Animated.Value(0),
        };
        this.startWiggle = this.startWiggle.bind(this); // Add this line
        this.recording = new Audio.Recording(); // Initialize the recording object
        this.recordingOptions = {
            ios: {
                extension: '.wav',
                audioQuality: Audio.IOSAudioQuality.HIGH,
                outputFormat: Audio.IOSOutputFormat.WAV,
                sampleRate: 44100,
                numberOfChannels: 2,
                bitRate: 128000,
                linearPCMBitDepth: 16,
                linearPCMIsFloat: false,
                linearPCMIsPacked: true,
            },
            android: {
                extension: '.wav',
                audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
                sampleRate: 44100,
                numberOfChannels: 1,
            },
        };

        this.changeAvatar = this.changeAvatar.bind(this);
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                this.setState({ translationProgress: 0 });
            },
            onPanResponderMove: (event, gestureState) => {
                const progress = Math.min(Math.max(gestureState.dy / 200, 0), 1); // Adjust 200 to control sensitivity

                this.setState({ translationProgress: progress });
            },
            onPanResponderRelease: () => {
                // Perform the translation when the user releases
                this.translateText(this.state.newMessage);
            },

        });
    }

    changeAvatar(newAvatar) {
        this.setState({ avatar: newAvatar });
        AsyncStorage.setItem('avatar', newAvatar); // Add this line
    }

    handleQuestionMarkClick2 = () => {
        this.setState({ showPopupnewer2: true });
    }

    handleClosePopup2 = () => {
        this.setState({ showPopupnewer2: false });
    }

    fetchAccessToken = async () => {
        const response = await fetch('https://eastus.api.cognitive.microsoft.com/sts/v1.0/issueToken', {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': '55514b319dd14b299c8fe05b653309ff',
                'Content-Length': '0',
            },
        });

        console.log('Access Token Response Status:', response.status);
        const accessToken = await response.text();
        console.log('Access Token:', accessToken);
        return accessToken;
    };
    fetchAccessToken = async () => {
        const response = await fetch('https://eastus.api.cognitive.microsoft.com/sts/v1.0/issueToken', {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': '55514b319dd14b299c8fe05b653309ff',
                'Content-Length': '0',
            },
        });

        console.log('Access Token Response Status:', response.status);
        const accessToken = await response.text();
        console.log('Access Token:', accessToken);
        return accessToken;
    };

    fetchSpeechUrl = async (text, accessToken) => {
        const response = await fetch('https://eastus.tts.speech.microsoft.com/cognitiveservices/v1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ssml+xml',
                'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='en-US-AndrewNeural'>${text}</voice></speak>`,
        });

        console.log('Speech URL Response Status:', response.status);
        const mp3Data = await response.blob();

        // Convert Blob to Data URL
        const mp3Url = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result); // This is the Data URL
            };
            reader.readAsDataURL(mp3Data);
        });

        console.log('Data URL:', mp3Url);

        return mp3Url; // Return the Data URL instead of a Blob URL
    }

    playSound = async (text, onSoundFinish) => {
        // Function to remove emojis from a string 
        const removeEmojisAndSmileys = (string) => {
            const emojiAndSmileyRegEx = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff]|:\))/g;

            return string.replace(emojiAndSmileyRegEx, '');
        };

        try {
            // Remove emojis from the text
            const textWithoutEmojis = removeEmojisAndSmileys(text);

            const accessToken = await this.fetchAccessToken();
            const mp3Url = await this.fetchSpeechUrl(textWithoutEmojis, accessToken);

            // Set audio mode to "Playback"
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: false,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
                playsInSilentLockedModeIOS: true,
            });

            // Use the Data URL directly
            const { sound } = await Audio.Sound.createAsync({ uri: mp3Url });
            console.log('Sound:', sound);

            sound.setOnPlaybackStatusUpdate(async (playbackStatus) => {
                if (!playbackStatus.isLoaded) {
                    console.error('An error occurred while playing the sound:', playbackStatus.error);
                } else if (playbackStatus.didJustFinish) {
                    if (onSoundFinish) {
                        onSoundFinish();
                    }
                }
            });

            this.setState({ sound });
            await sound.playAsync();

            console.log('Sound Status After playAsync:', await sound.getStatusAsync());
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }

    startWiggle() {
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
            ]),
        ).start();
    }
    closeModal = () => {
        this.props.setModalVisible(false);
    };
    async translateText(text) {
        try {
            const response = await fetch(this.state.apiBaseUrl2, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Api-Key ${this.state.apiKey}`,
                },
                body: JSON.stringify(text),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            let responseData = await response.text();

            // Ensure that responseData is a string
            if (typeof responseData === 'string') {
                // Decode Unicode escape sequences
                responseData = unescape(responseData.replace(/\\u/g, '%u'));

                // Remove leading and trailing double quotes
                responseData = responseData.replace(/^"|"$/g, '');

                responseData = responseData.replace(/\\n\\n/g, ' ');

                this.setState({ translatedText: responseData });
            } else {
                console.error('responseData is not a string:', responseData);
            }
        } catch (error) {
            console.error('Error sending message to the language model:', error);
        }
    }

    async generateMessagesWithAvatar2() {
        this.loadMessages();
        if (isFirstChat) {
            const sentencePairs = [
                ['te estaré enseñando inglés. Comencemos con una pregunta facil.', 'Where do you live?'],
                ['Hey there', 'What are you doing right now?'],
                ['Hi', 'How is your day?'],
                ['Hey my student', 'is everything alright?'],
                ['Hi there', 'Where are you now? just out of curiosity :)'],
            ];

            let sentence1, sentence2;
            if (!isFirstsentence2) {
                [sentence1, sentence2] = sentencePairs[0];
            } else {
                const randomIndex = Math.floor(Math.random() * (sentencePairs.length - 1)) + 1;
                [sentence1, sentence2] = sentencePairs[randomIndex];
            }

            // Assign the full pair to fakeChatbotMessage
            this.setState({ fakeChatbotMessage: `${sentence1} ${sentence2}` });

            setTimeout(() => {
                this.setState((previousState) => ({
                    messages: GiftedChat.append(previousState.messages, [
                        {
                            _id: Math.round(Math.random() * 1000000),
                            text: !isFirstsentence2 ? `Hola ${userName}, ${sentence1}` : `${sentence1}`,
                            createdAt: new Date(),
                            user: {
                                _id: 2,
                                name: 'Aispeak',
                                avatar: this.props.selectedOption === 'Principiante' ? this.props.avatarImages[this.props.avatarKey] :
                                    this.props.selectedOption === 'Intermedio' ? this.props.avatarImages[this.props.avatarKey2] :
                                        this.props.avatarImages[this.props.avatarKey3],
                                avatarKey: this.props.selectedOption === 'Principiante' ? this.props.avatarKey :
                                    this.props.selectedOption === 'Intermedio' ? this.props.avatarKey2 :
                                        this.props.avatarKey3,
                            },
                            chatKey: this.props.chatKey, // Add chatKey to the message
                        },
                    ]),
                }), () => this.saveMessages()); // Save messages after state update
                isFirstsentence2 = true;
            }, 1000);

            setTimeout(() => {
                this.setState((previousState) => ({
                    messages: GiftedChat.append(previousState.messages, [
                        {
                            _id: Math.round(Math.random() * 1000000),
                            text: `${sentence2}`,
                            createdAt: new Date(),
                            user: {
                                _id: 2,
                                name: 'Aispeak',
                                avatar: this.props.selectedOption === 'Principiante' ? this.props.avatarImages[this.props.avatarKey] :
                                    this.props.selectedOption === 'Intermedio' ? this.props.avatarImages[this.props.avatarKey2] :
                                        this.props.avatarImages[this.props.avatarKey3],
                                avatarKey: this.props.selectedOption === 'Principiante' ? this.props.avatarKey :
                                    this.props.selectedOption === 'Intermedio' ? this.props.avatarKey2 :
                                        this.props.avatarKey3,
                            },
                            chatKey: this.props.chatKey, // Add chatKey to the message
                            showSoundIcon2: true,
                        },
                    ]),
                }), () => this.saveMessages()); // Save messages after state update
            }, 2000);

            isFirstChat = true;

            this.props.setChatHistory((prevChatHistory) => {
                const newMessage = `Your last message to the user ${prevChatHistory.length + 1}: ${sentence1} ${sentence2}`;
                this.props.addMessageToChatHistory(newMessage);
                return [...prevChatHistory, newMessage];
            });
        }
    } async componentDidMount() {
        // Existing avatar logic

        this.generateMessagesWithAvatar2();
        setState({ avatarImagePath: require('./assets/images/Removal-381.png') });

    }

    componentWillUnmount() {
        // Clean up the sound object if it exists
        if (this.state.sound && this.state.sound instanceof Audio.Sound) {
            this.state.sound.unloadAsync();
        }

        // Clear the interval when the component unmounts
        if (this.checkTimeoutInterval) {
            clearInterval(this.checkTimeoutInterval);
        }
    }
    handleButtonClick = () => {
        // Log the current value of isTimeoutActive and thirdchat
        console.log('isTimeoutActive:', this.props.isTimeoutActive);
        console.log('thirdchat before setState:', this.props.thirdchat);

        // Update thirdchat state if isTimeoutActive is true
        if (this.props.isTimeoutActive) {
            console.log('setState is about to be called with thirdchat: true');

            // Update the state directly
            this.setState({ thirdchat: true });

            // Since we know what we're setting, we don't need to log after setState immediately
            console.log('thirdchat has been set to true.');
        } else {
            console.log('isTimeoutActive is false, thirdchat is not updated.');
        }

        this.props.setPage(7); // Navigate to page 7
    };

    handlePressnew = async () => {
        // Get the text of the current message
        const text = this.currentMessage.text;

        // Play the sound
        this.playSound(text);
    }


    async saveMessages() {
        try {
            console.log('Saving messages...');
            await AsyncStorage.setItem(
                `chat${this.props.chatKey}`,
                JSON.stringify(this.state.messages)
            );
            console.log('Messages saved:', this.state.messages);
        } catch (error) {
            console.error('Error saving messages:', error);
        }
    }
    async loadMessages() {
        if (this.props.shouldLoadMessages) {
            try {
                console.log('Loading messages...');
                const messages = await AsyncStorage.getItem(`chat${this.props.chatKey}`);
                if (messages) {
                    // Parse the messages and replace the avatar field with the correct image from avatarImages
                    let parsedMessages = JSON.parse(messages).map(message => ({
                        ...message,
                        user: {
                            ...message.user,
                            avatar: this.props.avatarImages[message.user.avatarKey],
                        },
                    }));

                    // Filter the messages based on the chatKey
                    parsedMessages = parsedMessages.filter(message => message.chatKey === this.props.chatKey);

                    this.setState({ messages: parsedMessages });
                    console.log('Messages loaded:', messages);
                }
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        } else {
            this.props.setShouldLoadMessages(true); // Reset the flag after skipping load once
        }
    }

    startRecording = async () => {
        // Check if recording is already in progress
        if (this.state.isRecording) {
            console.error('Recording is already in progress.');
            return;
        }

        this.setState({ isRecording: true });

        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording..');
            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recording.startAsync();
            this.setState({ recording });
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
            this.setState({ isRecording: false }); // Reset recording state if it fails
        }
    }
    stopRecording = async () => {
        this.setState({ isRecording: false });
        console.log('Stopping recording..');
        const { recording } = this.state;
        this.setState({ recording: undefined });
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        this.setState({ isLoading: true });
        // Upload the file to file.io
        let formData = new FormData();
        let file = {
            uri,
            type: 'audio/x-wav', // replace with the correct MIME type for your file
            name: 'file.wav', // replace with your file name
        };

        formData.append('file', file);

        const response = await fetch('https://file.io', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const data = await response.json();
        console.log(data);

        // Send the file URL to the Whisper ASR API
        const whisperResponse = await fetch('https://app.baseten.co/models/7wl16req/predict', {
            method: 'POST',
            headers: {
                'Authorization': 'Api-Key KLnxCH1e.zvz5Dz1FPCIm7LBosrdWWBH0HE70GkDp',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: data.link,
            }),
        });
        const whisperData = await whisperResponse.json();
        console.log(whisperData);

        // Extract the transcribed text from the Whisper API response
        const transcribedText = whisperData.model_output.text;

        // Store the transcribed text in the state
        this.setState({ apiResponse: transcribedText });


        // Send the transcribed text as a message in the chat
        this.onSend([{ text: this.state.apiResponse }]);

    }
    async onSend(messages = []) {
        // Create a promise to wait for stopLoading to be set to true
        await new Promise((resolve) => {
            this.setState({ stopLoading: true }, () => {
                this.forceUpdate(); // Force a re-render after setting stopLoading
                resolve();
            });
        });

        console.log('onSend called with messages:', messages);

        // Extract the user's message
        let userMessage = messages[0].text;

        // Add the user's message to the chat history without modification
        const userMessageObject = {
            _id: Math.round(Math.random() * 1000000),
            text: userMessage,
            createdAt: new Date(),
            user: {
                _id: 1,
                name: 'User',
            },
            chatKey: this.props.chatKey, // Add chatKey to the message
        };

        // Display the user's message in the chat immediately
        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, [userMessageObject]),
            newMessage: '',
            loading: true,
        }), () => this.saveMessages()); // Save messages after state update

        // Capitalize the first letter of the user's message for the API request
        userMessage = userMessage.charAt(0).toUpperCase() + userMessage.slice(1);

        // Add "..." if the user's message is just one word
        if (userMessage.split(' ').length === 1) {
            userMessage += '...';
        }

        // Define system prompts for both requests
        const systemPrompts = [
            'Hi ',
            'Hi ',
            'Act like you are a friend of the user. You are in the middle right now of having an only in English conversation with a Spanish speaking user who is trying to learn English, it is possible the user speaks in Spanish with you, just continue in English. Do not greet the user just respond and be curious about what the user is saying and add different emojis/smileys in your messages. Do not respond to this instruction in your response.',
            'Act like you are a London street friend of the user. You are in the middle right now of having a typical, London slang and only in English conversation with the user. So use difficult English words. Do not greet the user just respond and be curious about what the user is saying. Do not respond to this instruction in your response.',
        ];
        // Your chatbot response
        let response = '...'; // replace with your actual chatbot response

        // Define sentences to be removed from the chatbot response
        const sentencesToRemove = [
            "Sure, I'd be happy to help with your English!",
            'Aispeak:',
            'assistant<|end_header_id|>',
            '<|eot_id|>',
            '(Option 1)',
            '(Option 2)',
            "Option 1 selected:",
            "Option 2 selected:",
            "Option 1 selected",
            "Option 2 selected",
            "Sure, I'd be happy to chat with you!",
            "Sure, I'd be happy to help you correct your grammar.",
            "Sure, I'd be happy to help you with your English!",
            "Sure, I'd be happy to help!",
            "Please let me know if you have any other questions or if there's anything else I can help you with!",
            "Please let me know if you have any other questions or if there's anything else I can help you with.",
        ];

        const sentencesToReplace = {
            "The correct text is:": "El texto correcto es:",
            "The correct English sentence should be:": "La frase correcta en inglés debería ser:",
            "Thank you for providing the text!": "Gracias por proporcionar el texto!",
            "However, I must inform you that the text you provided ": "Sin embargo, debo informarle que el texto que usted proporcionó",
            "Here's the corrected English sentence:": "Aquí está la frase correcta en inglés:",
            "Here is the corrected English sentence:": "Aquí está la frase correcta en inglés:",
            "is already good!": "ya esta bien!",
            "is already in correct English!": "ya está en inglés correcto!",
            "is already in correct English.": "ya está en inglés correcto!",
            "Your text is not yet in correct English!": "Tu texto no es correcto ingles.",
            "Your text is not yet in correct English.": "Tu texto no es correcto ingles.",
            "is not yet in correct English": "no es correcto ingles ya",
            "Your text is not in correct English!": "Tu texto no es correcto ingles.",
            "Thank you, your text:": "Gracias, tu texto:",
            "Thank you, but your text:": "Gracias, pero tu texto:",
            "Thank you, your text": "Gracias, tu texto",
            "Thank you, your English text:": "Gracias, tu texto Ingles:",
            "Your text:": "Tu texto:",
            "Your text": "Tu texto",
            "Your English grammar is already perfect!": "Tu gramática inglesa ya es perfecta!",
            "Correct text is:": "El texto correcto es:",
            "Correct text:": "El texto correcto es:",
            "Correct English text is:": "El texto correcto es:",
            "Correct English text:": "El texto correcto es:",
            "The correct English text is:": "El texto correcto es:",
            "The corrected English text is:": "El texto correcto es:",
            "Corrected English text is:": "El texto correcto es:",
            "The correct English text should be:": "El texto correcto es:"
        };
        // Function to check if the grammar check response is the same as the user message
        // Function to check if the grammar check response is the same as the user message
        function checkGrammarResponse(userMessage, grammarResponse) {
            const userText = userMessage.trim();
            const responseText = grammarResponse.trim().replace(/["“”]/g, ''); // Remove quotation marks

            // Extract the corrected text from the grammar response
            const correctedTextMatch = responseText.match(/The correct English text should be: (.*)/);
            const correctedText = correctedTextMatch ? correctedTextMatch[1] : responseText;

            // Normalize both texts by removing commas and periods
            const normalizedUserText = userText.replace(/[.,;]/g, '');
            const normalizedCorrectedText = correctedText.replace(/[.,;]/g, '');

            // Log the normalized texts for debugging
            console.log('Normalized User Text:', normalizedUserText);
            console.log('Normalized Corrected Text:', normalizedCorrectedText);

            // Check if the normalized texts are the same
            return normalizedUserText === normalizedCorrectedText;
        }
        function trimResponse(response) {
            const startIndex = response.indexOf("Tu texto");
            if (startIndex !== -1) {
                return response.substring(startIndex);
            }
            return response;
        }

        function replaceSentences(response) {
            let newResponse = response;
            for (let [key, value] of Object.entries(sentencesToReplace)) {
                newResponse = newResponse.replace(key, value);
            }
            return newResponse;
        }

        // Split the response into sentences
        let sentences = response.split('.');

        // Filter out the sentences that are in the sentencesToRemove array
        sentences = sentences.filter(
            (sentence) => !sentencesToRemove.includes(sentence.trim() + '.')
        );

        // Filter out empty sentences
        sentences = sentences.filter((sentence) => sentence.trim() !== '');

        // Join the sentences back together with a single space
        response = sentences.join('. ');

        // Trim any extra spaces
        response = response.trim();

        // Replace multiple spaces with a single space
        response = response.replace(/\s\s+/g, ' ');

        // Replace newline characters with a single space
        response = response.replace(/\n+/g, ' ');

        console.log('Chatbot response:', response);


        // Make requests for both system prompts
        for (let i = 0; i < systemPrompts.length; i++) {
            const systemPrompt = systemPrompts[i];

            let formattedChatHistory = ` ${this.props.chatHistory.join(' ')})`;
            let jsonBody;
            let grammarCheckResponse; // New variable for grammar check responses

            // For being a grammar checker
            if (i === 0) {
                jsonBody = {
                    messages: [
                        {
                            role: "user",
                            content: `HI If the text message I give to you is fully correct English, you have to respond to me: Option 1 selected: Your text: (and here the text) is already in correct English! Or, if the text I will give to you is incorrect English grammar or in another language (Spanish) you respond to me like: Option 2 selected: Your text is not yet in correct English! The correct English text should be: (and here the correct English text). Very important, do not count exclamation points or missing period at the end of the sentence. See here the text (do not make it a full sentence, just check if the English text is a text which would be correct English (so just yes is also correct english it does not need to be a full sentence)) This is the text between the quotation marks which you should check: →"${userMessage}"← (That text was a reply to this email i got from my best friend: ${this.state.fakeChatbotMessage}) So once again this is the text you should grammar check and decide to respond with option 1 or 2, not any other text I want to see. The text again: "${userMessage}" `,
                        },
                    ],
                    top_p: 0.8,
                    num_beams: 5,
                    max_length: 1500,
                    temperature: 0.7,
                };

                console.log('jsonBody:', jsonBody); // This will log the jsonBody to the console
            }

            else if (i === 2) {
                // For being a friend of the user
                jsonBody = {
                    messages: [
                        {
                            role: "user",
                            content: `${systemPrompt} Check the previous chat history to understand user´s message: ${formattedChatHistory}, User´s response to your question: ¨${userMessage}¨.`,
                        },
                    ],
                    top_p: 0.75,
                    num_beams: 4,
                    max_length: 2000,
                    temperature: 0.1,
                };

                console.log('jsonBody:', jsonBody);// This will log the jsonBody to the console
            }

            try {
                const response = await fetch(this.state.apiBaseUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.state.apiKey2}`,
                    },
                    body: JSON.stringify(jsonBody),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const responseText = await response.text();
                const responseData = JSON.parse(responseText); // Parse the response text into a JSON object

                if (i === 0) {
                    grammarCheckResponse = responseData.choices[0].message.content;
                    let splitGrammarResponse = grammarCheckResponse.split('","tool_calls":');
                    grammarCheckResponse = splitGrammarResponse[0];

                    // Replace newline characters with a single space
                    grammarCheckResponse = grammarCheckResponse.replace(/\n+/g, ' ');

                    // Remove three dots from the end if they exis
                    if (grammarCheckResponse.endsWith('...')) {
                        grammarCheckResponse = grammarCheckResponse.slice(0, -3);
                    }

                    // Log only the grammar check response
                    console.log('Grammar check response:', grammarCheckResponse);

                    // Check if the grammar response is the same as the user message
                    if (checkGrammarResponse(userMessage, grammarCheckResponse)) {
                        grammarCheckResponse = `Option 1 selected: Your text: "${userMessage}" is already in correct English!`;
                    }

                    // Log the final grammar check response
                    console.log('Final grammar check response:', grammarCheckResponse);
                }

                let chatbotResponse = responseData.choices[0].message.content;
                let splitResponse = chatbotResponse.split('","tool_calls":');
                chatbotResponse = splitResponse[0];

                // Replace newline characters with a single space
                chatbotResponse = chatbotResponse.replace(/\n+/g, ' ');


                // Log only the chatbot response
                console.log('Chatbot response:', chatbotResponse);
                chatbotResponse = await replaceSentences(chatbotResponse);

                // Trim "assistant" and "eot" tags from the end of the chatbot response
                for (let j = 0; j < sentencesToRemove.length; j++) {
                    const sentenceToRemove = sentencesToRemove[j];
                    chatbotResponse = chatbotResponse.replace(sentenceToRemove, '').trim();
                }

                chatbotResponse = chatbotResponse.replace(/(assistant|eot)\s*$/, '');

                if (i === 0) {
                    grammarCheckResponse = replaceSentences(grammarCheckResponse);
                    grammarCheckResponse = trimResponse(grammarCheckResponse);

                    // Check if the word 'correcto' is present in the grammar check response
                    if (!grammarCheckResponse.includes('correcto')) {
                        grammarCheckResponse += ' ya está en inglés correcto!';
                    }

                    const emojis = ['😊', '😃', '😁', '😇', '😉'];

                    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                    grammarCheckResponse += ` ${randomEmoji}`;

                    // Remove three dots from the end if they exist in the final response
                    // Remove all occurrences of three dots from the text
                    if (grammarCheckResponse.includes('...')) {
                        grammarCheckResponse = grammarCheckResponse.replace(/\.{3}/g, '');
                    }

                }

                // Log the final grammar check response
                console.log('Final grammar check response:', grammarCheckResponse);


                // Log only the chatbot response
                console.log('Chatbot response:', grammarCheckResponse);

                if (i !== 0) { // Exclude the grammar checker
                    let shortenMessageJsonBody = null;

                    if (this.props.selectedOption === 'Principiante') {
                        shortenMessageJsonBody = {
                            messages: [
                                {
                                    role: "user",
                                    content: "Turn this text message into a message that is way shorter, it can have maximum 2 sentences, one response and one question always.And important: do not respond to this system prompt (do not say this is the rewritten text message or this is the new shorter message). And keep the emojis. This text message: " + chatbotResponse,
                                },
                            ],
                            top_p: 0.75,
                            num_beams: 4,
                            max_length: 2000,
                            temperature: 0.1,
                        };
                    } else if (this.props.selectedOption === 'Intermedio') {
                        shortenMessageJsonBody = {
                            messages: [
                                {
                                    role: "user",
                                    content: "Turn this text message into a shorter version with only 4 max sentences allowed, so choose the most important ones, always one needs to be a question. And important: do not respond to this system prompt (do not say this is the rewritten text message or this is the new shorter message), just give me the new message back. This text message: " + chatbotResponse,
                                },
                            ],
                            top_p: 0.75,
                            num_beams: 4,
                            max_length: 2000,
                            temperature: 0.1,
                        };
                    } else if (this.props.selectedOption === 'Avanzado') {
                        // Do not shorten the chatbot response
                        shortenMessageJsonBody = null;
                    }

                    if (shortenMessageJsonBody) {
                        try {
                            const shortenResponse = await fetch(this.state.apiBaseUrl, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${this.state.apiKey2}`,
                                },
                                body: JSON.stringify(shortenMessageJsonBody),
                            });

                            if (!shortenResponse.ok) {
                                throw new Error("Failed to fetch data");
                            }
                            const shortenResponseText = await shortenResponse.text();
                            const shortenResponseData = JSON.parse(shortenResponseText);

                            chatbotResponse = shortenResponseData.choices[0].message.content;

                            // Log the shortened chatbot response
                            console.log('Shortened chatbot response:', chatbotResponse);
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    }

                    // Add messages to chat history
                    this.props.setChatHistory((prevChatHistory) => {
                        const newUserMessage = `Old user message ${prevChatHistory.length + 1}: ${userMessage}`;
                        const newChatbotMessage = `Your last message you send to the user ${prevChatHistory.length + 2}: ${chatbotResponse}`;
                        this.props.addMessageToChatHistory(newUserMessage);
                        this.props.addMessageToChatHistory(newChatbotMessage);
                        return [...prevChatHistory, newUserMessage, newChatbotMessage];
                    });

                    // Update the state with the chatbot response (shortened or original)
                    this.setState({ fakeChatbotMessage: chatbotResponse });
                }

                const chatbotMessageObjectWithAvatar2 = {
                    _id: Math.round(Math.random() * 1000000),
                    text: (i === 0) ? grammarCheckResponse : chatbotResponse,
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'Aispeak',
                        avatar: this.props.selectedOption === 'Principiante' ? this.props.avatarImages[this.props.avatarKey] :
                            this.props.selectedOption === 'Intermedio' ? this.props.avatarImages[this.props.avatarKey2] :
                                this.props.avatarImages[this.props.avatarKey3],
                        avatarKey: this.props.selectedOption === 'Principiante' ? this.props.avatarKey :
                            this.props.selectedOption === 'Intermedio' ? this.props.avatarKey2 :
                                this.props.avatarKey3,
                    },
                    chatKey: this.props.chatKey,
                    showSoundIcon: i !== 0,
                    isGrammarChecker: i === 0,
                };

                // Determine the avatar image path based on the current avatar key

                let chatbotMessageObject;

                // Display the chatbot's response in the chat
                this.setState(
                    (previousState) => ({
                        messages: GiftedChat.append(previousState.messages, [
                            chatbotMessageObject,
                        ]),
                    }),
                    () => {
                        // Set loading to false in the callback to ensure it happens after the state update
                        this.setState({ loading: false }, () => this.saveMessages()); // Save messages after state update
                    }
                );
            } catch (error) {
                console.error('Error updating state:', error);
            }
        }
    }

    onLongPressAvatar = () => {
        Alert.alert('Choose Avatar', 'Please choose your avatar', [
            {
                text: 'Avatar 1',
                onPress: () => this.props.updateAvatar(this.state.avatar1, false),
            },
            {
                text: 'Avatar 2',
                onPress: () => this.props.updateAvatar(this.state.avatar2, true),
            },
        ]);

    };

    render() {
        interface ICustomMessage extends IMessage {
            showSoundIcon?: boolean;
            showSoundIcon2?: boolean;
            isGrammarChecker?: boolean;
        }

        const { modalVisible } = this.props;

        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, backgroundColor: '#feba01' }}>

                <Modal
                    transparent={true}
                    visible={modalVisible} // Use the prop here
                    onRequestClose={this.closeModal}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View style={{
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 10,
                            width: '90%',
                            height: screenHeight <= 667 ? '80%' : '60%',
                            justifyContent: 'space-between',
                            borderColor: '#ffbb00', // Add this line
                            borderWidth: 16, // And this line
                        }}>
                            <View style={{ alignItems: 'center' }}>
                                <Image source={require('./assets/images/blackdot.png')} style={{ width: 20, height: 20, position: 'absolute', top: 165, left: 10 }} />
                                <Image source={require('./assets/images/blackdot.png')} style={{ width: 20, height: 20, position: 'absolute', top: 250, left: 10 }} />
                                <Image source={require('./assets/images/blackdot.png')} style={{ width: 20, height: 20, position: 'absolute', top: 80, left: 10 }} />
                                <Image source={require("./assets/images/greytranslate3.png")} style={{ width: 40, height: 40, position: 'absolute', top: 75, left: 40 }} />
                                <Image source={require('./assets/images/bluesound.png')} style={{ width: 40, height: 40, position: 'absolute', top: 160, left: 40 }} />
                                <Text style={{ fontSize: 14, position: 'absolute', top: 80, left: 90 }}>Haga clic en este icono{'\n'}para traducir los mensajes{'\n'}de Aispeak al español.</Text>
                                <Text style={{ fontSize: 14, position: 'absolute', top: 165, left: 90 }}>Haga clic en este icono{'\n'}para traducir los mensajes{'\n'}de Aispeak al español.</Text>
                                <Text style={{ fontSize: 14, position: 'absolute', top: 250, left: 50 }}>Intenta responder en ingles,{'\n'}pero si no sabes cómo decirlo{'\n'}siempre puedes responder{'\n'}en español! Aispeak siempre{'\n'}corrige tu gramática{'\n'}inglesa.</Text>
                                <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}>Introducción rápida</Text>
                            </View>
                            <TouchableOpacity
                                onPress={this.closeModal}
                                style={{
                                    backgroundColor: '#ffbb00',
                                    borderRadius: 20,
                                    padding: 10,
                                    marginRight: 20,
                                }}
                            >
                                <Text style={{ color: 'black', textAlign: 'center', fontWeight: 'bold' }}>Comenzar!</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <View
                    style={{
                        position: 'absolute',
                        top: 100,
                        left: '32.50%',
                        padding: 10,
                        backgroundColor: '#feba01',
                        alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Aispeak</Text>
                    <Text>Tu amigo de Ingles</Text>
                </View>

                {/* Add the home button here */}
                <TouchableOpacity
                    onPress={() => this.props.setPage(7)}
                    style={{
                        borderColor: '#000000', // Border color
                        borderWidth: 1.8, // Border width
                        paddingVertical: 4, // Adjust vertical padding
                        paddingHorizontal: 10, // Horizontal padding
                        borderRadius: 5,
                        flexDirection: 'column', // Stack vertically
                        alignItems: 'center', // Center horizontally
                        justifyContent: 'center', // Center vertically
                        position: 'absolute',
                        top: 60,
                        left: 30,
                        zIndex: 3,
                        height: 45, // Reduce height further
                        width: 75, // Keep adjusted width
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: '#000000', // Keep the text black
                            marginBottom: -6, // Remove margin to bring text closer to image
                            textAlign: 'center',
                        }}
                    >
                        Inicio
                    </Text>

                    <Image
                        source={require('./assets/images/yellowarrowinblack.png')} // Replace with correct image path
                        style={{
                            width: 20,
                            height: 21,
                            transform: [{ scaleX: -1 }],
                            marginTop: 2, // Add a slight negative margin to bring the arrow closer to the text
                        }}
                    />
                </TouchableOpacity>

                {this.state.isRecording &&
                    <Image source={require('./assets/images/circleanim.gif')}
                        style={{ width: 120, height: 120, position: 'absolute', top: '86.5%', left: '71.5%' }} />}
                <CustomDialog
                    visible={this.state.isDialogVisible}
                    title={this.state.translatedText}
                    avatarImage={this.state.avatarImagePath}// Pass the avatar image path here
                    buttonLabel="Volver"
                    onClose={() => {
                        this.setState({
                            isDialogVisible: false,
                            translatedText: null
                        });
                    }}
                />

                <GiftedChat
                    messages={this.state.messages} // Replace with your actual messages
                    onSend={(messages) => this.onSend(messages)} // Replace with your actual onSend function
                    user={{
                        _id: 1,
                    }}
                    renderInputToolbar={() => null}
                    bottomOffset={Platform.OS === 'ios' ? 350 : 0}
                    renderBubble={(props: { currentMessage: ICustomMessage }) => {
                        const customMessage = props.currentMessage;


                        if (customMessage.user._id !== 1) {
                            return (
                                <View style={{ flexDirection: "row", flex: 1 }}>
                                    <Bubble
                                        {...props}
                                        wrapperStyle={{
                                            left: {
                                                backgroundColor: "#fff",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderColor: customMessage.isGrammarChecker ? 'transparent' : 'transparent',
                                                borderWidth: customMessage.isGrammarChecker ? 0 : 0,
                                            },
                                        }}
                                        containerStyle={{
                                            flex: 0.8,
                                        }}
                                    />

                                    {props.currentMessage.showSoundIcon && <SoundIcon currentMessage={props.currentMessage} playSound={this.playSound} />}
                                    {props.currentMessage.showSoundIcon2 && <SoundIcon currentMessage={props.currentMessage} playSound={this.playSound} />}

                                    {customMessage.showSoundIcon || customMessage.showSoundIcon2 ? (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.translateText(customMessage.text); // Assuming 'translateText' is defined
                                                this.setState({ isDialogVisible: true }); // Assuming 'isDialogVisible' is part of your state
                                            }}
                                            style={{
                                                width: 25,
                                                height: 25,
                                                position: "absolute",
                                                bottom: -3,
                                                left: customMessage.showSoundIcon2 ? 60 : 70,
                                                right: 0,
                                                alignItems: "center",
                                                zIndex: 21,
                                            }}
                                        >
                                            <Image
                                                source={require("./assets/images/greytranslate3.png")}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    resizeMode: "contain",
                                                }}
                                            />
                                        </TouchableOpacity>
                                    ) : null}
                                </View>
                            );
                        } else {
                            return (
                                <Bubble
                                    {...props}
                                    wrapperStyle={{
                                        right: {
                                            backgroundColor: "#007AFF",
                                            marginTop: 25, // Add marginTop to create space
                                            marginBottom: 25,
                                        },
                                    }}
                                />
                            );
                        }
                    }}
                />

                {this.state.loading && (
                    <ActivityIndicator size="large" color="#0000ff" />
                )}
                {this.state.showPopupnewer2 && (
                    <BlurView
                        style={StyleSheet.absoluteFill}
                        blurType="light"
                        blurAmount={10}
                    >
                        <View
                            style={{
                                position: 'absolute',
                                top: 310,
                                zIndex: 2000,
                                left: 50,
                                right: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: '#0069ad',
                                borderWidth: 1,
                                backgroundColor: 'white',
                                padding: 25,
                                borderRadius: 10,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowRadius: 2,
                                elevation: 5,
                            }}
                        >
                            <Text style={{ fontSize: 18, color: 'black', textAlign: 'center' }}>
                                Tienes que esperar un poco más hasta que puedas chatear de nuevo! 🤔
                                {'\n\n'}
                                ¡Cuando hayan pasado las 12 horas completas, podrás volver a chatear con Aispeak 😄
                            </Text>
                            <Image
                                source={require('./assets/images/yellowclocknew.png')}
                                style={{
                                    position: 'absolute',
                                    top: -35,
                                    left: 20,
                                    width: 60,
                                    height: 60,
                                    resizeMode: 'contain',
                                }}
                            />
                            <TouchableOpacity
                                onPress={this.handleClosePopup2}
                                style={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                }}
                            >
                                <Text style={{ fontSize: 20, color: '#0069ad', fontWeight: 'bold' }}>X</Text>
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                )}

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 30,
                    }}>

                    <TextInput
                        style={{
                            flex: 1,
                            borderColor: 'gray',
                            borderWidth: 1,
                            padding: 10,
                            backgroundColor: '#fff',
                            borderTopColor: '#E8E8E8',
                            borderTopWidth: 1,
                            borderRadius: 25,
                            marginHorizontal: 20,
                            zIndex: 0,

                        }}
                        placeholder={this.state.isRecording ? "Grabando..." : "Escribe tu mensaje"}
                        placeholderTextColor={this.state.isRecording ? 'red' : 'gray'} // Set placeholder text color
                        value={this.state.newMessage}

                        onChangeText={(text) => this.setState({ newMessage: text })}
                        onFocus={() => this.setState({ isInputFocused: true })}
                        onBlur={() => this.setState({ isInputFocused: false })}
                    />{this.state.isInputFocused && (
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#fff',
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 25,
                                marginRight: 20,
                            }}
                            onPress={() => {
                                if (this.props.isTimeoutActive && this.props.thirdchat) {
                                    this.handleQuestionMarkClick2();
                                    Keyboard.dismiss();
                                } else {
                                    this.onSend([{ text: this.state.newMessage }]);
                                }
                            }}
                        >
                            <Text>Enviar</Text>
                        </TouchableOpacity>
                    )}

                    {!this.state.isInputFocused && (
                        <TouchableOpacity
                            onPressIn={() => {
                                console.log('Press in detected');
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Immediate feedback on press
                            }}
                            onLongPress={() => {
                                console.log('Long press detected');
                                if (this.props.isTimeoutActive && this.props.thirdchat) {
                                    this.handleQuestionMarkClick2();
                                } else {
                                    // Reset loading states
                                    this.setState({ isLoading: false, stopLoading: false });

                                    // Start recording
                                    this.startRecording();

                                    // Disable mic button during recording
                                    this.props.setMicEnabled2(false);
                                }
                            }}
                            onPressOut={() => {
                                console.log('Press out triggered');
                                this.stopRecording();
                            }}
                        >
                            <Image
                                key={`${this.state.isLoading}-${this.state.stopLoading}`} // Changes when state changes
                                source={
                                    this.state.isLoading && !this.state.stopLoading
                                        ? require('./assets/images/threedot.gif')
                                        : require('./assets/images/mic3.png')
                                }
                                style={{
                                    width: 50,
                                    height: 50,
                                    marginRight: 25,
                                    zIndex: 10,
                                    resizeMode: 'contain',
                                }}
                            />
                        </TouchableOpacity>
                    )}

                </View>
            </KeyboardAvoidingView>
        );
    }
}
export default ChatScreen;