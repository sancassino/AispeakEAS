// Preloadimages.js

import { Asset } from 'expo-asset'; // Ensure you have expo-asset installed

const preloadImages = async () => {
    const imageAssets = [
        require('./assets/images/capiandchat.png'),
        require('./assets/images/infocloud.png'),
        require('./assets/images/blackex.png'),
        require('./assets/images/whiteex.png'),
        require('./assets/images/yellowbackgroundnew.png'),
        require('./assets/images/nivel2green.png'),
        require('./assets/images/nivel3blue.png'),
        require('./assets/images/nivel2black.png'),
        require('./assets/images/nivel3black.png'),
        require('./assets/images/levelreddest.png'),
        require('./assets/images/levelblack2.png'),
        require('./assets/images/mic3.png'),
        require('./assets/images/circleanim.gif'),
        require('./assets/images/greytranslate3.png'),
        require('./assets/images/bluesound.png'),
        require('./assets/images/aispeakenglish.png'),
        require('./assets/images/ukmate2.png'),
        require('./assets/images/Removal773new.png'),
        require('./assets/images/Removal90new.png'),
        require('./assets/images/sub2newnew.png'),
        require('./assets/images/crownsubnewnew.png'),
        require('./assets/images/sub1newnew.png'),
        require('./assets/images/newaispeak.png'),
        require('./assets/images/[removal.ai]_5d7bcad8-c8b3-4b60-80b2-a73a4505c746-m003t0569_a_paperwork_014aug22.png'),
        require('./assets/images/[removal.ai]_f18aa0aa-831f-47de-b135-67526dbe96c2-7911202.png'),
        require('./assets/images/[removal.ai]_fdee0702-4379-4d45-8e87-3b853296c531-0000000000.png'),
        require('./assets/images/blackarrowdown.png'),
        require('./assets/images/arar.png'),
        require('./assets/images/circleblacknew.png'),
        require('./assets/images/circletransp.png'),
        require('./assets/images/bluearrow.gif'),
        require('./assets/images/blackdot.png'),
        require('./assets/images/greencheckmark.jpg'),
        require('./assets/images/dadwblue.png'),
        require('./assets/images/dadw2.jpg'),
        require('./assets/images/crownsub.png'),
        require('./assets/images/sub1.png'),
        require('./assets/images/sub2.png'),
        require('./assets/images/fdd5fed2-2446-491f-b4e6-71c7a885105d-8669645.png'),
        require('./assets/images/2C28ECBB-B493-497C-9394-754BDA626C74.jpg'),
        require('./assets/images/dkddkd2.png'),
        require('./assets/images/arrow.jpg'),
        require('./assets/images/f25cb07f-a341-4055-b811-26476a495a16-20944045.png'),
        require('./assets/images/newaispeak.png'),
        require('./assets/images/Removal-804.png'),
        require('./assets/images/coudwhite5.png'),
        require('./assets/images/unitedkingdom.png'),
        require('./assets/images/circleone.jpg'),
        require('./assets/images/circletwo.gif'),
        require('./assets/images/circletwo.jpeg'),
        require('./assets/images/circlethree.gif'),
        require('./assets/images/circlethree.jpeg'),
        require('./assets/images/circlefour.gif'),
        require('./assets/images/thecircle.jpeg'),
        require('./assets/images/circlefive.gif'),
        require('./assets/images/circlefive.jpg'),
        require('./assets/images/coudyellow.PNG'),
        require('./assets/images/890132lock.png'),
        require('./assets/images/[removal.ai]_43b30bb4-f162-4b0a-9af8-03f85f9ad955-arroww.png'),
        require('./assets/images/character.png'),
        require('./assets/images/confetti.gif'),
        require('./assets/images/finger.gif'),
        require('./assets/images/mountainnew.png'),
        require('./assets/images/whitecircle.png'),
        require('./assets/images/yellowbar.jpg'),
        require('./assets/images/[removal.ai]_789b56b9-8c8e-4d48-a760-5779c00b3445-dadw.png'),
        require('./assets/images/orangearrow.gif'),
        require('./assets/images/output-onlinegiftool.gif'),
        require('./assets/images/Removal-381.png')
    ];

    const cacheImages = imageAssets.map(image => {
        return Asset.fromModule(image).downloadAsync();
    });

    return Promise.all(cacheImages);
};

export default preloadImages;
