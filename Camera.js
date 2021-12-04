import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'

export default class PickImage extends React.Component{
    state = {
        image:null
    }

    getPermissionAsync  = async()=>{
        if(Platform.OS!=="web"){
            const {status}=await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if(status !== 'granted'){
                alert("Sorry, we need camera roll permissions to make this work!")
            }
        }
    }

    componentDidMount(){
        this.getPermissionAsync();
    }

    _pickImage = async()=>{
        try{
            var result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing:true,
                aspect:[4,3],
                quality:1
            });
            this.uploadImage(result.uri);
        }
        catch(e){
            console.log(e)         
        }
    }

    uploadImage = async(uri)=>{
        const data = new FormData();
        var fileName = uri.split("/")[uri.split("/").length - 1]
        var type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        const fileToUpload = {
            uri:uri,
            name:fileName,
            type:type
        };
        data.append("digit",fileToUpload);
        fetch("https://f292a3137990.ngrok.io/predict-digit",{
            method:"POST",
            body:data,
            headers:{
                "content-type":"multipart/form-data"
            }
        })
        .then(response=> response.json())
        .then(result=>{
            console.log("Success",result)
        })
        .catch(error=>console.error("Error ",error))
    }

    render(){
        var {image} = this.state;
        return(
            <View style = {{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Button title = "Pick an image from camera roll" onPress = {this._pickImage}></Button>
            </View>
        )
    }
}