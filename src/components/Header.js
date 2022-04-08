import React, {Component} from "react";
import {
    View,
    Dimensions,
    Image,
    StyleSheet,Text,
    TouchableOpacity
} from "react-native";
import * as colors from '../styles/colors';
import * as sizes from '../styles/sizes';
import commonStyles from '../styles/commonStyles';
const {height, width} = Dimensions.get("window");

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        this.props.bgIcon
        return (
            <View style={styles.mainContainer}>
                <TouchableOpacity
                    style={styles.headerImageStyle}
                    onPress={()=>{
                        this.props.leftAction();
                    }}>
                    <Image
                        style={commonStyles.imageStyle}
                        source={this.props.leftIcon}
                    />
                </TouchableOpacity>
                <Text style={[commonStyles.textStyle,{color: colors.black,}]}>{this.props.headerText}</Text>
                <View style={{position: 'absolute', bottom: 0, backgroundColor: '#cccccc', width: "100%", height: 4}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        height: 50,
        width: "100%",
        flexDirection: 'row',
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerImageStyle:{
        width: 25,
        height: 25,
        //backgroundColor:"yellow",
        position: 'absolute',
        left: 15
    }
});
