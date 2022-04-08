import React, {Component} from 'react';
import { 
    View, 
    Image,
} from 'react-native';  

export default ProgressBar = props => {
    if(props.visible){
        return(
            <View style={[{
                position: 'absolute',
                top: 0, bottom: 0, left: 0, right: 0,
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: '#ffffffAA'
            }, props.style]}>
                <Image
                    source={require('../assets/images/loading.gif')}
                    style={{width: 80, height: 50}}
                    resizeMode='cover'
                />
            </View>
        )
    }else{
        return null
    }
}