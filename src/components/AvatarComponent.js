
import React, { Component } from 'react';
import {
    Image,
    ActivityIndicator,
    View
} from 'react-native';

export default class AvatarComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            source: typeof props.source == 'string' ? props.source : null,
            loading: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.source != nextProps.source) {
            if (typeof nextProps.source == 'string') {
                this.setState({
                    source: nextProps.source
                })
            }
        }
    }

    render() {
        const { props, state } = this
        const { source,loading } = state
        return (
            <View 
                {...props}
                style={props.style}>
                <Image
                    style={props.style}
                    source={source ? { uri: source } : props.defaultSource ? props.defaultSource : null}
                    onError={(e) => {
                        this.setState({
                            source: null
                        })
                    }}
                    onLoadStart={() => {
                        this.setState({loading: true})
                    }}
                    onLoadEnd={() => {
                        this.setState({loading: false})
                    }}
                    resizeMethod='resize'
                />
                <View style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                    alignItem: 'center', justifyContent: 'center'
                }}>
                    <ActivityIndicator animating={loading} color='#007AFF' size={props.size} />
                </View>
            </View>
        )
    }
}