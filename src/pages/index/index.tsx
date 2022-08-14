import React, { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import './index.scss'
import { connect } from 'react-redux'
import * as actions from '../../actions';
import { RootState } from 'src/store/type'

interface IOrderDeliveryProps {
  user: any;
}

class Index extends Component<any,IOrderDeliveryProps> {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  
  add=()=>{
    console.log('this.props--->',this.props);
    
    this.props.dispatch(actions.add())
  }

  min=()=>{
    this.props.dispatch(actions.minus())
  }

  render () {
    console.log('12345',this.props.user);
    
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <Button onClick={this.add}>加</Button>
        <Button onClick={this.min}>减</Button>
      </View>
    )
  }
}

export default connect((state: RootState) => ({
  user: state,
}))(Index);
