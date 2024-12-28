import { StyleSheet, Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;

const Styles = StyleSheet.create({
    subscriptionContainer: {
        flex: 1,
    },
    subscriptionTop: {
        flex: 1,
        backgroundColor: '#ffbb00',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15, // Decreased from 30
    },

    subscriptionBottomTop: {
        flex: 3,
        backgroundColor: 'transparent',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 5, // Decreased from 15
        paddingLeft: 20,
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    subscriptionBottomBottom: {
        flex: 6,
        backgroundColor: '#ffbb00',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 15, // Decreased from 30
        paddingLeft: 20,
    },


    centeredText: {
        fontSize: 20, // Set the font size
        color: '#fff', // Set the text color to white
        fontWeight: 'bold', // Make the text bold
    },
    leftText: {
        fontSize: 24, // Set the font size
        color: '#2e393f', // Set the text color
        fontWeight: '800', // Make the text bold
    },
    leftText2: {
        fontSize: 18, // Set the font size
        color: '#2e393f', // Set the text color
        fontWeight: '800', // Make the text bold
        zIndex: 21
    },
    leftText3: {
        fontSize: 14, // Set the font size
        color: '#2e393f', // Set the text color
        fontWeight: '800', // Make the text bold
        zIndex: 21
    },
    smallText: {
        fontSize: 14, // Set the font size
        color: '#2e393f', // Set the text color
        fontWeight: '800', // Make the text bold
        zIndex: 21
    },
    rectangle: {
        width: '120%', // Set the width to 90% of the parent view
        height: 80, // Set a fixed height
        backgroundColor: '#fff', // Set the background color to white
        marginTop: 20, // Increase the margin to the top
        borderRadius: 20, // Increase the border radius for more rounded corners
        borderColor: 'transparent', // Make the border transparent when not selected
        borderWidth: 2, // Always include the border in the layout
    },
    rectanglesmallphone: {
        width: '60%', // Set the width to 90% of the parent view
        height: 40, // Set a fixed height
        backgroundColor: '#fff', // Set the background color to white
        marginTop: 20, // Increase the margin to the top
        borderRadius: 20, // Increase the border radius for more rounded corners
        borderColor: 'transparent', // Make the border transparent when not selected
        borderWidth: 2, // Always include the border in the layout
    },
    rectangle2: {
        width: '120%', // Set the width to 90% of the parent view
        height: 80, // Set a fixed height
        backgroundColor: '#fff', // Set the background color to transparent
        marginTop: 20, // Increase the margin to the top
        borderRadius: 20, // Increase the border radius for more rounded corners
        borderColor: 'blue', // Make the border blue when selected
        borderWidth: 2, // Always include the border in the layout
        zIndex: 6
    },
    rectanglenuevo: {
        width: 50, // Adjust as needed
        height: 50, // Adjust as needed
        backgroundColor: '#fff',
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 2,

    },
    whiteRectangle: {
        height: 200,
        width: '100%',
        backgroundColor: '#fff',
        alignSelf: 'center',
        position: 'absolute',
        bottom: screenHeight * 0.24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 }, // Add some offset to the shadow
        shadowOpacity: 0.5, // Increase the opacity of the shadow
        shadowRadius: 6, // Increase the blur radius of the shadow
        elevation: 10, // Increase the elevation to add more depth on Android

    },
    whiteRectanglesmall: {
        height: 200,
        width: '100%',
        backgroundColor: '#fff',
        alignSelf: 'center',
        position: 'absolute',
        bottom: screenHeight * 0.1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 }, // Add some offset to the shadow
        shadowOpacity: 0.5, // Increase the opacity of the shadow
        shadowRadius: 6, // Increase the blur radius of the shadow
        elevation: 10, // Increase the elevation to add more depth on Android

    },
    nextButton: {
        width: '70%',
        height: 40, // Adjust this value as per your requirement
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 10, // Add some border radius for curved corners
        bottom: screenHeight * 0.1,
    },
    nextButtonsmall: {
        width: '70%',
        height: 40, // Adjust this value as per your requirement
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 10, // Add some border radius for curved corners
        bottom: screenHeight * 0.02,
    },
    nextButtonText: {
        fontSize: 20, // Set the font size
        color: '#000', // Set the text color to black
        fontWeight: 'bold', // Make the text bold

    },


    container: {
        flex: 1,
        backgroundColor: '#FFB901',
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 15,
    },
    imageclone: {
        width: 90,
        height: 90,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 15,
    },
    imagenewer: {
        width: 70,
        height: 70,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 15,
    },
    imagenewer2: {
        width: 80,
        height: 80,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 15,
    },
    imagenewersmall: {
        width: 50,
        height: 50,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 15,
    },
    imagenewersmaller: {
        width: 30,
        height: 30,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 15,
    },
    imagenewer3: {
        width: 85,
        height: 85,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 15,
    },
    image1: {
        width: 350,
        height: 350,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 15,
    },
    image2: {
        width: 60,
        height: 60,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 15,
    },
    image3: {
        width: 140,
        height: 140,
    },
    image4: {
        width: 180,
        height: 180,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 15,
    },
    image44: {
        width: 200,
        height: 200,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 15,
    },
    image5: {
        width: 35,
        height: 35,
    },
    image6: {
        width: 300,
        height: 300,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 15,
    },
    image610: {
        width: 230,
        height: 230,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 15,
    },
    image67: {
        width: 150,
        height: 150,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 15,
    },
    image66: {
        width: 50,
        height: 50,
    },
    image90: {
        width: 100,
        height: 100,
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 15,
    },
    image7: {
        width: 60,
        height: 45,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 15,
    },
    rectanglenewer: {
        width: '90%',
        height: '60%', // Adjust as needed
        backgroundColor: 'white',
        padding: 20,
        bottom: -180,
        left: 20,
        borderColor: '#000000',
        borderWidth: 4,
    },
    titlenewer: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    textnewer: {
        fontSize: 16,
    },
    image8: {
        width: 100,
        height: 100,
    },
    image88: {
        width: 60,
        height: 60,
    },
    image10: {
        width: 60,
        height: 60,
    },
    image100: {
        width: 70,
        height: 70,
    },
    image101: {
        width: 100,
        height: 100,
    },
    image102: {
        width: 40,
        height: 40,
    },
    image11: {
        width: 120,
        height: 120,
    },
    image80: {
        width: 30,
        height: 30,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 15,
    },
    text1: {
        fontFamily: 'Noto Sans',
        fontSize: 25,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 15,
    },
    text01: {
        fontFamily: 'Noto Sans',
        fontSize: 25,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 15,
    },
    text13: {
        fontFamily: 'Noto Sans',
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 15,
    },
    text2: {
        fontFamily: 'Readex Pro',
        fontSize: 16,
        alignSelf: 'center',
    },
    text3: {
        fontFamily: 'Noto Sans',
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 15,
    },
    text31: {
        fontFamily: 'Noto Sans',
        fontSize: 11,
        alignSelf: 'center',
        marginBottom: 15,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: '#fff',
    },
    selectedCircle: {
        backgroundColor: '#000',
    },
    arrow: {
        width: 60,
        height: 60,
    },
    blankPage: {
        flex: 1,
        backgroundColor: '#FFB901',
        justifyContent: 'center',
        alignItems: 'center',
    },
    whiteBox: {
        backgroundColor: 'white',
        paddingVertical: 150,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
    },
    question: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    input: {
        height: 40,
        width: 200,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 10,
    },

});

export default Styles;
